/**
 * @fileoverview Test file demonstrating complex environment variable parsing and type conversion
 * using the EnvBinder library. This file showcases various data types, template substitutions,
 * path aliases, and validation features through extensive test cases.
 *
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 * @since 0.0.1
 */

// Import EnvBinder class (ensure dotenv is configured to load .env file)
import dotenv from 'dotenv'; // dotenv for standard .env file loading
dotenv.config({ path: __dirname + '/envs/.env.complex' });

import * as util from 'node:util';
import { dirname } from 'node:path';

import env from '../src/index';

env.addAlias('HOME', dirname(__dirname) + '/home');
env.addAlias('ROOTDIR', dirname(__dirname));
env.addAlias('HOST', 'ed6.some-host.com', false);
env.addAlias('DATABASE_URL', 'https://cloud.db-server.com', false);
env.addAlias('LOG_LEVEL', 'info', false);
env.addAlias('REQUEST_TIMEOUT', '30000', false);
env.addAlias('REDIS_URL', 'redis://localhost:6379', false);
env.addAlias('PORT', '9906', false);

const inspect = (l: unknown) => util.inspect(l, { depth: 10, colors: true });

// Complex environment variables from .env.complex

console.log(`\n ======================== TEST COMPLEX =========================\n`);
console.log(`\nPrinting values:`);

// Boolean Values
console.log(`ENV: 'ENABLE_FEATURE'`, ' ➜ ', inspect(env.getBool('ENABLE_FEATURE')));
console.log(`ENV: 'DISABLE_FEATURE'`, ' ➜ ', inspect(env.getBool('DISABLE_FEATURE')));
console.log(`ENV: 'NULL_BOOLEAN'`, ' ➜ ', inspect(env.getBool('NULL_BOOLEAN')));
console.log(`ENV: 'UNDEFINED_BOOLEAN'`, ' ➜ ', inspect(env.getBool('UNDEFINED_BOOLEAN')));
console.log(`ENV: 'EMPTY_BOOLEAN'`, ' ➜ ', inspect(env.getBool('EMPTY_BOOLEAN')));
console.log(`ENV: 'ZERO_BOOLEAN'`, ' ➜ ', inspect(env.getBool('ZERO_BOOLEAN')));
console.log(`ENV: 'FALSY_BOOLEAN'`, ' ➜ ', inspect(env.getBool('FALSY_BOOLEAN')));

// String Values
console.log(`ENV: 'BASIC_STRING'`, ' ➜ ', inspect(env.getString('BASIC_STRING')));
console.log(`ENV: 'STRING_WITH_QUOTES'`, ' ➜ ', inspect(env.getString('STRING_WITH_QUOTES')));
console.log(`ENV: 'EMPTY_STRING'`, ' ➜ ', inspect(env.getString('EMPTY_STRING')));
console.log(`ENV: 'NUMERIC_AS_STRING'`, ' ➜ ', inspect(env.getString('NUMERIC_AS_STRING')));
console.log(`ENV: 'BOOLEAN_AS_STRING'`, ' ➜ ', inspect(env.getString('BOOLEAN_AS_STRING')));
console.log(`ENV: 'URL_AS_STRING'`, ' ➜ ', inspect(env.getString('URL_AS_STRING')));
console.log(`ENV: 'ESCAPED_STRING'`, ' ➜ ', inspect(env.getString('ESCAPED_STRING')));
console.log(`ENV: 'UNICODE_STRING'`, ' ➜ ', inspect(env.getString('UNICODE_STRING')));
console.log(`ENV: 'SPECIAL_CHARS'`, ' ➜ ', inspect(env.getString('SPECIAL_CHARS')));

// Number Values
console.log(`ENV: 'INTEGER_VALUE'`, ' ➜ ', inspect(env.getNumber('INTEGER_VALUE')));
console.log(`ENV: 'NEGATIVE_INTEGER'`, ' ➜ ', inspect(env.getNumber('NEGATIVE_INTEGER')));
console.log(`ENV: 'ZERO_NUMBER'`, ' ➜ ', inspect(env.getNumber('ZERO_NUMBER')));
console.log(`ENV: 'DECIMAL_VALUE'`, ' ➜ ', inspect(env.getNumber('DECIMAL_VALUE')));
console.log(`ENV: 'NEGATIVE_DECIMAL'`, ' ➜ ', inspect(env.getNumber('NEGATIVE_DECIMAL')));
console.log(`ENV: 'SCIENTIFIC_NOTATION'`, ' ➜ ', inspect(env.getNumber('SCIENTIFIC_NOTATION')));
console.log(`ENV: 'PERCENTAGE_VALUE'`, ' ➜ ', inspect(env.getNumber('PERCENTAGE_VALUE')));
console.log(`ENV: 'LARGE_NUMBER'`, ' ➜ ', inspect(env.getNumber('LARGE_NUMBER')));
console.log(`ENV: 'SMALL_DECIMAL'`, ' ➜ ', inspect(env.getNumber('SMALL_DECIMAL')));

