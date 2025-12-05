import { useCallback } from 'react';
import { useNotesContext } from './notesContext';
import * as notesApi from '../api/notesApi';
import { useUI } from './uiContext';
import * as storage from '../utils/storage';

/**
 * Custom hook that exposes state and CRUD actions for notes.
 */
// PUBLIC_INTERFACE
export function useNotes() {
  const { state, actions } = useNotesContext();
  const { flags } = useUI();

  const loadNotes = useCallback(async () => {
    actions.loadStart();
    try {
      const res = await notesApi.listNotes();
      if (res.ok) {
        actions.loadSuccess(res.data || []);
      } else {
        if (flags.localStorageFallback) {
          const data = storage.list();
          actions.loadSuccess(data);
        } else {
          actions.loadError(res.error || 'Failed to load');
        }
      }
    } catch (e) {
      if (flags.localStorageFallback) {
        const data = storage.list();
        actions.loadSuccess(data);
      } else {
        actions.loadError(e.message || 'Failed to load');
      }
    }
  }, [actions, flags.localStorageFallback]);

  const createNote = useCallback(async (payload) => {
    // optimistic local add with temp id
    const temp = { id: `tmp_${Date.now()}`, ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    actions.createSuccess(temp);
    try {
      const res = await notesApi.createNote(payload);
      if (res.ok && res.data) {
        // replace temp with real
        actions.deleteSuccess(temp.id);
        actions.createSuccess(res.data);
        if (flags.localStorageFallback) storage.upsert(res.data);
        return { ok: true, note: res.data };
      } else {
        if (flags.localStorageFallback) {
          storage.upsert(temp);
          return { ok: true, note: temp, offline: true };
        }
        actions.deleteSuccess(temp.id);
        return { ok: false, error: res.error || 'Create failed' };
      }
    } catch (e) {
      if (flags.localStorageFallback) {
        storage.upsert(temp);
        return { ok: true, note: temp, offline: true };
      }
      actions.deleteSuccess(temp.id);
      return { ok: false, error: e.message || 'Create failed' };
    }
  }, [actions, flags.localStorageFallback]);

  const updateNote = useCallback(async (id, payload) => {
    const prev = state.items.find(n => String(n.id) === String(id));
    const next = { ...prev, ...payload, id, updatedAt: new Date().toISOString() };
    actions.updateSuccess(next);
    try {
      const res = await notesApi.updateNote(id, payload);
      if (res.ok && res.data) {
        actions.updateSuccess(res.data);
        if (flags.localStorageFallback) storage.upsert(res.data);
        return { ok: true };
      } else {
        if (flags.localStorageFallback) {
          storage.upsert(next);
          return { ok: true, offline: true };
        }
        // revert
        actions.updateSuccess(prev);
        return { ok: false, error: res.error || 'Update failed' };
      }
    } catch (e) {
      if (flags.localStorageFallback) {
        storage.upsert(next);
        return { ok: true, offline: true };
      }
      actions.updateSuccess(prev);
      return { ok: false, error: e.message || 'Update failed' };
    }
  }, [actions, flags.localStorageFallback, state.items]);

  const deleteNote = useCallback(async (id) => {
    const backup = state.items.find(n => String(n.id) === String(id));
    actions.deleteSuccess(id);
    try {
      const res = await notesApi.deleteNote(id);
      if (res.ok) {
        if (flags.localStorageFallback) storage.remove(id);
        return { ok: true };
      } else {
        if (flags.localStorageFallback) {
          storage.remove(id);
          return { ok: true, offline: true };
        }
        // revert
        if (backup) actions.createSuccess(backup);
        return { ok: false, error: res.error || 'Delete failed' };
      }
    } catch (e) {
      if (flags.localStorageFallback) {
        storage.remove(id);
        return { ok: true, offline: true };
      }
      if (backup) actions.createSuccess(backup);
      return { ok: false, error: e.message || 'Delete failed' };
    }
  }, [actions, flags.localStorageFallback, state.items]);

  const selectNote = useCallback((id) => {
    actions.select(id);
  }, [actions]);

  const setFilter = useCallback((q) => actions.setFilter(q), [actions]);

  return {
    state,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setFilter
  };
}
