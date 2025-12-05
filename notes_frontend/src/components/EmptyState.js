import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Empty state prompting to create the first note.
 */
// PUBLIC_INTERFACE
export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="card empty-state">
      <h2>Welcome to Personal Notes</h2>
      <p className="helper">Create your first note to get started.</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={() => navigate('/notes/new')}>Create Note</button>
      </div>
    </div>
  );
}
