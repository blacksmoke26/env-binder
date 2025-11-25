/**
 * @fileoverview Comprehensive example demonstrating EnvBinder usage with various environment variable types
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 * @since 0.0.1
 *
 * This example showcases how to:
 * - Import and configure EnvBinder
 * - Set up path aliases for dynamic resolution
 * - Retrieve different data types (string, number, boolean, array)
 * - Handle required variables with validation
 * - Use template literals and variable substitution
 * - Perform environment-specific logic
 * - Work with dates, patterns, enums, objects, and custom transformations
 * - Parse URLs, time durations, and arrays
 */

// Import EnvBinder class (ensure dotenv is configured to load .env file)
// import 'dotenv-safe/config'; // dotenv-safe for required .env files
import dotenv from 'dotenv'; // dotenv for standard .env file loading
dotenv.config({ path: __dirname + '/envs/.env.sample' });

import { dirname } from 'node:path';
import * as util from 'node:util';

import env from '../src/index';

export const inspect = (l: unknown) => util.inspect(l, { depth: 10, colors: true,  });

// Configure ROOT alias for path resolution
// This allows using $ROOTDIR in environment variables for dynamic path construction
env.addAlias('ROOTDIR', dirname(__dirname));

// =============================================================================
// HAS VALUE EXAMPLES
// =============================================================================
const hasDatabaseConfig = env.has('DATABASE_CONFIG'); // prints: true/false
const hasCacheConfig = env.has('CACHE_CONFIG'); // prints: true/false
const hasApiKey = env.has('API_KEY'); // prints: true/false
const hasFeatures = env.has('ACTIVE_FEATURES'); // prints: true/false
const hasTimeout = env.has('REQUEST_TIMEOUT'); // prints: true/false

console.log('Environment variable presence checks:', {
  'Has -> DATABASE_CONFIG': hasDatabaseConfig,
  'Has -> CACHE_CONFIG': hasCacheConfig,
  'Has -> API_KEY': hasApiKey,
  'Has -> ACTIVE_FEATURES': hasFeatures,
  'Has -> REQUEST_TIMEOUT': hasTimeout,
});

// =============================================================================
// SERVER CONFIGURATION
// =============================================================================
const PORT = env.getNumber('PORT', 3000); // prints: 3000
const nodeEnv = env.environment(); // prints: "development"
const HOST = env.getString('HOST', 'localhost'); // prints: "localhost"
const API_VERSION = env.getString('API_VERSION', 'v1'); // prints: "v1"
const SERVER_TIMEOUT = env.getTimeDuration('SERVER_TIMEOUT', 30000); // prints: 30000
const FRONTEND_API_ENDPOINT = env.getUrl('FRONTEND_API_ENDPOINT'); // prints: URL object or undefined

// =============================================================================
// DATABASE CONFIGURATION
// =============================================================================
const DATABASE_URL = env.getRequired<string>('DATABASE_URL'); // prints: "postgresql://user:pass@localhost:5432/mydb"
const DB_HOST = env.getString('DB_HOST', 'localhost'); // prints: "localhost"
const DB_PORT = env.getNumber('DB_PORT', 5432); // prints: 5432
const DB_NAME = env.getString('DB_NAME', 'myapp'); // prints: "myapp"
const DB_USER = env.getString('DB_USER', 'admin'); // prints: "admin"
const DB_PASS = env.getString('DB_PASS', ''); // prints: ""
const DB_SSL = env.getBool('DB_SSL', false); // prints: false
const DB_POOL_SIZE = env.getInteger('DB_POOL_SIZE', 10); // prints: 10
const DB_CONNECTION_TIMEOUT = env.getTimeDuration('DB_CONNECTION_TIMEOUT', 10000); // prints: 10000

// =============================================================================
// SEQUELIZE ORM CONFIGURATION
// =============================================================================
const SEQUELIZE_DIR = env.getString('SEQUELIZE_DIR'); // prints: "/path/to/sequelize/dir"
const SEQUELIZE_DB_URL = env.getUrl('SEQUELIZE_DB_URL'); // prints: URL object or undefined
const SEQUELIZE_LOGGING = env.getBool('SEQUELIZE_LOGGING', false); // prints: false
const SEQUELIZE_LOG_QUERY_PARAMETERS = env.getBool('SEQUELIZE_LOG_QUERY_PARAMETERS', false); // prints: false
const SEQUELIZE_BENCHMARK = env.getBool('SEQUELIZE_BENCHMARK', false); // prints: false

