'use client';

import { GlobalLayout } from '@/components/layout/global-layout';
import { SystemHealth } from '@/components/landing/system-health';

export default function SecurityPage() {
  return (
    <GlobalLayout>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-zinc-100 mb-6">
              Enterprise Security & Compliance
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Zero-trust architecture with end-to-end encryption, strict role-based access control, and immutable audit logs.
            </p>
          </div>

          {/* Security Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Data Isolation</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Tenant data completely isolated at the application layer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Encryption at rest (AES-256) and in transit (TLS 1.3)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Database row-level security with per-user filters</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Automatic key rotation every 90 days</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Role-Based Access</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Admin: Full system access and user management</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Analyst: Dashboard, reports, and intervention workflows</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Viewer: Read-only access to dashboards and reports</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Custom roles with fine-grained permission control</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Audit & Compliance</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Immutable audit logs for all API calls and data access</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Real-time compliance monitoring and alerting</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>SOC 2 Type II, ISO 27001, GDPR compliant</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Data retention policies with secure deletion</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Infrastructure</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Multi-region redundancy with automatic failover</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>DDoS protection and rate limiting</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Regular penetration testing and security audits</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>24/7 security monitoring and incident response</span>
                </li>
              </ul>
            </div>
          </div>

          {/* System Health */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">System Health</h2>
            <SystemHealth />
          </div>

          {/* Compliance Badges */}
          <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-100 mb-6">Certifications & Standards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-xs text-zinc-400">SOC 2 Type II</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-xs text-zinc-400">ISO 27001</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <p className="text-xs text-zinc-400">GDPR</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-xs text-zinc-400">HIPAA Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
}
