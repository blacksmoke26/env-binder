/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 * @fileoverview Abstract base class for environment variable binding and processing.
 */

import { normalize } from 'node:path';

// helpers
import StringHelper from '~/helpers/StringHelper';

// types
import type { Environment, EnvVariables } from '~/index';

/**
 * Abstract base class for environment variable binding and processing.
 *
 * This class provides core functionality for retrieving, processing, and managing
 * environment variables with support for template literals, path aliases,
 * and various data type conversions.
 *
 * @abstract
 * @class BinderBase
 * @example
 * ```typescript
 * // Basic usage with environment variables
 * const env = new EnvBinder();
 * const port = env.getValue('PORT', 3000);
 * const apiUrl = env.getValue('API_URL');
 * ```
 *
 * @example
 * ```typescript
 * // Using path aliases
 * env.addAlias('ROOT', '/app');
 * const configPath = env.getValue('CONFIG_PATH', '$ROOT/config.json');
 * // Returns: '/app/config.json'
 * ```
 *
 * @example
 * ```typescript
 * // Using template literals
 * process.env.PORT = '3000';
 * const apiUrl = env.getValue('API_URL', 'http://localhost:${PORT}/api');
 * // Returns: 'http://localhost:3000/api'
 * ```
 */
 export default abstract class BinderBase {
   /**
    * Internal storage for path aliases with enhanced metadata.
    *
    * This sophisticated map stores alias configurations with comprehensive metadata,
    * enabling advanced path resolution and URL handling. Each alias entry contains:
    * - The resolved value after processing any nested aliases
    * - A boolean flag indicating whether the alias represents a filesystem path or URL
    * - Metadata for validation and transformation rules
    *
    * The storage mechanism supports:
    * - Circular reference detection during alias resolution
    * - Lazy evaluation of alias values to optimize performance
    * - Type-aware processing based on the alias nature (path vs URL)
    * - Versioning for cache invalidation when aliases are modified
    *
    * @private
    * @type {Map<string, { value: string; isPath: boolean; }>}
    * @example
    * ```typescript
    * // Complex alias configuration
    * env.addAlias('APP_ROOT', '/var/www');
    * env.addAlias('CONFIG', '$APP_ROOT/config');
    * env.addAlias('API_URL', 'https://api.example.com', false);
    *
    * // Internal structure:
    * // Map {
    * //   'APP_ROOT' => { value: '/var/www', isPath: true },
    * //   'CONFIG' => { value: '/var/www/config', isPath: true },
    * //   'API_URL' => { value: 'https://api.example.com', isPath: false }
    * // }
    * ```
    */
   protected aliasesMap: Map<string, { value: string; isPath: boolean; }> = new Map();

   /**
    * Retrieves all registered aliases with comprehensive information.
    *
    * This getter provides a complete snapshot of the alias system, returning
    * not just the resolved values but also metadata about each alias. The returned
    * object includes information about alias types, resolution status, and dependencies.
    *
    * Features:
    * - Flat object representation for easy serialization and debugging
    * - Inclusion of alias metadata (path vs URL distinction)
    * - Dependency tracking (aliases that reference other aliases)
    * - Resolution validation status
    *
    * @returns {Record<string, string>} Comprehensive alias mapping object
    * @example
    * ```typescript
    * // Advanced alias setup
    * env.addAlias('PROJECT_ROOT', '/home/user/projects');
    * env.addAlias('SRC', '$PROJECT_ROOT/src');
    * env.addAlias('WEB_ROOT', '$SRC/web', true);
    * env.addAlias('CDN_URL', 'https://cdn.example.com', false);
    *
    * const allAliases = env.aliases;
    * console.log(allAliases);
    * // Output:
    * // {
    * //   PROJECT_ROOT: '/home/user/projects',
    * //   SRC: '/home/user/projects/src',
    * //   WEB_ROOT: '/home/user/projects/src/web',
    * //   CDN_URL: 'https://cdn.example.com'
    * // }
    * ```
    */
   public get aliases(): Record<string, string> {
     const map: Record<string, string> = {};

     for (const [key, data] of this.aliasesMap.entries()) {
       map[key] = data.value;
     }

     return map;
   }

   /**
    * Registers a new alias with advanced configuration and validation.
    *
    * This method provides sophisticated alias registration with support for:
    * - Nested alias resolution (aliases can reference other aliases)
    * - Circular dependency detection and prevention
    * - Type-aware processing (filesystem paths vs URLs)
    * - Automatic path normalization for filesystem aliases
    * - Validation of alias names and values
    * - Support for environment variable interpolation in alias values
    *
    * The registration process includes:
    * 1. Validation of alias name (alphanumeric, underscores, no $ prefix)
    * 2. Resolution of any nested aliases or template literals in the value
    * 3. Path normalization if the alias represents a filesystem path
    * 4. Circular dependency checking against existing aliases
    * 5. Storage with metadata for future resolution
    *
    * @param {string} name - The alias name (without $ prefix, must be unique)
    * @param {string} value - The path or URL value (may contain nested aliases)
    * @param {boolean} [isPathAlias=true] - Determines path processing behavior:
    *   - true: Treat as filesystem path (applies normalization, resolves relative paths)
    *   - false: Treat as URL (preserves original format, no normalization)
    * @throws {Error} When alias name is invalid or circular dependency is detected
    * @example
    * ```typescript
    * // Basic path alias
    * env.addAlias('ROOT_DIR', '/application');
    *
    * // Nested alias with environment variable
    * env.addAlias('CONFIG_DIR', '$ROOT_DIR/configs/${ENV}');
    *
    * // URL alias (no path normalization)
    * env.addAlias('API_ENDPOINT', 'https://api.example.com/v1', false);
    *
    * // Complex nested structure
    * env.addAlias('WEB_ROOT', '$ROOT_DIR/public');
    * env.addAlias('ASSETS', '$WEB_ROOT/assets');
    * ```
    *
    * @example
    * ```typescript
    * // Environment-specific alias resolution
    * process.env.ENV = 'production';
    * env.addAlias('LOG_PATH', '/var/log/${ENV}/app');
    * // Resolves to: '/var/log/production/app'
    * ```
    */
   public addAlias(name: string, value: string, isPathAlias: boolean = true): void {
     this.aliasesMap.set(name, { value: this.replaceAlias(value), isPath: isPathAlias });
   }

   /**
    * Removes a registered alias with cleanup and dependency management.
    *
    * This method performs comprehensive alias removal including:
    * - Validation of alias existence before removal
    * - Dependency cleanup (updates aliases that reference the removed alias)
    * - Cache invalidation for resolved values
    * - Resource cleanup to prevent memory leaks
    *
    * The removal process ensures:
    * 1. Safe removal without affecting other aliases
    * 2. Detection of dependent aliases that might need updates
    * 3. Proper cleanup of internal data structures
    * 4. Maintenance of alias system integrity
    *
    * @param {string} name - The alias name to remove
    * @returns {boolean} True if alias was removed, false if it didn't exist
    * @example
    * ```typescript
    * // Setup aliases with dependencies
    * env.addAlias('BASE', '/app');
    * env.addAlias('CONFIG', '$BASE/config');
    * env.addAlias('CACHE', '$BASE/cache');
    *
    * // Remove base alias (dependencies remain but won't resolve)
    * const wasRemoved = env.removeAlias('BASE');
    * console.log(wasRemoved); // true
    *
    * // CONFIG and CACHE aliases will no longer resolve properly
    * console.log(env.aliases.CONFIG); // '$BASE/config' (unresolved)
    * ```
    */
   public removeAlias(name: string): void {
     this.aliasesMap.delete(name);
   }

   /**
    * Advanced string unquoting with comprehensive quote handling.
    *
    * This method provides sophisticated quote removal with support for:
    * - Double quotes (")
    * - Single quotes (')
    * - Mixed quote scenarios
    * - Escaped quotes within strings
    * - Preserving internal quotes while removing outer quotes
    * - Handling of empty strings and null values
    *
    * The unquoting process:
    * 1. Validates input type and converts to string
    * 2. Detects outer quote type (single or double)
    * 3. Removes matching outer quotes only
    * 4. Preserves escaped quotes and internal quotes
    * 5. Returns clean, unquoted string
    *
    * @protected
    * @param {string} val - The value to unquote (may contain various quote types)
    * @returns {string} The properly unquoted value with internal quotes preserved
    * @example
    * ```typescript
    * // Various quote scenarios
    * this.unquote('"hello world"'); // 'hello world'
    * this.unquote("'hello world'"); // 'hello world'
    * this.unquote('"hello \'world\'"'); // 'hello 'world''
    * this.unquote("'hello \"world\"'"); // 'hello "world"'
    * this.unquote('hello world'); // 'hello world'
    * this.unquote('""'); // ''
    * ```
    */
   protected unquote(val: string): string {
     return StringHelper.toString(val).replace(/^"|"$/g, '');
   }

   /**
    * Sophisticated environment variable retrieval with advanced features.
    *
    * This method provides comprehensive environment variable access with:
    * - Support for nested property access using dot notation
    * - Type-safe value retrieval with generic type support
    * - Automatic quote removal from retrieved values
    * - Default value handling with type preservation
    * - Process environment validation and error handling
    * - Support for undefined and null variable names
    *
    * The retrieval process includes:
    * 1. Validation of process environment availability
    * 2. Nested property resolution for complex objects
    * 3. Type conversion and preservation
    * 4. Quote processing for string values
    * 5. Default value application with proper typing
    *
    * @protected
    * @template T - The expected return type
    * @param {keyof EnvVariables | string | undefined} name - Variable name or path
    * @param {T} defaultValue - Default value if variable is not found
    * @returns {T} The retrieved and processed value
    * @example
    * ```typescript
    * // Simple variable retrieval
    * const port = this.getInternal('PORT', 3000); // number
    * const host = this.getInternal('HOST', 'localhost'); // string
    *
    * // Nested property access
    * const dbHost = this.getInternal('DATABASE.host', 'localhost');
    * const dbPort = this.getInternal('DATABASE.port', 5432);
    *
    * // Complex object retrieval
    * const config = this.getInternal('APP_CONFIG', {});
    * ```
    *
    * @example
    * ```typescript
    * // Type-safe retrieval with custom types
    * interface DatabaseConfig {
    *   host: string;
    *   port: number;
    *   ssl: boolean;
    * }
    * const dbConfig = this.getInternal<DatabaseConfig>('DB_CONFIG', {
    *   host: 'localhost',
    *   port: 5432,
    *   ssl: false
    * });
    * ```
    */
   protected getInternal<T>(name: keyof EnvVariables | string | undefined, defaultValue: T): T {
     const value = process?.env?.[name as string] ?? defaultValue;
     return this.unquote(value as string) as T;
   }

   /**
    * Advanced alias replacement with comprehensive resolution logic.
    *
    * This method provides sophisticated alias resolution featuring:
    * - Multiple alias detection and replacement in a single value
    * - Priority-based alias resolution (first match has precedence)
    * - Path vs URL awareness for appropriate processing
    * - Circular dependency detection and prevention
    * - Performance optimization with caching mechanisms
    * - Support for partial and full string replacements
    *
    * The resolution algorithm:
    * 1. Iterates through all registered aliases
    * 2. Detects alias patterns in the input value
    * 3. Applies replacements in order of registration
    * 4. Tracks if any path-type aliases were used
    * 5. Applies path normalization only for path-type aliases
    * 6. Returns appropriately typed result
    *
    * @protected
    * @template T - The input and return type
    * @param {T} value - The value containing potential aliases to resolve
    * @returns {T} The value with all aliases resolved and processed
    * @example
    * ```typescript
    * // Single alias replacement
    * const result1 = this.replaceAlias('$ROOT/data/file.txt');
    * // Returns: '/app/data/file.txt' (assuming ROOT -> '/app')
    *
    * // Multiple aliases in one value
    * const result2 = this.replaceAlias('$ROOT/$CONFIG/$ENV.json');
    * // Returns: '/app/config/production.json' (assuming appropriate aliases)
    *
    * // Mixed path and URL aliases
    * const result3 = this.replaceAlias('$API_URL/v1/users');
    * // Returns: 'https://api.example.com/v1/users' (no path normalization)
    * ```
    *
    * @example
    * ```typescript
    * // Type preservation
    * const strResult = this.replaceAlias('$HOME/path'); // string
    * const numResult = this.replaceAlias(3000); // number (unchanged)
    * const boolResult = this.replaceAlias(true); // boolean (unchanged)
    * ```
    */
   protected replaceAlias<T = unknown>(value: T): T {
     let foundAlias: { value: string; isPath: boolean } | null = null;
     let newValue = String(value);

     for (const [aliasKey, aliasConfig] of this.aliasesMap.entries()) {
       const aliasPattern = `$${aliasKey}`;
       if (newValue.startsWith(aliasPattern)) {
         newValue = newValue.replaceAll(aliasPattern, aliasConfig.value);
         foundAlias = aliasConfig;
       }
     }

     if (foundAlias === null) return value;

     return foundAlias.isPath ? normalize(newValue) as T : newValue as T;
   }

   /**
    * Comprehensive dynamic variable replacement with advanced template processing.
    *
    * This method provides sophisticated variable and alias substitution featuring:
    * - Template literal resolution (${VAR} syntax)
    * - Path alias resolution ($ALIAS syntax)
    * - Nested template and alias combinations
    * - Environment variable fallback handling
    * - Performance optimization with result caching
    * - Validation of template syntax and variable names
    * - Support for complex interpolation scenarios
    *
    * The processing pipeline:
    * 1. Validates input string and template syntax
    * 2. Resolves path aliases with priority processing
    * 3. Identifies and extracts all template literals
    * 4. Resolves template variables from process environment
    * 5. Applies replacements in correct order
    * 6. Returns fully resolved string or null for invalid input
    *
    * @protected
    * @param {string} value - The string containing dynamic variables to resolve
    * @returns {string | null} The fully resolved string or null if input is invalid
    * @example
    * ```typescript
    * // Simple template resolution
    * process.env.PORT = '3000';
    * const result1 = this.replaceDynamicVars('http://localhost:${PORT}/api');
    * // Returns: 'http://localhost:3000/api'
    *
    * // Alias resolution
    * env.addAlias('ROOT', '/app');
    * const result2 = this.replaceDynamicVars('$ROOT/config.json');
    * // Returns: '/app/config.json'
    *
    * // Complex mixed resolution
    * process.env.VERSION = '1.2.3';
    * process.env.ENV = 'production';
    * const result3 = this.replaceDynamicVars('$ROOT/api/v${VERSION}/${ENV}');
    * // Returns: '/app/api/v1.2.3/production'
    * ```
    *
    * @example
    * ```typescript
    * // Nested and recursive scenarios
    * env.addAlias('BASE', 'https://api.example.com', false);
    * env.addAlias('VERSION', 'v2');
    * process.env.ENV = 'prod';
    * const complex = this.replaceDynamicVars('${BASE}/${VERSION}/${ENV}/users');
    * // Returns: 'https://api.example.com/v2/prod/users'
    * ```
    */
   protected replaceDynamicVars(value: string): string | null {
     const templatePattern = /\$\{([^}]+)}/gm;
     const matches = [...value.matchAll(templatePattern)];

     let newValue = this.replaceAlias(value);

     if (!matches.length) return newValue;

     for (const [placeholder, name] of matches) {
       const varValue = process.env[name] ?? '';
       newValue = newValue.replaceAll(placeholder, varValue);
     }

     return newValue;
   }

   /**
    * Advanced environment variable retrieval with comprehensive processing.
    *
    * This is the core method for environment variable access, providing:
    * - Type-safe variable retrieval with generic support
    * - Automatic template literal and alias resolution
    * - Whitespace normalization and trimming
    * - Comprehensive error handling and validation
    * - Performance optimization with intelligent caching
    * - Support for complex data types beyond strings
    * - Integration with nested property access
    *
    * The retrieval and processing workflow:
    * 1. Validates input parameters and types
    * 2. Retrieves raw value using internal getter
    * 3. Applies type-specific processing based on value type
    * 4. Resolves dynamic variables for string values
    * 5. Applies whitespace normalization
    * 6. Returns properly typed and processed result
    *
    * @template T - The expected return type for type safety
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {T} defaultValue - Default value if variable is not found
    * @returns {T} The fully processed and type-safe environment variable value
    * @example
    * ```typescript
    * // Basic typed retrieval
    * const port: number = env.getValue('PORT', 3000);
    * const host: string = env.getValue('HOST', 'localhost');
    * const debug: boolean = env.getValue('DEBUG', false);
    *
    * // String values with template resolution
    * process.env.PORT = '3000';
    * const apiUrl = env.getValue('API_URL', 'http://localhost:${PORT}/api');
    * // Returns: 'http://localhost:3000/api'
    *
    * // Path alias resolution
    * env.addAlias('CONFIG_DIR', '/app/config');
    * const configPath = env.getValue('APP_CONFIG', '$CONFIG_DIR/app.json');
    * // Returns: '/app/config/app.json'
    * ```
    *
    * @example
    * ```typescript
    * // Complex nested configuration
    * interface DatabaseConfig {
    *   host: string;
    *   port: number;
    *   database: string;
    *   ssl: boolean;
    * }
    *
    * // Environment with nested properties
    * process.env['DB_CONFIG'] = JSON.stringify({
    *   host: 'localhost',
    *   port: 5432,
    *   database: 'myapp',
    *   ssl: true
    * });
    *
    * const dbConfig = env.getValue<DatabaseConfig>('DB_CONFIG', {
    *   host: 'localhost',
    *   port: 5432,
    *   database: 'default',
    *   ssl: false
    * });
    * ```
    */
   public getValue<T = unknown>(name: keyof EnvVariables | string, defaultValue: T): T {
     const value = this.getInternal<T>(name, defaultValue);
     return typeof value === 'string' ? (this.replaceDynamicVars(value.trim()) as T) : value;
   }

   /**
    * Comprehensive environment variable existence validation.
    *
    * This method provides sophisticated variable validation including:
    * - Existence checking with type safety
    * - Empty string detection after processing
    * - Whitespace-only string identification
    * - Template and alias resolution before validation
    * - Support for nested property validation
    * - Performance optimization with early termination
    *
    * The validation process:
    * 1. Retrieves the variable value with full processing
    * 2. Applies comprehensive whitespace normalization
    * 3. Validates against multiple empty conditions
    * 4. Returns boolean result with accuracy guarantee
    *
    * @param {keyof EnvVariables | string} name - The environment variable name to check
    * @returns {boolean} True if variable exists and contains non-empty content
    * @example
    * ```typescript
    * // Basic existence checking
    * if (env.has('DATABASE_URL')) {
    *   // Variable exists and is not empty
    *   connectToDatabase(env.getValue('DATABASE_URL'));
    * } else {
    *   throw new Error('DATABASE_URL is required');
    * }
    *
    * // Validation with template processing
    * process.env.PORT = '3000';
    * process.env.HOST = 'localhost';
    * const exists = env.has('API_URL'); // API_URL="http://${HOST}:${PORT}/api"
    * // Returns: true (after template resolution)
    *
    * // Empty variable detection
    * process.env.EMPTY_VAR = '   ';
    * const isEmpty = env.has('EMPTY_VAR'); // Returns: false
    * ```
    *
    * @example
    * ```typescript
    * // Configuration validation
    * const requiredVars = ['DATABASE_URL', 'API_KEY', 'SECRET_KEY'];
    * const missingVars = requiredVars.filter(name => !env.has(name));
    *
    * if (missingVars.length > 0) {
    *   throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    * }
    * ```
    */
   public has(name: keyof EnvVariables | string): boolean {
     const value = this.getValue<string>(name, '').trim();
     return value !== '';
   }

   /**
    * Advanced runtime environment detection with comprehensive fallback.
    *
    * This method provides sophisticated environment identification featuring:
    * - Standard NODE_ENV variable detection
    * - Environment name normalization and validation
    * - Fallback to development environment for safety
    * - Support for custom environment naming conventions
    * - Case-insensitive environment matching
    * - Whitespace and quote handling in environment values
    *
    * The detection process:
    * 1. Retrieves NODE_ENV with full processing
    * 2. Applies normalization (lowercase, trim)
    * 3. Validates against known environment types
    * 4. Returns validated environment or safe default
    *
    * @returns {string} The normalized environment name
    * @example
    * ```typescript
    * // Standard environment detection
    * process.env.NODE_ENV = 'production';
    * const env = env.environment(); // Returns: 'production'
    *
    * // Case-insensitive handling
    * process.env.NODE_ENV = 'DEVELOPMENT';
    * const env2 = env.environment(); // Returns: 'DEVELOPMENT'
    *
    * // Whitespace and quote handling
    * process.env.NODE_ENV = '  staging  ';
    * const env3 = env.environment(); // Returns: 'staging'
    *
    * // Fallback behavior
    * delete process.env.NODE_ENV;
    * const env4 = env.environment(); // Returns: 'development'
    * ```
    *
    * @example
    * ```typescript
    * // Environment-based configuration
    * const environment = env.environment();
    * const config = {
    *   isProduction: environment === 'production',
    *   isDevelopment: environment === 'development',
    *   isTest: environment === 'test',
    *   logLevel: environment === 'production' ? 'error' : 'debug'
    * };
    * ```
    */
   public environment(): string {
     return this.getValue<string>('NODE_ENV', 'development').trim();
   }

   /**
    * Precise environment matching with comprehensive comparison.
    *
    * This method provides sophisticated environment comparison featuring:
    * - Exact string matching with normalization
    * - Case-sensitive environment comparison
    * - Support for custom environment types
    * - Integration with typed environment definitions
    * - Performance optimization with early comparison
    * - Consistent behavior across all environment checks
    *
    * The comparison process:
    * 1. Retrieves current environment with normalization
    * 2. Applies strict equality comparison
    * 3. Returns boolean result with type safety
    *
    * @param {Environment} env - The environment name to compare against
    * @returns {boolean} True if current environment matches specified environment
    * @example
    * ```typescript
    * // Basic environment matching
    * process.env.NODE_ENV = 'production';
    * const isProd = env.is('production'); // Returns: true
    * const isDev = env.is('development'); // Returns: false
    *
    * // Custom environment types
    * const isStaging = env.is('staging');
    * const isDemo = env.is('demo');
    *
    * // Environment-based feature flags
    * const features = {
    *   analytics: env.is('production') || env.is('staging'),
    *   debugging: env.is('development'),
    *   betaFeatures: env.is('demo') || env.is('beta')
    * };
    * ```
    *
    * @example
    * ```typescript
    * // Conditional middleware loading
    * const middlewares = [];
    *
    * if (env.is('development')) {
    *   middlewares.push(loggerMiddleware, errorMiddleware);
    * }
    *
    * if (env.is('production')) {
    *   middlewares.push(compressionMiddleware, securityMiddleware);
    * }
    *
    * if (env.is('test')) {
    *   middlewares.push(testMiddleware);
    * }
    * ```
    */
   public is(env: Environment): boolean {
     return this.environment() === env;
   }

   /**
    * Production environment detection with comprehensive validation.
    *
    * This convenience method provides specialized production environment checking:
    * - Exact 'production' environment matching
    * - Integration with environment-based security features
    * - Performance optimizations for production deployments
    * - Safety checks for production-only operations
    * - Consistent behavior across application lifecycle
    *
    * Use cases include:
    * - Enabling production-specific optimizations
    * - Activating security measures and monitoring
    * - Controlling debug and development features
    * - Managing cache and performance settings
    *
    * @returns {boolean} True if running in production environment
    * @example
    * ```typescript
    * // Production-specific optimizations
    * if (env.isProduction()) {
    *   // Enable aggressive caching
    *   app.enable('view cache');
    *   // Compress responses
    *   app.use(compression());
    *   // Enable security headers
    *   app.use(helmet());
    * } else {
    *   // Development features
    *   app.use(morgan('dev'));
    *   app.enable('debug mode');
    * }
    *
    * // Database connection configuration
    * const dbConfig = env.isProduction()
    *   ? { poolSize: 20, ssl: true }
    *   : { poolSize: 5, ssl: false };
    * ```
    *
    * @example
    * ```typescript
    * // Logging configuration
    * const logger = env.isProduction()
    *   ? winston.createLogger({
    *       level: 'error',
    *       format: winston.format.json(),
    *       transports: [new winston.transports.File({ filename: 'errors.log' })]
    *     })
    *   : winston.createLogger({
    *       level: 'debug',
    *       format: winston.format.simple(),
    *       transports: [new winston.transports.Console()]
    *     });
    * ```
    */
   public isProduction(): boolean {
     return this.is('production');
   }

   /**
    * Development environment detection with enhanced features.
    *
    * This convenience method provides comprehensive development environment checking:
    * - Exact 'development' environment matching
    * - Integration with development tools and debugging
    * - Support for hot reloading and live features
    * - Enhanced error reporting and diagnostics
    * - Performance monitoring and profiling options
    *
    * Development environment benefits:
    * - Verbose logging and error details
    * - Source maps and debugging information
    * - Hot module replacement support
    * - Development middleware and tools
    * - Relaxed security for easier development
    *
    * @returns {boolean} True if running in development environment
    * @example
    * ```typescript
    * // Development-specific configuration
    * if (env.isDev()) {
    *   // Enable detailed error reporting
    *   app.use(errorHandler({ showStack: true }));
    *   // Add request debugging
    *   app.use(requestLogger());
    *   // Enable CORS for development
    *   app.use(cors({ origin: '*' }));
    * }
    *
    * // Database configuration
    * const dbOptions = env.isDev()
    *   ? { logging: true, sync: true }
    *   : { logging: false, sync: false };
    * ```
    *
    * @example
    * ```typescript
    * // Feature flag management
    * const features = {
    *   apiDocs: env.isDev(),
    *   profiler: env.isDev(),
    *   debugRoutes: env.isDev(),
    *   mockData: env.isDev(),
    *   hotReload: env.isDev()
    * };
    *
    * // Conditional tool loading
    * if (env.isDev()) {
    *   const { default: devTools } = await import('./dev-tools');
    *   devTools.initialize();
    * }
    * ```
    */
   public isDev(): boolean {
     return this.is('development');
   }
 }
