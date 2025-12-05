import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import EmptyState from '../components/EmptyState';
import { useNotes } from '../state/useNotes';
import { useUI } from '../state/uiContext';
import { connectWS, disconnectWS } from '../api/ws';

/**
 * Notes page with two-pane layout, sidebar and editor based on route.
 */
// PUBLIC_INTERFACE
export default function NotesPage({ mode: propMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { flags, showToast, confirm } = useUI();
  const { state, loadNotes, createNote, updateNote, deleteNote, selectNote } = useNotes();

  const mode = propMode || (location.pathname.endsWith('/new') ? 'create' : id ? 'edit' : 'list');

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (id) selectNote(id);
  }, [id, selectNote]);

  useEffect(() => {
    let close = () => {};
    if (flags.wsEnabled) {
      close = connectWS({
        onMessage: (evt) => {
          try {
            const data = JSON.parse(evt.data);
            // Basic handling example: if backend broadcasts 'notesUpdated', reload
            if (data.type === 'notesUpdated') {
              loadNotes();
            }
          } catch (_) { /* noop */ }
        }
      });
    }
    return () => {
      close();
      disconnectWS();
    };
  }, [flags.wsEnabled, loadNotes]);

  const activeNote = useMemo(() => {
    if (!id) return null;
    return state.items.find(n => String(n.id) === String(id)) || null;
  }, [id, state.items]);

  const handleCreate = async (payload) => {
    const res = await createNote(payload);
    if (res?.ok && res.note) {
      showToast('Note created', 'success');
      navigate(`/notes/${res.note.id}`);
    } else {
      showToast(res?.error || 'Failed to create note', 'error');
    }
  };

  const handleSave = async (payload) => {
    const res = await updateNote(id, payload);
    if (res?.ok) {
      showToast('Note saved', 'success');
    } else {
      showToast(res?.error || 'Failed to save note', 'error');
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete note?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete'
    });
    if (!ok) return;
    const res = await deleteNote(id);
    if (res?.ok) {
      showToast('Note deleted', 'success');
      navigate('/notes');
    } else {
      showToast(res?.error || 'Failed to delete note', 'error');
    }
  };

  return (
    <div className="layout-two-pane">
      <Sidebar />
      <section aria-label="Main panel">
        {mode === 'create' ? (
          <NoteEditor mode="create" onSave={handleCreate} onCancel={() => navigate('/notes')} />
        ) : mode === 'edit' ? (
          <NoteEditor
            mode="edit"
            note={activeNote}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => navigate('/notes')}
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}
