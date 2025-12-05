import React from 'react';
import './App.css';
import './styles/theme.css';
import Header from './components/Header';
import { AppRoutes } from './routes/AppRoutes';
import { UIProvider } from './state/uiContext';
import { NotesProvider } from './state/notesContext';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';

/**
 * App shell: wraps routes with UI and Notes providers and renders a header with gradient.
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <UIProvider>
      <NotesProvider>
        <div className="app-root">
          <Header />
          <main className="app-main">
            <AppRoutes />
          </main>
          <Toast />
          <ConfirmDialog />
        </div>
      </NotesProvider>
    </UIProvider>
  );
}

export default App;
