# Env Binder:  Type-Safe Environment Variables Manager 🌟

A powerful TypeScript utility for managing and validating environment variables with type safety and robust parsing capabilities.

## Features ✨

- 🔧 Bind environment variables with type-safe methods
- 🌐 Parse JSON, Cron expressions, Patterns, and Enums
- 🔢 Intelligent parsing for Numbers *(floats)*, Integers, and URLs
- 🔄 Handle nested objects and arrays from environment variables
- 📦 Support for complex types (`arrays`, `objects`, `dates`, `URLs`, `time` durations)
- 📊 Handle time units (minutes, hours, days, weeks)
- 📋 Built-in validation and parsing for various data types
- ✏️ Custom transformation functions for specialized needs
- ❓ Support for required fields with error throwing
- 📝 Support for Boolean falsy values and string arrays
- 🎯 Path alias resolution with `$PREFIX` support. *(value starts with `$PATHALIAS`)*
- 🗂️ Singleton pattern for consistent configuration access
- 🔌 Support for variable substitution in environment values
- 🛡️ Runtime type validation and error handling
- 🎨 Beautiful TypeScript intellisense support
- 🚀 Fast and lightweight with zero dependencies


## Getting Started

### Installation

First, install Env Binder using your preferred package manager:

```bash
npm install @junaidatari/env-binder
# or
yarn add @junaidatari/env-binder
# or
pnpm add @junaidatari/env-binder
```

### Basic Setup

1. Create a `.env` file in your project's root directory: 

```dotenv
HOST=localhost
PORT=3000
```

2. Initialize Env Binder in your application:

```typescript
// Load environment variables first
import 'dotenv/config';

// Import and use Env Binder
import env from '@junaidatari/env-binder';

const host = env.getString('HOST', '127.0.0.1');
const port = env.getNumber('PORT', 3000);

console.log(`Server will run on ${host}:${port}`);
```

### TypeScript Autocompletion (Optional)

For enhanced IntelliSense, extend the type definitions:

1. Create `src/typings/env-binder.d.ts` in your project
2. Add the following declarations:

```typescript
import * as envbinder from '@junaidatari/env-binder'; // important

declare module '@junaidatari/env-binder' {
  export interface EnvVariables {
    /**
     * Server hostname
     * @default 'localhost'
     */
    HOST: string;

    /**
     * Server port number
     * @default 3000
     */
    PORT: number;

    // Add your environment variables here...
  }
}
```

**Bonus Tip**: Please check the `samples/` directory for supported values and enhanced usage.

## Core API 📚

### Basic Type Methods

```typescript
// Application configuration
const serviceName = env.getString('SERVICE_NAME', 'payment-gateway');
const apiVersion = env.getString('API_VERSION', 'v1');

// Infrastructure settings
const maxMemoryMB = env.getNumber('MAX_MEMORY_MB', 512);
const connectionTimeout = env.getInteger('CONNECTION_TIMEOUT', 30);

// Feature toggles with granular control
const enableRateLimiting = env.getBoolean('ENABLE_RATE_LIMITING', true);
const enableMetrics = env.getBoolean('ENABLE_METRICS', false);

// Critical security values
const jwtSecret = env.getRequired('JWT_SECRET');
const encryptionKey = env.getRequired('ENCRYPTION_KEY');
```

### Advanced Type Methods

```typescript
// Multi-cloud infrastructure configuration
interface CloudConfig {
  provider: 'aws' | 'gcp' | 'azure';
  region: string;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  autoScaling: {
    minInstances: number;
    maxInstances: number;
    targetCPU: number;
  };
}

const cloudConfig = env.getObject<CloudConfig>('CLOUD_CONFIG', {
  provider: 'aws',
  region: 'us-west-2',
  resources: {
    cpu: 1,
    memory: 2,
    storage: 10
  },
  autoScaling: {
    minInstances: 1,
    maxInstances: 5,
    targetCPU: 70
  }
});

// Microservice communication
const serviceEndpoints = env.getArray<string>('SERVICE_ENDPOINTS');
const trustedIPs = env.getStringArray('TRUSTED_IPS');

// External API configurations
const paymentProvider = env.getUrl('PAYMENT_PROVIDER_URL');
const notificationService = env.getUrl('NOTIFICATION_SERVICE_URL');

// Time-based operations
const deploymentWindow = env.getDate('DEPLOYMENT_WINDOW');
const maintenanceStart = env.getTime('MAINTENANCE_START');
```

