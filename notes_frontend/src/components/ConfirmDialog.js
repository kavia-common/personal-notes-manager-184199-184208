import React from 'react';
import { useUI } from '../state/uiContext';

/**
 * Simple confirm dialog with OK/Cancel controlled by UI context.
 */
// PUBLIC_INTERFACE
export default function ConfirmDialog() {
  const { confirmState, resolveConfirm } = useUI();

  if (!confirmState.open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title" style={{ marginTop: 0 }}>{confirmState.title || 'Please confirm'}</h3>
        <p className="helper" style={{ marginBottom: 16 }}>{confirmState.message || 'Are you sure?'}</p>
        <div className="form-actions">
          <button className="btn" onClick={() => resolveConfirm(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => resolveConfirm(true)}>{confirmState.confirmText || 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}
