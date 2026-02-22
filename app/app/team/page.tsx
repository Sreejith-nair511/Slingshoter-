'use client';

import { Plus, MoreVertical } from 'lucide-react';

export default function TeamPage() {
  const members = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', joinedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'analyst', joinedDate: '2024-01-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'analyst', joinedDate: '2024-02-01' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'viewer', joinedDate: '2024-02-10' },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Team</h1>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Manage team members and permissions
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Plus size={20} />
          <span>Invite Member</span>
        </button>
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
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Role</th>
              <th className="px-6 py-4 text-left font-semibold">Joined</th>
              <th className="px-6 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr
                key={member.id}
                style={{ borderBottom: idx < members.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <td className="px-6 py-4 text-sm font-medium">{member.name}</td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {member.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {member.joinedDate}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 hover:opacity-70 transition-opacity">
                    <MoreVertical size={20} style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
