import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { config, parseFeatureFlags } from '../api/config';

const UIContext = createContext(null);

/**
 * UIProvider holds toasts, confirm dialog, theme state, and feature flags.
 */
// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [resolver, setResolver] = useState(null);
  const [theme, setTheme] = useState(() => {
    const cached = localStorage.getItem('ui.theme');
    return cached || 'light';
  });

  const flags = useMemo(() => {
    const f = parseFeatureFlags(process.env.REACT_APP_FEATURE_FLAGS);
    return {
      localStorageFallback: !!f.localStorageFallback,
      showSettings: !!f.showSettings,
      wsEnabled: !!(process.env.REACT_APP_WS_URL) || !!f.wsEnabled
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('ui.theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, ...opts });
      setResolver(() => resolve);
    });
  }, []);

  const resolveConfirm = useCallback((value) => {
    if (resolver) resolver(value);
    setResolver(null);
    setConfirmState({ open: false });
  }, [resolver]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = {
    toasts,
    showToast,
    removeToast,
    confirmState,
    confirm,
    resolveConfirm,
    theme,
    toggleTheme,
    flags,
    config
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
