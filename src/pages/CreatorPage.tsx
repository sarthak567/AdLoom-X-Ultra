import { useState } from 'react';
import { useLocalAppData } from '../hooks/useLocalAppData';
import { useAdloomMutations } from '../hooks/useAdloomMutations';

export default function CreatorPage() {
  const {
    data: { creators, creatorVaults },
    registerCreator,
    stakeVault,
    harvestVault,
    toggleCreatorAiMode,
  } = useLocalAppData();
  const mutations = useAdloomMutations();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({ creatorId: '', handle: '', category: '' });
  const [stakeForm, setStakeForm] = useState({ creatorId: '', amount: '' });

  const handleRegister = () => {
    if (!registerForm.handle || !registerForm.category) return;
    const creatorId = registerForm.creatorId || `creator-${Date.now()}`;
    mutations.registerCreator(creatorId, registerForm.handle, registerForm.category, () => {
      registerCreator(creatorId, registerForm.handle, registerForm.category);
      setShowRegisterModal(false);
      setRegisterForm({ creatorId: '', handle: '', category: '' });
    });
  };

  const handleStake = () => {
    if (!stakeForm.creatorId || !stakeForm.amount) return;
    mutations.stakeVault(stakeForm.creatorId, stakeForm.amount, () => {
      stakeVault(stakeForm.creatorId, stakeForm.amount);
      setShowStakeModal(false);
      setStakeForm({ creatorId: '', amount: '' });
    });
  };

  const handleHarvest = (creatorId: string) => {
    mutations.harvestVault(creatorId, () => {
      harvestVault(creatorId);
    });
  };

  const selectedCreator = showDetailModal
    ? creators.find((c) => c.id === showDetailModal)
    : null;
  const creatorVault = selectedCreator
    ? creatorVaults.find((v) => v.creatorId === selectedCreator.handle)
    : null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">Creator command</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Vault analytics & AI optimization</h1>
          <p className="mt-2 text-white/60">
            Monitor vault performance, RPM, and AI protection for every creator microchain plugged into the marketplace.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
          >
            + Register Creator
          </button>
          <button
            onClick={() => setShowStakeModal(true)}
            className="rounded-2xl border border-pink-500/30 bg-pink-500/10 px-6 py-3 text-sm font-medium text-pink-300 transition hover:border-pink-500/50 hover:bg-pink-500/20"
          >
            Stake Vault
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {creators.map((creator) => (
          <article key={creator.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">{creator.category}</p>
                <p className="text-xl font-semibold text-white">{creator.handle}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  creator.aiMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/70'
                }`}
              >
                {creator.aiMode ? 'AI Shield' : 'Manual'}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>RPM</span>
                <span className="text-white">{creator.rpm}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vault balance</span>
                <span className="text-emerald-300">{creator.vault}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowDetailModal(creator.id)}
                className="flex-1 rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white"
              >
                View Details
              </button>
              <button
                onClick={() => toggleCreatorAiMode(creator.id)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  creator.aiMode
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/50'
                    : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                }`}
              >
                {creator.aiMode ? 'AI On' : 'AI Off'}
              </button>
            </div>
            {creatorVaults.find((v) => v.creatorId === creator.handle) && (
              <button
                onClick={() => handleHarvest(creator.id)}
                className="mt-3 w-full rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-300 transition hover:border-pink-500/50"
              >
                Harvest Yield
              </button>
            )}
          </article>
        ))}
      </div>

      {/* Register Creator Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Register New Creator</h2>
            <p className="mt-2 text-sm text-white/60">Add a new creator to the AdLoom marketplace</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Creator ID</label>
                <input
                  type="text"
                  value={registerForm.creatorId}
                  onChange={(e) => setRegisterForm({ ...registerForm, creatorId: e.target.value })}
                  placeholder="creator-123"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Handle</label>
                <input
                  type="text"
                  value={registerForm.handle}
                  onChange={(e) => setRegisterForm({ ...registerForm, handle: e.target.value })}
                  placeholder="@creatorhandle"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Category</label>
                <select
                  value={registerForm.category}
                  onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Immersive Music">Immersive Music</option>
                  <option value="Interactive Podcast">Interactive Podcast</option>
                  <option value="Generative Art">Generative Art</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stake Vault Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Stake Creator Vault</h2>
            <p className="mt-2 text-sm text-white/60">Stake $ATTN tokens to earn yield</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Creator ID</label>
                <select
                  value={stakeForm.creatorId}
                  onChange={(e) => setStakeForm({ ...stakeForm, creatorId: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Select creator</option>
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.handle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70">Stake Amount ($ATTN)</label>
                <input
                  type="text"
                  value={stakeForm.amount}
                  onChange={(e) => setStakeForm({ ...stakeForm, amount: e.target.value })}
                  placeholder="100"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Staking...' : 'Stake'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creator Detail Modal */}
      {showDetailModal && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{selectedCreator.handle}</h2>
                <p className="mt-1 text-sm text-white/60">{selectedCreator.category}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(null)}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Revenue Per Mille</p>
                <p className="mt-1 text-2xl font-semibold text-white">{selectedCreator.rpm}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Vault Balance</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">{selectedCreator.vault}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">AI Optimization</p>
                <p className={`mt-1 text-2xl font-semibold ${selectedCreator.aiMode ? 'text-emerald-300' : 'text-white/70'}`}>
                  {selectedCreator.aiMode ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Category</p>
                <p className="mt-1 text-2xl font-semibold text-pink-300">{selectedCreator.category}</p>
              </div>
            </div>
            {creatorVault && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-lg font-semibold text-white">Creator Vault</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Staked Amount</p>
                    <p className="mt-1 text-white">{creatorVault.stakedAmount}</p>
                  </div>
                  <div>
                    <p className="text-white/50">APY</p>
                    <p className="mt-1 text-white">{(creatorVault.apyBps / 100).toFixed(2)}%</p>
                  </div>
                </div>
                <button
                  onClick={() => handleHarvest(selectedCreator.id)}
                  className="mt-4 w-full rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
                >
                  Harvest Yield
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
