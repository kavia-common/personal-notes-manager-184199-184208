import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotesPage from '../pages/NotesPage';
import SettingsPage from '../pages/SettingsPage';
import { useUI } from '../state/uiContext';

/**
 * Central route definitions for the app.
 */
// PUBLIC_INTERFACE
export function AppRoutes() {
  const { flags } = useUI();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" replace />} />
      <Route path="/notes" element={<NotesPage />}>
        {/* nested handled inside NotesPage layout via Outlet-like behavior */}
      </Route>
      <Route path="/notes/new" element={<NotesPage mode="create" />} />
      <Route path="/notes/:id" element={<NotesPage mode="edit" />} />
      {flags.showSettings ? <Route path="/settings" element={<SettingsPage />} /> : null}
      <Route path="*" element={<Navigate to="/notes" replace />} />
    </Routes>
  );
}
