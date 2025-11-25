/**
 * Environment Configuration and Path Resolution
 *
 * This file handles the initialization of environment variables and sets up
 * path resolution aliases for the application. It uses EnvBinder to manage
 * environment variables with dynamic path construction capabilities.
 *
 * Setup Steps:
 * 1. Load environment variables from .env file
 * 2. Initialize EnvBinder singleton instance
 * 3. Configure ROOTDIR alias for dynamic path resolution
 * 4. Verify Sequelize directory configuration
 *
 * Usage:
 * - Environment variables can now use $ROOTDIR/ prefix for paths relative to project root
 * - Access SEQUELIZE_DIR to locate Sequelize-related files
 *
 * @todo Consider adding validation for required environment variables
 * @todo Document available environment variables and their purposes
 */

import 'dotenv/config';

import {dirname} from 'node:path';

import { EnvBinder } from '@junaidatari/env-binder';

const env = EnvBinder.getInstance();

// Configure ROOTDIR alias for path resolution
// This allows using $ROOTDIR in environment variables for dynamic path construction
// @ts-ignore
env.addAlias('ROOTDIR', dirname(import.meta.dirname));

console.log('Sequelize directory:', env.getString('SEQUELIZE_DIR'));
