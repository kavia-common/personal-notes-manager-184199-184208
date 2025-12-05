const KEY = 'notes.fallback.v1';

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function list() {
  return readAll();
}

// PUBLIC_INTERFACE
export function upsert(note) {
  const items = readAll();
  const idx = items.findIndex(n => String(n.id) === String(note.id));
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...note, updatedAt: new Date().toISOString() };
  } else {
    items.unshift({ ...note, id: note.id || `ls_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  writeAll(items);
  return items;
}

// PUBLIC_INTERFACE
export function remove(id) {
  const items = readAll().filter(n => String(n.id) !== String(id));
  writeAll(items);
  return items;
}
