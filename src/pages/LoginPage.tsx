import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WalletConnectButton } from '../components/WalletConnectButton';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('avery@adloom.xyz');
  const [name, setName] = useState('Avery Lin');

  const redirectTarget = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ name, email, organization: 'AdLoom X Ultra' });
    navigate(redirectTarget, { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400/80 to-sky-500/80" />
          <h1 className="text-2xl font-semibold">AdLoom X Ultra Console</h1>
          <p className="mt-2 text-sm text-white/70">WaveHack admin access · Linera Testnet</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Email</label>
            <input
              value={email}
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-3 text-sm font-semibold text-slate-900"
          >
            Sign in and continue
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-white/60">
          <p>Need wallet access?</p>
          <div className="mt-3 flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}