### Specialized Parsers

```typescript
// Performance and scaling configurations
const cacheTTL = env.getTimeDuration('CACHE_TTL', '2h');
const sessionTimeout = env.getTimeDuration('SESSION_TIMEOUT', '15m');
const rateLimitWindow = env.getTimeDuration('RATE_LIMIT_WINDOW', '1m');

// Scheduled operations
const nightlyBackup = env.getCron('NIGHTLY_BACKUP', '0 2 * * *');
const healthCheck = env.getCron('HEALTH_CHECK', '*/5 * * * *');
const reportGeneration = env.getCron('REPORT_GENERATION', '0 9 * * 1-5');

// Data validation patterns
const phoneRegex = /^\+?[\d\s-()]{10,}$/;
const supportPhone = env.getPattern('SUPPORT_PHONE', phoneRegex);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const adminEmail = env.getPattern('ADMIN_EMAIL', emailRegex);

// Strict configuration validation
const allowedRegions = env.getEnum('AWS_REGION', ['us-east-1', 'us-west-2', 'eu-west-1']);
const logFormat = env.getEnum('LOG_FORMAT', ['json', 'text', 'structured']);

// Complex custom transformations
const databaseUrl = env.getCustom('DATABASE_URL', 
  value => {
    // Ensure SSL is enabled in production
    if (env.isProduction() && !value.includes('sslmode=require')) {
      return value + '?sslmode=require';
    }
    return value;
  }
);
```

## Practical Examples 🛠️

### E-commerce Platform Configuration

```typescript
class EcommerceConfig {
  private env = EnvBinder.getInstance();

  get platform() {
    return {
      name: this.env.getString('PLATFORM_NAME', 'ShopHub'),
      version: this.env.getString('PLATFORM_VERSION', '2.0.0'),
      environment: this.env.getString('NODE_ENV', 'development'),
      currency: this.env.getEnum('CURRENCY', ['USD', 'EUR', 'GBP', 'JPY']),
      timezone: this.env.getString('TIMEZONE', 'UTC')
    };
  }

  get payment() {
    return {
      providers: this.env.getArray('PAYMENT_PROVIDERS'),
      defaultProvider: this.env.getString('DEFAULT_PAYMENT_PROVIDER'),
      webhookSecret: this.env.getRequired('PAYMENT_WEBHOOK_SECRET'),
      timeout: this.env.getTimeDuration('PAYMENT_TIMEOUT', '30s'),
      retryAttempts: this.env.getInteger('PAYMENT_RETRY_ATTEMPTS', 3),
      currencyConversion: this.env.getBoolean('ENABLE_CURRENCY_CONVERSION', true)
    };
  }

  get security() {
    return {
      jwtExpiry: this.env.getTimeDuration('JWT_EXPIRY', '24h'),
      refreshTokenExpiry: this.env.getTimeDuration('REFRESH_TOKEN_EXPIRY', '7d'),
      passwordMinLength: this.env.getInteger('PASSWORD_MIN_LENGTH', 8),
      maxLoginAttempts: this.env.getInteger('MAX_LOGIN_ATTEMPTS', 5),
      lockoutDuration: this.env.getTimeDuration('LOCKOUT_DURATION', '15m'),
      requireTwoFactor: this.env.getBoolean('REQUIRE_TWO_FACTOR', false)
    };
  }
}
```

### Real-time Analytics Pipeline

