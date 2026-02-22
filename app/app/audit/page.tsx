'use client';

import { Clock } from 'lucide-react';

export default function AuditPage() {
  const events = [
    { timestamp: '2024-02-23 14:32', user: 'John Doe', action: 'Updated Threat Detection model', type: 'update' },
    { timestamp: '2024-02-23 13:15', user: 'Jane Smith', action: 'Deployed new model version', type: 'deploy' },
    { timestamp: '2024-02-23 11:45', user: 'John Doe', action: 'Created alert rule', type: 'create' },
    { timestamp: '2024-02-23 10:20', user: 'Admin', action: 'Enabled risk monitoring', type: 'config' },
    { timestamp: '2024-02-23 09:00', user: 'Jane Smith', action: 'Exported report', type: 'export' },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Audit Log</h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Track all system events and changes
        </p>
      </div>

      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--secondary)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-6 py-4 text-left font-semibold">Timestamp</th>
              <th className="px-6 py-4 text-left font-semibold">User</th>
              <th className="px-6 py-4 text-left font-semibold">Action</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: idx < events.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {event.timestamp}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{event.user}</td>
                <td className="px-6 py-4 text-sm">{event.action}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {event.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