// URL Values
console.log(`ENV: 'HTTP_URL'`, ' ➜ ', inspect(env.getUrl('HTTP_URL')));
console.log(`ENV: 'HTTPS_URL'`, ' ➜ ', inspect(env.getUrl('HTTPS_URL')));
console.log(`ENV: 'FTP_URL'`, ' ➜ ', inspect(env.getUrl('FTP_URL')));
console.log(`ENV: 'WS_URL'`, ' ➜ ', inspect(env.getUrl('WS_URL')));
console.log(`ENV: 'WSS_URL'`, ' ➜ ', inspect(env.getUrl('WSS_URL')));
console.log(`ENV: 'URL_WITH_PORT'`, ' ➜ ', inspect(env.getUrl('URL_WITH_PORT')));
console.log(`ENV: 'URL_WITH_PATH'`, ' ➜ ', inspect(env.getUrl('URL_WITH_PATH')));
console.log(`ENV: 'URL_WITH_QUERY'`, ' ➜ ', inspect(env.getUrl('URL_WITH_QUERY')));
console.log(`ENV: 'URL_WITH_FRAGMENT'`, ' ➜ ', inspect(env.getUrl('URL_WITH_FRAGMENT')));
console.log(`ENV: 'LOCALHOST_URL'`, ' ➜ ', inspect(env.getUrl('LOCALHOST_URL')));
console.log(`ENV: 'IP_URL'`, ' ➜ ', inspect(env.getUrl('IP_URL')));

// Required Values
console.log(`ENV: 'REQUIRED_API_KEY'`, ' ➜ ', inspect(env.getString('REQUIRED_API_KEY')));
console.log(`ENV: 'DATABASE_PASSWORD_REQUIRED'`, ' ➜ ', inspect(env.getString('DATABASE_PASSWORD_REQUIRED')));
console.log(`ENV: 'JWT_SECRET_REQUIRED'`, ' ➜ ', inspect(env.getString('JWT_SECRET_REQUIRED')));

