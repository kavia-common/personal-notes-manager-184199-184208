import * as client from './client';

// PUBLIC_INTERFACE
export async function listNotes() {
  return client.get('/api/notes');
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  return client.get(`/api/notes/${id}`);
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  return client.post('/api/notes', payload);
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  return client.put(`/api/notes/${id}`, payload);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  return client.del(`/api/notes/${id}`);
}
