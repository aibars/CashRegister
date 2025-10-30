import * as dotenv from 'dotenv';
import { CashRegisterConfig } from '../types';

// Load environment variables from .env file
dotenv.config();

/**
 * Loads and validates configuration from environment variables
 * @returns CashRegisterConfig object with values from environment or defaults
 */
export function loadConfigFromEnv(): CashRegisterConfig {
  const config: CashRegisterConfig = {
    enableRandomMode: parseBooleanEnv('ENABLE_RANDOM_MODE', true),
    randomModeDivisor: parseNumberEnv('RANDOM_DIVISOR', 3),
    outputFormat: parseOutputFormat(process.env.OUTPUT_FORMAT, 'standard')
  };

  // Validate configuration
  validateConfig(config);

  return config;
}

/**
 * Parses a boolean environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Boolean value
 */
function parseBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
    return true;
  }
  if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
    return false;
  }
  
  console.warn(`Invalid boolean value for ${key}: ${value}. Using default: ${defaultValue}`);
  return defaultValue;
}

/**
 * Parses a number environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Number value
 */
function parseNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  
  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    console.warn(`Invalid number value for ${key}: ${value}. Using default: ${defaultValue}`);
    return defaultValue;
  }
  
  return numValue;
}

/**
 * Parses output format environment variable
 * @param value - Environment variable value
 * @param defaultValue - Default value if not set or invalid
 * @returns Valid output format
 */
function parseOutputFormat(
  value: string | undefined, 
  defaultValue: 'standard' | 'json' | 'verbose'
): 'standard' | 'json' | 'verbose' {
  if (!value) return defaultValue;
  
  const validFormats: Array<'standard' | 'json' | 'verbose'> = ['standard', 'json', 'verbose'];
  const format = value.toLowerCase() as 'standard' | 'json' | 'verbose';
  
  if (validFormats.includes(format)) {
    return format;
  }
  
  console.warn(`Invalid output format: ${value}. Using default: ${defaultValue}`);
  return defaultValue;
}

/**
 * Validates the loaded configuration
 * @param config - Configuration to validate
 */
function validateConfig(config: CashRegisterConfig): void {
  if (!Number.isInteger(config.randomModeDivisor) || config.randomModeDivisor <= 0) {
    throw new Error(`Invalid RANDOM_DIVISOR: ${config.randomModeDivisor}. Must be a positive integer.`);
  }
  
  if (config.randomModeDivisor > 100) {
    console.warn(`Large RANDOM_DIVISOR value (${config.randomModeDivisor}) may rarely trigger random mode.`);
  }
}

/**
 * Gets current environment (development, production, test)
 * @returns Environment string
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'production';
}

/**
 * Checks if running in development mode
 * @returns True if in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Displays current configuration (useful for debugging)
 * @param config - Configuration to display
 */
export function displayConfig(config: CashRegisterConfig): void {
  if (isDevelopment() || process.env.DEBUG) {
    console.log('Cash Register Configuration:');
    console.log(`  Random Mode: ${config.enableRandomMode ? 'enabled' : 'disabled'}`);
    console.log(`  Random Divisor: ${config.randomModeDivisor}`);
    console.log(`  Output Format: ${config.outputFormat}`);
    console.log(`  Environment: ${getEnvironment()}`);
    console.log('');
  }
}