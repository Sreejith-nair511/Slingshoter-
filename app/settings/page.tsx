'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('thresholds');

  const tabs = [
    { id: 'thresholds', label: 'Trust Thresholds' },
    { id: 'verification', label: 'Verification Preferences' },
    { id: 'notifications', label: 'Notification Controls' },
    { id: 'security', label: 'Security Settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Settings</h1>
              <p className="text-zinc-400">Configure your trust calibration preferences</p>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-zinc-800 flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'thresholds' && (
              <div className="space-y-8">
                <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Trust Deviation Thresholds</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Warning Threshold</label>
                        <span className="text-lg font-bold text-amber-500">15%</span>
                      </div>
                      <input type="range" min="0" max="50" defaultValue="15" className="w-full" />
                      <p className="text-xs text-zinc-500 mt-2">Trigger notifications when deviation exceeds this %</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Intervention Threshold</label>
                        <span className="text-lg font-bold text-red-500">25%</span>
                      </div>
                      <input type="range" min="0" max="50" defaultValue="25" className="w-full" />
                      <p className="text-xs text-zinc-500 mt-2">Require human review when deviation exceeds this %</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-zinc-300">Confidence Floor</label>
                        <span className="text-lg font-bold text-blue-500">65%</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="65" className="w-full" />
                      <p className="text-xs text-zinc-500 mt-2">Minimum confidence required to proceed without review</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="space-y-8">
                <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Verification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">Auto-verify low-risk claims</p>
                        <p className="text-xs text-zinc-500 mt-1">Skip review for high-confidence, low-complexity claims</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>

                    <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">Parallel evidence gathering</p>
                        <p className="text-xs text-zinc-500 mt-1">Query multiple sources simultaneously for faster verification</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>

                    <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">Include external fact-checkers</p>
                        <p className="text-xs text-zinc-500 mt-1">Cross-reference with third-party verification services</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">High-severity alerts</p>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">Calibration updates</p>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">Weekly summary reports</p>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-300">System maintenance notices</p>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                  <h3 className="text-lg font-semibold text-zinc-100 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-zinc-300 mb-2">Two-Factor Authentication</p>
                      <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="border-t border-zinc-700 pt-6">
                      <p className="text-sm font-medium text-zinc-300 mb-3">Active Sessions</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                          <span className="text-zinc-300">Chrome on macOS</span>
                          <button className="text-xs text-red-500 hover:text-red-400">Revoke</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                          <span className="text-zinc-300">Safari on iPhone</span>
                          <button className="text-xs text-red-500 hover:text-red-400">Revoke</button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-700 pt-6">
                      <p className="text-sm font-medium text-zinc-300 mb-2">API Keys</p>
                      <button className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition border border-zinc-700">
                        Manage API Keys
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-12 flex justify-end gap-4">
              <button className="px-6 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition border border-zinc-700">
                Cancel
              </button>
              <button className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
