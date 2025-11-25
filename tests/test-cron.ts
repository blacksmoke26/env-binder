/**
 * @fileoverview Test script for validating cron expression parsing using EnvBinder.
 *
 * This script loads environment variables from a .env.cron file and tests the
 * getCron() method of EnvBinder by validating various cron expressions used for
 * system maintenance, backups, notifications, and business operations.
 *
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 * @since 0.0.1
 */

// Import EnvBinder class (ensure dotenv is configured to load .env file)
// import 'dotenv-safe/config'; // dotenv-safe for required .env files
import dotenv from 'dotenv'; // dotenv for standard .env file loading
dotenv.config({ path: __dirname + '/envs/.env.cron' });

import * as util from 'node:util';

import env from '../src/index';

const inspect = (l: unknown) => util.inspect(l, { depth: 10, colors: true });

// Cron expressions from .env.cron

console.log(`\n ======================== TEST CRONS =========================\n`);
console.log(`\nPrinting values:`);

console.log(`ENV: 'CRON_SYSTEM_CLEANUP'`, ' → ', inspect(env.getCron('CRON_SYSTEM_CLEANUP')));
console.log(`ENV: 'CRON_DATABASE_BACKUP'`, ' → ', inspect(env.getCron('CRON_DATABASE_BACKUP')));
console.log(`ENV: 'CRON_CACHE_REFRESH'`, ' → ', inspect(env.getCron('CRON_CACHE_REFRESH')));
console.log(`ENV: 'CRON_LOG_ROTATION'`, ' → ', inspect(env.getCron('CRON_LOG_ROTATION')));
console.log(`ENV: 'CRON_HEALTH_CHECK'`, ' → ', inspect(env.getCron('CRON_HEALTH_CHECK')));
console.log(`ENV: 'CRON_PERFORMANCE_METRICS'`, ' → ', inspect(env.getCron('CRON_PERFORMANCE_METRICS')));
console.log(`ENV: 'CRON_SECURITY_SCAN'`, ' → ', inspect(env.getCron('CRON_SECURITY_SCAN')));
console.log(`ENV: 'CRON_DISK_SPACE_CHECK'`, ' → ', inspect(env.getCron('CRON_DISK_SPACE_CHECK')));
console.log(`ENV: 'CRON_DATA_SYNC'`, ' → ', inspect(env.getCron('CRON_DATA_SYNC')));
console.log(`ENV: 'CRON_REPORT_GENERATION'`, ' → ', inspect(env.getCron('CRON_REPORT_GENERATION')));
console.log(`ENV: 'CRON_DATA_ARCHIVAL'`, ' → ', inspect(env.getCron('CRON_DATA_ARCHIVAL')));
console.log(`ENV: 'CRON_INDEX_REBUILD'`, ' → ', inspect(env.getCron('CRON_INDEX_REBUILD')));
console.log(`ENV: 'CRON_EMAIL_DIGEST'`, ' → ', inspect(env.getCron('CRON_EMAIL_DIGEST')));
console.log(`ENV: 'CRON_ALERT_CHECK'`, ' → ', inspect(env.getCron('CRON_ALERT_CHECK')));
console.log(`ENV: 'CRON_NOTIFICATION_QUEUE'`, ' → ', inspect(env.getCron('CRON_NOTIFICATION_QUEUE')));
console.log(`ENV: 'CRON_SUMMARY_REPORT'`, ' → ', inspect(env.getCron('CRON_SUMMARY_REPORT')));
console.log(`ENV: 'CRON_FEATURE_TOGGLE'`, ' → ', inspect(env.getCron('CRON_FEATURE_TOGGLE')));
console.log(`ENV: 'CRON_CONTENT_PUBLISH'`, ' → ', inspect(env.getCron('CRON_CONTENT_PUBLISH')));
console.log(`ENV: 'CRON_PROMOTION_START'`, ' → ', inspect(env.getCron('CRON_PROMOTION_START')));
console.log(`ENV: 'CRON_AUCTION_END'`, ' → ', inspect(env.getCron('CRON_AUCTION_END')));
console.log(`ENV: 'CRON_INCREMENTAL_BACKUP'`, ' → ', inspect(env.getCron('CRON_INCREMENTAL_BACKUP')));
console.log(`ENV: 'CRON_SNAPSHOT_CREATION'`, ' → ', inspect(env.getCron('CRON_SNAPSHOT_CREATION')));
console.log(`ENV: 'CRON_BACKUP_VERIFICATION'`, ' → ', inspect(env.getCron('CRON_BACKUP_VERIFICATION')));
console.log(`ENV: 'CRON_DISASTER_RECOVERY_TEST'`, ' → ', inspect(env.getCron('CRON_DISASTER_RECOVERY_TEST')));
console.log(`ENV: 'CRON_API_SYNC'`, ' → ', inspect(env.getCron('CRON_API_SYNC')));
console.log(`ENV: 'CRON_WEBHOOK_PROCESSOR'`, ' → ', inspect(env.getCron('CRON_WEBHOOK_PROCESSOR')));
console.log(`ENV: 'CRON_TOKEN_REFRESH'`, ' → ', inspect(env.getCron('CRON_TOKEN_REFRESH')));
console.log(`ENV: 'CRON_RATE_LIMIT_RESET'`, ' → ', inspect(env.getCron('CRON_RATE_LIMIT_RESET')));
console.log(`ENV: 'CRON_WORKDAY_BUSINESS_HOURS'`, ' → ', inspect(env.getCron('CRON_WORKDAY_BUSINESS_HOURS')));
console.log(`ENV: 'CRON_WEEKEND_MAINTENANCE'`, ' → ', inspect(env.getCron('CRON_WEEKEND_MAINTENANCE')));
console.log(`ENV: 'CRON_QUARTERLY_REPORT'`, ' → ', inspect(env.getCron('CRON_QUARTERLY_REPORT')));
console.log(`ENV: 'CRON_YEARLY_AUDIT'`, ' → ', inspect(env.getCron('CRON_YEARLY_AUDIT')));
console.log(`ENV: 'CRON_SEASONAL_ROTATION'`, ' → ', inspect(env.getCron('CRON_SEASONAL_ROTATION')));
console.log(`ENV: 'CRON_TIMEZONE_SYNC'`, ' → ', inspect(env.getCron('CRON_TIMEZONE_SYNC')));
console.log(`ENV: 'CRON_HOLIDAY_CHECK'`, ' → ', inspect(env.getCron('CRON_HOLIDAY_CHECK')));
console.log(`ENV: 'CRON_LEAP_YEAR_ADJUSTMENT'`, ' → ', inspect(env.getCron('CRON_LEAP_YEAR_ADJUSTMENT')));
console.log(`ENV: 'CRON_CACHE_WARMING'`, ' → ', inspect(env.getCron('CRON_CACHE_WARMING')));
console.log(`ENV: 'CRON_DB_OPTIMIZATION'`, ' → ', inspect(env.getCron('CRON_DB_OPTIMIZATION')));
console.log(`ENV: 'CRON_SESSION_CLEANUP'`, ' → ', inspect(env.getCron('CRON_SESSION_CLEANUP')));
console.log(`ENV: 'CRON_TEMP_FILE_PURGE'`, ' → ', inspect(env.getCron('CRON_TEMP_FILE_PURGE')));
console.log(`ENV: 'CRON_DELIVERY_PROCESSING'`, ' → ', inspect(env.getCron('CRON_DELIVERY_PROCESSING')));
console.log(`ENV: 'CRON_JOB_CREATION'`, ' → ', inspect(env.getCron('CRON_JOB_CREATION')));
console.log(`ENV: 'CRON_FILE_UPLOAD'`, ' → ', inspect(env.getCron('CRON_FILE_UPLOAD')));
console.log(`ENV: 'CRON_QUOTE_REQUEST'`, ' → ', inspect(env.getCron('CRON_QUOTE_REQUEST')));
console.log(`ENV: 'CRON_QUOTE_MODIFY'`, ' → ', inspect(env.getCron('CRON_QUOTE_MODIFY')));
console.log(`ENV: 'CRON_PROCESS_SUBMISSION'`, ' → ', inspect(env.getCron('CRON_PROCESS_SUBMISSION')));
console.log(`ENV: 'CRON_COMPLETION_TASK'`, ' → ', inspect(env.getCron('CRON_COMPLETION_TASK')));
console.log(`ENV: 'CRON_CSV_EXPORT'`, ' → ', inspect(env.getCron('CRON_CSV_EXPORT')));
console.log(`ENV: 'CRON_ARCHIVE_DOWNLOAD'`, ' → ', inspect(env.getCron('CRON_ARCHIVE_DOWNLOAD')));
console.log(`ENV: 'CRON_WOO_BATCH_TRANSFER'`, ' → ', inspect(env.getCron('CRON_WOO_BATCH_TRANSFER')));
console.log(`ENV: 'CRON_FETCH_JOB_IDENTIFIERS'`, ' → ', inspect(env.getCron('CRON_FETCH_JOB_IDENTIFIERS')));
console.log(`ENV: 'CRON_REFRESH_BATCH_DATA'`, ' → ', inspect(env.getCron('CRON_REFRESH_BATCH_DATA')));
console.log(`ENV: 'CRON_MODIFY_ORDER_STATE'`, ' → ', inspect(env.getCron('CRON_MODIFY_ORDER_STATE')));
console.log(`ENV: 'CRON_PURGE_CONTACT_DATA'`, ' → ', inspect(env.getCron('CRON_PURGE_CONTACT_DATA')));
console.log(`ENV: 'CRON_REFRESH_ITEM_STATUS'`, ' → ', inspect(env.getCron('CRON_REFRESH_ITEM_STATUS')));
console.log(`ENV: 'CRON_STRIPE_DATA_SYNC'`, ' → ', inspect(env.getCron('CRON_STRIPE_DATA_SYNC')));
console.log(`ENV: 'CRON_PDF_BATCH_CREATION'`, ' → ', inspect(env.getCron('CRON_PDF_BATCH_CREATION')));
console.log(`ENV: 'CRON_BATCH_RETRY_PROCESS'`, ' → ', inspect(env.getCron('CRON_BATCH_RETRY_PROCESS')));
