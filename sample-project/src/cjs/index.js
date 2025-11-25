/**
 * Environment Configuration Setup
 *
 * This file configures the environment variables and sets up path aliases
 * for the application. It loads environment variables from .env files
 * and establishes a ROOTDIR alias for dynamic path resolution.
 *
 * TODO:
 * - Consider migrating from CommonJS to ES module syntax
 * - Review and validate environment variable naming conventions
 *
 * HOW TO:
 * 1. Ensure all required environment variables are set in your .env file
 * 2. Use $ROOTDIR in environment variables to reference the project root
 * 3. Access environment variables using the env binder methods
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const { dirname } = require('node:path');
const env = require('@junaidatari/env-binder').default;

// Configure ROOTDIR alias for path resolution
// This allows using $ROOTDIR in environment variables for dynamic path construction
// @ts-ignore
env.addAlias('ROOTDIR', dirname(__dirname));

// Log the configured Sequelize directory for verification
console.log('Sequelize directory:', env.getString('SEQUELIZE_DIR'));
