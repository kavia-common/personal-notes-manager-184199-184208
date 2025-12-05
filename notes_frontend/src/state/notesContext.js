import React, { createContext, useCallback, useContext, useReducer } from 'react';

const initialState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
  filter: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, items: action.payload || [] };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'CREATE_SUCCESS':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_SUCCESS': {
      const updated = state.items.map(n => String(n.id) === String(action.payload.id) ? action.payload : n);
      return { ...state, items: updated };
    }
    case 'DELETE_SUCCESS': {
      const filtered = state.items.filter(n => String(n.id) !== String(action.id));
      return { ...state, items: filtered, selectedId: state.selectedId === action.id ? null : state.selectedId };
    }
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'FILTER':
      return { ...state, filter: action.value };
    default:
      return state;
  }
}

const NotesContext = createContext(null);

/**
 * Provides notes state and dispatch helpers.
 */
// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    loadStart: () => dispatch({ type: 'LOAD_START' }),
    loadSuccess: (items) => dispatch({ type: 'LOAD_SUCCESS', payload: items }),
    loadError: (error) => dispatch({ type: 'LOAD_ERROR', error }),
    createSuccess: (note) => dispatch({ type: 'CREATE_SUCCESS', payload: note }),
    updateSuccess: (note) => dispatch({ type: 'UPDATE_SUCCESS', payload: note }),
    deleteSuccess: (id) => dispatch({ type: 'DELETE_SUCCESS', id }),
    select: (id) => dispatch({ type: 'SELECT', id }),
    setFilter: (value) => dispatch({ type: 'FILTER', value }),
  };

  const selectNote = useCallback((id) => actions.select(id), []);

  return (
    <NotesContext.Provider value={{ state, dispatch, actions, selectNote }}>
      {children}
    </NotesContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useNotesContext() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotesContext must be used within NotesProvider');
  return ctx;
}