// Time Duration Values
console.log(`ENV: 'TIME_SECONDS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_SECONDS')));
console.log(`ENV: 'TIME_MINUTES'`, ' ➜ ', inspect(env.getTimeDuration('TIME_MINUTES')));
console.log(`ENV: 'TIME_HOURS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_HOURS')));
console.log(`ENV: 'TIME_DAYS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_DAYS')));
console.log(`ENV: 'TIME_WEEKS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_WEEKS')));
console.log(`ENV: 'TIME_MONTHS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_MONTHS')));
console.log(`ENV: 'TIME_YEARS'`, ' ➜ ', inspect(env.getTimeDuration('TIME_YEARS')));
console.log(`ENV: 'COMPLEX_TIME'`, ' ➜ ', inspect(env.getTimeDuration('COMPLEX_TIME')));
console.log(`ENV: 'NEGATIVE_TIME'`, ' ➜ ', inspect(env.getTimeDuration('NEGATIVE_TIME')));
console.log(`ENV: 'ZERO_TIME'`, ' ➜ ', inspect(env.getTimeDuration('ZERO_TIME')));
console.log(`ENV: 'DECIMAL_TIME'`, ' ➜ ', inspect(env.getTimeDuration('DECIMAL_TIME')));

// Array Values (JSON format)
console.log(`ENV: 'STRING_ARRAY'`, ' ➜ ', inspect(env.getArray('STRING_ARRAY')));
console.log(`ENV: 'NUMBER_ARRAY'`, ' ➜ ', inspect(env.getArray('NUMBER_ARRAY')));
console.log(`ENV: 'MIXED_ARRAY'`, ' ➜ ', inspect(env.getArray('MIXED_ARRAY')));
console.log(`ENV: 'NESTED_ARRAY'`, ' ➜ ', inspect(env.getArray('NESTED_ARRAY')));
console.log(`ENV: 'OBJECT_ARRAY'`, ' ➜ ', inspect(env.getArray('OBJECT_ARRAY')));
console.log(`ENV: 'ESCAPED_ARRAY'`, ' ➜ ', inspect(env.getArray('ESCAPED_ARRAY')));
console.log(`ENV: 'UNICODE_ARRAY'`, ' ➜ ', inspect(env.getArray('UNICODE_ARRAY')));
console.log(`ENV: 'EMPTY_ARRAY'`, ' ➜ ', inspect(env.getArray('EMPTY_ARRAY')));
console.log(`ENV: 'SINGLE_ITEM_ARRAY'`, ' ➜ ', inspect(env.getArray('SINGLE_ITEM_ARRAY')));

// Cron Expressions
try {
  console.log(`ENV: 'VALID_CRON'`, ' ➜ ', inspect(env.getCron('VALID_CRON')));
} catch (e) {
  console.log(`ENV: 'VALID_CRON'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'VALID_CRON_WITH_SECONDS'`, ' ➜ ', inspect(env.getCron('VALID_CRON_WITH_SECONDS')));
} catch (e) {
  console.log(`ENV: 'VALID_CRON_WITH_SECONDS'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'VALID_CRON_RANGE'`, ' ➜ ', inspect(env.getCron('VALID_CRON_RANGE')));
} catch (e) {
  console.log(`ENV: 'VALID_CRON_RANGE'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'VALID_CRON_LIST'`, ' ➜ ', inspect(env.getCron('VALID_CRON_LIST')));
} catch (e) {
  console.log(`ENV: 'VALID_CRON_LIST'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'INVALID_CRON'`, ' ➜ ', inspect(env.getCron('INVALID_CRON')));
} catch (e) {
  console.log(`ENV: 'INVALID_CRON'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'DISABLED_CRON'`, ' ➜ ', inspect(env.getCron('DISABLED_CRON')));
} catch (e) {
  console.log(`ENV: 'DISABLED_CRON'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'NULL_CRON'`, ' ➜ ', inspect(env.getCron('NULL_CRON')));
} catch (e) {
  console.log(`ENV: 'NULL_CRON'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'EMPTY_CRON'`, ' ➜ ', inspect(env.getCron('EMPTY_CRON')));
} catch (e) {
  console.log(`ENV: 'EMPTY_CRON'`, ' ➜ ', inspect(e));
}
try {
  console.log(`ENV: 'COMPLEX_CRON'`, ' ➜ ', inspect(env.getCron('COMPLEX_CRON')));
} catch (e) {
  console.log(`ENV: 'COMPLEX_CRON'`, ' ➜ ', inspect(e));
}

// Date Values
console.log(`ENV: 'ISO_DATE'`, ' ➜ ', inspect(env.getDate('ISO_DATE')));
console.log(`ENV: 'DATE_ONLY'`, ' ➜ ', inspect(env.getDate('DATE_ONLY')));
console.log(`ENV: 'DATE_TIME'`, ' ➜ ', inspect(env.getDate('DATE_TIME')));
console.log(`ENV: 'UNIX_TIMESTAMP'`, ' ➜ ', inspect(env.getDate('UNIX_TIMESTAMP')));
console.log(`ENV: 'INVALID_DATE'`, ' ➜ ', inspect(env.getDate('INVALID_DATE')));
console.log(`ENV: 'FUTURE_DATE'`, ' ➜ ', inspect(env.getDate('FUTURE_DATE')));
console.log(`ENV: 'PAST_DATE'`, ' ➜ ', inspect(env.getDate('PAST_DATE')));
console.log(`ENV: 'DATE_WITH_TIMEZONE'`, ' ➜ ', inspect(env.getDate('DATE_WITH_TIMEZONE')));

// Enum Values
console.log(`ENV: 'COLOR_ENUM'`, ' ➜ ', inspect(env.getEnum('COLOR_ENUM', ['red', 'green', 'blue'])));
console.log(`ENV: 'SIZE_ENUM'`, ' ➜ ', inspect(env.getEnum('SIZE_ENUM', ['small', 'medium', 'large'])));
console.log(`ENV: 'STATUS_ENUM'`, ' ➜ ', inspect(env.getEnum('STATUS_ENUM', ['active', 'inactive'])));
console.log(`ENV: 'PRIORITY_ENUM'`, ' ➜ ', inspect(env.getEnum('PRIORITY_ENUM', ['low', 'medium', 'high'])));

// Object Values (JSON)
console.log(`ENV: 'SIMPLE_OBJECT'`, ' ➜ ', inspect(env.getObject('SIMPLE_OBJECT')));
console.log(`ENV: 'NESTED_OBJECT'`, ' ➜ ', inspect(env.getObject('NESTED_OBJECT')));
console.log(`ENV: 'OBJECT_WITH_ARRAY'`, ' ➜ ', inspect(env.getObject('OBJECT_WITH_ARRAY')));
console.log(`ENV: 'OBJECT_WITH_NULL'`, ' ➜ ', inspect(env.getObject('OBJECT_WITH_NULL')));
console.log(`ENV: 'EMPTY_OBJECT'`, ' ➜ ', inspect(env.getObject('EMPTY_OBJECT')));
console.log(`ENV: 'OBJECT_WITH_SPECIAL_CHARS'`, ' ➜ ', inspect(env.getObject('OBJECT_WITH_SPECIAL_CHARS')));
console.log(`ENV: 'OBJECT_WITH_BOOLEAN'`, ' ➜ ', inspect(env.getObject('OBJECT_WITH_BOOLEAN')));
console.log(`ENV: 'OBJECT_WITH_NUMBER'`, ' ➜ ', inspect(env.getObject('OBJECT_WITH_NUMBER')));

// Multiple Values (delimiter separated)
console.log(`ENV: 'MULTIPLE_SEMICOLON'`, ' ➜ ', inspect(env.getStringArray('MULTIPLE_SEMICOLON')));
console.log(`ENV: 'MULTIPLE_PIPE'`, ' ➜ ', inspect(env.getStringArray('MULTIPLE_PIPE')));
console.log(`ENV: 'MULTIPLE_NEWLINE'`, ' ➜ ', inspect(env.getStringArray('MULTIPLE_NEWLINE')));
console.log(`ENV: 'MULTIPLE_SPECIAL'`, ' ➜ ', inspect(env.getStringArray('MULTIPLE_SPECIAL')));

// Time Duration Edge Cases
console.log(`ENV: 'DURATION_COMPLEX'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_COMPLEX')));
console.log(`ENV: 'DURATION_DECIMAL'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_DECIMAL')));
console.log(`ENV: 'DURATION_NEGATIVE'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_NEGATIVE')));
console.log(`ENV: 'DURATION_ZERO'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_ZERO')));
console.log(`ENV: 'DURATION_LARGE'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_LARGE')));
console.log(`ENV: 'DURATION_FRACTION'`, ' ➜ ', inspect(env.getTimeDuration('DURATION_FRACTION')));

// Database Connection Strings
console.log(`ENV: 'MONGODB_URL'`, ' ➜ ', inspect(env.getString('MONGODB_URL')));
console.log(`ENV: 'POSTGRESQL_URL'`, ' ➜ ', inspect(env.getString('POSTGRESQL_URL')));
console.log(`ENV: 'REDIS_URL'`, ' ➜ ', inspect(env.getString('REDIS_URL')));
console.log(`ENV: 'MYSQL_URL'`, ' ➜ ', inspect(env.getString('MYSQL_URL')));
console.log(`ENV: 'SQLITE_URL'`, ' ➜ ', inspect(env.getString('SQLITE_URL')));
console.log(`ENV: 'COSMOS_URL'`, ' ➜ ', inspect(env.getString('COSMOS_URL')));

// Security Configuration
console.log(`ENV: 'CORS_ORIGINS'`, ' ➜ ', inspect(env.getStringArray('CORS_ORIGINS')));
console.log(`ENV: 'RATE_LIMIT_COMPLEX'`, ' ➜ ', inspect(env.getString('RATE_LIMIT_COMPLEX')));
console.log(`ENV: 'JWT_ALGORITHM'`, ' ➜ ', inspect(env.getString('JWT_ALGORITHM')));
console.log(`ENV: 'BCRYPT_ROUNDS'`, ' ➜ ', inspect(env.getNumber('BCRYPT_ROUNDS')));
console.log(`ENV: 'OAUTH_SCOPES'`, ' ➜ ', inspect(env.getStringArray('OAUTH_SCOPES')));
console.log(`ENV: 'API_KEYS'`, ' ➜ ', inspect(env.getStringArray('API_KEYS')));
console.log(`ENV: 'ENCRYPTION_KEY'`, ' ➜ ', inspect(env.getString('ENCRYPTION_KEY')));

// Feature Flags
console.log(`ENV: 'FEATURE_FLAGS'`, ' ➜ ', inspect(env.getObject('FEATURE_FLAGS')));
console.log(`ENV: 'DARK_MODE_THEME'`, ' ➜ ', inspect(env.getString('DARK_MODE_THEME')));
console.log(`ENV: 'BETA_FEATURE_ACCESS'`, ' ➜ ', inspect(env.getBool('BETA_FEATURE_ACCESS')));
console.log(`ENV: 'MAINTENANCE_SCHEDULE'`, ' ➜ ', inspect(env.getDate('MAINTENANCE_SCHEDULE')));
console.log(`ENV: 'DEPRECATED_FEATURE_WARNING'`, ' ➜ ', inspect(env.getBool('DEPRECATED_FEATURE_WARNING')));

// Performance Tuning
console.log(`ENV: 'CACHE_CONFIG'`, ' ➜ ', inspect(env.getObject('CACHE_CONFIG')));
console.log(`ENV: 'POOL_CONFIG'`, ' ➜ ', inspect(env.getObject('POOL_CONFIG')));
console.log(`ENV: 'QUEUE_CONFIG'`, ' ➜ ', inspect(env.getObject('QUEUE_CONFIG')));
console.log(`ENV: 'THROTTLE_CONFIG'`, ' ➜ ', inspect(env.getObject('THROTTLE_CONFIG')));

// Monitoring and Logging
console.log(`ENV: 'LOG_LEVEL'`, ' ➜ ', inspect(env.getString('LOG_LEVEL')));
console.log(`ENV: 'LOG_FORMAT'`, ' ➜ ', inspect(env.getString('LOG_FORMAT')));
console.log(`ENV: 'METRICS_ENABLED'`, ' ➜ ', inspect(env.getBool('METRICS_ENABLED')));
console.log(`ENV: 'HEALTH_CHECK_INTERVAL'`, ' ➜ ', inspect(env.getTimeDuration('HEALTH_CHECK_INTERVAL')));
console.log(`ENV: 'PERFORMANCE_SAMPLE_RATE'`, ' ➜ ', inspect(env.getNumber('PERFORMANCE_SAMPLE_RATE')));
console.log(`ENV: 'ERROR_NOTIFICATION_SLACK'`, ' ➜ ', inspect(env.getUrl('ERROR_NOTIFICATION_SLACK')));

// Third-party Service Configurations
console.log(`ENV: 'STRIPE_WEBHOOK_SECRET'`, ' ➜ ', inspect(env.getString('STRIPE_WEBHOOK_SECRET')));
console.log(`ENV: 'AWS_REGION'`, ' ➜ ', inspect(env.getString('AWS_REGION')));
console.log(`ENV: 'GOOGLE_CLOUD_PROJECT'`, ' ➜ ', inspect(env.getString('GOOGLE_CLOUD_PROJECT')));
console.log(`ENV: 'TWILIO_ACCOUNT_SID'`, ' ➜ ', inspect(env.getString('TWILIO_ACCOUNT_SID')));
console.log(`ENV: 'SENTRY_DSN'`, ' ➜ ', inspect(env.getUrl('SENTRY_DSN')));

// Template String and Variable Substitution Examples
console.log(`ENV: 'TEMPLATE_URL'`, ' ➜ ', inspect(env.getString('TEMPLATE_URL')));
console.log(`ENV: 'TEMPLATE_EMAIL'`, ' ➜ ', inspect(env.getString('TEMPLATE_EMAIL')));
console.log(`ENV: 'TEMPLATE_FILE_PATH'`, ' ➜ ', inspect(env.getString('TEMPLATE_FILE_PATH')));
console.log(`ENV: 'TEMPLATE_DATABASE'`, ' ➜ ', inspect(env.getString('TEMPLATE_DATABASE')));

// Variable Aliases and References
console.log(`ENV: 'API_HOST_ALIAS'`, ' ➜ ', inspect(env.getString('API_HOST_ALIAS')));
console.log(`ENV: 'API_PORT_ALIAS'`, ' ➜ ', inspect(env.getString('API_PORT_ALIAS')));
console.log(`ENV: 'DB_CONNECTION_ALIAS'`, ' ➜ ', inspect(env.getString('DB_CONNECTION_ALIAS')));
console.log(`ENV: 'DUMP_SQL_ALIAS'`, ' ➜ ', inspect(env.getString('DUMP_SQL_ALIAS')));
console.log(`ENV: 'REDIS_CONNECTION_ALIAS'`, ' ➜ ', inspect(env.getString('REDIS_CONNECTION_ALIAS')));
console.log(`ENV: 'LOG_LEVEL_ALIAS'`, ' ➜ ', inspect(env.getString('LOG_LEVEL_ALIAS')));
console.log(`ENV: 'TIMEOUT_ALIAS'`, ' ➜ ', inspect(env.getString('TIMEOUT_ALIAS')));

// Complex Template Combinations
console.log(`ENV: 'FULL_API_ENDPOINT'`, ' ➜ ', inspect(env.getString('FULL_API_ENDPOINT')));
console.log(`ENV: 'WEBSOCKET_CONNECTION'`, ' ➜ ', inspect(env.getString('WEBSOCKET_CONNECTION')));
console.log(`ENV: 'CLOUD_STORAGE_PATH'`, ' ➜ ', inspect(env.getString('CLOUD_STORAGE_PATH')));
console.log(`ENV: 'DOCKER_COMPOSE_CMD'`, ' ➜ ', inspect(env.getString('DOCKER_COMPOSE_CMD')));

// Environment-Dependent Templates
console.log(`ENV: 'ENV_CONFIG_PATH'`, ' ➜ ', inspect(env.getString('ENV_CONFIG_PATH')));
console.log(`ENV: 'ENV_DATABASE_URL'`, ' ➜ ', inspect(env.getString('ENV_DATABASE_URL')));
console.log(`ENV: 'ENV_LOG_LEVEL'`, ' ➜ ', inspect(env.getString('ENV_LOG_LEVEL')));
console.log(`ENV: 'ENV_FEATURE_FLAGS'`, ' ➜ ', inspect(env.getString('ENV_FEATURE_FLAGS')));

// Nested Variable Substitution
console.log(`ENV: 'NESTED_TEMPLATE'`, ' ➜ ', inspect(env.getString('NESTED_TEMPLATE')));
console.log(`ENV: 'DEEP_NESTED'`, ' ➜ ', inspect(env.getString('DEEP_NESTED')));
console.log(`ENV: 'CONDITIONAL_NESTED'`, ' ➜ ', inspect(env.getString('CONDITIONAL_NESTED')));
console.log(`ENV: 'NESTED_SUBSTITUTION'`, ' ➜ ', inspect(env.getString('NESTED_SUBSTITUTION')));

// Array Template Substitutions
console.log(`ENV: 'TEMPLATE_ARRAY'`, ' ➜ ', inspect(env.getArray('TEMPLATE_ARRAY')));
console.log(`ENV: 'TEMPLATE_OBJECT'`, ' ➜ ', inspect(env.getObject('TEMPLATE_OBJECT')));

// Path and URL Templates
console.log(`ENV: 'TEMPLATE_STATIC_PATH'`, ' ➜ ', inspect(env.getString('TEMPLATE_STATIC_PATH')));
console.log(`ENV: 'TEMPLATE_API_DOCS'`, ' ➜ ', inspect(env.getString('TEMPLATE_API_DOCS')));
console.log(`ENV: 'TEMPLATE_WEBHOOK'`, ' ➜ ', inspect(env.getString('TEMPLATE_WEBHOOK')));

// Dynamic Configuration Templates
console.log(`ENV: 'TEMPLATE_SERVICE_URL'`, ' ➜ ', inspect(env.getString('TEMPLATE_SERVICE_URL')));
console.log(`ENV: 'TEMPLATE_CACHE_KEY'`, ' ➜ ', inspect(env.getString('TEMPLATE_CACHE_KEY')));
console.log(`ENV: 'TEMPLATE_QUEUE_NAME'`, ' ➜ ', inspect(env.getString('TEMPLATE_QUEUE_NAME')));

// Conditional Template Logic
console.log(`ENV: 'TEMPLATE_ENV_SUFFIX'`, ' ➜ ', inspect(env.getString('TEMPLATE_ENV_SUFFIX')));
console.log(`ENV: 'TEMPLATE_LOG_FILE'`, ' ➜ ', inspect(env.getString('TEMPLATE_LOG_FILE')));
console.log(`ENV: 'TEMPLATE_DB_NAME'`, ' ➜ ', inspect(env.getString('TEMPLATE_DB_NAME')));

// Multi-line Template Strings
console.log(`ENV: 'TEMPLATE_EMAIL_BODY'`, ' ➜ ', inspect(env.getString('TEMPLATE_EMAIL_BODY')));
console.log(`ENV: 'TEMPLATE_SQL_QUERY'`, ' ➜ ', inspect(env.getString('TEMPLATE_SQL_QUERY')));

// URL Construction with Variables
console.log(`ENV: 'TEMPLATE_OAUTH_URL'`, ' ➜ ', inspect(env.getString('TEMPLATE_OAUTH_URL')));
console.log(`ENV: 'TEMPLATE_CALLBACK_URL'`, ' ➜ ', inspect(env.getString('TEMPLATE_CALLBACK_URL')));
console.log(`ENV: 'TEMPLATE_WEBHOOK_URL'`, ' ➜ ', inspect(env.getString('TEMPLATE_WEBHOOK_URL')));

// File System Path Templates
console.log(`ENV: 'TEMPLATE_UPLOAD_PATH'`, ' ➜ ', inspect(env.getString('TEMPLATE_UPLOAD_PATH')));
console.log(`ENV: 'TEMPLATE_CONFIG_FILE'`, ' ➜ ', inspect(env.getString('TEMPLATE_CONFIG_FILE')));
console.log(`ENV: 'TEMPLATE_LOG_ROTATION'`, ' ➜ ', inspect(env.getString('TEMPLATE_LOG_ROTATION')));

// Service Discovery Templates
console.log(`ENV: 'TEMPLATE_SERVICE_REGISTRY'`, ' ➜ ', inspect(env.getString('TEMPLATE_SERVICE_REGISTRY')));
console.log(`ENV: 'TEMPLATE_HEALTH_CHECK'`, ' ➜ ', inspect(env.getString('TEMPLATE_HEALTH_CHECK')));

// Environment-Specific Aliases
console.log(`ENV: 'DEV_API_URL'`, ' ➜ ', inspect(env.getString('DEV_API_URL')));
console.log(`ENV: 'PROD_API_URL'`, ' ➜ ', inspect(env.getString('PROD_API_URL')));
console.log(`ENV: 'STAGING_API_URL'`, ' ➜ ', inspect(env.getString('STAGING_API_URL')));
console.log(`ENV: 'LOCAL_API_URL'`, ' ➜ ', inspect(env.getString('LOCAL_API_URL')));

// Template Literals with Expressions
console.log(`ENV: 'TEMPLATE_VERSIONED_API'`, ' ➜ ', inspect(env.getString('TEMPLATE_VERSIONED_API')));
console.log(`ENV: 'TEMPLATE_TIMESTAMPED_LOG'`, ' ➜ ', inspect(env.getString('TEMPLATE_TIMESTAMPED_LOG')));
console.log(`ENV: 'TEMPLATE_USER_SESSION'`, ' ➜ ', inspect(env.getString('TEMPLATE_USER_SESSION')));

// Complex Variable Interpolation
console.log(`ENV: 'TEMPLATE_CONNECTION_STRING'`, ' ➜ ', inspect(env.getString('TEMPLATE_CONNECTION_STRING')));
console.log(`ENV: 'TEMPLATE_CLOUD_ENDPOINT'`, ' ➜ ', inspect(env.getString('TEMPLATE_CLOUD_ENDPOINT')));

// Dynamic Feature Configuration
console.log(`ENV: 'TEMPLATE_FEATURE_FLAG'`, ' ➜ ', inspect(env.getString('TEMPLATE_FEATURE_FLAG')));
console.log(`ENV: 'TEMPLATE_RATE_LIMIT'`, ' ➜ ', inspect(env.getString('TEMPLATE_RATE_LIMIT')));
console.log(`ENV: 'TEMPLATE_CACHE_NAMESPACE'`, ' ➜ ', inspect(env.getString('TEMPLATE_CACHE_NAMESPACE')));
