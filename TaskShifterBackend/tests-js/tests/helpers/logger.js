const ENABLE_LOGS = (process.env.ENABLE_LOGS || 'true') === 'true';

export function log(...args) {
  if (ENABLE_LOGS) console.log('[LOG]', ...args);
}

export function debug(...args) {
  if (ENABLE_LOGS) console.debug('[DEBUG]', ...args);
}