// =============================================================================
// REDIS CONFIGURATION
// =============================================================================
const REDIS_URL = env.getUrl('REDIS_URL'); // prints: URL object or undefined
const REDIS_HOST = env.getString('REDIS_HOST', 'localhost'); // prints: "localhost"
const REDIS_PORT = env.getNumber('REDIS_PORT', 6379); // prints: 6379
const REDIS_PASS = env.getString('REDIS_PASS', ''); // prints: ""
const REDIS_DB = env.getInteger('REDIS_DB', 0); // prints: 0
const REDIS_MAX_RETRIES = env.getInteger('REDIS_MAX_RETRIES', 3); // prints: 3

// =============================================================================
// SECURITY CONFIGURATION
// =============================================================================
const CORS_ORIGIN = env.getUrl('CORS_ORIGIN'); // prints: URL object or undefined
const RATE_LIMIT_WINDOW = env.getTimeDuration('RATE_LIMIT_WINDOW', 15); // prints: 15
const RATE_LIMIT_MAX = env.getInteger('RATE_LIMIT_MAX', 100); // prints: 100
const SESSION_SECRET = env.getRequired<string>('SESSION_SECRET'); // prints: "your-secret-key"
const BCRYPT_ROUNDS = env.getInteger('BCRYPT_ROUNDS', 12); // prints: 12

// =============================================================================
// APPLICATION SPECIFIC SETTINGS
// =============================================================================
const MAX_FILE_SIZE = env.getNumber('MAX_FILE_SIZE', 10485760); // prints: 10485760
const ALLOWED_FILE_TYPES = env.getStringArray<string>('ALLOWED_FILE_TYPES', []); // prints: ["jpg", "png"]
const DEFAULT_PAGE_SIZE = env.getInteger('DEFAULT_PAGE_SIZE', 20); // prints: 20
const MAX_PAGE_SIZE = env.getInteger('MAX_PAGE_SIZE', 100); // prints: 100
const CACHE_TTL_MINUTES = env.getTimeDuration('CACHE_TTL_MINUTES'); // prints: 60000

// =============================================================================
// ARRAY VARIABLES EXAMPLES
// =============================================================================
const SUPPORTED_LANGUAGES = env.getArray<string>('SUPPORTED_LANGUAGES', []); // prints: ["en", "es", "fr"]
const ACTIVE_FEATURES = env.getArray<string>('ACTIVE_FEATURES', []); // prints: ["feature1", "feature2"]

// =============================================================================
// DECIMAL AND INTEGER VARIABLES EXAMPLES
// =============================================================================
const MAX_UPLOAD_SPEED = env.getNumber('MAX_UPLOAD_SPEED', 10.5); // prints: 10.5
const MIN_RETRY_ATTEMPTS = env.getInteger('MIN_RETRY_ATTEMPTS', 3); // prints: 3
const DISK_USAGE_THRESHOLD = env.getNumber('DISK_USAGE_THRESHOLD', 85.75); // prints: 85.75
const MAX_CONNECTIONS = env.getInteger('MAX_CONNECTIONS', 1000); // prints: 1000
const CACHE_HIT_RATIO = env.getNumber('CACHE_HIT_RATIO', 0.95); // prints: 0.95

// =============================================================================
// PATH ALIASES EXAMPLES
// =============================================================================
const LOG_FILE_PATH = env.getString('LOG_FILE_PATH'); // prints: "/path/to/logs/app.log"
const CONFIG_DIR = env.getString('CONFIG_DIR'); // prints: "/path/to/config"
const STATIC_ASSETS_PATH = env.getString('STATIC_ASSETS_PATH'); // prints: "/path/to/assets"
const TEMP_DIR = env.getString('TEMP_DIR'); // prints: "/tmp"
const UPLOAD_DIR = env.getString('UPLOAD_DIR'); // prints: "/path/to/uploads"
const BACKUP_DIR = env.getString('BACKUP_DIR'); // prints: "/path/to/backups"