```typescript
// Kafka streaming configuration
const kafkaConfig = {
  brokers: env.getStringArray('KAFKA_BROKERS'),
  clientId: env.getString('KAFKA_CLIENT_ID', 'analytics-pipeline'),
  groupId: env.getString('KAFKA_GROUP_ID', 'analytics-consumers'),
  topics: {
    events: env.getString('KAFKA_EVENTS_TOPIC', 'user-events'),
    metrics: env.getString('KAFKA_METRICS_TOPIC', 'system-metrics'),
    errors: env.getString('KAFKA_ERRORS_TOPIC', 'error-logs')
  },
  producer: {
    batchSize: env.getInteger('KAFKA_BATCH_SIZE', 1000),
    lingerMs: env.getInteger('KAFKA_LINGER_MS', 10),
    compressionType: env.getEnum('KAFKA_COMPRESSION', ['none', 'gzip', 'snappy', 'lz4'])
  },
  consumer: {
    sessionTimeout: env.getTimeDuration('KAFKA_SESSION_TIMEOUT', '30s'),
    heartbeatInterval: env.getTimeDuration('KAFKA_HEARTBEAT_INTERVAL', '3s'),
    maxPollRecords: env.getInteger('KAFKA_MAX_POLL_RECORDS', 500)
  }
};

// Redis caching layer
const cacheConfig = {
  url: env.getUrl('REDIS_URL'),
  keyPrefix: env.getString('REDIS_KEY_PREFIX', 'analytics:'),
  defaultTTL: env.getTimeDuration('CACHE_DEFAULT_TTL', '1h'),
  clusters: env.getArray('REDIS_CLUSTER_NODES'),
  sentinel: {
    enabled: env.getBoolean('REDIS_SENTINEL_ENABLED', false),
    masters: env.getStringArray('REDIS_SENTINEL_MASTERS'),
    nodes: env.getStringArray('REDIS_SENTINEL_NODES')
  }
};
```

### AI/ML Model Serving Infrastructure

```typescript
class MLConfig {
  private env = EnvBinder.getInstance();

  get model() {
    return {
      name: this.env.getString('MODEL_NAME', 'sentiment-analysis'),
      version: this.env.getString('MODEL_VERSION', 'v1.2.0'),
      path: this.env.getString('MODEL_PATH', '$MODEL_DIR/models'),
      batchSize: this.env.getInteger('MODEL_BATCH_SIZE', 32),
      maxSequenceLength: this.env.getInteger('MAX_SEQUENCE_LENGTH', 512),
      gpuEnabled: this.env.getBoolean('MODEL_GPU_ENABLED', false),
      precision: this.env.getEnum('MODEL_PRECISION', ['fp32', 'fp16', 'int8'])
    };
  }

  get inference() {
    return {
      timeout: this.env.getTimeDuration('INFERENCE_TIMEOUT', '5s'),
      maxConcurrentRequests: this.env.getInteger('MAX_CONCURRENT_REQUESTS', 100),
      rateLimitPerMinute: this.env.getInteger('RATE_LIMIT_PER_MINUTE', 1000),
      enableCaching: this.env.getBoolean('ENABLE_INFERENCE_CACHE', true),
      cacheTTL: this.env.getTimeDuration('INFERENCE_CACHE_TTL', '1h')
    };
  }

  get monitoring() {
    return {
      enableMetrics: this.env.getBoolean('ENABLE_MODEL_METRICS', true),
      metricsInterval: this.env.getTimeDuration('METRICS_INTERVAL', '30s'),
      enableDriftDetection: this.env.getBoolean('ENABLE_DRIFT_DETECTION', true),
      driftThreshold: this.env.getNumber('DRIFT_THRESHOLD', 0.1),
      alertWebhook: env.getUrl('MODEL_ALERT_WEBHOOK')
    };
  }
}
```

## Path Aliases & URLs 🗂️

### Multi-Environment Path Resolution

```dotenv
# Development paths
MODEL_STORAGE=$DEV_ROOT/models
LOG_DIRECTORY=$DEV_ROOT/logs/analytics
CACHE_DIRECTORY=$DEV_ROOT/cache/ml

# Production paths
MODEL_STORAGE=$PROD_ROOT/data/models
LOG_DIRECTORY=$PROD_ROOT/var/log/analytics
CACHE_DIRECTORY=$PROD_ROOT/var/cache/ml

# Shared paths
CONFIG_TEMPLATES=$SHARED_ROOT/configs
CERTIFICATE_PATH=$SHARED_ROOT/certs
BACKUP_STORAGE=$BACKUP_ROOT/archives
```

```typescript
// Dynamic path configuration
const paths = {
  modelStorage: env.getString('MODEL_STORAGE'),
  logDirectory: env.getString('LOG_DIRECTORY'),
  cacheDirectory: env.getString('CACHE_DIRECTORY'),
  configTemplates: env.getString('CONFIG_TEMPLATES'),
  certificates: env.getString('CERTIFICATE_PATH'),
  backups: env.getString('BACKUP_STORAGE')
};

// Environment-specific initialization
if (env.isDev()) {
  env.addAlias('DEV_ROOT', '/workspace/project');
  env.addAlias('SHARED_ROOT', '/workspace/shared');
} else {
  env.addAlias('PROD_ROOT', '/opt/application');
  env.addAlias('SHARED_ROOT', '/opt/shared');
  env.addAlias('BACKUP_ROOT', '/mnt/backups');
}
```

