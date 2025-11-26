/**
 * EnvBinder - A comprehensive utility for type-safe environment variable management.
 *
 * This library provides a robust solution for handling environment variables in TypeScript
 * applications with features including:
 * - Type-safe variable access with TypeScript support
 * - Dynamic variable substitution using ${VAR_NAME} syntax
 * - Path alias resolution with $ALIAS_NAME patterns
 * - Extensive type conversion (string, number, boolean, arrays, dates, and more)
 * - Required variable validation with clear error messages
 * - Template literal support for dynamic values
 * - Singleton pattern for consistent access across the application
 *
 * @example Basic Usage
 * ```typescript
 * import EnvBinder from 'env-binder';
 *
 * // Create or get the singleton instance
 * const env = EnvBinder.getInstance();
 *
 * // Retrieve values with type conversion
 * const port = env.getNumber('PORT', 3000);
 * const isProd = env.isProduction();
 * const isStaging = env.is('staging');
 * const dbUrl = env.getRequired<string>('DATABASE_URL');
 * ```
 *
 * @example Using Aliases and Dynamic Variables
 * ```typescript
 * // Add path aliases for reusable configurations
 * env.addAlias('ROOT', '/app');
 * env.addAlias('CONFIG_DIR', '$ROOT/config');
 *
 * // Environment variable: API_CONFIG_PATH=$CONFIG_DIR/api.json
 * const configPath = env.get('API_CONFIG_PATH'); // Returns: /app/config/api.json
 *
 * // Using template literals in environment variables
 * // API_URL=http://localhost:${PORT}/api
 * const apiUrl = env.get('API_URL'); // Substitutes PORT value
 * ```
 *
 * @example Advanced Type Conversions
 * ```typescript
 * // Convert time durations with units
 * const sessionTimeout = env.getTimeDuration('SESSION_TIMEOUT'); // "5m" → 300000ms
 *
 * // Parse JSON objects with template support
 * // DB_CONFIG={"host":"localhost","port":${PORT}}
 * const dbConfig = env.getObject<DbConfig>('DB_CONFIG');
 *
 * // Validate patterns
 * const email = env.getPattern(
 *   'ADMIN_EMAIL',
 *   /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * );
 *
 * // Handle arrays
 * const allowedOrigins = env.getArray<string>('ALLOWED_ORIGINS');
 * const features = env.getStringArray<string>('ACTIVE_FEATURES');
 * ```
 *
 * @example Error Handling and Validation
 * ```typescript
 * try {
 *   // This will throw if DATABASE_URL is not set
 *   const dbUrl = env.getRequired<string>('DATABASE_URL');
 *
 *   // Validate enum values
 *   const logLevel = env.getEnum(
 *     'LOG_LEVEL',
 *     ['debug', 'info', 'warn', 'error'],
 *     'info'
 *   );
 * } catch (error) {
 *   console.error('Configuration error:', error.message);
 * }
 * ```
 *
 * @example Working with Dates and Times
 * ```typescript
 * // Parse ISO dates or timestamps
 * const startDate = env.getDate('START_DATE');
 *
 * // Handle cron expressions for scheduled tasks
 * const backupCron = env.getCron('BACKUP_CRON'); // "0 3 * * *"
 *
 * // Convert time units
 * const timeoutMs = env.getTime('TIMEOUT', 'MILLISECONDS', 1);
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 * @author Junaid Atari <mj.atari@gmail.com>
 * @license ISC
 */

// helpers
import BinderBase from '~/base/BinderBase';

// types
import type { EnvVariables, TimeUnit } from '~/index';

/**
 * Constant array of string values that are considered falsy when converting environment variables to boolean.
 * These values will be interpreted as false when using getBool().
 *
 * @constant {readonly string[]}
 * @default ['false', '0', 'null', '', 'undefined']
 * @example
 * ```typescript
 * // Environment variable: DEBUG_MODE=false
 * const debugMode = env.getBool('DEBUG_MODE'); // false
 *
 * // Environment variable: ENABLED=0
 * const enabled = env.getBool('ENABLED');      // false
 *
 * // Environment variable: ACTIVE=null
 * const active = env.getBool('ACTIVE');        // false
 * ```
 */
export const BOOLEAN_FALSY_VALUES = ['false', '0', 'null', '', 'undefined', 'off', 'no', 'none', 'disabled'];

