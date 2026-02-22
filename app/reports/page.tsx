'use client';

import { PublicNavbar } from '@/components/public-navbar';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">Reports</h1>
              <p className="text-zinc-400">Generate and export trust calibration analytics</p>
            </div>

            {/* Report Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Report Options */}
              <div className="lg:col-span-1 p-8 rounded-lg border border-zinc-800 bg-zinc-900 h-fit">
                <h3 className="text-lg font-semibold text-zinc-100 mb-6">Report Options</h3>
                
                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm"
                    >
                      <option value="today">Today</option>
                      <option value="7days">Last 7 days</option>
                      <option value="30days">Last 30 days</option>
                      <option value="custom">Custom range</option>
                    </select>
                  </div>

                  {/* Report Type */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Report Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Executive Summary</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Calibration Metrics</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" className="rounded" />
                        <span>Verification Details</span>
                      </label>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">Export Format</label>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                        Generate PDF
                      </button>
                      <button className="w-full px-4 py-2 rounded bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition border border-zinc-700">
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="lg:col-span-2 p-8 rounded-lg border border-zinc-800 bg-zinc-900">
                <h3 className="text-lg font-semibold text-zinc-100 mb-6">Report Preview</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">Executive Summary</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-zinc-800 rounded">
                        <p className="text-xs text-zinc-500 mb-1">Avg Confidence</p>
                        <p className="text-2xl font-bold text-zinc-100">87.4%</p>
                      </div>
                      <div className="p-4 bg-zinc-800 rounded">
                        <p className="text-xs text-zinc-500 mb-1">Calibration Index</p>
                        <p className="text-2xl font-bold text-zinc-100">82.1%</p>
                      </div>
                      <div className="p-4 bg-zinc-800 rounded">
                        <p className="text-xs text-zinc-500 mb-1">Avg Deviation</p>
                        <p className="text-2xl font-bold text-amber-500">5.3%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">Key Findings</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Confidence increased 3.2% from previous period</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-500">•</span>
                        <span>Calibration index shows 87% alignment</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-500">•</span>
                        <span>7 interventions triggered for high-risk outputs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Recent Reports</h3>
              <table className="w-full text-sm text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Generated</th>
                    <th className="text-left py-2 px-4">Format</th>
                    <th className="text-left py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Weekly Calibration Report', date: '2024-02-20', format: 'PDF' },
                    { name: 'January Metrics Summary', date: '2024-02-01', format: 'CSV' },
                    { name: 'Q1 Trust Analysis', date: '2024-01-15', format: 'PDF' },
                  ].map((report, idx) => (
                    <tr key={idx} className="border-b border-zinc-700">
                      <td className="py-3 px-4">{report.name}</td>
                      <td className="py-3 px-4 text-zinc-500">{report.date}</td>
                      <td className="py-3 px-4">{report.format}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-500 hover:text-blue-400">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
