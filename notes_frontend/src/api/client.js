import { config } from './config';

function log(level, ...args) {
  const levels = ['error','warn','info','debug'];
  const current = levels.indexOf((config.logLevel || 'warn').toLowerCase());
  const idx = levels.indexOf(level);
  if (idx <= current) {
    // eslint-disable-next-line no-console
    console[level] ? console[level](...args) : console.log(...args);
  }
}

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (_) { /* ignore */ }
  if (!res.ok) {
    const error = data?.error || data?.message || `${res.status}`;
    log('warn', 'API error:', error, data);
    return { ok: false, error, status: res.status, data };
  }
  return { ok: true, data, status: res.status };
}

// PUBLIC_INTERFACE
export async function get(path) {
  const url = `${config.baseUrl}${path}`;
  log('debug', 'GET', url);
  return handle(await fetch(url, { headers: { 'Accept': 'application/json' } }));
}

// PUBLIC_INTERFACE
export async function post(path, body) {
  const url = `${config.baseUrl}${path}`;
  log('debug', 'POST', url, body);
  return handle(await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body || {})
  }));
}

// PUBLIC_INTERFACE
export async function put(path, body) {
  const url = `${config.baseUrl}${path}`;
  log('debug', 'PUT', url, body);
  return handle(await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body || {})
  }));
}

// PUBLIC_INTERFACE
export async function del(path) {
  const url = `${config.baseUrl}${path}`;
  log('debug', 'DELETE', url);
  return handle(await fetch(url, { method: 'DELETE', headers: { 'Accept': 'application/json' } }));
}