// =============================================================================
// TIME UNIT VARIABLES EXAMPLES
// =============================================================================
const SESSION_TIMEOUT = env.getTimeDuration('SESSION_TIMEOUT'); // prints: 3600000
const TOKEN_EXPIRATION = env.getTimeDuration('TOKEN_EXPIRATION'); // prints: 86400000
const CACHE_CLEANUP_INTERVAL = env.getTimeDuration('CACHE_CLEANUP_INTERVAL'); // prints: 300000
const RATE_LIMIT_RESET_PERIOD = env.getTimeDuration('RATE_LIMIT_RESET_PERIOD'); // prints: 900000
const REQUEST_TIMEOUT = env.getTimeDuration('REQUEST_TIMEOUT'); // prints: 30000

// =============================================================================
// ENVIRONMENT DETECTION EXAMPLES
// =============================================================================
if (env.isProduction()) {
  console.log('Running in production mode');
  // console.log('Running in production mode'); // prints: "Running in production mode"
} else if (env.isDev()) {
  console.log('Running in development mode');
  // console.log('Running in development mode'); // prints: "Running in development mode"
} else if (env.is('demo')) {
  console.log('Running in demo mode');
  // console.log('Running in demo mode'); // prints: "Running in demo mode"
}

// =============================================================================
// DATE, PATTERN, ENUM, OBJECT, AND CUSTOM EXAMPLES
// =============================================================================
const BACKUP_SCHEDULE_DATE = env.getDate('BACKUP_SCHEDULE_DATE'); // prints: Date object or undefined
const MAINTENANCE_WINDOW = env.getString('MAINTENANCE_WINDOW'); // prints: "02:00-04:00"
const EMAIL_PATTERN = env.getPattern('EMAIL_PATTERN', /^[^\s@]+@[^\s@]+\.[^\s@]+$/); // prints: /[^\s@]+@[^\s@]+\.[^\s@]+/
const PHONE_PATTERN = env.getPattern('PHONE_PATTERN', /^\+?[\d\s-()]+$/); // prints: /\+?[\d\s-()]+/
const LOG_LEVEL = env.getEnum('LOG_LEVEL', ['debug', 'info', 'warn', 'error'], 'error'); // prints: "info"
const USER_ROLE = env.getEnum('USER_ROLE', ['guest', 'user', 'admin'], 'guest'); // prints: "user"
const PAYMENT_STATUS = env.getEnum('PAYMENT_STATUS', ['pending', 'completed', 'failed'], 'completed'); // prints: "completed"
const DATABASE_CONFIG = env.getObject<{ host: string, port: number, ssl: boolean }>('DATABASE_CONFIG'); // prints: {host: "localhost", port: 5432}
const CACHE_CONFIG = env.getObject<{ ttl: number, maxSize: number }>('CACHE_CONFIG'); // prints: {type: "redis", ttl: 3600}
const API_ENDPOINT_TRANSFORMED = env.getCustom('API_ENDPOINT_TRANSFORMED', (value: string) => value.toUpperCase()); // prints: "HTTPS://API.EXAMPLE.COM"
const PROXY_URL_TRANSFORMED = env.getCustom('PROXY_URL_TRANSFORMED', (value: string) => new URL(value)); // prints: URL object

// =============================================================================
// BOOLEAN, URL, AND REQUIRED EXAMPLES
// =============================================================================
const ENABLE_ANALYTICS = env.getBool('ENABLE_ANALYTICS', false); // prints: false
const DEBUG_MODE = env.getBool('DEBUG_MODE', false); // prints: false
const MAINTENANCE_MODE = env.getBool('MAINTENANCE_MODE', false); // prints: false
const SERVER_HOSTS = env.getArray<string>('SERVER_HOSTS', []); // prints: ["host1", "host2"]
const AVAILABLE_PLUGINS = env.getArray<string>('AVAILABLE_PLUGINS', []); // prints: ["plugin1", "plugin2"]
const OAUTH_CALLBACK_URL = env.getUrl('OAUTH_CALLBACK_URL'); // prints: URL object or undefined
const WEBSOCKET_ENDPOINT = env.getUrl('WEBSOCKET_ENDPOINT'); // prints: URL object or undefined
const SECRET_KEY_REQUIRED = env.getRequired<string>('SECRET_KEY_REQUIRED'); // prints: "required-secret-key"
const LICENSE_KEY_REQUIRED = env.getRequired<string>('LICENSE_KEY_REQUIRED'); // prints: "required-license-key"

