'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Hero } from '@/components/landing/hero';
import { Pipeline } from '@/components/landing/pipeline';
import { MetricsGrid } from '@/components/landing/metrics-grid';
import { DeepAnalytics } from '@/components/landing/deep-analytics';
import { Architecture } from '@/components/landing/architecture';
import { SystemHealth } from '@/components/landing/system-health';

export default function HomePage() {
  return (
    <div className="bg-zinc-950">
      <PublicNavbar />

      {/* Hero Section */}
      <Hero />

      {/* Pipeline Section */}
      <Pipeline />

      {/* Metrics Grid */}
      <MetricsGrid />

      {/* Deep Analytics */}
      <DeepAnalytics />

      {/* Architecture */}
      <Architecture />

      {/* System Health */}
      <SystemHealth />

      {/* Footer */}
      <section className="bg-zinc-950 border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems operational</span>
            </div>
            <div>
              <span>Trust Calibration Layer v1.0 • Instrumentation Console</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-400 transition-colors">API Docs</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Status</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
