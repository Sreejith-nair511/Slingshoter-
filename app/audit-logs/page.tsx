'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';

const auditEvents = [
  {
    id: 1,
    timestamp: '2024-02-23 14:32:45',
    user: 'alice@company.com',
    action: 'Verified output',
    resource: 'Model: GPT-4 Threat Detection',
    severity: 'info',
  },
  {
    id: 2,
    timestamp: '2024-02-23 14:28:12',
    user: 'bob@company.com',
    action: 'Rejected intervention',
    resource: 'Claim ID: CLM-92847',
    severity: 'warning',
  },
  {
    id: 3,
    timestamp: '2024-02-23 14:15:03',
    user: 'charlie@company.com',
    action: 'Updated trust threshold',
    resource: 'Setting: Confidence Threshold',
    severity: 'info',
  },
  {
    id: 4,
    timestamp: '2024-02-23 13:42:19',
    user: 'system',
    action: 'Calibration event',
    resource: 'Model: BERT Classification',
    severity: 'success',
  },
  {
    id: 5,
    timestamp: '2024-02-23 13:15:44',
    user: 'diana@company.com',
    action: 'Access denied',
    resource: 'Report: Q1 Analysis',
    severity: 'error',
  },
];

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'error':
      return 'text-red-500 bg-red-500/10';
    case 'warning':
      return 'text-amber-500 bg-amber-500/10';
    case 'success':
      return 'text-emerald-500 bg-emerald-500/10';
    default:
      return 'text-blue-500 bg-blue-500/10';
  }
}

export default function AuditLogsPage() {
  const [filterSeverity, setFilterSeverity] = useState('all');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Audit Logs</h1>
              <p className="text-zinc-400">Immutable record of all system events</p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search events..."
                className="flex-1 px-4 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder-zinc-500"
              />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm"
              >
                <option value="all">All Severities</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Audit Table */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="text-left py-3 px-6 font-semibold text-zinc-300">Timestamp</th>
                    <th className="text-left py-3 px-6 font-semibold text-zinc-300">User</th>
                    <th className="text-left py-3 px-6 font-semibold text-zinc-300">Action</th>
                    <th className="text-left py-3 px-6 font-semibold text-zinc-300">Resource</th>
                    <th className="text-left py-3 px-6 font-semibold text-zinc-300">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEvents
                    .filter((event) => filterSeverity === 'all' || event.severity === filterSeverity)
                    .map((event) => (
                      <tr key={event.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="py-4 px-6 text-zinc-400">{event.timestamp}</td>
                        <td className="py-4 px-6 text-zinc-300">{event.user}</td>
                        <td className="py-4 px-6 text-zinc-300">{event.action}</td>
                        <td className="py-4 px-6 text-zinc-400 text-xs">{event.resource}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-zinc-400">Showing 1-5 of 248 events</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition text-sm">
                  Previous
                </button>
                <button className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
