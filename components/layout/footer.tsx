import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/product" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Product</Link></li>
              <li><Link href="/technology" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Technology</Link></li>
              <li><Link href="/security" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Security</Link></li>
              <li><Link href="/docs" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* App */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">App</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Dashboard</Link></li>
              <li><Link href="/reports" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Reports</Link></li>
              <li><Link href="/audit-logs" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Audit Logs</Link></li>
              <li><Link href="/system-health" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">System Health</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Status Page</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Support</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Terms</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">DPA</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>All systems operational</span>
          </div>
          <p className="text-xs text-zinc-500">
            Trust Calibration Layer v1.0 © 2024
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Status</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Blog</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