// Convert to time units
const TIMEOUT_IN_MINUTES_Ms = env.getTime('TIMEOUT_IN_MINUTES', 'MILLISECONDS', 1); // prints: 60000
const TIMEOUT_IN_MINUTES_Secs = env.getTime('TIMEOUT_IN_MINUTES', 'SECONDS', 1); // prints: 60
const TIMEOUT_IN_MINUTES_Minutes = env.getTime('TIMEOUT_IN_MINUTES', 'MINUTES', 1); // prints: 1

// =============================================================================
// CRON EXPRESSION EXAMPLES
// =============================================================================
const BACKUP_CRON = env.getCron('BACKUP_CRON'); // prints: "0 3 * * *"
const MAINTENANCE_CRON = env.getCron('MAINTENANCE_CRON'); // prints: undefined
const CLEANUP_CRON = env.getCron('CLEANUP_CRON'); // prints: undefined
const REPORT_CRON = env.getCron('REPORT_CRON'); // prints: "0 9 * * 1-5"

console.log(`\nPrinting values:`);
console.log(`ENV: 'PORT'`, ' → ', inspect(PORT));
console.log(`ENV: 'nodeEnv'`, ' → ', inspect(nodeEnv));
console.log(`ENV: 'HOST'`, ' → ', inspect(HOST));
console.log(`ENV: 'API_VERSION'`, ' → ', inspect(API_VERSION));
console.log(`ENV: 'SERVER_TIMEOUT'`, ' → ', inspect(SERVER_TIMEOUT));
console.log(`ENV: 'FRONTEND_API_ENDPOINT'`, ' → ', inspect(FRONTEND_API_ENDPOINT));
console.log(`ENV: 'DATABASE_URL'`, ' → ', inspect(DATABASE_URL));
console.log(`ENV: 'DB_HOST'`, ' → ', inspect(DB_HOST));
console.log(`ENV: 'DB_PORT'`, ' → ', inspect(DB_PORT));
console.log(`ENV: 'DB_NAME'`, ' → ', inspect(DB_NAME));
console.log(`ENV: 'DB_USER'`, ' → ', inspect(DB_USER));
console.log(`ENV: 'DB_PASS'`, ' → ', inspect(DB_PASS));
console.log(`ENV: 'DB_SSL'`, ' → ', inspect(DB_SSL));
console.log(`ENV: 'DB_POOL_SIZE'`, ' → ', inspect(DB_POOL_SIZE));
console.log(`ENV: 'DB_CONNECTION_TIMEOUT'`, ' → ', inspect(DB_CONNECTION_TIMEOUT));
console.log(`ENV: 'SEQUELIZE_DIR'`, ' → ', inspect(SEQUELIZE_DIR));
console.log(`ENV: 'SEQUELIZE_DB_URL'`, ' → ', inspect(SEQUELIZE_DB_URL));
console.log(`ENV: 'SEQUELIZE_LOGGING'`, ' → ', inspect(SEQUELIZE_LOGGING));
console.log(`ENV: 'SEQUELIZE_LOG_QUERY_PARAMETERS'`, ' → ', inspect(SEQUELIZE_LOG_QUERY_PARAMETERS));
console.log(`ENV: 'SEQUELIZE_BENCHMARK'`, ' → ', inspect(SEQUELIZE_BENCHMARK));
console.log(`ENV: 'REDIS_URL'`, ' → ', inspect(REDIS_URL));
console.log(`ENV: 'REDIS_HOST'`, ' → ', inspect(REDIS_HOST));
console.log(`ENV: 'REDIS_PORT'`, ' → ', inspect(REDIS_PORT));
console.log(`ENV: 'REDIS_PASS'`, ' → ', inspect(REDIS_PASS));
console.log(`ENV: 'REDIS_DB'`, ' → ', inspect(REDIS_DB));
console.log(`ENV: 'REDIS_MAX_RETRIES'`, ' → ', inspect(REDIS_MAX_RETRIES));
console.log(`ENV: 'CORS_ORIGIN'`, ' → ', inspect(CORS_ORIGIN));
console.log(`ENV: 'RATE_LIMIT_WINDOW'`, ' → ', inspect(RATE_LIMIT_WINDOW));
console.log(`ENV: 'RATE_LIMIT_MAX'`, ' → ', inspect(RATE_LIMIT_MAX));
console.log(`ENV: 'SESSION_SECRET'`, ' → ', inspect(SESSION_SECRET));
console.log(`ENV: 'BCRYPT_ROUNDS'`, ' → ', inspect(BCRYPT_ROUNDS));
console.log(`ENV: 'MAX_FILE_SIZE'`, ' → ', inspect(MAX_FILE_SIZE));
console.log(`ENV: 'ALLOWED_FILE_TYPES'`, ' → ', inspect(ALLOWED_FILE_TYPES));
console.log(`ENV: 'DEFAULT_PAGE_SIZE'`, ' → ', inspect(DEFAULT_PAGE_SIZE));
console.log(`ENV: 'MAX_PAGE_SIZE'`, ' → ', inspect(MAX_PAGE_SIZE));
console.log(`ENV: 'CACHE_TTL_MINUTES'`, ' → ', inspect(CACHE_TTL_MINUTES));
console.log(`ENV: 'SUPPORTED_LANGUAGES'`, ' → ', inspect(SUPPORTED_LANGUAGES));
console.log(`ENV: 'ACTIVE_FEATURES'`, ' → ', inspect(ACTIVE_FEATURES));
console.log(`ENV: 'MAX_UPLOAD_SPEED'`, ' → ', inspect(MAX_UPLOAD_SPEED));
console.log(`ENV: 'MIN_RETRY_ATTEMPTS'`, ' → ', inspect(MIN_RETRY_ATTEMPTS));
console.log(`ENV: 'DISK_USAGE_THRESHOLD'`, ' → ', inspect(DISK_USAGE_THRESHOLD));
console.log(`ENV: 'MAX_CONNECTIONS'`, ' → ', inspect(MAX_CONNECTIONS));
console.log(`ENV: 'CACHE_HIT_RATIO'`, ' → ', inspect(CACHE_HIT_RATIO));
console.log(`ENV: 'LOG_FILE_PATH'`, ' → ', inspect(LOG_FILE_PATH));
console.log(`ENV: 'CONFIG_DIR'`, ' → ', inspect(CONFIG_DIR));
console.log(`ENV: 'STATIC_ASSETS_PATH'`, ' → ', inspect(STATIC_ASSETS_PATH));
console.log(`ENV: 'TEMP_DIR'`, ' → ', inspect(TEMP_DIR));
console.log(`ENV: 'UPLOAD_DIR'`, ' → ', inspect(UPLOAD_DIR));
console.log(`ENV: 'BACKUP_DIR'`, ' → ', inspect(BACKUP_DIR));
console.log(`ENV: 'SESSION_TIMEOUT'`, ' → ', inspect(SESSION_TIMEOUT));
console.log(`ENV: 'TOKEN_EXPIRATION'`, ' → ', inspect(TOKEN_EXPIRATION));
console.log(`ENV: 'CACHE_CLEANUP_INTERVAL'`, ' → ', inspect(CACHE_CLEANUP_INTERVAL));
console.log(`ENV: 'RATE_LIMIT_RESET_PERIOD'`, ' → ', inspect(RATE_LIMIT_RESET_PERIOD));
console.log(`ENV: 'REQUEST_TIMEOUT'`, ' → ', inspect(REQUEST_TIMEOUT));
console.log(`ENV: 'BACKUP_SCHEDULE_DATE'`, ' → ', inspect(BACKUP_SCHEDULE_DATE));
console.log(`ENV: 'MAINTENANCE_WINDOW'`, ' → ', inspect(MAINTENANCE_WINDOW));
console.log(`ENV: 'EMAIL_PATTERN'`, ' → ', inspect(EMAIL_PATTERN));
console.log(`ENV: 'PHONE_PATTERN'`, ' → ', inspect(PHONE_PATTERN));
console.log(`ENV: 'LOG_LEVEL'`, ' → ', inspect(LOG_LEVEL));
console.log(`ENV: 'USER_ROLE'`, ' → ', inspect(USER_ROLE));
console.log(`ENV: 'PAYMENT_STATUS'`, ' → ', inspect(PAYMENT_STATUS));
console.log(`ENV: 'DATABASE_CONFIG'`, ' → ', inspect(DATABASE_CONFIG));
console.log(`ENV: 'CACHE_CONFIG'`, ' → ', inspect(CACHE_CONFIG));
console.log(`ENV: 'API_ENDPOINT_TRANSFORMED'`, ' → ', inspect(API_ENDPOINT_TRANSFORMED));
console.log(`ENV: 'PROXY_URL_TRANSFORMED'`, ' → ', inspect(PROXY_URL_TRANSFORMED));
console.log(`ENV: 'ENABLE_ANALYTICS'`, ' → ', inspect(ENABLE_ANALYTICS));
console.log(`ENV: 'DEBUG_MODE'`, ' → ', inspect(DEBUG_MODE));
console.log(`ENV: 'MAINTENANCE_MODE'`, ' → ', inspect(MAINTENANCE_MODE));
console.log(`ENV: 'SERVER_HOSTS'`, ' → ', inspect(SERVER_HOSTS));
console.log(`ENV: 'AVAILABLE_PLUGINS'`, ' → ', inspect(AVAILABLE_PLUGINS));
console.log(`ENV: 'OAUTH_CALLBACK_URL'`, ' → ', inspect(OAUTH_CALLBACK_URL));
console.log(`ENV: 'WEBSOCKET_ENDPOINT'`, ' → ', inspect(WEBSOCKET_ENDPOINT));
console.log(`ENV: 'SECRET_KEY_REQUIRED'`, ' → ', inspect(SECRET_KEY_REQUIRED));
console.log(`ENV: 'LICENSE_KEY_REQUIRED'`, ' → ', inspect(LICENSE_KEY_REQUIRED));
console.log(`ENV: 'TIMEOUT_IN_MINUTES_Ms'`, ' → ', inspect(TIMEOUT_IN_MINUTES_Ms));
console.log(`ENV: 'TIMEOUT_IN_MINUTES_Secs'`, ' → ', inspect(TIMEOUT_IN_MINUTES_Secs));
console.log(`ENV: 'TIMEOUT_IN_MINUTES_Minutes'`, ' → ', inspect(TIMEOUT_IN_MINUTES_Minutes));
console.log(`ENV: 'BACKUP_CRON'`, ' → ', inspect(BACKUP_CRON));
console.log(`ENV: 'MAINTENANCE_CRON'`, ' → ', inspect(MAINTENANCE_CRON));
console.log(`ENV: 'CLEANUP_CRON'`, ' → ', inspect(CLEANUP_CRON));
console.log(`ENV: 'REPORT_CRON'`, ' → ', inspect(REPORT_CRON));

