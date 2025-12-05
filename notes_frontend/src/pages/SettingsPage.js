import React from 'react';
import { config } from '../api/config';
import { useUI } from '../state/uiContext';

/**
 * Settings view to display resolved environment and feature flags.
 */
// PUBLIC_INTERFACE
export default function SettingsPage() {
  const { flags } = useUI();
  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Settings</h2>
      <div className="helper">Resolved configuration and feature flags.</div>
      <pre style={{ overflow: 'auto', background: 'transparent', borderRadius: 8, padding: 12 }}>
{JSON.stringify({ config, flags }, null, 2)}
      </pre>
    </div>
  );
}
