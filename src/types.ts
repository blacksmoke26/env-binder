/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 */

/**
 * Represents the possible runtime environments for the application.
 *
 * This type defines the standard environments that the application can run in,
 * allowing for environment-specific configurations and behaviors. Each environment
 * corresponds to a different deployment context with distinct settings, logging
 * levels, and operational characteristics.
 *
 * @type {('development'|'staging'|'production'|'demo'|string)}
 * @default 'development'
 * @description
 * - **development**: Local development environment with debugging enabled
 * - **staging**: Pre-production environment for final testing
 * - **production**: Live environment serving actual users
 * - **demo**: Special environment for demonstration purposes
 * - **string**: Allows for custom environment names
 *
 * @example Environment Configuration
 * ```typescript
 * // Environment-specific configurations
 * const configs = {
 *   development: { debug: true, logLevel: 'verbose' },
 *   staging: { debug: false, logLevel: 'info' },
 *   production: { debug: false, logLevel: 'error' },
 *   demo: { debug: true, logLevel: 'warn', readonly: true }
 * };
 * ```
 */
export type Environment = 'development' | 'staging' | 'production' | 'demo' | string;

/**
 * Enumeration of supported time units for duration conversion.
 * Used with methods like getTimeDuration() for unit-specific conversions.
 *
 * This type provides a standardized way to represent time units throughout
 * the application, enabling consistent duration handling and conversions.
 *
 * @type {'MILLISECONDS' | 'SECONDS' | 'MINUTES' | 'HOURS'}
 * @description
 * - **MILLISECONDS**: For precise timing operations and intervals
 * - **SECONDS**: For common timeout and duration values
 * - **MINUTES**: For longer operational durations
 * - **HOURS**: For extended time-based configurations
 *
 * @example Duration Conversions
 * ```typescript
 * // Convert a timeout value to different units
 * const timeout = env.getTimeDuration('TIMEOUT', 'MILLISECONDS', 5); // 300000ms
 * const timeoutSecs = env.getTimeDuration('TIMEOUT', 'SECONDS', 5);   // 300s
 * const timeoutMinutes = env.getTimeDuration('TIMEOUT', 'MINUTES', 5);   // 5min
 * const timeoutHours = env.getTimeDuration('TIMEOUT', 'HOURS', 5);     // 5h
 *
 * // Working with different units
 * const retryDelay = env.getTimeDuration('RETRY_DELAY', 'SECONDS', 30);
 * const sessionTimeout = env.getTimeDuration('SESSION_TIMEOUT', 'MINUTES', 30);
 * const maintenanceWindow = env.getTimeDuration('MAINTENANCE_WINDOW', 'HOURS', 2);
 * ```
 *
 * @example Best Practices
 * ```typescript
 * // Choose appropriate units for the context
 * const dbQueryTimeout = env.getTimeDuration('DB_QUERY_TIMEOUT', 'MILLISECONDS', 5000); // For database queries
 * const apiRateLimit = env.getTimeDuration('API_RATE_LIMIT', 'SECONDS', 60);          // For rate limiting
 * const cleanupInterval = env.getTimeDuration('CLEANUP_INTERVAL', 'MINUTES', 15);     // For periodic tasks
 * const reportGeneration = env.getTimeDuration('REPORT_GENERATION', 'HOURS', 24);    // For long-running jobs
 * ```
 */
export type TimeUnit = 'MILLISECONDS' | 'SECONDS' | 'MINUTES' | 'HOURS';

