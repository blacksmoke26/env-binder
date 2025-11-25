/**
 * Environment Configuration Setup
 *
 * This file initializes and configures environment variables for the application.
 * It sets up path resolution aliases and loads required environment configurations.
 *
 * TODO:
 * - Consider moving environment-specific configurations to separate files
 * - Add validation for critical environment variables
 * - Implement fallback values for optional environment variables
 *
 * How to use:
 * 1. Ensure all required environment variables are set in your .env file
 * 2. The ROOTDIR alias will be automatically available for path configurations
 * 3. Access environment variables using the env.getString() method
 */

import 'dotenv/config';

import { dirname } from 'node:path';

import env from '@junaidatari/env-binder';

// Set up ROOTDIR alias for easier path resolution in environment variables
// This enables the use of $ROOTDIR as a placeholder in environment configs
// @ts-ignore
env.addAlias('ROOTDIR', dirname(__dirname));

console.log('Sequelize directory:', env.getString('SEQUELIZE_DIR'));
