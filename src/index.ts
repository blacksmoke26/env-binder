/**
 * @fileoverview Provides singleton instance of EnvBinder for environment-specific configuration management.
 *
 * This module exports a singleton instance of the EnvBinder class, which facilitates
 * environment-specific configuration binding and management throughout the application.
 * The EnvBinder ensures consistent access to environment variables and configuration
 * settings across different runtime environments.
 *
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 *
 * @module EnvBinder
 * @version 0.0.1
 */

// classes
import EnvBinder from '~/classes/EnvBinder';

export { Environment, EnvVariables, TimeUnit } from './types';

export { EnvBinder };

export default EnvBinder.getInstance();
