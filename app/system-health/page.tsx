'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';
import { SystemHealth } from '@/components/landing/system-health';

export default function SystemHealthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">System Health</h1>
              <p className="text-zinc-400">Real-time performance and infrastructure metrics</p>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-500">Overall Status</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-zinc-100">Operational</p>
              </div>
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                <p className="text-sm text-zinc-500 mb-2">Uptime (24h)</p>
                <p className="text-3xl font-bold text-zinc-100">99.98%</p>
                <p className="text-xs text-emerald-500 mt-1">↑ 0.02% from previous day</p>
              </div>
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                <p className="text-sm text-zinc-500 mb-2">Avg Response Time</p>
                <p className="text-3xl font-bold text-zinc-100">124ms</p>
                <p className="text-xs text-blue-500 mt-1">↓ 8ms from yesterday</p>
              </div>
              <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900">
                <p className="text-sm text-zinc-500 mb-2">Active Requests</p>
                <p className="text-3xl font-bold text-zinc-100">1,247</p>
                <p className="text-xs text-zinc-400 mt-1">Peak: 2,341 today</p>
              </div>
            </div>

            {/* Detailed Metrics */}
            <SystemHealth />

            {/* Service Status */}
            <div className="mt-12 p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-6">Service Status</h3>
              <div className="space-y-4">
                {[
                  { name: 'API Gateway', status: 'operational', uptime: '99.99%' },
                  { name: 'Verification Engine', status: 'operational', uptime: '100%' },
                  { name: 'Analytics DB', status: 'operational', uptime: '99.97%' },
                  { name: 'Cache Layer', status: 'operational', uptime: '99.95%' },
                ].map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded bg-zinc-800">
                    <div>
                      <p className="font-medium text-zinc-100">{service.name}</p>
                      <p className="text-xs text-zinc-500">Last checked: 2 minutes ago</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-emerald-500">{service.status}</span>
                      </div>
                      <p className="text-xs text-zinc-500">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="mt-8 p-8 rounded-lg border border-emerald-900 bg-emerald-900/20">
              <h3 className="text-lg font-semibold text-emerald-300 mb-4">Recent Alerts</h3>
              <p className="text-sm text-emerald-200">No active alerts. System running normally.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
