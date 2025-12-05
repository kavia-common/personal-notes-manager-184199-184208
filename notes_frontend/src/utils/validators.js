export function parseTags(input) {
  if (!input) return [];
  return input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

// PUBLIC_INTERFACE
export function validateNote({ title, content }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = 'Title is required';
  if (!content || !content.trim()) errors.content = 'Content is required';
  return errors;
}

// PUBLIC_INTERFACE
export function isValidId(id) {
  return typeof id === 'string' || typeof id === 'number';
}
