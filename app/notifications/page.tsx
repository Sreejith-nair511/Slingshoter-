'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    { id: 1, type: 'warning', title: 'High Trust Deviation Detected', message: 'Model GPT-4 showing 28% confidence deviation', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'Calibration Complete', message: 'Trust model has been recalibrated successfully', time: '4 hours ago' },
    { id: 3, type: 'alert', title: 'Intervention Required', message: '5 high-risk outputs awaiting human review', time: '6 hours ago' },
    { id: 4, type: 'success', title: 'System Healthy', message: 'All verification engines running optimally', time: '1 day ago' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Notifications</h1>
              <p className="text-zinc-400">Stay informed about system events</p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex gap-2">
              {['all', 'warning', 'info', 'alert'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-6 rounded-lg border ${
                    notif.type === 'warning'
                      ? 'border-amber-900 bg-amber-900/20'
                      : notif.type === 'alert'
                        ? 'border-red-900 bg-red-900/20'
                        : notif.type === 'success'
                          ? 'border-emerald-900 bg-emerald-900/20'
                          : 'border-zinc-800 bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-100 mb-1">{notif.title}</h3>
                      <p className="text-sm text-zinc-400">{notif.message}</p>
                      <p className="text-xs text-zinc-500 mt-2">{notif.time}</p>
                    </div>
                    <button className="text-zinc-500 hover:text-zinc-400 ml-4">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
