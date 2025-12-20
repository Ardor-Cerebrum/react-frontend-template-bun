/**
 * Application configuration
 * Environment variables are prefixed with VITE_ to be accessible in the browser
 */

export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_URL,
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Ardor Logging
  ardorLogsApiUrl: import.meta.env.VITE_ARDOR_LOGS_API_URL,
  ardorSubmitLogsKey: import.meta.env.VITE_ARDOR_SUBMIT_LOGS_KEY,
  ardorServiceId: import.meta.env.VITE_ARDOR_SERVICE_ID,
} as const;

// Type-safe environment variable access
export type Config = typeof config;
