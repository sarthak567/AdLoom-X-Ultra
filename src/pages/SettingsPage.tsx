import { useAuth } from '../context/AuthContext';
import { useLocalAppData } from '../hooks/useLocalAppData';

export default function SettingsPage() {
  const { user, logout, disconnectWallet, wallet } = useAuth();
  const { data, resetDatabase } = useLocalAppData();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Workspace settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Profile, org, and data controls</h1>
        <p className="mt-2 text-white/60">
          Manage your WaveHack workspace, reset the local JSON datastore, or disconnect wallets.
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="mt-4 grid gap-4 text-sm text-white/80 md:grid-cols-2">
          <div>
            <p className="text-white/50">Name</p>
            <p className="text-white">{user?.name ?? 'AdLoom Builder'}</p>
          </div>
          <div>
            <p className="text-white/50">Email</p>
            <p className="text-white">{user?.email ?? 'builder@adloom.xyz'}</p>
          </div>
          <div>
            <p className="text-white/50">Organization</p>
            <p className="text-white">{user?.organization ?? 'AdLoom'}</p>
          </div>
          <div>
            <p className="text-white/50">Wallet</p>
            <p className="text-white">{wallet ?? 'Not connected'}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={disconnectWallet}
            className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/70 hover:border-white hover:text-white"
          >
            Disconnect wallet
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-white/20 px-4 py-2 text-xs text-rose-200 hover:border-rose-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Local JSON datastore</h2>
        <p className="mt-2 text-sm text-white/70">
          The dashboard reads from <code>src/data/appData.json</code> and mirrors updates into `localStorage`.
        </p>
        <div className="mt-4 grid gap-4 text-sm text-white/80 md:grid-cols-3">
          <div>
            <p className="text-white/50">Viewers cached</p>
            <p className="text-white">{data.viewers.length}</p>
          </div>
          <div>
            <p className="text-white/50">Creators cached</p>
            <p className="text-white">{data.creators.length}</p>
          </div>
          <div>
            <p className="text-white/50">Transactions stored</p>
            <p className="text-white">{data.payments.transactions.length}</p>
          </div>
        </div>
        <button
          onClick={resetDatabase}
          className="mt-6 rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:border-white hover:text-white"
        >
          Reset local JSON snapshot
        </button>
      </section>
    </div>
  );
}