### Service Discovery and URLs

```typescript
const serviceUrls = {
  // Core microservices
  userService: env.getUrl('USER_SERVICE_URL'),
  paymentGateway: env.getUrl('PAYMENT_GATEWAY_URL'),
  inventoryService: env.getUrl('INVENTORY_SERVICE_URL'),

  // External integrations
  stripeApi: env.getUrl('STRIPE_API_URL'),
  sendGridApi: env.getUrl('SENDGRID_API_URL'),
  awsS3: env.getUrl('AWS_S3_URL'),

  // Internal infrastructure
  messageQueue: env.getUrl('MESSAGE_QUEUE_URL'),
  cacheCluster: env.getUrl('CACHE_CLUSTER_URL'),
  databaseCluster: env.getUrl('DATABASE_CLUSTER_URL'),

  // Monitoring and observability
  prometheus: env.getUrl('PROMETHEUS_URL'),
  grafana: env.getUrl('GRAFANA_URL'),
  elasticsearch: env.getUrl('ELASTICSEARCH_URL')
};

// URL transformations for security
const secureUrls = Object.entries(serviceUrls).reduce((acc, [key, url]) => {
  acc[key] = env.getCustom(key.toUpperCase() + '_URL', (value) => {
    // Force HTTPS in production
    if (env.isProduction() && value.startsWith('http://')) {
      return value.replace('http://', 'https://');
    }
    return value;
  });
  return acc;
}, {} as Record<string, string>);
```

## Error Handling ⚠️

### Comprehensive Validation

```typescript
// Configuration validation with detailed errors
function validateConfig() {
  const errors: string[] = [];

  // Critical configuration validation
  try {
    env.getRequired('DATABASE_URL');
  } catch (err) {
    errors.push('Database URL is required for application startup');
  }

  try {
    env.getRequired('JWT_SECRET');
    const secret = env.getString('JWT_SECRET');
    if (secret.length < 32) {
      errors.push('JWT secret must be at least 32 characters');
    }
  } catch (err) {
    errors.push('JWT secret is required and must be strong');
  }

  // Performance configuration validation
  const maxMemory = env.getNumber('MAX_MEMORY_MB', 512);
  const minMemory = env.getNumber('MIN_MEMORY_MB', 256);
  if (minMemory >= maxMemory) {
    errors.push('Minimum memory must be less than maximum memory');
  }

  // Security validation
  const allowedOrigins = env.getArray('ALLOWED_ORIGINS');
  if (env.isProduction() && allowedOrigins.includes('*')) {
    errors.push('Wildcard origins not allowed in production');
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
}

// Runtime configuration monitoring
class ConfigMonitor {
  private env = EnvBinder.getInstance();

  checkConfigurationHealth() {
    const health = {
      database: this.checkDatabaseConfig(),
      cache: this.checkCacheConfig(),
      externalServices: this.checkExternalServices(),
      security: this.checkSecurityConfig()
    };

    const isHealthy = Object.values(health).every(status => status);

    if (!isHealthy) {
      const unhealthyServices = Object.entries(health)
        .filter(([_, healthy]) => !healthy)
        .map(([service]) => service);

      console.warn(`Configuration health check failed for: ${unhealthyServices.join(', ')}`);
    }

    return isHealthy;
  }

  private checkDatabaseConfig(): boolean {
    try {
      const url = this.env.getRequired('DATABASE_URL');
      return url.startsWith('postgres://') || url.startsWith('mongodb://');
    } catch {
      return false;
    }
  }

  private checkCacheConfig(): boolean {
    try {
      const redisUrl = this.env.getUrl('REDIS_URL');
      const timeout = this.env.getTimeDuration('CACHE_TIMEOUT', '5s');
      return redisUrl && timeout > 0;
    } catch {
      return false;
    }
  }

  private checkExternalServices(): boolean {
    const requiredServices = ['PAYMENT_SERVICE_URL', 'NOTIFICATION_SERVICE_URL'];
    return requiredServices.every(service => {
      try {
        this.env.getRequired(service);
        return true;
      } catch {
        return false;
      }
    });
  }

  private checkSecurityConfig(): boolean {
    const secret = this.env.getString('JWT_SECRET', '');
    const encryptionKey = this.env.getString('ENCRYPTION_KEY', '');
    return secret.length >= 32 && encryptionKey.length >= 32;
  }
}
```