/**
 * Interface defining the structure for environment variables used throughout the application.
 * This provides TypeScript intellisense and compile-time checking for environment variable names.
 *
 * @interface EnvVariables
 * @description
 * This base interface serves as the foundation for type-safe environment variable management.
 * It provides a structured approach to defining, accessing, and validating environment variables
 * while maintaining full TypeScript support and IDE assistance.
 *
 * The interface is designed to be extensible, allowing applications to define their specific
 * environment variable requirements while inheriting the core functionality and type safety.
 *
 * @keyConcepts
 * - **Type Safety**: All environment variables are typed at compile time
 * - **Intellisense**: IDE support for autocompletion and documentation
 * - **Validation**: Built-in support for value validation and conversion
 * - **Nested Access**: Support for dot notation in nested configurations
 * - **Extensibility**: Easy extension for application-specific variables
 *
 * @example Define Custom Variables
 * ```typescript
 * // Extend the base interface for your application
 * interface AppVariables extends EnvVariables {
 *   // Database configuration
 *   DATABASE_URL: string;
 *   DB_POOL_SIZE: number;
 *   DB_SSL: boolean;
 *   DB_TIMEOUT_MILLISECONDS: number;
 *
 *   // Application settings
 *   MAX_FILE_SIZE: number;
 *   ALLOWED_FILE_TYPES: string[];
 *   API_VERSION: string;
 *
 *   // Feature flags
 *   ENABLE_ANALYTICS: boolean;
 *   DEBUG_MODE: boolean;
 *   BETA_FEATURES: boolean;
 *
 *   // Security settings
 *   JWT_SECRET: string;
 *   SESSION_TIMEOUT_MINUTES: number;
 *   CORS_ORIGINS: string[];
 *
 *   // External service configurations
 *   REDIS_URL: string;
 *   SMTP_HOST: string;
 *   SMTP_PORT: number;
 * }
 *
 * // Use with EnvBinder for full type safety
 * const env = new EnvBinder<AppVariables>();
 * const dbUrl = env.getValue('DATABASE_URL'); // Fully typed!
 * const poolSize = env.getNumber('DB_POOL_SIZE', 10); // Number with default
 * const isSsl = env.getBool('DB_SSL', false); // Boolean conversion
 * ```
 *
 * @example Using with Nested Paths
 * ```typescript
 * // Access nested configuration using dot notation
 * const dbConfig = env.getValue('database.mongodb.url');
 * const redisConfig = env.getValue('cache.redis.port');
 * const apiConfig = env.getValue('api.v2.endpoint');
 * ```
 *
 * @example Complex Configuration Structure
 * ```typescript
 * interface ComplexConfig extends EnvVariables {
 *   // Multi-environment database configuration
 *   'database.development.url': string;
 *   'database.staging.url': string;
 *   'database.production.url': string;
 *
 *   // Service discovery configuration
 *   'services.auth.host': string;
 *   'services.auth.port': number;
 *   'services.auth.protocol': string;
 *
 *   // Feature toggle configuration
 *   'features.b rollout.percentage': number;
 *   'features.experiments.enabled': boolean;
 * }
 * ```
 *
 * @example Environment-Specific Variables
 * ```typescript
 * // Define variables that change based on environment
 * const getEnvVars = (env: Environment) => {
 *   const baseVars: EnvVariables = { NODE_ENV: env };
 *
 *   if (env === 'production') {
 *     return {
 *       ...baseVars,
 *       LOG_LEVEL: 'error',
 *       DEBUG_MODE: 'false',
 *       ENABLE_PROFILING: 'false',
 *     };
 *   }
 *
 *   return {
 *     ...baseVars,
 *     LOG_LEVEL: 'debug',
 *     DEBUG_MODE: 'true',
 *     ENABLE_PROFILING: 'true',
 *   };
 * };
 * ```
 *
 * @example Validation and Defaults
 * ```typescript
 * // Combine with EnvBinder's validation features
 * interface ValidatedConfig extends EnvVariables {
 *   REQUIRED_PORT: number; // Use getRequired() for this
 *   OPTIONAL_TIMEOUT?: string; // Optional with default
 *   BOOLEAN_FLAG: boolean; // Use getBool() conversion
 *   NUMBER_VALUE: number; // Use getNumber() conversion
 * }
 *
 * const env = new EnvBinder<ValidatedConfig>();
 *
 * // Required variable throws if missing
 * const port = env.getRequired('REQUIRED_PORT');
 *
 * // Optional with default value
 * const timeout = env.getValue('OPTIONAL_TIMEOUT', '30s');
 *
 * // Type-converted values
 * const flag = env.getBool('BOOLEAN_FLAG', false);
 * const value = env.getNumber('NUMBER_VALUE', 100);
 * ```
 */
