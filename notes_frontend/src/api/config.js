function safeJSONParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

// PUBLIC_INTERFACE
export const config = {
  baseUrl: (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '')),
  logLevel: process.env.REACT_APP_LOG_LEVEL || 'warn',
  wsUrl: process.env.REACT_APP_WS_URL || '',
  healthPath: process.env.REACT_APP_HEALTHCHECK_PATH || '/health'
};

// PUBLIC_INTERFACE
export function parseFeatureFlags(value) {
  const flags = {};
  if (!value) return flags;
  if (value.trim().startsWith('{')) {
    const obj = safeJSONParse(value, {});
    Object.assign(flags, obj);
  } else {
    value.split(',').map(s => s.trim()).filter(Boolean).forEach(k => { flags[k] = true; });
  }
  return flags;
}