### Environment-Specific Logic

```typescript
// Smart configuration based on environment
class SmartConfig {
  private env = EnvBinder.getInstance();

  get logging() {
    const baseConfig = {
      level: this.env.getString('LOG_LEVEL', 'info'),
      format: this.env.getEnum('LOG_FORMAT', ['json', 'text']),
      enabled: this.env.getBoolean('LOGGING_ENABLED', true)
    };

    if (this.env.isDev()) {
      return {
        ...baseConfig,
        console: true,
        file: false,
        verbose: true,
        colors: true
      };
    } else if (this.env.isProduction()) {
      return {
        ...baseConfig,
        console: false,
        file: true,
        verbose: false,
        colors: false,
        structured: true
      };
    } else {
      return {
        ...baseConfig,
        console: true,
        file: true,
        verbose: false,
        colors: false
      };
    }
  }

  get performance() {
    const environment = this.env.environment();

    return {
      // Caching strategy
      cacheEnabled: this.env.getBoolean('CACHE_ENABLED', true),
      cacheTTL: this.env.getTimeDuration(
        'CACHE_TTL',
        environment === 'production' ? '1h' : '5m'
      ),

      // Connection pooling
      poolSize: this.env.getInteger(
        'POOL_SIZE',
        environment === 'production' ? 20 : 5
      ),

      // Rate limiting
      rateLimitEnabled: this.env.getBoolean('RATE_LIMIT_ENABLED', environment === 'production'),
      rateLimitWindow: this.env.getTimeDuration(
        'RATE_LIMIT_WINDOW',
        environment === 'production' ? '1m' : '10s'
      ),

      // Monitoring
      metricsEnabled: this.env.getBoolean('METRICS_ENABLED', environment !== 'test'),
      profilingEnabled: this.env.getBoolean('PROFILING_ENABLED', environment === 'development')
    };
  }
}
```

## Best Practices 🎯

### Hierarchical Configuration Management

