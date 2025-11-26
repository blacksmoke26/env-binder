import * as envbinder from '@junaidatari/env-binder';

declare module '@junaidatari/env-binder' {
  /**
   * @inheritDoc {envbinder.EnvVariables}
   */
  export interface EnvVariables {
    PORT: number;
    HOST: string;
    API_VERSION: string;
    SERVER_TIMEOUT: number;
    FRONTEND_API_ENDPOINT: string;
    DATABASE_URL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
    DB_SSL: boolean;
    DB_POOL_SIZE: number;
    DB_CONNECTION_TIMEOUT: number;
    SEQUELIZE_DIR: string;
    SEQUELIZE_DB_URL: string;
    SEQUELIZE_LOGGING: boolean;
    SEQUELIZE_LOG_QUERY_PARAMETERS: boolean;
    SEQUELIZE_BENCHMARK: boolean;
    REDIS_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASS: string;
    REDIS_DB: number;
    REDIS_MAX_RETRIES: number;
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW: number;
    RATE_LIMIT_MAX: number;
    SESSION_SECRET: string;
    BCRYPT_ROUNDS: number;
    MAX_FILE_SIZE: number;
    ALLOWED_FILE_TYPES: string;
    DEFAULT_PAGE_SIZE: number;
    MAX_PAGE_SIZE: number;
    CACHE_TTL_MINUTES: number;
    SUPPORTED_LANGUAGES: string[];
    ACTIVE_FEATURES: string[];
    MAX_UPLOAD_SPEED: number;
    MIN_RETRY_ATTEMPTS: number;
    DISK_USAGE_THRESHOLD: number;
    MAX_CONNECTIONS: number;
    CACHE_HIT_RATIO: number;
    LOG_FILE_PATH: string;
    CONFIG_DIR: string;
    STATIC_ASSETS_PATH: string;
    TEMP_DIR: string;
    UPLOAD_DIR: string;
    BACKUP_DIR: string;
    SESSION_TIMEOUT: number;
    TOKEN_EXPIRATION: number;
    CACHE_CLEANUP_INTERVAL: number;
    RATE_LIMIT_RESET_PERIOD: number;
    REQUEST_TIMEOUT: number;
    BACKUP_SCHEDULE_DATE: string;
    MAINTENANCE_WINDOW: string;
    EMAIL_PATTERN: string;
    PHONE_PATTERN: string;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
    USER_ROLE: 'admin' | 'user' | 'guest';
    PAYMENT_STATUS: 'pending' | 'completed' | 'failed';
    DATABASE_CONFIG: Record<string, any>;
    CACHE_CONFIG: Record<string, any>;
    API_ENDPOINT_TRANSFORMED: string;
    PROXY_URL_TRANSFORMED: string;
    ENABLE_ANALYTICS: boolean;
    DEBUG_MODE: boolean;
    MAINTENANCE_MODE: boolean;
    SERVER_HOSTS: string[];
    AVAILABLE_PLUGINS: string[];
    OAUTH_CALLBACK_URL: string;
    WEBSOCKET_ENDPOINT: string;
    SECRET_KEY_REQUIRED: string;
    LICENSE_KEY_REQUIRED: string;
    BACKUP_CRON: string | boolean;
    MAINTENANCE_CRON: string | boolean;
    CLEANUP_CRON: string | boolean;
    REPORT_CRON: string | boolean;
    TIMEOUT_IN_MINUTES: number;
  }

}
