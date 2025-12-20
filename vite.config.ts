import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Formats log message in format: level_name: asctime - message
 */
function formatLog(level: string, message: string): string {
  return `${level}: ${new Date().toISOString()} - ${message}`;
}

// Create custom logger based on the default one
const logger = createLogger();
const originalInfo = logger.info;
const originalWarn = logger.warn;
const originalError = logger.error;

logger.info = (msg: string, options?) => {
  originalInfo(formatLog('INFO', msg.replace(/^\s+/, '')), options);
};

logger.warn = (msg: string, options?) => {
  originalWarn(formatLog('WARNING', msg.replace(/^\s+/, '')), options);
};

logger.error = (msg: string, options?) => {
  originalError(formatLog('ERROR', msg.replace(/^\s+/, '')), options);
};

// Proxy endpoint from environment variable (set during container build)
const proxyEndpoint = process.env.VITE_ARDOR_PROXY_ENDPOINT || '/_debug';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT),
    allowedHosts: [".ardor.cloud"],
    proxy: {
      // Proxy logs API requests to avoid CORS in development
      [proxyEndpoint]: {
        target: process.env.VITE_ARDOR_LOGS_API_URL || 'https://api.ardor.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(new RegExp(`^${proxyEndpoint}`), '/solutions-api'),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  customLogger: logger,
});
