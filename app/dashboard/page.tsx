'use client';

import { DeepAnalytics } from '@/components/landing/deep-analytics';
import { MetricsGrid } from '@/components/landing/metrics-grid';
import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Analytics Dashboard</h1>
              <p className="text-zinc-400">Real-time trust metrics and verification results</p>
            </div>

            {/* Key Metrics */}
            <div className="mb-12">
              <MetricsGrid />
            </div>

            {/* Deep Analytics */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-8">Detailed Analysis</h2>
              <DeepAnalytics />
            </div>

            {/* Additional Controls Section */}
            <div className="mt-12 p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Intervention Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Pending Review</p>
                  <p className="text-3xl font-bold text-amber-500">12</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Approved</p>
                  <p className="text-3xl font-bold text-emerald-500">487</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Rejected</p>
                  <p className="text-3xl font-bold text-red-500">8</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
