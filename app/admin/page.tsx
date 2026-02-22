'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';

export default function AdminPage() {
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'Analyst', status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@company.com', role: 'Viewer', status: 'Inactive' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Admin Panel</h1>
              <p className="text-zinc-400">Manage users, roles, and system settings</p>
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Users', value: '24' },
                { label: 'Active Sessions', value: '12' },
                { label: 'API Calls (24h)', value: '142.5K' },
                { label: 'System Uptime', value: '99.98%' },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                  <p className="text-xs text-zinc-500 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* User Management */}
            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-100">User Management</h3>
                <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-zinc-700 hover:bg-zinc-800/50">
                        <td className="py-3 px-4 text-zinc-300">{user.name}</td>
                        <td className="py-3 px-4 text-zinc-400 text-xs">{user.email}</td>
                        <td className="py-3 px-4">
                          <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">
                            <option>{user.role}</option>
                            <option>Admin</option>
                            <option>Analyst</option>
                            <option>Viewer</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-500 text-xs hover:text-blue-400 mr-3">Edit</button>
                          <button className="text-red-500 text-xs hover:text-red-400">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