```typescript
import { EnvBinder } from '@junaidatari/env-binder';

class HierarchicalConfig {
  private env = EnvBinder.getInstance();
  private _cache = new Map<string, any>();

  // Lazy-loaded configuration with caching
  get database() {
    if (!this._cache.has('database')) {
      this._cache.set('database', {
        primary: {
          host: this.env.getString('DB_PRIMARY_HOST', 'localhost'),
          port: this.env.getNumber('DB_PRIMARY_PORT', 5432),
          name: this.env.getRequired('DB_NAME'),
          username: this.env.getString('DB_USERNAME', 'app'),
          password: this.env.getRequired('DB_PASSWORD'),
          ssl: this.env.getBoolean('DB_SSL', this.env.isProduction()),
          pool: {
            min: this.env.getInteger('DB_POOL_MIN', 2),
            max: this.env.getInteger('DB_POOL_MAX', 10),
            idleTimeout: this.env.getTimeDuration('DB_IDLE_TIMEOUT', '30s'),
            connectionTimeout: this.env.getTimeDuration('DB_CONNECTION_TIMEOUT', '5s')
          }
        },
        replicas: this.env.getArray('DB_REPLICA_HOSTS').map(host => ({
          host,
          port: this.env.getNumber('DB_REPLICA_PORT', 5432),
          readOnly: true,
          weight: this.env.getInteger('DB_REPLICA_WEIGHT', 1)
        })),
        migration: {
          autoRun: this.env.getBoolean('DB_AUTO_MIGRATE', !this.env.isProduction()),
          timeout: this.env.getTimeDuration('DB_MIGRATION_TIMEOUT', '10m'),
          retries: this.env.getInteger('DB_MIGRATION_RETRIES', 3)
        }
      });
    }
    return this._cache.get('database');
  }

  get security() {
    if (!this._cache.has('security')) {
      this._cache.set('security', {
        jwt: {
          secret: this.env.getRequired('JWT_SECRET'),
          algorithm: this.env.getEnum('JWT_ALGORITHM', ['HS256', 'HS512', 'RS256']),
          expiry: this.env.getTimeDuration('JWT_EXPIRY', '24h'),
          refreshExpiry: this.env.getTimeDuration('JWT_REFRESH_EXPIRY', '7d'),
          issuer: this.env.getString('JWT_ISSUER', 'myapp'),
          audience: this.env.getString('JWT_AUDIENCE', 'myapp-users')
        },
        encryption: {
          algorithm: this.env.getEnum('ENCRYPTION_ALGORITHM', ['AES-256-GCM', 'AES-128-GCM']),
          key: this.env.getRequired('ENCRYPTION_KEY'),
          ivLength: this.env.getInteger('ENCRYPTION_IV_LENGTH', 16),
          tagLength: this.env.getInteger('ENCRYPTION_TAG_LENGTH', 16)
        },
        rateLimiting: {
          enabled: this.env.getBoolean('RATE_LIMIT_ENABLED', this.env.isProduction()),
          windowMs: this.env.getTimeDuration('RATE_LIMIT_WINDOW', '15m'),
          maxRequests: this.env.getInteger('RATE_LIMIT_MAX', 100),
          skipSuccessfulRequests: this.env.getBoolean('RATE_LIMIT_SKIP_SUCCESS', false),
          skipFailedRequests: this.env.getBoolean('RATE_LIMIT_SKIP_FAILED', false)
        },
        cors: {
          enabled: this.env.getBoolean('CORS_ENABLED', true),
          origins: this.env.getArray('CORS_ORIGINS'),
          methods: this.env.getArray('CORS_METHODS', ['GET', 'POST', 'PUT', 'DELETE']),
          headers: this.env.getArray('CORS_HEADERS'),
          credentials: this.env.getBoolean('CORS_CREDENTIALS', false),
          maxAge: this.env.getTimeDuration('CORS_MAX_AGE', '24h')
        }
      });
    }
    return this._cache.get('security');
  }

  // Configuration validation
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate database configuration
    try {
      const dbConfig = this.database;
      if (dbConfig.primary.port < 1 || dbConfig.primary.port > 65535) {
        errors.push('Database port must be between 1 and 65535');
      }
      if (dbConfig.primary.pool.min > dbConfig.primary.pool.max) {
        errors.push('Database pool min size cannot exceed max size');
      }
    } catch (err) {
      errors.push(`Database configuration error: ${err.message}`);
    }

    // Validate security configuration
    try {
      const securityConfig = this.security;
      if (securityConfig.jwt.secret.length < 32) {
        errors.push('JWT secret must be at least 32 characters');
      }
      if (securityConfig.encryption.key.length < 32) {
        errors.push('Encryption key must be at least 32 characters');
      }
    } catch (err) {
      errors.push(`Security configuration error: ${err.message}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default new HierarchicalConfig();
```

### Dynamic Configuration with Hot Reload

```typescript
class DynamicConfig {
  private env = EnvBinder.getInstance();
  private listeners: Map<string, ((value: any) => void)[]> = new Map();
  private watchInterval: NodeJS.Timeout | null = null;

  // Start watching for configuration changes
  startWatching(intervalMs: number = 5000) {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
    }

    this.watchInterval = setInterval(() => {
      this.checkForChanges();
    }, intervalMs);
  }

  // Stop watching for changes
  stopWatching() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
  }

  // Subscribe to configuration changes
  onChange(key: string, callback: (value: any) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  // Check for configuration changes
  private checkForChanges() {
    const watchedKeys = Array.from(this.listeners.keys());

    for (const key of watchedKeys) {
      const currentValue = this.env.getValue(key);
      const storedKey = `__last_${key}`;
      const lastValue = this.env.getValue(storedKey, undefined);

      if (currentValue !== lastValue) {
        // Store new value for comparison
        process.env[storedKey] = String(currentValue);

        // Notify listeners
        const callbacks = this.listeners.get(key) || [];
        callbacks.forEach(callback => {
          try {
            callback(currentValue);
          } catch (err) {
            console.error(`Error in config change listener for ${key}:`, err);
          }
        });
      }
    }
  }

  // Get dynamic configuration with change detection
  getDynamic<T>(key: string, defaultValue: T): { value: T; onChange: (callback: (value: T) => void) => void } {
    const getValue = () => this.env.getValue(key, defaultValue);

    return {
      value: getValue(),
      onChange: (callback: (value: T) => void) => {
        this.onChange(key, (newValue) => callback(newValue as T));
      }
    };
  }
}

// Usage example
const dynamicConfig = new DynamicConfig();
dynamicConfig.startWatching();

