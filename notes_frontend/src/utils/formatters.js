export function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}
