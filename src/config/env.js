import dotenv from 'dotenv';

dotenv.config();

/**
 * Get environment variable
 *
 * @param key
 * @param defaultValue
 * @returns {*|string}
 */
export default function env(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