// =============================================================================
// CONFIGURATION LOGGING
// =============================================================================
console.log('Server configuration:', {
  PORT,
  HOST,
  NODE_ENV: nodeEnv,
  API_VERSION,
  TIMEOUT: SERVER_TIMEOUT,
  FRONTEND_API_ENDPOINT,
});
// prints: {port: 3000, host: "localhost", ...}

console.log('Database configuration:', {
  url: DATABASE_URL,
  host: DB_HOST,
  port: DB_PORT,
  name: DB_NAME,
  ssl: DB_SSL,
  poolSize: DB_POOL_SIZE,
  timeout: DB_CONNECTION_TIMEOUT,
});
// prints: {url: "...", host: "localhost", ...}

console.log('Time configurations:', {
  SESSION_TIMEOUT,
  TOKEN_EXPIRATION,
  CACHE_CLEANUP_INTERVAL,
  RATE_LIMIT_RESET_PERIOD,
  REQUEST_TIMEOUT,
});
// prints: {sessionTimeout: 3600000, ...}

console.log('Pattern and enum values:', {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  LOG_LEVEL,
  USER_ROLE,
  PAYMENT_STATUS,
});
// prints: {emailPattern: /.../, logLevel: "info", ...}

console.log('Object configurations:', {
  database: DATABASE_CONFIG,
  cache: CACHE_CONFIG,
});
// prints: {database: {...}, cache: {...}}

console.log('Custom transformed values:', {
  apiEndpoint: API_ENDPOINT_TRANSFORMED,
  proxyUrl: PROXY_URL_TRANSFORMED,
});
// prints: {apiEndpoint: "HTTPS://...", proxyUrl: URL object}

console.log('Features enabled:', ACTIVE_FEATURES);
// prints: ["feature1", "feature2"]

console.log('Supported languages:', SUPPORTED_LANGUAGES);
// prints: ["en", "es", "fr"]

console.log('Server hosts:', SERVER_HOSTS);
// prints: ["host1", "host2"]

console.log('Available plugins:', AVAILABLE_PLUGINS);
// prints: ["plugin1", "plugin2"]
