/**
 * Logger configuration
 * Format: level_name: asctime - message
 * 
 * Intercepts ALL console.log/info/warn/error calls,
 * including calls from external libraries.
 * 
 * Sends logs to backend API for centralized storage.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
type ApiLogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

interface LoggerConfig {
  minLevel: LogLevel;
  minRemoteLevel: LogLevel;
  enabled: boolean;
  remoteEnabled: boolean;
  flushInterval: number;
  maxBufferSize: number;
  maxRetries: number;
  retryBaseDelay: number;
}

interface LogEntry {
  message: string;
  log_level: ApiLogLevel;
  timestamp: number;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Display names for log levels in console output
const LOG_LEVEL_DISPLAY: Record<LogLevel, string> = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARNING',
  ERROR: 'ERROR',
};

// Mapping to API log levels
const LOG_LEVEL_API: Record<LogLevel, ApiLogLevel> = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error',
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types
const isDev = import.meta.env?.DEV ?? false;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types
const apiKey = import.meta.env?.VITE_ARDOR_SUBMIT_LOGS_KEY ?? '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types
const serviceId = import.meta.env?.VITE_ARDOR_SERVICE_ID ?? '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types
const logsApiBaseUrl = import.meta.env?.VITE_ARDOR_LOGS_API_URL ?? '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types - Proxy endpoint injected by Vite at build time
const proxyEndpoint = import.meta.env?.VITE_ARDOR_PROXY_ENDPOINT ?? '/_debug';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite env types - Minimum log level for remote logging
const remoteLogLevelEnv = (import.meta.env?.VITE_ARDOR_REMOTE_LOG_LEVEL ?? 'ERROR').toUpperCase() as LogLevel;

// Validate remote log level
const validLogLevels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
const minRemoteLevel: LogLevel = validLogLevels.includes(remoteLogLevelEnv) ? remoteLogLevelEnv : 'ERROR';

const config: LoggerConfig = {
  minLevel: isDev ? 'DEBUG' : 'INFO',
  minRemoteLevel,
  enabled: true,
  remoteEnabled: !!(apiKey && serviceId),
  flushInterval: 5000, // 5 seconds
  maxBufferSize: 100,
  maxRetries: 3,
  retryBaseDelay: 1000, // 1 second
};

// Log buffer for batching
let logBuffer: LogEntry[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let isFlushingInProgress = false;

// Store original console methods
const originalConsole = {
  log: console.log.bind(console),
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

/**
 * Formats current time to ISO format
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Gets Unix timestamp in seconds
 */
function getUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Converts arguments to a message string
 */
function argsToMessage(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

/**
 * Formats message according to template: level_name: asctime - message
 */
function formatMessage(level: LogLevel, message: string): string {
  return `${LOG_LEVEL_DISPLAY[level]}: ${getTimestamp()} - ${message}`;
}

/**
 * Checks if message should be logged to console based on current level
 */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minLevel];
}

/**
 * Checks if message should be sent to remote API
 */
function shouldLogRemote(level: LogLevel): boolean {
  if (!config.remoteEnabled) return false;
  return LOG_LEVELS[level] >= LOG_LEVELS[config.minRemoteLevel];
}

/**
 * Adds log entry to buffer for remote sending
 */
function addToBuffer(level: LogLevel, message: string): void {
  if (!shouldLogRemote(level)) return;

  const entry: LogEntry = {
    message,
    log_level: LOG_LEVEL_API[level],
    timestamp: getUnixTimestamp(),
  };

  logBuffer.push(entry);

  // Trim buffer if it exceeds max size
  if (logBuffer.length > config.maxBufferSize) {
    logBuffer = logBuffer.slice(-config.maxBufferSize);
  }
}

/**
 * Builds the logs API endpoint URL
 * In dev mode: uses Vite proxy with obfuscated endpoint (/_serviceIdPrefix)
 * In prod mode: uses direct URL if logsApiBaseUrl is set
 */
function getLogsEndpoint(): string {
  const apiPath = `/api/v1/services/${serviceId}/logs/submit`;
  
  if (logsApiBaseUrl) {
    // Production: direct URL to backend
    return `${logsApiBaseUrl}/solutions-api${apiPath}`;
  }
  
  // Development: use obfuscated Vite proxy endpoint
  return `${proxyEndpoint}${apiPath}`;
}

/**
 * Sends logs to backend API with retry logic
 */
async function sendLogs(logs: LogEntry[], retryCount = 0): Promise<boolean> {
  if (logs.length === 0 || !apiKey || !serviceId) return true;

  try {
    const response = await fetch(getLogsEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Logs-API-Key': apiKey,
      },
      body: JSON.stringify({ logs }),
    });

    if (response.status === 204) {
      return true;
    }

    if (response.status === 429 && retryCount < config.maxRetries) {
      // Rate limited - retry with exponential backoff
      const delay = config.retryBaseDelay * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendLogs(logs, retryCount + 1);
    }

    return false;
  } catch {
    if (retryCount < config.maxRetries) {
      const delay = config.retryBaseDelay * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return sendLogs(logs, retryCount + 1);
    }
    return false;
  }
}

/**
 * Flushes log buffer to backend
 */
async function flush(): Promise<void> {
  if (logBuffer.length === 0 || isFlushingInProgress) return;

  isFlushingInProgress = true;
  const logsToSend = [...logBuffer];
  logBuffer = [];

  const success = await sendLogs(logsToSend);

  if (!success) {
    // Return logs to buffer on failure (at the beginning)
    logBuffer = [...logsToSend, ...logBuffer].slice(-config.maxBufferSize);
    originalConsole.warn('Failed to send logs to backend, will retry later');
  }

  isFlushingInProgress = false;
}

