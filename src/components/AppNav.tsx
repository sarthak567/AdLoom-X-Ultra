import { NavLink } from 'react-router-dom';
import { WalletConnectButton } from './WalletConnectButton';
import { useAppContext } from '../context/AppContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/viewers', label: 'Viewers' },
  { to: '/creators', label: 'Creators' },
  { to: '/advertisers', label: 'Advertisers' },
  { to: '/payments', label: 'Payments' },
  { to: '/settings', label: 'Settings' },
];

export function AppNav() {
  const {
    state: {
      session: { user },
    },
  } = useAppContext();

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/80 to-sky-500/80" />
          <div>
            <p className="text-sm uppercase tracking-wide text-white/60">AdLoom X Ultra</p>
            <p className="text-xs text-white/50">Microchain Attention OS</p>
          </div>
        </div>
        <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition hover:text-white ${isActive ? 'text-white' : 'text-white/60'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-white/60 md:inline-flex">{user.name}</span>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}

