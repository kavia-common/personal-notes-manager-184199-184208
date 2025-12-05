import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../state/uiContext';

/**
 * Header with brand, theme toggle and optional settings link.
 */
// PUBLIC_INTERFACE
export default function Header() {
  const { theme, toggleTheme, flags } = useUI();
  const location = useLocation();

  // Persist theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/notes" className="brand" aria-label="Personal Notes home">
          <div className="brand-badge" aria-hidden>📝</div>
          <h1 className="app-title">Personal Notes</h1>
        </Link>
        <div className="header-actions">
          {flags.showSettings && location.pathname !== '/settings' ? (
            <Link className="btn btn-ghost" to="/settings">Settings</Link>
          ) : null}
          <button className="btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}
