'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: 'Acme Corp',
    email: 'admin@acme.com',
    notificationsEnabled: true,
    alertThreshold: '75',
  });

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Configure your account and system preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Organization Settings */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Organization</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Enable Notifications</label>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  Receive alerts about model performance
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                className="w-6 h-6 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--input)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
