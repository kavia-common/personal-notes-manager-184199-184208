import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../state/useNotes';
import NoteItem from './NoteItem';

/**
 * Sidebar with search, new note button and notes listing.
 */
// PUBLIC_INTERFACE
export default function Sidebar() {
  const navigate = useNavigate();
  const { state, setFilter } = useNotes();

  const filtered = useMemo(() => {
    const q = (state.filter || '').toLowerCase();
    if (!q) return state.items;
    return state.items.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q) ||
      (n.tags || []).join(',').toLowerCase().includes(q)
    );
  }, [state.items, state.filter]);

  return (
    <aside className="card sidebar" aria-label="Notes navigation sidebar">
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          placeholder="Search notes..."
          value={state.filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Search notes"
        />
        <button
          className="btn btn-primary"
          onClick={() => navigate('/notes/new')}
        >
          New
        </button>
      </div>
      <div className="note-list" role="list">
        {filtered.map(n => (
          <Link key={n.id} to={`/notes/${n.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <NoteItem note={n} active={state.selectedId === n.id} />
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="helper">No notes match your filter.</div>
        )}
      </div>
    </aside>
  );
}