/**
 * Flushes logs using sendBeacon for page unload
 */
function flushSync(): void {
  if (logBuffer.length === 0 || !apiKey || !serviceId) return;

  const logsToSend = [...logBuffer];
  logBuffer = [];

  const blob = new Blob([JSON.stringify({ logs: logsToSend })], {
    type: 'application/json',
  });

  // sendBeacon is more reliable during page unload
  navigator.sendBeacon(
    `${getLogsEndpoint()}?api_key=${apiKey}`,
    blob
  );
}

/**
 * Starts the flush timer
 */
function startFlushTimer(): void {
  if (flushTimer) return;

  flushTimer = setInterval(() => {
    flush();
  }, config.flushInterval);
}

/**
 * Stops the flush timer
 */
function stopFlushTimer(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

/**
 * Sets up global error handlers
 */
function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  window.onerror = (message, source, lineno, colno, error) => {
    const errorMessage = error
      ? `${error.name}: ${error.message}`
      : String(message);
    const location = source ? ` at ${source}:${lineno}:${colno}` : '';
    
    originalConsole.error(formatMessage('ERROR', `Uncaught error: ${errorMessage}${location}`));
    addToBuffer('ERROR', `Uncaught error: ${errorMessage}${location}`);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error
      ? `${event.reason.name}: ${event.reason.message}`
      : String(event.reason);
    
    originalConsole.error(formatMessage('ERROR', `Unhandled promise rejection: ${reason}`));
    addToBuffer('ERROR', `Unhandled promise rejection: ${reason}`);
  });

  // Flush logs before page unload
  window.addEventListener('beforeunload', () => {
    flushSync();
  });

  // Also handle visibility change for mobile
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushSync();
    }
  });
}

/**
 * Overrides global console methods to format all logs
 */
function overrideConsole(): void {
  console.log = (...args: unknown[]) => {
    if (shouldLog('INFO')) {
      const message = argsToMessage(args);
      originalConsole.log(formatMessage('INFO', message));
      addToBuffer('INFO', message);
    }
  };

  console.debug = (...args: unknown[]) => {
    if (shouldLog('DEBUG')) {
      const message = argsToMessage(args);
      originalConsole.debug(formatMessage('DEBUG', message));
      addToBuffer('DEBUG', message);
    }
  };

  console.info = (...args: unknown[]) => {
    if (shouldLog('INFO')) {
      const message = argsToMessage(args);
      originalConsole.info(formatMessage('INFO', message));
      addToBuffer('INFO', message);
    }
  };

  console.warn = (...args: unknown[]) => {
    if (shouldLog('WARN')) {
      const message = argsToMessage(args);
      originalConsole.warn(formatMessage('WARN', message));
      addToBuffer('WARN', message);
    }
  };

  console.error = (...args: unknown[]) => {
    if (shouldLog('ERROR')) {
      const message = argsToMessage(args);
      originalConsole.error(formatMessage('ERROR', message));
      addToBuffer('ERROR', message);
    }
  };
}

/**
 * Restores original console methods
 */
function restoreConsole(): void {
  console.log = originalConsole.log;
  console.debug = originalConsole.debug;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

/**
 * Main logger object
 */
export const logger = {
  debug(message: string, ...args: unknown[]): void {
    if (shouldLog('DEBUG')) {
      const fullMessage = args.length > 0 ? `${message} ${argsToMessage(args)}` : message;
      originalConsole.debug(formatMessage('DEBUG', fullMessage));
      addToBuffer('DEBUG', fullMessage);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (shouldLog('INFO')) {
      const fullMessage = args.length > 0 ? `${message} ${argsToMessage(args)}` : message;
      originalConsole.info(formatMessage('INFO', fullMessage));
      addToBuffer('INFO', fullMessage);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (shouldLog('WARN')) {
      const fullMessage = args.length > 0 ? `${message} ${argsToMessage(args)}` : message;
      originalConsole.warn(formatMessage('WARN', fullMessage));
      addToBuffer('WARN', fullMessage);
    }
  },

  error(message: string, ...args: unknown[]): void {
    if (shouldLog('ERROR')) {
      const fullMessage = args.length > 0 ? `${message} ${argsToMessage(args)}` : message;
      originalConsole.error(formatMessage('ERROR', fullMessage));
      addToBuffer('ERROR', fullMessage);
    }
  },

  /**
   * Sets the minimum console logging level
   */
  setLevel(level: LogLevel): void {
    config.minLevel = level;
  },

  /**
   * Sets the minimum remote logging level
   */
  setRemoteLevel(level: LogLevel): void {
    config.minRemoteLevel = level;
  },

  /**
   * Enables/disables console logging
   */
  setEnabled(enabled: boolean): void {
    config.enabled = enabled;
  },

  /**
   * Enables/disables remote logging
   */
  setRemoteEnabled(enabled: boolean): void {
    config.remoteEnabled = enabled;
    if (enabled) {
      startFlushTimer();
    } else {
      stopFlushTimer();
    }
  },

  /**
   * Manually flush logs to backend
   */
  flush,

  /**
   * Restores original console behavior
   */
  restoreConsole,

  /**
   * Gets current buffer size (for debugging)
   */
  getBufferSize(): number {
    return logBuffer.length;
  },
};

// Initialize logger
overrideConsole();
setupGlobalErrorHandlers();

if (config.remoteEnabled) {
  startFlushTimer();
}

export type { LogLevel };
export default logger;