// Watch for critical configuration changes
dynamicConfig.onChange('LOG_LEVEL', (newLevel) => {
  console.log(`Log level changed to: ${newLevel}`);
  // Reconfigure logger at runtime
});

dynamicConfig.onChange('RATE_LIMIT_MAX', (newLimit) => {
  console.log(`Rate limit changed to: ${newLimit} requests`);
  // Update rate limiter configuration
});

// Get dynamic value with change handling
const { value: maxConnections, onChange: onMaxConnectionsChange } = dynamicConfig.getDynamic('MAX_CONNECTIONS', 100);

onMaxConnectionsChange((newMax) => {
  console.log(`Max connections updated: ${newMax}`);
  // Adjust connection pool size
});
```

### Environment-Aware Configuration Builder

```typescript
class EnvironmentAwareConfig {
  private env = EnvBinder.getInstance();
  private environment: string;

  constructor() {
    this.environment = this.env.environment();
    this.setupEnvironmentAliases();
  }

  private setupEnvironmentAliases() {
    // Set up path aliases based on environment
    const basePaths = {
      development: '/workspace/project',
      staging: '/opt/staging',
      production: '/opt/production'
    };

    const basePath = basePaths[this.environment as keyof typeof basePaths] || basePaths.development;

    this.env.addAlias('APP_ROOT', basePath);
    this.env.addAlias('LOG_DIR', `${basePath}/logs`);
    this.env.addAlias('CACHE_DIR', `${basePath}/cache`);
    this.env.addAlias('CONFIG_DIR', `${basePath}/config`);
  }

  // Create configuration based on environment
  createConfig() {
    const baseConfig = {
      environment: this.environment,
      isDevelopment: this.environment === 'development',
      isProduction: this.environment === 'production',
      isTest: this.environment === 'test'
    };

    switch (this.environment) {
      case 'development':
        return {
          ...baseConfig,
          debug: true,
          hotReload: true,
          sourceMaps: true,
          verboseLogging: true,
          mockExternalServices: true,
          database: {
            url: 'postgresql://localhost:5432/app_dev',
            logging: true,
            migrations: { autoRun: true }
          },
          cache: {
            enabled: false,
            ttl: '1m'
          },
          security: {
            ssl: false,
            cors: { origins: ['*'] },
            rateLimiting: { enabled: false }
          }
        };

      case 'staging':
        return {
          ...baseConfig,
          debug: false,
          hotReload: false,
          sourceMaps: false,
          verboseLogging: false,
          mockExternalServices: false,
          database: {
            url: this.env.getRequired('DATABASE_URL'),
            logging: false,
            migrations: { autoRun: true }
          },
          cache: {
            enabled: true,
            ttl: '30m'
          },
          security: {
            ssl: true,
            cors: { origins: this.env.getArray('ALLOWED_ORIGINS') },
            rateLimiting: { 
              enabled: true,
              windowMs: '15m',
              maxRequests: 1000
            }
          }
        };

      case 'production':
        return {
          ...baseConfig,
          debug: false,
          hotReload: false,
          sourceMaps: false,
          verboseLogging: false,
          mockExternalServices: false,
          database: {
            url: this.env.getRequired('DATABASE_URL'),
            logging: false,
            migrations: { autoRun: false }
          },
          cache: {
            enabled: true,
            ttl: '2h'
          },
          security: {
            ssl: true,
            cors: { origins: this.env.getArray('ALLOWED_ORIGINS') },
            rateLimiting: { 
              enabled: true,
              windowMs: '15m',
              maxRequests: 100
            }
          },
          monitoring: {
            enabled: true,
            metricsInterval: '30s',
            alerting: true,
            tracing: true
          }
        };

      default:
        throw new Error(`Unknown environment: ${this.environment}`);
    }
  }
}

