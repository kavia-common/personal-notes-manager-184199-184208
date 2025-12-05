import React, { useEffect } from 'react';
import { useUI } from '../state/uiContext';

/**
 * Toast container rendering success/error messages from UI context queue.
 */
// PUBLIC_INTERFACE
export default function Toast() {
  const { toasts, removeToast } = useUI();

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map(t =>
      setTimeout(() => removeToast(t.id), t.duration || 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