export interface EnvVariables {
  /**
   * The current runtime environment of the application.
   *
   * This critical variable determines the operational context of the application,
   * influencing configuration settings, logging levels, error handling behaviors,
   * feature availability, and various other runtime characteristics.
   *
   * The environment setting affects:
   * - Configuration loading and merging strategies
   * - Logging verbosity and output destinations
   * - Error reporting and debugging capabilities
   * - Performance optimizations enabled
   * - Security policies and restrictions
   * - Third-party service endpoints
   * - Cache strategies and TTL values
   * - Database connection pooling
   * - Feature flags and experimental features
   *
   * @type {Environment}
   * @default 'development'
   * @description
   * - **development**: Full debugging, verbose logging, hot reload enabled
   * - **staging**: Production-like environment with testing features
   * - **production**: Optimized for performance, minimal logging, security hardened
   * - **demo**: Read-only mode, limited features, sample data
   *
   * @example Environment-Specific Behavior
   * ```typescript
   * // Configure logging based on environment
   * const configureLogging = (env: Environment) => {
   *   const configs = {
   *     development: {
   *       level: 'debug',
   *       console: true,
   *       file: false,
   *       sourceMap: true,
   *     },
   *     staging: {
   *       level: 'info',
   *       console: true,
   *       file: true,
   *       sourceMap: false,
   *     },
   *     production: {
   *       level: 'error',
   *       console: false,
   *       file: true,
   *       sourceMap: false,
   *     },
   *     demo: {
   *       level: 'warn',
   *       console: false,
   *       file: true,
   *       sourceMap: false,
   *     },
   *   };
   *
   *   return configs[env] || configs.development;
   * };
   * ```
   *
   * @example Configuration Loading
   * ```typescript
   * // Load environment-specific configuration files
   * const loadConfig = async (env: Environment) => {
   *   const baseConfig = await import('./config/base.json');
   *   const envConfig = await import(`./config/${env}.json`);
   *   const localConfig = await import('./config/local.json').catch(() => null);
   *
   *   return mergeConfigs(baseConfig, envConfig, localConfig);
   * };
   * ```
   *
   * @example Feature Flag Control
   * ```typescript
   * // Environment-based feature toggles
   * const getFeatures = (env: Environment) => {
   *   const features = {
   *     development: {
   *       debugMode: true,
   *       hotReload: true,
   *       sourceMaps: true,
   *       profiling: true,
   *     },
   *     staging: {
   *       debugMode: false,
   *       hotReload: false,
   *       sourceMaps: false,
   *       profiling: true,
   *     },
   *     production: {
   *       debugMode: false,
   *       hotReload: false,
   *       sourceMaps: false,
   *       profiling: false,
   *     },
   *     demo: {
   *       debugMode: false,
   *       hotReload: false,
   *       sourceMaps: false,
   *       profiling: false,
   *       readOnly: true,
   *     },
   *   };
   *
   *   return features[env] || features.development;
   * };
   * ```
   *
   * @example Security Configuration
   * ```typescript
   * // Environment-based security settings
   * const getSecurityConfig = (env: Environment) => {
   *   if (env === 'production') {
   *     return {
   *       httpsOnly: true,
   *       hstsEnabled: true,
   *       csrfProtection: true,
   *       rateLimiting: 'strict',
   *       sessionTimeout: 15 * 60 * 1000, // 15 minutes
   *     };
   *   }
   *
   *   return {
   *     httpsOnly: false,
   *     hstsEnabled: false,
   *     csrfProtection: env !== 'demo',
   *     rateLimiting: 'lenient',
   *     sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
   *   };
   * };
   * ```
   *
   * @example Environment Validation
   * ```typescript
   * // Validate and sanitize environment values
   * const validateEnvironment = (env: string): Environment => {
   *   const validEnvs = ['development', 'staging', 'production', 'demo'];
   *   const normalized = env.toLowerCase().trim();
   *
   *   if (!validEnvs.includes(normalized)) {
   *     console.warn(`Invalid environment "${env}", falling back to "development"`);
   *     return 'development';
   *   }
   *
   *   return normalized as Environment;
   * };
   * ```
   */
  NODE_ENV: Environment;

  /**
   * Allows for additional environment variables beyond the predefined ones.
   *
   * This index signature enables the interface to accommodate any number of
   * custom environment variables while maintaining type safety for the core
   * predefined variables. It provides flexibility for applications to define
   * their specific environment variable requirements without being constrained
   * by a fixed set of properties.
   *
   * @keyof string
   * @value any
   * @description
   * - Accepts any string key for custom environment variables
   * - Values can be of any type (string, number, boolean, object, etc.)
   * - Maintains compatibility with process.env's dynamic nature
   * - Allows for runtime discovery of environment variables
   *
   * @example Dynamic Environment Variables
   * ```typescript
   * // Access custom environment variables
   * const dbHost = env.getValue('DATABASE_HOST'); // Not predefined, but accessible
   * const apiPort = env.getNumber('API_PORT', 3000); // Dynamic with default
   * const featureFlag = env.getBool('FEATURE_X_ENABLED', false); // Dynamic boolean
   * ```
   *
   * @example Environment Discovery
   * ```typescript
   * // Discover and process all environment variables
   * const getAllEnvVars = (): Record<string, string> => {
   *   return Object.keys(process.env).reduce((acc, key) => {
   *     acc[key] = env.getValue(key);
   *     return acc;
   *   }, {} as Record<string, string>);
   * };
   * ```
   *
   * @example Configuration Validation
   * ```typescript
   * // Validate dynamic configuration
   * const validateDynamicConfig = () => {
   *   const requiredVars = ['API_URL', 'DATABASE_URL', 'JWT_SECRET'];
   *   const missing = requiredVars.filter(key => !env.has(key));
   *
   *   if (missing.length > 0) {
   *     throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
   *   }
   * };
   * ```
   */
  [key: string]: any;
}
