import React from 'react';
import { formatDate } from '../utils/formatters';

/**
 * A compact note item used in the list with title and updated time.
 */
// PUBLIC_INTERFACE
export default function NoteItem({ note, active }) {
  return (
    <div className={`note-item ${active ? 'active' : ''}`} role="listitem" aria-current={active ? 'true' : 'false'}>
      <div>
        <div className="note-title">{note.title || 'Untitled'}</div>
        <div className="helper">{(note.content || '').slice(0, 80)}</div>
      </div>
      <div className="note-meta" aria-label="Last updated">
        {note.updatedAt ? formatDate(note.updatedAt) : ''}
      </div>
    </div>
  );
}
