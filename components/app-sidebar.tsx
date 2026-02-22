'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Settings, LogOut, LayoutDashboard, TrendingUp, AlertCircle, Users, GitBranch, HelpCircle } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { label: 'Models', href: '/app/models', icon: BarChart3 },
    { label: 'Metrics', href: '/app/metrics', icon: TrendingUp },
    { label: 'Audit Log', href: '/app/audit', icon: GitBranch },
    { label: 'Alerts', href: '/app/alerts', icon: AlertCircle },
    { label: 'Team', href: '/app/team', icon: Users },
    { label: 'Settings', href: '/app/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen border-r" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            TrustCalib
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            v1.0 Enterprise
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {user.organization}
            </p>
            <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              {user.role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--accent-foreground)' : 'var(--foreground)',
                }}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <HelpCircle size={20} />
            <span>Help & Support</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-75"
            style={{ color: 'var(--foreground)' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
