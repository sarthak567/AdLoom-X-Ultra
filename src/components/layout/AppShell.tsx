import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WalletConnectButton } from '../WalletConnectButton';
import { LineraStatus } from '../LineraStatus';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Viewers', to: '/viewers' },
  { label: 'Creators', to: '/creators' },
  { label: 'Advertisers', to: '/advertisers' },
  { label: 'Payments', to: '/payments' },
  { label: 'Settings', to: '/settings' },
];

export function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/80 to-sky-500/80" />
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">AdLoom X Ultra</p>
              <p className="text-xs text-white/50">WaveHack Console</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-white/60 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? 'bg-white/10 text-white' : 'hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <LineraStatus />
            <div className="text-right text-xs">
              <p className="font-semibold text-white">{user?.name ?? 'AdLoom Builder'}</p>
              <p className="text-white/50">{user?.organization ?? 'AdLoom'}</p>
            </div>
            <WalletConnectButton />
            <button
              onClick={logout}
              className="rounded-full border border-white/20 p-2 text-white/60 transition hover:border-white hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
            <Menu className="h-6 w-6 text-white/80" />
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-white/10 px-6 py-4 text-sm text-white/70 md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-full px-3 py-2 ${
                    location.pathname === item.to ? 'bg-white/10 text-white' : ''
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <WalletConnectButton />
              <button
                onClick={logout}
                className="rounded-full border border-white/20 px-3 py-2 text-xs text-white/70"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

