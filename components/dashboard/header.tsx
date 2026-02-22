'use client';

import { Settings, Bell } from 'lucide-react';

interface HeaderProps {
  mode: 'normal' | 'intervention';
  onModeChange: (mode: 'normal' | 'intervention') => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header
      className="border-b"
      style={{
        backgroundColor: 'var(--slate-bg)',
        borderColor: 'var(--slate-border)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--slate-text)' }}
          >
            Trust Calibration Layer
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--slate-muted)' }}>
            AI Output Reliability & Confidence Monitor
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--slate-border)',
              color: 'var(--slate-text)',
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <button
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--slate-border)',
              color: 'var(--slate-text)',
            }}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          <div className="flex items-center gap-2 ml-4 p-2 rounded-lg border" style={{ borderColor: 'var(--slate-border)' }}>
            <button
              onClick={() => onModeChange('normal')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mode === 'normal' ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                backgroundColor: mode === 'normal' ? 'var(--blue-primary)' : 'transparent',
                color: mode === 'normal' ? 'white' : 'var(--slate-text)',
              }}
            >
              Monitor
            </button>
            <button
              onClick={() => onModeChange('intervention')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mode === 'intervention' ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                backgroundColor: mode === 'intervention' ? 'var(--amber-risk)' : 'transparent',
                color: mode === 'intervention' ? 'white' : 'var(--slate-text)',
              }}
            >
              Intervene
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