// Initialize configuration
const config = new EnvironmentAwareConfig();
export default config.createConfig();
```

## API Reference 📖

### Core Methods

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `getString(name, defaultValue?)` | `string` | Gets a string value with alias/template support | `env.getString('HOST', 'localhost')` |
| `getNumber(name, defaultValue?)` | `number` | Parses a numeric value (float) | `env.getNumber('PORT', 3000)` |
| `getInteger(name, defaultValue?)` | `number` | Gets an integer value | `env.getInteger('MAX_CONN', 100)` |
| `getBool(name, defaultValue?)` | `boolean` | Parses boolean (true/false, yes/no, 1/0) | `env.getBool('DEBUG', false)` |
| `getRequired(name)` | `string` | Gets required value (throws if missing) | `env.getRequired('API_KEY')` |

### Advanced Methods

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `getObject<T>(name, defaultValue?)` | `T` | Parses JSON object with type | `env.getObject<Config>('CONFIG')` |
| `getArray<T>(name, defaultValue?)` | `T[]` | Parses JSON array | `env.getArray<string>('ALLOWED')` |
| `getStringArray(name, defaultValue?)` | `string[]` | Parses comma-separated strings | `env.getStringArray('ORIGINS')` |
| `getUrl(name, trimSlash?)` | `string` | Validates and returns URL | `env.getUrl('API_URL', true)` |
| `getDate(name, defaultValue?)` | `Date` | Parses ISO date string | `env.getDate('START_DATE')` |

### Specialized Methods

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `getTime(name, defaultValue?)` | `string` | Parses HH:MM format | `env.getTime('MAINTENANCE')` |
| `getTimeDuration(name, defaultValue?)` | `number` | Converts "5m", "24h", "7d" to ms | `env.getTimeDuration('TIMEOUT')` |
| `getCron(name, defaultValue?)` | `string` | Validates cron expression | `env.getCron('BACKUP')` |
| `getPattern(name, regex, defaultValue?)` | `string` | Validates with regex pattern | `env.getPattern('EMAIL', emailRegex)` |
| `getEnum<T>(name, values, defaultValue?)` | `T` | Validates against enum list | `env.getEnum('LEVEL', ['debug', 'info'])` |
| `getCustom(name, fn, defaultValue?)` | `any` | Applies custom transformer | `env.getCustom('URL', toHttps)` |

### Utility Methods

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `getMultiple(keys)` | `Record<string, any>` | Gets multiple values at once | `env.getMultiple(['HOST', 'PORT'])` |
| `has(name)` | `boolean` | Checks if variable exists and not empty | `env.has('DATABASE_URL')` |
| `environment()` | `string` | Gets current NODE_ENV | `env.environment()` |
| `is(env)` | `boolean` | Checks environment match | `env.is('production')` |
| `isProduction()` | `boolean` | Checks if environment is production | `env.isProduction()` |
| `isDev()` | `boolean` | Checks if environment is development | `env.isDev()` |

### Alias Management

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `addAlias(name, value, isPathAlias?)` | `void` | Registers a new path alias | `env.addAlias('ROOT', '/app')` |
| `removeAlias(name)` | `void` | Removes a registered alias | `env.removeAlias('ROOT')` |
| `aliases` | `Record<string, string>` | Gets all registered aliases | `env.aliases` |

### Static Methods

| Method Signature | Return Type | Description | Example |
|------------------|-------------|-------------|---------|
| `getInstance()` | `EnvBinder` | Gets singleton instance | `EnvBinder.getInstance()` |

## Data Formats 📝

### Boolean Values

Truthy: `true`, `1`, `yes`, `on`  
Falsy: `false`, `0`, `no`, `off`, `null`, `undefined`, `""` *(empty value)*

### Time Durations

| Format | Example | Result |
|--------|---------|--------|
| Seconds | `30s` | 30000ms |
| Minutes | `5m` | 300000ms |
| Hours | `24h` | 86400000ms |
| Days | `7d` | 604800000ms |
| Weeks | `1w` | 604800000ms |

### Array Formats

```bash
# JSON format
FEATURES='["auth","logging","cache"]'

# Comma-separated
ORIGINS="http://localhost:3000,https://example.com"
```

## Contributing 🤝

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Submit a pull request

### Development Setup

```bash
git clone https://github.com/blacksmoke26/env-binder.git
cd env-binder
npm install
npm run test
```

## License 📄

This project is licensed under the ISC License - see the LICENSE file for details.

## Support 💬

- 📖 [Documentation](https://github.com/blacksmoke26/env-binder)
- 🐛 [Report Issues](https://github.com/blacksmoke26/env-binder/issues)
- 💡 [Feature Requests](https://github.com/blacksmoke26/env-binder/discussions)

## Acknowledgments 🙏

Built with TypeScript developers in mind, focusing on type safety and developer experience. The core implementation has been battle-tested in production applications.

---

Created with ❤️ by Junaid Atari
