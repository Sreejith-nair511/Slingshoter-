'use client';

import { GlobalLayout } from '@/components/layout/global-layout';
import { Architecture } from '@/components/landing/architecture';
import { DeepAnalytics } from '@/components/landing/deep-analytics';

export default function TechnologyPage() {
  return (
    <GlobalLayout>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-zinc-100 mb-6">
              The Engine Behind Trust Calibration
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Five-layer architecture for real-time trust verification, evidence gathering, and automated calibration. Built for scale and accuracy.
            </p>
          </div>

          {/* Architecture */}
          <Architecture />

          {/* Full Analytics */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-zinc-100 mb-8">Detailed Metrics & Analysis</h2>
            <DeepAnalytics />
          </div>

          {/* Technical Details */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Verification Pipeline</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-3">
                  <span className="text-blue-500 font-semibold">1.</span>
                  <span>Extract claims from model output using semantic analysis</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-semibold">2.</span>
                  <span>Query evidence sources and knowledge bases in parallel</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-semibold">3.</span>
                  <span>Score each piece of evidence with confidence ratings</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-semibold">4.</span>
                  <span>Aggregate verification scores across all claims</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-semibold">5.</span>
                  <span>Compare to model confidence for deviation detection</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Performance Specs</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">End-to-end latency</p>
                  <p className="text-2xl font-bold text-zinc-100">4.2ms</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Verification accuracy</p>
                  <p className="text-2xl font-bold text-zinc-100">98.1%</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Throughput (claims/sec)</p>
                  <p className="text-2xl font-bold text-zinc-100">8,500+</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">System uptime SLA</p>
                  <p className="text-2xl font-bold text-zinc-100">99.99%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
}