/**
 * EnvBinder - A comprehensive class for type-safe environment variable management.
 *
 * This class provides a rich API for accessing, validating, and converting environment variables
 * with full TypeScript support and extensive error handling capabilities.
 *
 * Key Features:
 * - Type-safe variable access with full IntelliSense support
 * - Dynamic variable substitution (${VAR_NAME}) in values
 * - Path alias resolution ($ALIAS_NAME) for reusable paths
 * - Extensive type conversion methods for all common data types
 * - Required variable validation with descriptive error messages
 * - Template literal support for dynamic value construction
 * - Singleton pattern for consistent application-wide access
 *
 * @class EnvBinder
 * @extends BinderBase
 * @description
 * The EnvBinder class serves as the primary interface for environment variable management
 * in your application. It provides methods for retrieving values as various types,
 * with built-in validation, default value support, and error handling.
 *
 * @example Basic Setup and Usage
 * ```typescript
 * import EnvBinder from 'env-binder';
 *
 * // Initialize the binder (singleton pattern)
 * const env = EnvBinder.getInstance();
 *
 * // Add path aliases for common directories
 * env.addAlias('ROOT', process.cwd());
 * env.addAlias('LOGS', '$ROOT/logs');
 *
 * // Get typed values with defaults
 * const config = {
 *   port: env.getNumber('PORT', 3000),
 *   host: env.getString('HOST', 'localhost'),
 *   isProduction: env.isEnvironment('production'),
 *   database: {
 *     url: env.getRequired<string>('DATABASE_URL'),
 *     poolSize: env.getInteger('DB_POOL_SIZE', 10),
 *     ssl: env.getBool('DB_SSL', false)
 *   }
 * };
 * ```
 *
 * @example Advanced Configuration with Validation
 * ```typescript
 * // Validate enum values
 * const logLevel = env.getEnum(
 *   'LOG_LEVEL',
 *   ['error', 'warn', 'info', 'debug'],
 *   'info'
 * );
 *
 * // Parse complex configurations
 * const features = env.getObject<FeatureConfig>('FEATURES', {
 *   auth: true,
 *   caching: false,
 *   analytics: true
 * });
 *
 * // Handle time-based configurations
 * const sessionTimeout = env.getTimeDuration('SESSION_TIMEOUT');
 * const maintenanceWindow = env.getCron('MAINTENANCE_CRON');
 * ```
 *
 * @example Template Literal and Alias Usage
 * ```typescript
 * // Environment variables can use template literals:
 * // API_ENDPOINT=http://${HOST}:${PORT}/api/v1
 * // LOG_FILE=$LOGS/app-${NODE_ENV}.log
 *
 * const apiEndpoint = env.get('API_ENDPOINT');
 * // If HOST=localhost and PORT=3000, returns: http://localhost:3000/api/v1
 *
 * const logFile = env.get('LOG_FILE');
 * // If LOGS=/app/logs and NODE_ENV=production, returns: /app/logs/app-production.log
 * ```
 *
 * @since 0.0.1
 */
 export default class EnvBinder extends BinderBase {
   /**
    * Singleton instance reference for the EnvBinder class.
    * Ensures only one instance exists throughout the application lifecycle.
    *
    * @protected
    * @static
    * @type {EnvBinder | null}
    *
    * @remarks
    * The singleton pattern is implemented using a static property that holds the
    * single instance of the class. This approach provides:
    * - Global access point to the configuration instance
    * - Memory efficiency by preventing multiple instantiations
    * - Consistent state across all application modules
    *
    * @example
    * ```typescript
    * // The instance is created lazily on first access
    * const env1 = EnvBinder.getInstance();
    * const env2 = EnvBinder.getInstance();
    * console.log(env1 === env2); // true - same instance
    * ```
    */
   protected static instance: EnvBinder | null = null;

   /**
    * Retrieves the singleton instance of EnvBinder.
    * Creates a new instance on first call if none exists.
    *
    * @static
    * @returns {EnvBinder} The singleton instance
    *
    * @remarks
    * This method implements the getInstance() pattern with lazy initialization.
    * The first call creates the instance, subsequent calls return the same instance.
    * This ensures consistent configuration across the entire application.
    *
    * Thread Safety Note: In Node.js single-threaded environment, this implementation
    * is safe. For multi-threaded environments, additional synchronization would be required.
    *
    * @example
    * ```typescript
    * // Get the instance anywhere in your application
    * const env = EnvBinder.getInstance();
    * const port = env.getNumber('PORT', 3000);
    * ```
    *
    * @example
    * ```typescript
    * // Works across modules
    * // config.ts
    * export const config = {
    *   port: EnvBinder.getInstance().getNumber('PORT', 3000)
    * };
    *
    * // server.ts
    * const env = EnvBinder.getInstance();
    * console.log(`Server running on port ${env.getNumber('PORT', 3000)}`);
    * ```
    *
    * @example
    * ```typescript
    * // Early initialization with custom aliases
    * const env = EnvBinder.getInstance();
    * env.addAlias('ROOT', process.cwd());
    * env.addAlias('CONFIG', '$ROOT/config');
    *
    * // All subsequent getInstance() calls will have these aliases
    * const configPath = EnvBinder.getInstance().getString('CONFIG_PATH');
    * ```
    *
    * @see https://refactoring.guru/design-patterns/singleton for more information
    */
   public static getInstance(): EnvBinder {
     if (!EnvBinder.instance) {
       EnvBinder.instance = new EnvBinder();
     }
     return EnvBinder.instance;
   }

   /**
    * Protected constructor to enforce the singleton pattern.
    * Use EnvBinder.getInstance() instead of direct instantiation.
    *
    * @protected
    * @internal
    *
    * @remarks
    * The constructor is deliberately protected to prevent direct instantiation
    * using the 'new' operator. This enforces the singleton pattern and ensures
    * that all access goes through the getInstance() method.
    *
    * Attempting to call 'new EnvBinder()' will result in a TypeScript error
    * during compilation, preventing runtime errors.
    *
    * @example
    * ```typescript
    * // This will cause a TypeScript error
    * const env = new EnvBinder(); // Error: Constructor of class 'EnvBinder' is protected
    *
    * // Correct way to get instance
    * const env = EnvBinder.getInstance();
    * ```
    */
   protected constructor() {
     super();
   }

   /**
    * Retrieves and processes an environment variable as a string.
    * Supports template literals and path alias substitution out of the box.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {string} [defaultValue=''] - Default value if not found
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {string} The processed string value
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method serves as the foundation for all other type-specific getters.
    * It provides comprehensive string processing including:
    * - Template literal substitution (${VAR_NAME})
    * - Path alias resolution ($ALIAS_NAME)
    * - Automatic whitespace trimming
    * - Required field validation
    *
    * The processing order is important:
    * 1. Raw value retrieval from environment
    * 2. Template variable substitution
    * 3. Path alias resolution
    * 4. Whitespace trimming
    * 5. Required validation
    *
    * @example Basic String Retrieval
    * ```typescript
    * // Environment: HOST=localhost
    * const host = env.getString('HOST');
    * // Returns: "localhost"
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const version = env.getString('APP_VERSION', '1.0.0');
    * // Returns environment value or "1.0.0" if not set
    * ```
    *
    * @example Template Literal Substitution
    * ```typescript
    * // Environment: API_URL=http://localhost:${PORT}/api
    * // Environment: PORT=3000
    * const apiUrl = env.getString('API_URL');
    * // Returns: "http://localhost:3000/api"
    * ```
    *
    * @example Path Alias Substitution
    * ```typescript
    * // Environment: CONFIG_PATH=$ROOT/config/app.json
    * // ROOT alias set to /app
    * env.addAlias('ROOT', '/app');
    * const configPath = env.getString('CONFIG_PATH');
    * // Returns: "/app/config/app.json"
    * ```
    *
    * @example Complex Template with Multiple Variables
    * ```typescript
    * // Environment: LOG_FORMAT=$LOGS/app-${NODE_ENV}-${PORT}.log
    * // Environment: LOGS=/var/log
    * // Environment: NODE_ENV=production
    * // Environment: PORT=3000
    * const logFile = env.getString('LOG_FORMAT');
    * // Returns: "/var/log/app-production-3000.log"
    * ```
    *
    * @example Required String
    * ```typescript
    * try {
    *   const requiredUrl = env.getString('API_URL', '', true);
    * } catch (error) {
    *   console.error('API URL is required:', error.message);
    * }
    * ```
    *
    * @example Nested Environment Access
    * ```typescript
    * // Environment variable object structure
    * // database.redis.host=localhost
    * // database.redis.port=6379
    * const redisHost = env.getString('database.redis.host');
    * const redisUrl = env.getString('redis://$database.redis.host:$database.redis.port');
    * // Returns: "redis://localhost:6379"
    * ```
    */
   public getString(name: keyof EnvVariables | string, defaultValue: string = '', required: boolean = false): string {
     const value = this.getValue<string>(name, defaultValue);

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     return value;
   }

   /**
    * Retrieves and converts an environment variable to a boolean.
    * Recognizes common falsy values and supports required validation.
    *
    * Falsy values (case-insensitive):
    * - "false"
    * - "0"
    * - "null"
    * - "" (empty string)
    * - "undefined"
    * - "off"
    * - "no"
    * - "none"
    * - "disabled"
    *
    * Truthy values:
    * - "true"
    * - "1"
    * - Any non-empty string not in falsy list
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {boolean} [defaultValue=false] - Default value if not found
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {boolean} The boolean value
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides flexible boolean conversion that handles various common
    * representations of boolean values in environment variables. The conversion
    * follows these rules:
    *
    * 1. Case-insensitive comparison against falsy values
    * 2. Empty string is considered falsy
    * 3. Any non-empty string not in falsy list is truthy
    * 4. Numeric "1" is truthy, "0" is falsy
    *
    * This approach makes it easy to work with different configuration sources
    * that may use different conventions for boolean values.
    *
    * @example Basic Boolean Parsing
    * ```typescript
    * // Environment: DEBUG_MODE=true
    * const debugMode = env.getBool('DEBUG_MODE');
    * // Returns: true
    *
    * // Environment: ENABLE_LOGGING=false
    * const enableLogging = env.getBool('ENABLE_LOGGING');
    * // Returns: false
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const enableCache = env.getBool('ENABLE_CACHE', true);
    * // Returns true if ENABLE_CACHE is not set
    * ```
    *
    * @example Different Truthy Values
    * ```typescript
    * // Environment: PRODUCTION=1
    * const isProduction = env.getBool('PRODUCTION');
    * // Returns: true
    *
    * // Environment: MAINTENANCE_MODE=no
    * const maintenanceMode = env.getBool('MAINTENANCE_MODE');
    * // Returns: true (because "no" is not in falsy list)
    * ```
    *
    * @example Falsy Values
    * ```typescript
    * // All these return false:
    * env.getBool('FALSE_VAR');      // "false"
    * env.getBool('ZERO_VAR');       // "0"
    * env.getBool('NULL_VAR');       // "null"
    * env.getBool('EMPTY_VAR');      // ""
    * env.getBool('UNDEFINED_VAR');  // "undefined"
    * env.getBool('OFF_VAR');        // "off"
    * env.getBool('NO_VAR');         // "no"
    * env.getBool('NONE_VAR');       // "none"
    * env.getBool('DISABLED_VAR');   // "disabled"
    * ```
    *
    * @example Required Boolean
    * ```typescript
    * try {
    *   const sslEnabled = env.getBool('SSL_ENABLED', false, true);
    * } catch (error) {
    *   console.error('SSL_ENABLED flag is required:', error.message);
    * }
    * ```
    *
    * @example Feature Flags
    * ```typescript
    * const features = {
    *   analytics: env.getBool('ENABLE_ANALYTICS', false),
    *   caching: env.getBool('ENABLE_CACHING', true),
    *   monitoring: env.getBool('ENABLE_MONITORING', false),
    *   debug: env.getBool('DEBUG_MODE', false)
    * };
    * ```
    *
    * @example Conditional Logic
    * ```typescript
    * if (env.getBool('ENABLE_SSL')) {
    *   // Configure HTTPS
    *   server.use(https.createServer(options));
    * } else {
    *   // Use HTTP
    *   server.use(http.createServer());
    * }
    * ```
    *
    * @example Environment-Specific Behavior
    * ```typescript
    * const config = {
    *   isTest: env.getBool('IS_TEST_ENV', false),
    *   enableMetrics: env.getBool('ENABLE_METRICS', env.getBool('IS_PROD_ENV')),
    *   verboseLogging: env.getBool('VERBOSE', env.getBool('DEBUG_MODE'))
    * };
    * ```
    */
   public getBool(name: keyof EnvVariables | string, defaultValue: boolean = false, required: boolean = false): boolean {
     const value = this.getValue<string>(name, String(defaultValue)).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     return !(!value || BOOLEAN_FALSY_VALUES.includes(value));
   }

   /**
    * Retrieves and converts an environment variable to a number.
    * Supports both integers and floating-point numbers with validation.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {number} [defaultValue=0] - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {number} The numeric value
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides robust numeric parsing with automatic fallback to default
    * values when parsing fails. It uses JavaScript's built-in Number() constructor
    * which can handle:
    * - Decimal numbers (e.g., "3.14")
    * - Scientific notation (e.g., "1.5e2" → 150)
    * - Hexadecimal numbers (e.g., "0xFF" → 255)
    * - Octal numbers (e.g., "0o77" → 63)
    * - Binary numbers (e.g., "0b1010" → 10)
    *
    * When parsing fails (returns NaN), the method returns the provided default value.
    * This makes the method safe to use in production without additional validation.
    *
    * @example Integer Values
    * ```typescript
    * // Environment: PORT=3000
    * const port = env.getNumber('PORT', 3000);
    * // Returns: 3000
    * ```
    *
    * @example Floating Point Values
    * ```typescript
    * // Environment: TAX_RATE=0.08
    * const taxRate = env.getNumber('TAX_RATE', 0.05);
    * // Returns: 0.08
    * ```
    *
    * @example Scientific Notation
    * ```typescript
    * // Environment: LARGE_NUMBER=1.5e6
    * const largeNumber = env.getNumber('LARGE_NUMBER', 0);
    * // Returns: 1500000
    * ```
    *
    * @example Hexadecimal Value
    * ```typescript
    * // Environment: COLOR_MASK=0xFF0000
    * const colorMask = env.getNumber('COLOR_MASK', 0);
    * // Returns: 16711680
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const maxConnections = env.getNumber('MAX_CONNECTIONS', 100);
    * // Returns environment value or 100 if not set or invalid
    * ```
    *
    * @example Invalid Number Handling
    * ```typescript
    * // Environment: INVALID_PORT=not_a_number
    * const port = env.getNumber('INVALID_PORT', 3000);
    * // Returns: 3000 (default value because parsing failed)
    * ```
    *
    * @example Required Number
    * ```typescript
    * try {
    *   const requiredPort = env.getNumber('PORT', 0, true);
    *   console.log(`Server will run on port ${requiredPort}`);
    * } catch (error) {
    *   console.error('Port is required:', error.message);
    * }
    * ```
    *
    * @example Configuration Object
    * ```typescript
    * const serverConfig = {
    *   port: env.getNumber('PORT', 3000),
    *   timeout: env.getNumber('TIMEOUT', 30000),
    *   maxConnections: env.getNumber('MAX_CONNECTIONS', 100),
    *   retryAttempts: env.getNumber('RETRY_ATTEMPTS', 3),
    *   backoffMultiplier: env.getNumber('BACKOFF_MULTIPLIER', 2.0)
    * };
    * ```
    *
    * @example Mathematical Operations
    * ```typescript
    * const timeout = env.getNumber('TIMEOUT_SECONDS', 30) * 1000;
    * const interval = env.getNumber('PING_INTERVAL', 5) * 60 * 1000;
    * const maxAge = env.getNumber('CACHE_MAX_AGE', 3600) * 1000;
    * ```
    *
    * @example Validation
    * ```typescript
    * const port = env.getNumber('PORT', 3000);
    * if (port < 1 || port > 65535) {
    *   throw new Error('Port must be between 1 and 65535');
    * }
    * ```
    *
    * @example Percentage Calculations
    * ```typescript
    * const cpuLimit = env.getNumber('CPU_LIMIT_PERCENT', 80);
    * const maxMemory = env.getNumber('MAX_MEMORY_GB', 4) * 1024 * 1024 * 1024;
    * const diskUsageThreshold = env.getNumber('DISK_THRESHOLD', 0.9) * 100;
    * ```
    */
   public getNumber(name: keyof EnvVariables | string, defaultValue: number = 0, required: boolean = false): number {
     const value = this.getValue<string>(name, String(defaultValue)).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     const parsed = Number(value);
     return Number.isNaN(parsed) ? defaultValue : parsed;
   }

   /**
    * Retrieves and converts an environment variable to an integer.
    * Automatically truncates decimal values and validates the result.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {number} [defaultValue=0] - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {number} The integer value
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method is specifically designed for scenarios where you need whole numbers
    * and want to avoid floating-point precision issues. It uses parseInt() with base 10,
    * which:
    * - Truncates decimal portions (e.g., "3.9" → 3)
    * - Ignores non-numeric characters after valid digits (e.g., "123abc" → 123)
    * - Returns NaN for completely invalid input
    *
    * This behavior is particularly useful for:
    * - Port numbers
    * - Array sizes
    * - Loop counters
    * - Database connection pool sizes
    *
    * @example Integer Port
    * ```typescript
    * // Environment: PORT=3000
    * const port = env.getInteger('PORT', 3000);
    * // Returns: 3000
    * ```
    *
    * @example With Decimal Truncation
    * ```typescript
    * // Environment: TIMEOUT=30.5
    * const timeout = env.getInteger('TIMEOUT', 30);
    * // Returns: 30 (decimal truncated)
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const maxConnections = env.getInteger('MAX_CONNECTIONS', 10);
    * // Returns environment value or 10 if not set or invalid
    * ```
    *
    * @example Required Integer
    * ```typescript
    * try {
    *   const requiredPort = env.getInteger('PORT', 0, true);
    *   console.log(`Server running on port ${requiredPort}`);
    * } catch (error) {
    *   console.error('Port is required:', error.message);
    * }
    * ```
    *
    * @example Configuration Limits
    * ```typescript
    * const config = {
    *   maxFileSize: env.getInteger('MAX_FILE_SIZE_MB', 10),
    *   maxRetries: env.getInteger('MAX_RETRIES', 3),
    *   batchSize: env.getInteger('BATCH_SIZE', 100),
    *   threadPoolSize: env.getInteger('THREAD_POOL_SIZE', 4)
    * };
    *
    * // Validate limits
    * if (config.maxFileSize > 100) {
    *   console.warn('Max file size exceeds recommended limit of 100MB');
    * }
    * ```
    *
    * @example Array Sizing
    * ```typescript
    * const items = new Array(env.getInteger('ARRAY_SIZE', 10));
    * const pageSize = env.getInteger('PAGE_SIZE', 20);
    * const maxItems = env.getInteger('MAX_ITEMS_PER_PAGE', 100);
    * ```
    *
    * @example Loop Iterations
    * ```typescript
    * const retryCount = env.getInteger('RETRY_COUNT', 3);
    * for (let i = 0; i < retryCount; i++) {
    *   // Retry logic
    * }
    * ```
    *
    * @example Database Configuration
    * ```typescript
    * const dbConfig = {
    *   pool: {
    *     min: env.getInteger('DB_POOL_MIN', 2),
    *     max: env.getInteger('DB_POOL_MAX', 10),
    *     idleTimeoutMillis: env.getInteger('DB_IDLE_TIMEOUT', 30000)
    *   },
    *   retry: {
    *     attempts: env.getInteger('DB_RETRY_ATTEMPTS', 3),
    *     delay: env.getInteger('DB_RETRY_DELAY', 1000)
    *   }
    * };
    * ```
    *
    * @example Performance Tuning
    * ```typescript
    * const perfConfig = {
    *   workerThreads: env.getInteger('WORKER_THREADS', 4),
    *   queueSize: env.getInteger('QUEUE_SIZE', 1000),
    *   cacheEntries: env.getInteger('CACHE_ENTRIES', 10000),
    *   bufferLength: env.getInteger('BUFFER_LENGTH', 8192)
    * };
    * ```
    */
   public getInteger(name: keyof EnvVariables | string, defaultValue: number = 0, required: boolean = false): number {
     const value = this.getValue<string>(name, String(defaultValue)).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     const parsed = parseInt(value, 10);
     return Number.isNaN(parsed) ? defaultValue : parsed;
   }

   /**
    * Retrieves and processes an environment variable as a URL string.
    * Handles trailing slash normalization and supports template literals.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {boolean} [trimTrailingSlash=true] - Whether to remove trailing slash
    * @param {string} [defaultValue=''] - Default value if not found
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {string} The processed URL string
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method is specifically optimized for handling URLs in configuration,
    * providing intelligent normalization and template support. The trailing slash
    * handling is particularly useful for:
    *
    * - API endpoints where consistent formatting is important
    * - CDN URLs where trailing slashes might affect caching
    * - WebSocket connections where path normalization matters
    * - File system paths used in URLs
    *
    * The method preserves the protocol and domain structure while normalizing
    * only the path portion's trailing slash.
    *
    * @example Basic URL with Trailing Slash Trimmed (default)
    * ```typescript
    * // Environment: API_URL=http://localhost:3000/api/
    * const apiUrl = env.getUrl('API_URL');
    * // Returns: "http://localhost:3000/api" (trailing slash removed)
    * ```
    *
    * @example Keep Trailing Slash
    * ```typescript
    * // Environment: API_URL=http://localhost:3000/api/
    * const apiUrl = env.getUrl('API_URL', false);
    * // Returns: "http://localhost:3000/api/" (trailing slash preserved)
    * ```
    *
    * @example URL without Trailing Slash
    * ```typescript
    * // Environment: FRONTEND_URL=http://localhost:3000
    * const frontendUrl = env.getUrl('FRONTEND_URL');
    * // Returns: "http://localhost:3000" (no change needed)
    * ```
    *
    * @example With Template Literals
    * ```typescript
    * // Environment: OAUTH_CALLBACK=https://example.com/auth/callback?redirect=${FRONTEND_URL}
    * // Environment: FRONTEND_URL=http://localhost:3000
    * const callbackUrl = env.getUrl('OAUTH_CALLBACK');
    * // Returns: "https://example.com/auth/callback?redirect=http://localhost:3000"
    * ```
    *
    * @example WebSocket URL
    * ```typescript
    * // Environment: WS_URL=ws://localhost:${PORT}/socket
    * const wsUrl = env.getUrl('WS_URL');
    * // Returns: "ws://localhost:3000/socket"
    * ```
    *
    * @example Multiple URL Configuration
    * ```typescript
    * const urls = {
    *   api: env.getUrl('API_URL'),
    *   frontend: env.getUrl('FRONTEND_URL', false), // Keep trailing slash
    *   websocket: env.getUrl('WS_URL'),
    *   cdn: env.getUrl('CDN_URL')
    * };
    * ```
    *
    * @example with Path Aliases
    * ```typescript
    * // Environment: ASSET_URL=$CDN_BASE/assets/
    * // Environment: CDN_BASE=https://cdn.example.com
    * env.addAlias('CDN_BASE', 'https://cdn.example.com');
    * const assetUrl = env.getUrl('ASSET_URL');
    * // Returns: "https://cdn.example.com/assets"
    * ```
    *
    * @example Microservices Architecture
    * ```typescript
    * const microservices = {
    *   userService: env.getUrl('USER_SERVICE_URL'),
    *   productService: env.getUrl('PRODUCT_SERVICE_URL'),
    *   orderService: env.getUrl('ORDER_SERVICE_URL'),
    *   notificationService: env.getUrl('NOTIFICATION_SERVICE_URL')
    * };
    *
    * // All URLs are consistently formatted
    * Object.values(microservices).forEach(url => {
    *   console.log(`Service endpoint: ${url}/health`);
    * });
    * ```
    *
    * @example CDN Configuration
    * ```typescript
    * const cdnConfig = {
    *   baseUrl: env.getUrl('CDN_BASE_URL', false), // Keep trailing slash for base
    *   assetsUrl: env.getUrl('CDN_ASSETS_URL'),
    *   staticUrl: env.getUrl('CDN_STATIC_URL'),
    *   mediaUrl: env.getUrl('CDN_MEDIA_URL')
    * };
    *
    * // Construct full URLs
    * const logoUrl = `${cdnConfig.baseUrl}images/logo.png`;
    * const jsBundle = `${cdnConfig.assetsUrl}js/app.bundle.js`;
    * ```
    */
   public getUrl(name: keyof EnvVariables | string, trimTrailingSlash: boolean = true, defaultValue: string = '', required: boolean = false): string {
     const value = this.getValue<string>(name, defaultValue);

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return value;
     }

     const url = value.trim();
     return trimTrailingSlash ? url.replace(/\/+$/, '') : url;
   }

   /**
    * Retrieves a required environment variable.
    * Throws a descriptive error if the variable is missing or empty.
    * Use this for critical configuration values that must be present.
    *
    * @template T - The type of value to return
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @returns {T} The processed value
    * @throws {Error} If the variable is missing or empty
    *
    * @remarks
    * This method is designed for critical configuration values where absence or
    * emptiness should cause the application to fail fast. It's particularly useful
    * for:
    *
    * - Database connection strings
    * - API keys and secrets
    * - Essential service endpoints
    * - Security certificates paths
    *
    * The method provides type-safe retrieval while maintaining strict validation.
    * It processes the value through the same pipeline as other methods (template
    * substitution, alias resolution) before checking for emptiness.
    *
    * @example Required Database URL
    * ```typescript
    * try {
    *   const databaseUrl = env.getRequired<string>('DATABASE_URL');
    *   console.log('Database URL:', databaseUrl);
    * } catch (error) {
    *   console.error('Database URL is required:', error.message);
    *   process.exit(1);
    * }
    * ```
    *
    * @example Required Number
    * ```typescript
    * try {
    *   const port = env.getRequired<number>('PORT');
    *   server.listen(port);
    * } catch (error) {
    *   console.error('PORT is required:', error.message);
    * }
    * ```
    *
    * @example Required Boolean
    * ```typescript
    * try {
    *   const enableSsl = env.getRequired<boolean>('SSL_ENABLED');
    *   // Note: Environment variable should be "true" or "false" as string
    * } catch (error) {
    *   console.error('SSL_ENABLED flag is required:', error.message);
    * }
    * ```
    *
    * @example Required Configuration Object
    * ```typescript
    * interface AppConfig {
    *   apiUrl: string;
    *   timeout: number;
    *   retries: number;
    * }
    *
    * try {
    *   const appConfig = env.getRequired<AppConfig>('APP_CONFIG');
    *   // APP_CONFIG should be a valid JSON string
    * } catch (error) {
    *   console.error('App configuration is required:', error.message);
    * }
    * ```
    *
    * @example With Template Literal Processing
    * ```typescript
    * // Environment: API_ENDPOINT=http://api.example.com/${VERSION}
    * // Environment: VERSION=v1
    * try {
    *   const apiEndpoint = env.getRequired<string>('API_ENDPOINT');
    *   // Returns: "http://api.example.com/v1"
    * } catch (error) {
    *   console.error('API endpoint is required:', error.message);
    * }
    * ```
    *
    * @example With Path Access
    * ```typescript
    * try {
    *   const dbHost = env.getRequired<string>('database.mongodb.host');
    *   const dbPort = env.getRequired<number>('database.mongodb.port');
    * } catch (error) {
    *   console.error('Database configuration is required:', error.message);
    * }
    * ```
    *
    * @example Multiple Required Variables
    * ```typescript
    * const requiredConfigs = ['DATABASE_URL', 'SECRET_KEY', 'JWT_SECRET'];
    * requiredConfigs.forEach(configName => {
    *   try {
    *     env.getRequired<string>(configName);
    *   } catch (error) {
    *     console.error(`Missing required config: ${configName}`);
    *     process.exit(1);
    *   }
    * });
    * ```
    *
    * @example Application Startup Validation
    * ```typescript
    * function validateRequiredConfigs() {
    *   const criticalConfigs = {
    *     database: env.getRequired<string>('DATABASE_URL'),
    *     jwtSecret: env.getRequired<string>('JWT_SECRET'),
    *     encryptionKey: env.getRequired<string>('ENCRYPTION_KEY'),
    *     apiPort: env.getRequired<number>('API_PORT')
    *   };
    *
    *   // Additional validation
    *   if (criticalConfigs.apiPort < 1 || criticalConfigs.apiPort > 65535) {
    *     throw new Error(`Invalid API port: ${criticalConfigs.apiPort}`);
    *   }
    *
    *   return criticalConfigs;
    * }
    *
    * try {
    *   const config = validateRequiredConfigs();
    *   console.log('All required configurations validated successfully');
    *   startApplication(config);
    * } catch (error) {
    *   console.error('Configuration validation failed:', error.message);
    *   process.exit(1);
    * }
    * ```
    */
   public getRequired<T = unknown>(name: keyof EnvVariables | string): T {
     const value = this.getInternal<T>(name, undefined as T);

     if (value === undefined) {
       throw new Error(`Missing required environment variable "${name}"`);
     }

     return typeof (value as unknown) === 'string'
       ? (this.replaceDynamicVars((value as string)?.trim?.() ?? '') as T)
       : value;
   }

   /**
    * Retrieves a time value and converts it to the specified time unit.
    * Useful for timeout configurations and duration settings.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {TimeUnit} [unit='MINUTES'] - Target time unit for conversion
    * @param {number} [defaultValue=1] - Default value if not found
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {number} The converted time value
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method assumes the input value is in minutes and converts it to the
    * specified target unit. This design choice simplifies configuration by allowing
    * developers to specify all time values in a consistent unit (minutes) while
    * using them in whatever unit makes sense for the specific use case.
    *
    * Conversion factors:
    * - MINUTES: No conversion (1:1)
    * - SECONDS: Multiply by 60
    * - MILLISECONDS: Multiply by 60,000
    * - HOURS: Divide by 60
    *
    * The method is particularly useful for:
    * - Session timeouts
    * - Connection timeouts
    * - Cache expiration times
    * - Retry delays
    *
    * @example Convert to Milliseconds
    * ```typescript
    * // Environment: TIMEOUT=5
    * const timeoutMs = env.getTime('TIMEOUT', 'MILLISECONDS', 1);
    * // Returns: 300000 (5 minutes in milliseconds)
    * ```
    *
    * @example Convert to Seconds
    * ```typescript
    * // Environment: TIMEOUT=5
    * const timeoutSecs = env.getTime('TIMEOUT', 'SECONDS', 1);
    * // Returns: 300 (5 minutes in seconds)
    * ```
    *
    * @example Keep as Minutes
    * ```typescript
    * // Environment: TIMEOUT=5
    * const timeoutMins = env.getTime('TIMEOUT', 'MINUTES', 1);
    * // Returns: 5 (as minutes)
    * ```
    *
    * @example Convert to Hours
    * ```typescript
    * // Environment: SESSION_DURATION=120
    * const sessionHours = env.getTime('SESSION_DURATION', 'HOURS', 1);
    * // Returns: 2 (120 minutes = 2 hours)
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultTimeout = env.getTime('TIMEOUT', 'MINUTES', 30);
    * // Returns environment value or 30 minutes if not set
    * ```
    *
    * @example Required Time Value
    * ```typescript
    * try {
    *   const requiredTimeout = env.getTime('TIMEOUT', 'MINUTES', 1, true);
    *   console.log(`Timeout set to ${requiredTimeout} minutes`);
    * } catch (error) {
    *   console.error('Timeout is required:', error.message);
    * }
    * ```
    *
    * @example Server Configuration
    * ```typescript
    * const serverConfig = {
    *   sessionTimeout: env.getTime('SESSION_TIMEOUT', 'MINUTES', 30),
    *   requestTimeout: env.getTime('REQUEST_TIMEOUT', 'SECONDS', 60),
    *   connectionTimeout: env.getTime('CONN_TIMEOUT', 'MILLISECONDS', 5000),
    *   cleanupInterval: env.getTime('CLEANUP_INTERVAL', 'HOURS', 24)
    * };
    * ```
    *
    * @example Database Configuration
    * ```typescript
    * const dbConfig = {
    *   queryTimeout: env.getTime('DB_QUERY_TIMEOUT', 'SECONDS', 30),
    *   connectionIdleTime: env.getTime('DB_IDLE_TIME', 'MINUTES', 5),
    *   backupFrequency: env.getTime('DB_BACKUP_FREQ', 'HOURS', 6),
    *   retentionPeriod: env.getTime('DB_RETENTION', 'HOURS', 168) // 7 days
    * };
    * ```
    *
    * @example Cache Configuration
    * ```typescript
    * const cacheConfig = {
    *   defaultTtl: env.getTime('CACHE_TTL', 'MINUTES', 60),
    *   cleanupInterval: env.getTime('CACHE_CLEANUP', 'HOURS', 1),
    *   maxAge: env.getTime('CACHE_MAX_AGE', 'HOURS', 24),
    *   refreshInterval: env.getTime('CACHE_REFRESH', 'MINUTES', 15)
    * };
    * ```
    *
    * @example Rate Limiting
    * ```typescript
    * const rateLimitConfig = {
    *   windowSize: env.getTime('RATE_WINDOW', 'MINUTES', 15),
    *   blockDuration: env.getTime('BLOCK_DURATION', 'MINUTES', 60),
    *   cleanupDelay: env.getTime('CLEANUP_DELAY', 'SECONDS', 300)
    * };
    * ```
    */
   public getTime(
     name: keyof EnvVariables | string,
     unit: TimeUnit = 'MINUTES',
     defaultValue = 1,
     required: boolean = false
   ): number {
     const value = this.getNumber(name, defaultValue, required);

     switch (unit) {
       case 'MILLISECONDS':
         return value * 60 * 1000; // minutes to milliseconds
       case 'SECONDS':
         return value * 60; // minutes to seconds
       case 'HOURS':
         return value / 60; // minutes to hours
       case 'MINUTES':
       default:
         return value; // keep as minutes
     }
   }

   /**
    * Retrieves and parses an environment variable as a JSON array.
    * Supports template literal substitution within array elements.
    *
    * @template T - Type of array elements
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {Array<T>} defaultValue - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {Array<T>} The parsed array with type safety
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides robust array parsing with comprehensive error handling.
    * It supports:
    *
    * - Standard JSON array syntax with double quotes
    * - Relaxed parsing that accepts single quotes (converted to double quotes)
    * - Template literal substitution in array elements
    * - Type safety through TypeScript generics
    * - Automatic fallback to default value on parsing errors
    *
    * The method is particularly useful for:
    * - Lists of allowed origins for CORS
    * - Arrays of server URLs for load balancing
    * - Feature flag configurations
    * - Plugin or module enablement lists
    *
    * @example Basic Array
    * ```typescript
    * // Environment: ALLOWED_ORIGINS=["http://localhost:3000"]
    * const origins = env.getArray<string>('ALLOWED_ORIGINS');
    * // Returns: ["http://localhost:3000"]
    * ```
    *
    * @example Typed Array
    * ```typescript
    * interface ServerConfig {
    *   host: string;
    *   port: number;
    * }
    * const servers = env.getArray<ServerConfig>('SERVERS');
    * // Environment: SERVERS=[{"host":"localhost","port":3000}]
    * ```
    *
    * @example With Template Literals
    * ```typescript
    * // Environment: ENDPOINTS=["http://${HOST}:${PORT}/api","http://${HOST}:${PORT}/auth"]
    * // Environment: HOST=localhost
    * // Environment: PORT=3000
    * const endpoints = env.getArray<string>('ENDPOINTS');
    * // Returns: ["http://localhost:3000/api", "http://localhost:3000/auth"]
    * ```
    *
    * @example Number Array
    * ```typescript
    * // Environment: PORTS=[3000,3001,3002]
    * const ports = env.getArray<number>('PORTS');
    * // Returns: [3000, 3001, 3002]
    * ```
    *
    * @example Boolean Array
    * ```typescript
    * // Environment: FEATURES=[true,false,true]
    * const features = env.getArray<boolean>('FEATURES');
    * // Returns: [true, false, true]
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultOrigins = env.getArray<string>(
    *   'MISSING_ORIGINS',
    *   ['http://localhost:3000']
    * );
    * ```
    *
    * @example Required Array
    * ```typescript
    * try {
    *   const requiredOrigins = env.getArray<string>('ALLOWED_ORIGINS', [], true);
    * } catch (error) {
    *   console.error('Allowed origins are required:', error.message);
    * }
    * ```
    *
    * @example Complex Array Configuration
    * ```typescript
    * interface PluginConfig {
    *   name: string;
    *   enabled: boolean;
    *   options: Record<string, unknown>;
    * }
    * const plugins = env.getArray<PluginConfig>('PLUGINS', [
    *   { name: 'default', enabled: true, options: {} }
    * ]);
    * ```
    *
    * @example Environment Variables in Arrays
    * ```typescript
    * // Environment: PATHS=["$ROOT/logs","$ROOT/temp","$ROOT/cache"]
    * // ROOT alias set to /app
    * const paths = env.getArray<string>('PATHS');
    * // Returns: ["/app/logs", "/app/temp", "/app/cache"]
    * ```
    *
    * @example Load Balancer Configuration
    * ```typescript
    * const loadBalancer = {
    *   upstreamServers: env.getArray<string>('UPSTREAM_SERVERS'),
    *   healthCheckEndpoints: env.getArray<string>('HEALTH_ENDPOINTS'),
    *   backupServers: env.getArray<string>('BACKUP_SERVERS')
    * };
    * ```
    *
    * @example Feature Toggle System
    * ```typescript
    * const featureFlags = {
    *   enabledModules: env.getArray<string>('ENABLED_MODULES'),
    *   betaFeatures: env.getArray<string>('BETA_FEATURES', []),
    *   deprecatedFeatures: env.getArray<string>('DEPRECATED_FEATURES', [])
    * };
    * ```
    */
   public getArray<T = unknown>(name: keyof EnvVariables | string, defaultValue: Array<T> = [], required: boolean = false): Array<T> {
     const value = this.getValue<string>(name, '[]').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     try {
       // Handle both single and double quotes in JSON
       const jsonValue = value.replace(/'/g, '"');
       const data = JSON.parse(jsonValue);

       if (!Array.isArray(data)) {
         return defaultValue;
       }

       return data.map(x => this.replaceDynamicVars(String(x || '').trim()) as T);
     } catch (e) {
       return defaultValue;
     }
   }

   /**
    * Retrieves an environment variable as a comma-separated string array.
    * Automatically splits values and applies template literal substitution.
    *
    * @template T - Type of array elements
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {Array<T>} defaultValue - Default value if not found
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {Array<T>} The parsed string array
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides a convenient way to work with comma-separated values
    * (CSV) in environment variables. It's particularly useful for:
    *
    * - Lists of hosts or servers
    * - Comma-separated tags or categories
    * - IP address lists
    * - Feature flag lists
    *
    * The method intelligently handles:
    * - Single values (no comma)
    * - Multiple values with commas
    * - Whitespace around values
    * - Empty values (filtered out)
    * - Template literal substitution
    *
    * Unlike getArray(), this method doesn't require JSON syntax, making it
    * more readable for simple lists.
    *
    * @example Basic Comma-Separated List
    * ```typescript
    * // Environment: ALLOWED_HOSTS=localhost,127.0.0.1,example.com
    * const hosts = env.getStringArray<string>('ALLOWED_HOSTS');
    * // Returns: ["localhost", "127.0.0.1", "example.com"]
    * ```
    *
    * @example Single Value (No Comma)
    * ```typescript
    * // Environment: DEFAULT_HOST=localhost
    * const hosts = env.getStringArray<string>('DEFAULT_HOST');
    * // Returns: ["localhost"]
    * ```
    *
    * @example With Template Literals
    * ```typescript
    * // Environment: CORS_ORIGINS=http://localhost:${PORT},http://127.0.0.1:${PORT}
    * // Environment: PORT=3000
    * const origins = env.getStringArray<string>('CORS_ORIGINS');
    * // Returns: ["http://localhost:3000", "http://127.0.0.1:3000"]
    * ```
    *
    * @example With Spaces and Empty Values
    * ```typescript
    * // Environment: TAGS= node , typescript , express ,
    * const tags = env.getStringArray<string>('TAGS');
    * // Returns: ["node", "typescript", "express"]
    * // Empty values and whitespace are trimmed automatically
    * ```
    *
    * @example Path Aliases in Arrays
    * ```typescript
    * // Environment: LOG_PATHS=$LOGS/app.log,$LOGS/error.log,$LOGS/access.log
    * // Environment: LOGS=/var/log
    * const logPaths = env.getStringArray<string>('LOG_PATHS');
    * // Returns: ["/var/log/app.log", "/var/log/error.log", "/var/log/access.log"]
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultOrigins = env.getStringArray<string>(
    *   'MISSING_ORIGINS',
    *   ['http://localhost:3000']
    * );
    * ```
    *
    * @example Required Array
    * ```typescript
    * try {
    *   const requiredOrigins = env.getStringArray<string>('CORS_ORIGINS', [], true);
    * } catch (error) {
    *   console.error('CORS origins are required:', error.message);
    * }
    * ```
    *
    * @example Configuration for Features
    * ```typescript
    * const features = env.getStringArray<string>('ENABLED_FEATURES', []);
    * const appConfig = {
    *   features: features,
    *   hasAuth: features.includes('auth'),
    *   hasCache: features.includes('cache'),
    *   hasMonitoring: features.includes('monitoring')
    * };
    * ```
    *
    * @example Server Configuration
    * ```typescript
    * const serverHosts = env.getStringArray<string>('SERVER_HOSTS', ['localhost']);
    * const allowedIPs = env.getStringArray<string>('ALLOWED_IPS', ['127.0.0.1']);
    * const trustedProxies = env.getStringArray<string>('TRUSTED_PROXIES', []);
    * ```
    *
    * @example Database Configuration
    * ```typescript
    * const dbHosts = env.getStringArray<string>('DB_HOSTS', ['localhost']);
    * const readReplicas = env.getStringArray<string>('DB_READ_REPLICAS', []);
    * const shardKeys = env.getStringArray<string>('DB_SHARD_KEYS', ['userId']);
    * ```
    *
    * @example Microservice Discovery
    * ```typescript
    * const discovery = {
    *   serviceRegistry: env.getStringArray<string>('SERVICE_REGISTRY_URLS'),
    *   consulServers: env.getStringArray<string>('CONSUL_SERVERS'),
    *   etcdEndpoints: env.getStringArray<string>('ETCD_ENDPOINTS')
    * };
    * ```
    */
   public getStringArray<T = unknown>(name: keyof EnvVariables | string, defaultValue: Array<T> = [], required: boolean = false): Array<T> {
     const value = this.getValue<string>(name, '').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     const items = value.includes(',') ? value.split(',') : [value];

     return items
       .map((x) => this.replaceDynamicVars(String(x || '').trim()) as T)
       .filter(x => x !== '' && x !== null && x !== undefined); // Remove empty items
   }

   /**
    * Retrieves and validates an environment variable as a cron expression.
    * Supports standard 5-field cron expressions and handles falsy values.
    *
    * A cron expression consists of 5 fields representing minute, hour, day of month,
    * month, and day of week. The method validates the format and returns false for
    * falsy values (false, undefined, empty string).
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {string} [defaultValue=''] - Default value if not found or invalid
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {string | false} Valid cron expression or false for falsy values
    * @throws {Error} If required is true and value is empty or invalid
    *
    * @remarks
    * This method provides comprehensive cron expression validation supporting:
    *
    * - Asterisk (*) for "every" value
    * - Numbers (0-59 for minutes, 0-23 for hours, etc.)
    * - Ranges (e.g., 1-5 for Monday to Friday)
    * - Lists (e.g., 1,3,5 for specific values)
    * - Steps (e.g., *／2 for "every 2")
    * - Combinations of the above
    *
    * The regex validation ensures:
    * - Correct number of fields (5)
    * - Valid ranges for each field
    * - Proper syntax for special characters
    *
    * This is particularly useful for:
    * - Scheduled task configuration
    * - Backup schedules
    * - Cleanup jobs
    * - Report generation times
    *
    * @example Valid Cron Expression
    * ```typescript
    * // Environment: BACKUP_SCHEDULE=0 3 * * *
    * const backupCron = env.getCron('BACKUP_SCHEDULE');
    * // Returns: "0 3 * * *" (runs daily at 3:00 AM)
    * ```
    *
    * @example Complex Cron Expression
    * ```typescript
    * // Environment: REPORT_SCHEDULE=0 9 * * 1-5
    * const reportCron = env.getCron('REPORT_SCHEDULE');
    * // Returns: "0 9 * * 1-5" (runs weekdays at 9:00 AM)
    * ```
    *
    * @example Falsy Values
    * ```typescript
    * // Environment: MAINTENANCE_SCHEDULE=false
    * const maintenanceCron = env.getCron('MAINTENANCE_SCHEDULE');
    * // Returns: false
    *
    * // Environment: CLEANUP_SCHEDULE=undefined
    * const cleanupCron = env.getCron('CLEANUP_SCHEDULE');
    * // Returns: false
    * ```
    *
    * @example With Default and Required
    * ```typescript
    * const defaultCron = env.getCron('DEFAULT_CRON', '0 2 * * *');
    * // Returns environment value or default if not set
    *
    * const requiredCron = env.getCron('REQUIRED_CRON', '', true);
    * // Throws error if REQUIRED_CRON is not set
    * ```
    *
    * @example Advanced Cron Patterns
    * ```typescript
    * const schedules = {
    *   // Every 5 minutes
    *   frequent: env.getCron('FREQUENT_TASK', '*／5 * * * *'),
    *   // At 2:30 AM on Sundays
    *   weekly: env.getCron('WEEKLY_TASK', '30 2 * * 0'),
    *   // At 9 AM and 5 PM on weekdays
    *   businessHours: env.getCron('BUSINESS_TASK', '0 9,17 * * 1-5'),
    *   // On the 1st of every month at midnight
    *   monthly: env.getCron('MONTHLY_TASK', '0 0 1 * *')
    * };
    * ```
    *
    * @see https://en.wikipedia.org/wiki/Cron for cron expression syntax
    */
   public getCron(name: keyof EnvVariables | string, defaultValue: string = '', required: boolean = false): string | false {
     const value = this.getValue<string>(name, defaultValue).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value || BOOLEAN_FALSY_VALUES.includes(value)) {
       return false;
     }

     // Validate cron format: minute hour day-of-month month day-of-week
     // Supports: *, numbers, ranges (1-5), steps (*/2), and lists (1,3,5)
     const cronRegex = /^(\*|[0-5]?\d|\*\/\d+|\d+-\d+|\d+(?:,\d+)*)\s+(\*|[01]?\d|2[0-3]|\*\/\d+|\d+-\d+|\d+(?:,\d+)*)\s+(\*|[12]?\d|3[01]|\*\/\d+|\d+-\d+|\d+(?:,\d+)*)\s+(\*|[01]?\d|\*\/\d+|\d+-\d+|\d+(?:,\d+)*)\s+(\*|[0-6]|\*\/\d+|\d+-\d+|\d+(?:,\d+)*)$/;

     if (!cronRegex.test(value)) {
       throw new Error(`Environment variable "${name}" is not a valid cron expression: "${value}"`);
     }

     return value;
   }

   /**
    * Retrieves and converts an environment variable to a Date object.
    * Supports ISO 8601 strings, RFC 2822 format, and Unix timestamps.
    *
    * The method attempts multiple parsing strategies:
    * 1. ISO 8601 format (e.g., "2023-01-01T00:00:00Z")
    * 2. RFC 2822 format (e.g., "Jan 1 2023 00:00:00 GMT")
    * 3. Unix timestamp in milliseconds
    * 4. Unix timestamp in seconds
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {Date} [defaultValue=new Date()] - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {Date} The parsed Date object
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides flexible date parsing that handles multiple common
    * date formats encountered in configuration. The parsing strategy is:
    *
    * 1. First attempt: Native Date constructor parsing (handles ISO 8601 and RFC 2822)
    * 2. Second attempt: Parse as Unix timestamp (detects seconds vs milliseconds)
    * 3. Fallback: Return default value
    *
    * Unix timestamp detection logic:
    * - If > 1000000000000: Treated as milliseconds (post-2001)
    * - Otherwise: Treated as seconds and converted to milliseconds
    *
    * This approach makes it easy to work with dates from various sources:
    * - Database timestamps
    * - Configuration files
    * - External APIs
    * - Human-readable dates
    *
    * @example ISO 8601 Date
    * ```typescript
    * // Environment: START_DATE=2023-01-01T00:00:00Z
    * const startDate = env.getDate('START_DATE');
    * // Returns: Date object representing January 1, 2023, midnight UTC
    * ```
    *
    * @example Unix Timestamp
    * ```typescript
    * // Environment: DEPLOYMENT_TIME=1672531200
    * const deploymentTime = env.getDate('DEPLOYMENT_TIME');
    * // Returns: Date object for January 1, 2023, 00:00:00 GMT
    * ```
    *
    * @example Millisecond Timestamp
    * ```typescript
    * // Environment: EXPIRY_TIME=1672531200000
    * const expiryTime = env.getDate('EXPIRY_TIME');
    * // Returns: Date object for January 1, 2023, 00:00:00 GMT
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultDate = env.getDate('MISSING_DATE', new Date('2023-01-01'));
    * // Returns default date if environment variable is not set or invalid
    * ```
    *
    * @example Required Field
    * ```typescript
    * try {
    *   const requiredDate = env.getDate('REQUIRED_DATE', new Date(), true);
    * } catch (error) {
    *   console.error('Date is required:', error.message);
    * }
    * ```
    *
    * @example Date Validation
    * ```typescript
    * const startDate = env.getDate('START_DATE');
    * const endDate = env.getDate('END_DATE');
    *
    * if (startDate >= endDate) {
    *   throw new Error('Start date must be before end date');
    * }
    *
    * const now = new Date();
    * if (startDate < now) {
    *   console.warn('Start date is in the past');
    * }
    * ```
    *
    * @example Relative Date Calculations
    * ```typescript
    * const maintenanceWindow = env.getDate('MAINTENANCE_WINDOW');
    * const noticePeriod = env.getDate('NOTICE_PERIOD');
    *
    * // Calculate days until maintenance
    * const daysUntilMaintenance = Math.ceil(
    *   (maintenanceWindow.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    * );
    *
    * // Check if notice period is sufficient
    * const minNoticeDays = 7;
    * const noticeDays = Math.ceil(
    *   (maintenanceWindow.getTime() - noticePeriod.getTime()) / (1000 * 60 * 60 * 24)
    * );
    *
    * if (noticeDays < minNoticeDays) {
    *   console.warn('Insufficient notice period for maintenance');
    * }
    * ```
    *
    * @example Feature Scheduling
    * ```typescript
    * const features = {
    *   betaLaunch: env.getDate('BETA_LAUNCH_DATE'),
    *   productionRelease: env.getDate('PROD_RELEASE_DATE'),
    *   featureDeprecation: env.getDate('DEPRECATION_DATE')
    * };
    *
    * const currentDate = new Date();
    *
    * // Determine feature availability based on dates
    * const isBetaActive = features.betaLaunch <= currentDate;
    * const isProductionReady = features.productionRelease <= currentDate;
    * const isDeprecated = features.featureDeprecation <= currentDate;
    * ```
    */
   public getDate(name: keyof EnvVariables | string, defaultValue: Date = new Date(), required: boolean = false): Date {
     const value = this.getValue<string>(name, '').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     // Try parsing as ISO date first (most common format)
     const isoDate = new Date(value);
     if (!Number.isNaN(isoDate.getTime())) {
       return isoDate;
     }

     // Try parsing as Unix timestamp
     const timestamp = Number(value);
     if (!Number.isNaN(timestamp)) {
       // Determine if timestamp is in seconds or milliseconds
       // Milliseconds: > year 2001 in ms (1000000000000)
       // Seconds: reasonable Unix timestamp range
       return new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000);
     }

     return defaultValue;
   }

   /**
    * Retrieves and validates an environment variable against a regular expression pattern.
    * Useful for validating emails, URLs, phone numbers, and other formatted strings.
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {RegExp} pattern - Regular expression pattern to validate against
    * @param {string} [defaultValue=''] - Default value if validation fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {string} The validated string value
    * @throws {Error} If required is true or value doesn't match the pattern
    *
    * @remarks
    * This method provides pattern-based validation for environment variables,
    * ensuring that values conform to expected formats before being used in the
    * application. It's particularly useful for:
    *
    * - Email address validation
    * - URL format checking
    * - Phone number format validation
    * - Custom format requirements
    *
    * The validation process:
    * 1. Retrieve and trim the value
    * 2. Check if required and empty
    * 3. Return default if empty and not required
    * 4. Test against the provided regex pattern
    * 5. Return validated value or throw error
    *
    * @example Email Validation
    * ```typescript
    * const adminEmail = env.getPattern(
    *   'ADMIN_EMAIL',
    *   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    *   'admin@example.com'
    * );
    * // Returns valid email or throws if invalid
    * ```
    *
    * @example URL Validation
    * ```typescript
    * const apiUrl = env.getPattern(
    *   'API_URL',
    *   /^https?:\/\/.+/,
    *   'https://api.example.com'
    * );
    * // Ensures URL starts with http:// or https://
    * ```
    *
    * @example Phone Number Validation
    * ```typescript
    * const supportPhone = env.getPattern(
    *   'SUPPORT_PHONE',
    *   /^\+?[\d\s\-\(\)]+$/,
    *   '+1-555-123-4567'
    * );
    * // Accepts formats like +1-555-123-4567 or (555) 123-4567
    * ```
    *
    * @example Hex Color Validation
    * ```typescript
    * const themeColor = env.getPattern(
    *   'THEME_COLOR',
    *   /^#[0-9a-f]{6}$/i,
    *   '#000000'
    * );
    * // Ensures 6-digit hex color code
    * ```
    *
    * @example Required Field with Pattern
    * ```typescript
    * try {
    *   const dbUrl = env.getPattern(
    *     'DATABASE_URL',
    *     /^mongodb:\/\/.+/,
    *     '',
    *     true
    *   );
    * } catch (error) {
    *   console.error('Invalid MongoDB URL:', error.message);
    * }
    * ```
    *
    * @example API Key Validation
    * ```typescript
    * const apiKey = env.getPattern(
    *   'API_KEY',
    *   /^[a-zA-Z0-9]{32}$/,
    *   '',
    *   true
    * );
    * // Ensures 32-character alphanumeric API key
    * ```
    *
    * @example Semantic Version Validation
    * ```typescript
    * const appVersion = env.getPattern(
    *   'APP_VERSION',
    *   /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/,
    *   '1.0.0'
    * );
    * // Matches: 1.0.0, 1.2.3-beta, 2.0.0-rc1
    * ```
    *
    * @example Database Connection String Validation
    * ```typescript
    * const pgUrl = env.getPattern(
    *   'POSTGRES_URL',
    *   /^postgres:\/\/[a-zA-Z0-9\-\.]+:[\w\-]+@[a-zA-Z0-9\-\.]+:\d+\/[a-zA-Z0-9_\-]+$/,
    *   '',
    *   true
    * );
    * // Validates PostgreSQL connection string format
    * ```
    *
    * @example UUID Validation
    * ```typescript
    * const tenantId = env.getPattern(
    *   'TENANT_ID',
    *   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    *   '',
    *   true
    * );
    * // Ensures valid UUID format
    * ```
    */
   public getPattern(name: keyof EnvVariables | string, pattern: RegExp, defaultValue: string = '', required: boolean = false): string {
     const value = this.getValue<string>(name, defaultValue).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     if (!pattern.test(value)) {
       throw new Error(
         `Environment variable "${name}" with value "${value}" does not match the required pattern: ${pattern.toString()}`
       );
     }

     return value;
   }

   /**
    * Retrieves and validates an environment variable against a predefined list of allowed values.
    * Perfect for enums, configuration options, and constrained string values.
    *
    * @template T - Type of the allowed values
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {Array<T>} allowedValues - Array of permissible values
    * @param {T} defaultValue - Default value if not found or invalid
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {T} The validated value from allowed list
    * @throws {Error} If required is true or value is not in allowed list
    *
    * @remarks
    * This method provides strict validation against a predefined set of allowed values,
    * making it ideal for:
    *
    * - Enum-like configurations
    * - Feature flags with specific values
    * - Environment mode selection
    * - Driver or provider selection
    * - Security level configurations
    *
    * The validation logic:
    * 1. Check if the value is in the allowed list
    * 2. If yes, return the value
    * 3. If no, return the default value
    * 4. If default is not in allowed list, throw an error
    *
    * This ensures that only valid values can be returned, preventing runtime errors
    * from unexpected configuration values.
    *
    * @example Log Level Validation
    * ```typescript
    * const logLevel = env.getEnum(
    *   'LOG_LEVEL',
    *   ['error', 'warn', 'info', 'debug'] as const,
    *   'info'
    * );
    * // Returns one of the valid log levels
    * ```
    *
    * @example Database Driver Selection
    * ```typescript
    * type DbDriver = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';
    * const dbDriver = env.getEnum<DbDriver>(
    *   'DB_DRIVER',
    *   ['postgres', 'mysql', 'sqlite', 'mongodb'],
    *   'sqlite'
    * );
    * // Ensures valid database driver selection
    * ```
    *
    * @example Environment Mode
    * ```typescript
    * const environment = env.getEnum(
    *   'NODE_ENV',
    *   ['development', 'production', 'test'],
    *   'development'
    * );
    * // Validates against valid environment modes
    * ```
    *
    * @example Numeric Enum
    * ```typescript
    * const cacheSize = env.getEnum(
    *   'CACHE_SIZE_MB',
    *   [64, 128, 256, 512],
    *   128
    * );
    * // Ensures cache size is one of predefined values
    * ```
    *
    * @example Required Enum Field
    * ```typescript
    * try {
    *   const paymentGateway = env.getEnum(
    *     'PAYMENT_GATEWAY',
    *     ['stripe', 'paypal', 'square'],
    *     'stripe',
    *     true
    *   );
    * } catch (error) {
    *   console.error('Payment gateway must be specified:', error.message);
    * }
    * ```
    *
    * @example Security Level Configuration
    * ```typescript
    * type SecurityLevel = 'low' | 'medium' | 'high' | 'maximum';
    * const securityConfig = {
    *   authentication: env.getEnum<SecurityLevel>(
    *     'AUTH_LEVEL',
    *     ['low', 'medium', 'high', 'maximum'],
    *     'medium'
    *   ),
    *   encryption: env.getEnum<SecurityLevel>(
    *     'ENCRYPTION_LEVEL',
    *     ['medium', 'high', 'maximum'],
    *     'high'
    *   ),
    *   audit: env.getEnum<SecurityLevel>(
    *     'AUDIT_LEVEL',
    *     ['low', 'medium', 'high'],
    *     'medium'
    *   )
    * };
    * ```
    *
    * @example Feature Toggle Configuration
    * ```typescript
    * const features = {
    *   authProvider: env.getEnum<'local' | 'oauth' | 'saml'>(
    *     'AUTH_PROVIDER',
    *     ['local', 'oauth', 'saml'],
    *     'local'
    *   ),
    *   cacheBackend: env.getEnum<'redis' | 'memcached' | 'memory'>(
    *     'CACHE_BACKEND',
    *     ['redis', 'memcached', 'memory'],
    *     'memory'
    *   ),
    *   cdnProvider: env.getEnum<'cloudflare' | 'aws' | 'azure'>(
    *     'CDN_PROVIDER',
    *     ['cloudflare', 'aws', 'azure'],
    *     'cloudflare'
    *   )
    * };
    * ```
    *
    * @example Deployment Strategy
    * ```typescript
    * type DeploymentStrategy = 'bluegreen' | 'rolling' | 'canary' | 'recreate';
    * const deployConfig = {
    *     strategy: env.getEnum<DeploymentStrategy>(
    *       'DEPLOY_STRATEGY',
    *       ['bluegreen', 'rolling', 'canary', 'recreate'],
    *       'rolling'
    *     ),
    *     healthCheck: env.getEnum<'basic' | 'comprehensive' | 'full'>(
    *       'HEALTH_CHECK_LEVEL',
    *       ['basic', 'comprehensive', 'full'],
    *       'comprehensive'
    *     )
    *   };
    * ```
    */
   public getEnum<T = unknown>(
     name: keyof EnvVariables | string,
     allowedValues: Array<T>,
     defaultValue: T = '' as T,
     required: boolean = false
   ): T {
     const value = this.getValue<string>(name, String(defaultValue)).trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     const normalizedValue = allowedValues.includes(value as T) ? (value as T) : defaultValue;

     if (normalizedValue === defaultValue && !allowedValues.includes(defaultValue)) {
       throw new Error(
         `Environment variable "${name}" value "${value}" is not in allowed values: [${allowedValues.join(', ')}]`
       );
     }

     return normalizedValue;
   }

   /**
    * Retrieves and parses an environment variable as a JSON object.
    * Supports complex nested configurations with template literal substitution.
    *
    * @template T - Type of the expected object structure
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {T} [defaultValue={} as T] - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {T} The parsed object with type safety
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides robust JSON parsing for complex configuration objects.
    * It supports:
    *
    * - Nested object structures
    * - Arrays within objects
    * - Template literal substitution before parsing
    * - Type safety through TypeScript generics
    * - Graceful fallback to default value on parsing errors
    *
    * The parsing process:
    * 1. Retrieve the raw value
    * 2. Apply template literal substitution
    * 3. Parse as JSON
    * 4. Return parsed object or default
    *
    * This is ideal for:
    * - Database connection configurations
    * - Feature flag objects
    * - Service discovery settings
    * - Complex application settings
    *
    * @example Simple Object
    * ```typescript
    * // Environment: DB_CONFIG={"host":"localhost","port":5432}
    * const dbConfig = env.getObject<{host: string, port: number}>('DB_CONFIG');
    * // Returns: { host: "localhost", port: 5432 }
    * ```
    *
    * @example Nested Configuration
    * ```typescript
    * interface DatabaseConfig {
    *   mongodb: {
    *     url: string;
    *     options: {
    *       poolSize: number;
    *       ssl: boolean;
    *     };
    *   };
    * }
    * const config = env.getObject<DatabaseConfig>('DATABASE_CONFIG');
    * ```
    *
    * @example With Template Literals
    * ```typescript
    * // Environment: API_CONFIG={"url":"http://${HOST}:${PORT}","version":"v1"}
    * const apiConfig = env.getObject('API_CONFIG');
    * // Template variables are substituted before parsing
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultConfig = env.getObject(
    *   'MISSING_CONFIG',
    *   { retries: 3, timeout: 5000 }
    * );
    * ```
    *
    * @example Required Configuration
    * ```typescript
    * try {
    *   const requiredConfig = env.getObject('REQUIRED_CONFIG', {} as Config, true);
    * } catch (error) {
    *   console.error('Configuration is required:', error.message);
    * }
    * ```
    *
    * @example Microservice Configuration
    * ```typescript
    * interface ServiceConfig {
    *   discovery: {
    *     enabled: boolean;
    *     service: string;
    *     tags: string[];
    *   };
    *   health: {
    *     interval: number;
    *     timeout: number;
    *     endpoint: string;
    *   };
    *   metrics: {
    *     enabled: boolean;
    *     port: number;
    *     path: string;
    *   };
    * }
    *
    * const serviceConfig = env.getObject<ServiceConfig>('SERVICE_CONFIG');
    * ```
    *
    * @example Database Cluster Configuration
    * ```typescript
    * interface ClusterConfig {
    *   primary: {
    *     host: string;
    *     port: number;
    *     database: string;
    *   };
    *   replicas: Array<{
    *     host: string;
    *     port: number;
    *     weight: number;
    *   }>;
    *   options: {
    *     connectionTimeout: number;
    *     maxPoolSize: number;
    *     ssl: boolean;
    *   };
    * }
    *
    * const clusterConfig = env.getObject<ClusterConfig>('DB_CLUSTER_CONFIG');
    * ```
    *
    * @example Feature Toggle System
    * ```typescript
    * interface FeatureConfig {
    *   analytics: {
    *     enabled: boolean;
    *     samplingRate: number;
    *   };
    *   caching: {
    *     enabled: boolean;
    *     defaultTtl: number;
    *     backends: string[];
    *   };
    *   security: {
    *     rateLimit: {
    *       enabled: boolean;
    *       windowSize: number;
    *       maxRequests: number;
    *     };
    *   };
    * }
    *
    * const features = env.getObject<FeatureConfig>('FEATURE_CONFIG');
    * ```
    */
   public getObject<T = Record<string, unknown>>(
     name: keyof EnvVariables | string,
     defaultValue: T = {} as T,
     required: boolean = false
   ): T {
     const value = this.getValue<string>(name, '{}').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     try {
       return JSON.parse(value) as T;
     } catch (e) {
       return defaultValue;
     }
   }

   /**
    * Retrieves and processes an environment variable using a custom parser function.
    * Provides maximum flexibility for handling non-standard data formats.
    *
    * @template T - The type returned by the parser function
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {(value: string) => T} parser - Custom parser function to convert string to desired type
    * @param {T} [defaultValue='' as T] - Default value if parsing fails
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {T} The parsed value using custom parser
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides the ultimate flexibility for handling custom data formats
    * that don't fit into the standard types. It's particularly useful for:
    *
    * - Key-value pair configurations
    * - Binary or hexadecimal values
    * - Specialized string formats
    * - Encoded data (Base64, etc.)
    * - Custom domain-specific formats
    *
    * The parser function receives the raw string value and should return the
    * parsed value or throw an error if parsing fails. Any errors thrown by the
    * parser will be caught and the default value will be returned.
    *
    * @example Key-Value Pairs Parser
    * ```typescript
    * // Environment: CONFIG=redis.enabled=true,redis.port=6379,db.pool=10
    * const config = env.getCustom(
    *   'CONFIG',
    *   (str) => {
    *     const pairs = str.split(',');
    *     return pairs.reduce((acc, pair) => {
    *       const [key, value] = pair.split('=');
    *       acc[key.trim()] = value.trim();
    *       return acc;
    *     }, {} as Record<string, string>);
    *   },
    *   {}
    * );
    * // Returns: { "redis.enabled": "true", "redis.port": "6379", "db.pool": "10" }
    * ```
    *
    * @example Binary Number Parser
    * ```typescript
    * // Environment: PERMISSIONS=101101
    * const permissions = env.getCustom(
    *   'PERMISSIONS',
    *   (str) => parseInt(str, 2),
    *   0
    * );
    * // Returns: 45 (decimal equivalent of binary 101101)
    * ```
    *
    * @example CSV to Array Parser
    * ```typescript
    * // Environment: TAGS=node,typescript,express
    * const tags = env.getCustom(
    *   'TAGS',
    *   (str) => str.split(',').map(tag => tag.trim()),
    *   [] as string[]
    * );
    * // Returns: ['node', 'typescript', 'express']
    * ```
    *
    * @example URL Query String Parser
    * ```typescript
    * // Environment: QUERY_PARAMS=limit=10&offset=0&sort=desc
    * const params = env.getCustom(
    *   'QUERY_PARAMS',
    *   (str) => {
    *     const urlParams = new URLSearchParams(str);
    *     return Object.fromEntries(urlParams.entries());
    *   },
    *   {} as Record<string, string>
    * );
    * // Returns: { limit: '10', offset: '0', sort: 'desc' }
    * ```
    *
    * @example Base64 Decoder
    * ```typescript
    * // Environment: SECRET=SGVsbG8gV29ybGQ=
    * const secret = env.getCustom(
    *   'SECRET',
    *   (str) => Buffer.from(str, 'base64').toString(),
    *   ''
    * );
    * // Returns: "Hello World"
    * ```
    *
    * @example JSON5 Parser
    * ```typescript
    * // Environment: JSON_CONFIG={key: 'value', number: 42}
    * const config = env.getCustom(
    *   'JSON_CONFIG',
    *   (str) => {
    *     // Using JSON5 for more flexible JSON parsing
    *     const JSON5 = require('json5');
    *     return JSON5.parse(str);
    *   },
    *   {}
    * );
    * ```
    *
    * @example YAML Parser
    * ```typescript
    * // Environment: YAML_CONFIG=key: value\nnumber: 42
    * const config = env.getCustom(
    *   'YAML_CONFIG',
    *   (str) => {
    *     const yaml = require('js-yaml');
    *     return yaml.load(str);
    *   },
    *   {}
    * );
    * ```
    *
    * @example CSV Parser with Headers
    * ```typescript
    * // Environment: USER_DATA=name,age,city\nJohn,30,NYC\nJane,25,LA
    * const userData = env.getCustom(
    *   'USER_DATA',
    *   (str) => {
    *     const lines = str.split('\n');
    *     const headers = lines[0].split(',');
    *     return lines.slice(1).map(line => {
    *       const values = line.split(',');
    *       return headers.reduce((obj, header, index) => {
    *         obj[header] = values[index];
    *         return obj;
    *       }, {} as Record<string, string>);
    *     });
    *   },
    *   [] as Record<string, string>[]
    * );
    * ```
    *
    * @example Delimited Object Parser
    * ```typescript
    * // Environment: SERVICES=auth|http://auth:3000,api|http://api:3001,web|http://web:3002
    * const services = env.getCustom(
    *   'SERVICES',
    *   (str) => {
    *     return str.split(',').reduce((acc, service) => {
    *       const [name, url] = service.split('|');
    *       acc[name] = url;
    *       return acc;
    *     }, {} as Record<string, string>);
    *   },
    *   {}
    * );
    * ```
    */
   public getCustom<T>(
     name: keyof EnvVariables | string,
     parser: (value: string) => T,
     defaultValue: T = '' as T,
     required: boolean = false
   ): T {
     const value = this.getValue<string>(name, '').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     try {
       return parser(value);
     } catch (e) {
       return defaultValue;
     }
   }

   /**
    * Retrieves multiple environment variables in a single operation.
    * Useful for batching configuration loading and reducing code duplication.
    *
    * @template T - The type of values being retrieved
    * @param {Record<string, { name: keyof EnvVariables | string; defaultValue: T; required?: boolean }>} config - Configuration mapping
    * @returns {Record<string, T>} Object with all requested values
    *
    * @remarks
    * This method provides an efficient way to load multiple configuration values
    * at once, reducing boilerplate and improving code organization. It's particularly
    * useful for:
    *
    * - Application initialization
    * - Module configuration
    * - Service setup
    * - Environment-specific settings
    *
    * The method processes each configuration entry independently:
    * 1. Attempts to get the value using getValue()
    * 2. If required and empty, throws an error
    * 3. If any error occurs, uses the default value
    *
    * This approach ensures that a single failed configuration doesn't prevent
    * other configurations from loading.
    *
    * @example Basic Configuration Loading
    * ```typescript
    * const config = env.getMultiple({
    *   port: { name: 'PORT', defaultValue: 3000 },
    *   host: { name: 'HOST', defaultValue: 'localhost' },
    *   isProduction: { name: 'NODE_ENV', defaultValue: 'development' }
    * });
    * // Returns: { port: 3000, host: 'localhost', isProduction: 'development' }
    * ```
    *
    * @example Mixed Types
    * ```typescript
    * const serverConfig = env.getMultiple({
    *   port: { name: 'PORT', defaultValue: 3000 },
    *   enableSsl: { name: 'SSL_ENABLED', defaultValue: false },
    *   timeout: { name: 'TIMEOUT', defaultValue: 30000 },
    *   origins: { name: 'ALLOWED_ORIGINS', defaultValue: [] as string[] }
    * });
    * ```
    *
    * @example Required Fields
    * ```typescript
    * const requiredConfig = env.getMultiple({
    *   databaseUrl: {
    *     name: 'DATABASE_URL',
    *     defaultValue: '',
    *     required: true
    *   },
    *   secretKey: {
    *     name: 'SECRET_KEY',
    *     defaultValue: '',
    *     required: true
    *   },
    *   port: { name: 'PORT', defaultValue: 3000 }
    * });
    * // Will use defaults for non-required fields if missing
    * ```
    *
    * @example Nested Configuration
    * ```typescript
    * const appConfig = {
    *   server: env.getMultiple({
    *     port: { name: 'PORT', defaultValue: 3000 },
    *     host: { name: 'HOST', defaultValue: 'localhost' }
    *   }),
    *   database: env.getMultiple({
    *     url: { name: 'DB_URL', defaultValue: '', required: true },
    *     pool: { name: 'DB_POOL', defaultValue: 10 }
    *   })
    * };
    * ```
    *
    * @example With Path Access
    * ```typescript
    * const nestedConfig = env.getMultiple({
    *   redisHost: { name: 'cache.redis.host', defaultValue: 'localhost' },
    *   redisPort: { name: 'cache.redis.port', defaultValue: 6379 },
    *   redisTtl: { name: 'cache.redis.ttl', defaultValue: 3600 }
    * });
    * ```
    *
    * @example Microservice Configuration
    * ```typescript
    * const microserviceConfig = env.getMultiple({
    *   serviceName: { name: 'SERVICE_NAME', defaultValue: 'unknown', required: true },
    *   serviceVersion: { name: 'SERVICE_VERSION', defaultValue: '1.0.0' },
    *   servicePort: { name: 'SERVICE_PORT', defaultValue: 8080 },
    *   discoveryEnabled: { name: 'DISCOVERY_ENABLED', defaultValue: true },
    *   metricsEnabled: { name: 'METRICS_ENABLED', defaultValue: true },
    *   tracingEnabled: { name: 'TRACING_ENABLED', defaultValue: false }
    * });
    * ```
    *
    * @example Database Configuration
    * ```typescript
    * const dbConfig = env.getMultiple({
    *   host: { name: 'DB_HOST', defaultValue: 'localhost', required: true },
    *   port: { name: 'DB_PORT', defaultValue: 5432 },
    *   name: { name: 'DB_NAME', defaultValue: 'app', required: true },
    *   user: { name: 'DB_USER', defaultValue: 'admin', required: true },
    *   password: { name: 'DB_PASSWORD', defaultValue: '', required: true },
    *   ssl: { name: 'DB_SSL', defaultValue: false },
    *   poolSize: { name: 'DB_POOL_SIZE', defaultValue: 10 },
    *   timeout: { name: 'DB_TIMEOUT', defaultValue: 30000 }
    * });
    * ```
    *
    * @example API Gateway Configuration
    * ```typescript
    * const gatewayConfig = env.getMultiple({
    *   routes: { name: 'GATEWAY_ROUTES', defaultValue: [] as Route[] },
    *   rateLimit: { name: 'RATE_LIMIT', defaultValue: 100 },
    *   timeout: { name: 'GATEWAY_TIMEOUT', defaultValue: 30000 },
    *   retries: { name: 'GATEWAY_RETRIES', defaultValue: 3 },
    *   circuitBreaker: { name: 'CIRCUIT_BREAKER', defaultValue: true },
    *   healthCheck: { name: 'HEALTH_CHECK_INTERVAL', defaultValue: 60000 }
    * });
    * ```
    */
   public getMultiple<T = unknown>(
     config: Record<string, { name: keyof EnvVariables | string; defaultValue: T; required?: boolean }>
   ): Record<string, T> {
     const result: Record<string, T> = {};

     for (const [key, { name, defaultValue, required = false }] of Object.entries(config)) {
       try {
         result[key] = this.getValue<T>(name, defaultValue);
         if (required && !result[key]) {
           throw new Error(`Required environment variable "${name}" is empty or undefined`);
         }
       } catch (e) {
         result[key] = defaultValue;
       }
     }

     return result;
   }

   /**
    * Retrieves and parses a time duration value with unit suffix.
    * Supports human-readable time units for configuration simplicity.
    *
    * Supported units:
    * - s: seconds (e.g., "30s" → 30000ms)
    * - m: minutes (e.g., "5m" → 300000ms)
    * - h: hours (e.g., "2h" → 7200000ms)
    * - d: days (e.g., "7d" → 604800000ms)
    * - w: weeks (e.g., "2w" → 1209600000ms)
    *
    * @param {keyof EnvVariables | string} name - The environment variable name
    * @param {number} [defaultValue=0] - Default value in milliseconds
    * @param {boolean} [required=false] - Throw error if value is required but empty
    * @returns {number} Duration converted to milliseconds
    * @throws {Error} If required is true and value is empty
    *
    * @remarks
    * This method provides a human-readable way to specify time durations in
    * configuration, making it easier to understand and maintain settings.
    * The unit-based approach is more intuitive than raw millisecond values.
    *
    * Supported time units and their conversions:
    * - seconds (s): × 1000 milliseconds
    * - minutes (m): × 60,000 milliseconds
    * - hours (h): × 3,600,000 milliseconds
    * - days (d): × 86,400,000 milliseconds
    * - weeks (w): × 604,800,000 milliseconds
    *
    * The parsing uses a regular expression to extract the numeric value and unit.
    * Invalid formats or unsupported units result in the default value being returned.
    *
    * This is particularly useful for:
    * - Session timeouts
    * - Cache TTL values
    * - Retry delays
    * - Backup intervals
    * - Cleanup schedules
    *
    * @example Basic Duration
    * ```typescript
    * // Environment: SESSION_TIMEOUT=5m
    * const sessionTimeout = env.getTimeDuration('SESSION_TIMEOUT');
    * // Returns: 300000 (5 minutes in milliseconds)
    * ```
    *
    * @example Different Units
    * ```typescript
    * // Environment: TOKEN_EXPIRY=24h
    * const tokenExpiry = env.getTimeDuration('TOKEN_EXPIRY');
    * // Returns: 86400000 (24 hours in milliseconds)
    *
    * // Environment: CACHE_TTL=30d
    * const cacheTtl = env.getTimeDuration('CACHE_TTL');
    * // Returns: 2592000000 (30 days in milliseconds)
    * ```
    *
    * @example With Default Value
    * ```typescript
    * const defaultTimeout = env.getTimeDuration('TIMEOUT', 60000);
    * // Returns 60000ms if TIMEOUT is not set or invalid
    * ```
    *
    * @example Required Duration
    * ```typescript
    * try {
    *   const requiredTimeout = env.getTimeDuration('REQUIRED_TIMEOUT', 0, true);
    * } catch (error) {
    *   console.error('Timeout duration is required:', error.message);
    * }
    * ```
    *
    * @example Common Use Cases
    * ```typescript
    * const config = {
    *   sessionTimeout: env.getTimeDuration('SESSION_TIMEOUT', 1800000), // 30min
    *   tokenExpiry: env.getTimeDuration('TOKEN_EXPIRY', 3600000),      // 1hour
    *   cacheCleanup: env.getTimeDuration('CACHE_CLEANUP', 86400000),   // 1day
    *   backupRetention: env.getTimeDuration('BACKUP_RETENTION', 604800000) // 1week
    * };
    * ```
    *
    * @example Rate Limiting Configuration
    * ```typescript
    * const rateLimits = {
    *   windowSize: env.getTimeDuration('RATE_WINDOW', 900000),    // 15 minutes
    *   banDuration: env.getTimeDuration('BAN_DURATION', 3600000),  // 1 hour
    *   cleanupInterval: env.getTimeDuration('CLEANUP_INTERVAL', 300000) // 5 minutes
    * };
    * ```
    *
    * @example Database Connection Settings
    * ```typescript
    * const dbTimeouts = {
    *   connection: env.getTimeDuration('DB_CONN_TIMEOUT', 10000),    // 10 seconds
    *   query: env.getTimeDuration('DB_QUERY_TIMEOUT', 30000),       // 30 seconds
    *   idle: env.getTimeDuration('DB_IDLE_TIMEOUT', 300000),        // 5 minutes
    *   healthCheck: env.getTimeDuration('DB_HEALTH_CHECK', 60000)    // 1 minute
    * };
    * ```
    *
    * @example Background Job Configuration
    * ```typescript
    * const jobSchedule = {
    *   dataRetention: env.getTimeDuration('DATA_RETENTION', 2592000000),  // 30 days
    *   reportGeneration: env.getTimeDuration('REPORT_FREQ', 86400000),    // 1 day
    *   notificationDelay: env.getTimeDuration('NOTIFY_DELAY', 3600000),    // 1 hour
    *   maintenanceWindow: env.getTimeDuration('MAINTENANCE_WINDOW', 1800000) // 30 minutes
    * };
    * ```
    *
    * @example Performance Monitoring
    * ```typescript
    * const monitoringConfig = {
    *   metricsInterval: env.getTimeDuration('METRICS_INTERVAL', 60000),     // 1 minute
    *   alertThreshold: env.getTimeDuration('ALERT_THRESHOLD', 300000),     // 5 minutes
    *   historyRetention: env.getTimeDuration('HISTORY_RETENTION', 604800000), // 1 week
    *   aggregationWindow: env.getTimeDuration('AGG_WINDOW', 300000)         // 5 minutes
    * };
    * ```
    */
   public getTimeDuration(name: keyof EnvVariables | string, defaultValue: number = 0, required: boolean = false): number {
     const value = this.getValue<string>(name, '').trim();

     if (required && !value) {
       throw new Error(`Required environment variable "${name}" is empty or undefined`);
     }

     if (!value) {
       return defaultValue;
     }

     // Match pattern: number followed by unit (s, m, h, d, w)
     const match = value.match(/^(\d+)([smhdw])$/i);
     if (!match) {
       return defaultValue;
     }

     const [, numStr, unit] = match;
     const num = parseInt(numStr, 10);

     switch (unit.toLowerCase()) {
       case 's': // seconds to milliseconds
         return num * 1000;
       case 'm': // minutes to milliseconds
         return num * 60 * 1000;
       case 'h': // hours to milliseconds
         return num * 60 * 60 * 1000;
       case 'd': // days to milliseconds
         return num * 24 * 60 * 60 * 1000;
       case 'w': // weeks to milliseconds
         return num * 7 * 24 * 60 * 60 * 1000;
       default:
         return defaultValue;
     }
   }
 }
