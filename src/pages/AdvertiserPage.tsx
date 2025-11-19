import { useState } from 'react';
import { useLocalAppData } from '../hooks/useLocalAppData';
import { useAdloomMutations } from '../hooks/useAdloomMutations';

export default function AdvertiserPage() {
  const {
    data: { advertisers, campaigns, aiInstructions },
    registerAdvertiser,
    fundCampaign,
    registerCampaign,
    submitBrandInstruction,
  } = useLocalAppData();
  const mutations = useAdloomMutations();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({ advertiserId: '', brand: '', floorCpmMicros: '1000' });
  const [fundForm, setFundForm] = useState({ advertiserId: '', amount: '' });
  const [campaignForm, setCampaignForm] = useState({ advertiserId: '', campaignId: '', budget: '', floorCpmMicros: '1000' });
  const [aiForm, setAiForm] = useState({ advertiserId: '', instruction: '' });

  const handleRegister = () => {
    if (!registerForm.brand) return;
    const advertiserId = registerForm.advertiserId || `advertiser-${Date.now()}`;
    mutations.registerAdvertiser(advertiserId, registerForm.brand, parseInt(registerForm.floorCpmMicros), () => {
      registerAdvertiser(advertiserId, registerForm.brand, parseInt(registerForm.floorCpmMicros));
      setShowRegisterModal(false);
      setRegisterForm({ advertiserId: '', brand: '', floorCpmMicros: '1000' });
    });
  };

  const handleFund = () => {
    if (!fundForm.advertiserId || !fundForm.amount) return;
    mutations.fundCampaign(fundForm.advertiserId, fundForm.amount, () => {
      fundCampaign(fundForm.advertiserId, fundForm.amount);
      setShowFundModal(false);
      setFundForm({ advertiserId: '', amount: '' });
    });
  };

  const handleRegisterCampaign = () => {
    if (!campaignForm.advertiserId || !campaignForm.campaignId || !campaignForm.budget) return;
    mutations.registerCampaign(
      campaignForm.advertiserId,
      campaignForm.campaignId,
      campaignForm.budget,
      parseInt(campaignForm.floorCpmMicros),
      () => {
        registerCampaign(campaignForm.advertiserId, campaignForm.campaignId, campaignForm.budget, parseInt(campaignForm.floorCpmMicros));
        setShowCampaignModal(false);
        setCampaignForm({ advertiserId: '', campaignId: '', budget: '', floorCpmMicros: '1000' });
      },
    );
  };

  const handleSubmitInstruction = () => {
    if (!aiForm.advertiserId || !aiForm.instruction) return;
    mutations.submitBrandInstruction(aiForm.advertiserId, aiForm.instruction, () => {
      submitBrandInstruction(aiForm.advertiserId, aiForm.instruction);
      setShowAiModal(false);
      setAiForm({ advertiserId: '', instruction: '' });
    });
  };

  const selectedAdvertiser = showDetailModal
    ? advertisers.find((a) => a.id === showDetailModal)
    : null;
  const advertiserCampaigns = selectedAdvertiser
    ? campaigns.filter((c) => c.advertiserId === selectedAdvertiser.brand)
    : [];
  const advertiserInstructions = selectedAdvertiser
    ? aiInstructions.filter((i) => i.advertiserId === selectedAdvertiser.brand)
    : [];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">Brand OS control</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Campaign health & AI directives</h1>
          <p className="mt-2 text-white/60">
            Each advertiser runs on its own microchain with budget pacing, BrandOS directives, and adaptive ad variants.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
          >
            + Register Advertiser
          </button>
          <button
            onClick={() => setShowFundModal(true)}
            className="rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-3 text-sm font-medium text-sky-300 transition hover:border-sky-500/50 hover:bg-sky-500/20"
          >
            Fund Campaign
          </button>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-3 text-sm font-medium text-indigo-300 transition hover:border-indigo-500/50 hover:bg-indigo-500/20"
          >
            Create Campaign
          </button>
          <button
            onClick={() => setShowAiModal(true)}
            className="rounded-2xl border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-medium text-purple-300 transition hover:border-purple-500/50 hover:bg-purple-500/20"
          >
            AI Instruction
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {advertisers.map((adv) => (
          <article key={adv.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">Advertiser</p>
                <p className="text-xl font-semibold text-white">{adv.brand}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{adv.aiStatus}</span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Campaigns</span>
                <span className="text-white">{adv.campaigns}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Budget Locked</span>
                <span className="text-emerald-300">{adv.budget}</span>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(adv.id)}
              className="mt-6 w-full rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white"
            >
              Inspect Brand OS
            </button>
          </article>
        ))}
      </div>

      {/* Register Advertiser Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Register New Advertiser</h2>
            <p className="mt-2 text-sm text-white/60">Create a new advertiser account with Brand OS</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Advertiser ID</label>
                <input
                  type="text"
                  value={registerForm.advertiserId}
                  onChange={(e) => setRegisterForm({ ...registerForm, advertiserId: e.target.value })}
                  placeholder="advertiser-123"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Brand Name</label>
                <input
                  type="text"
                  value={registerForm.brand}
                  onChange={(e) => setRegisterForm({ ...registerForm, brand: e.target.value })}
                  placeholder="MyBrand"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Floor CPM (micros)</label>
                <input
                  type="number"
                  value={registerForm.floorCpmMicros}
                  onChange={(e) => setRegisterForm({ ...registerForm, floorCpmMicros: e.target.value })}
                  placeholder="1000"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
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
                className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Campaign Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Fund Campaign</h2>
            <p className="mt-2 text-sm text-white/60">Add budget to an advertiser's campaign</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Advertiser ID</label>
                <select
                  value={fundForm.advertiserId}
                  onChange={(e) => setFundForm({ ...fundForm, advertiserId: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Select advertiser</option>
                  {advertisers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70">Amount ($ATTN)</label>
                <input
                  type="text"
                  value={fundForm.amount}
                  onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                  placeholder="1000"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowFundModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleFund}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Funding...' : 'Fund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Create Campaign</h2>
            <p className="mt-2 text-sm text-white/60">Launch a new advertising campaign</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Advertiser ID</label>
                <select
                  value={campaignForm.advertiserId}
                  onChange={(e) => setCampaignForm({ ...campaignForm, advertiserId: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Select advertiser</option>
                  {advertisers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70">Campaign ID</label>
                <input
                  type="text"
                  value={campaignForm.campaignId}
                  onChange={(e) => setCampaignForm({ ...campaignForm, campaignId: e.target.value })}
                  placeholder="campaign-123"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Budget ($ATTN)</label>
                <input
                  type="text"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                  placeholder="5000"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Floor CPM (micros)</label>
                <input
                  type="number"
                  value={campaignForm.floorCpmMicros}
                  onChange={(e) => setCampaignForm({ ...campaignForm, floorCpmMicros: e.target.value })}
                  placeholder="1000"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterCampaign}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Instruction Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Submit Brand OS Instruction</h2>
            <p className="mt-2 text-sm text-white/60">Send a directive to the AI Brand OS agent</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Advertiser ID</label>
                <select
                  value={aiForm.advertiserId}
                  onChange={(e) => setAiForm({ ...aiForm, advertiserId: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                >
                  <option value="">Select advertiser</option>
                  {advertisers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70">Instruction</label>
                <textarea
                  value={aiForm.instruction}
                  onChange={(e) => setAiForm({ ...aiForm, instruction: e.target.value })}
                  placeholder="Boost eco creatives for EU viewers"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAiModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInstruction}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advertiser Detail Modal */}
      {showDetailModal && selectedAdvertiser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{selectedAdvertiser.brand}</h2>
                <p className="mt-1 text-sm text-white/60">Brand OS Dashboard</p>
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
                <p className="text-xs text-white/50">Active Campaigns</p>
                <p className="mt-1 text-2xl font-semibold text-white">{selectedAdvertiser.campaigns}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Budget Locked</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">{selectedAdvertiser.budget}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">AI Status</p>
                <p className="mt-1 text-2xl font-semibold text-sky-300">{selectedAdvertiser.aiStatus}</p>
              </div>
            </div>
            {advertiserCampaigns.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">Campaigns</h3>
                <div className="mt-4 space-y-3">
                  {advertiserCampaigns.map((campaign) => (
                    <div key={campaign.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{campaign.id}</p>
                          <p className="text-sm text-white/60">{campaign.impressionsServed} impressions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/50">Budget</p>
                          <p className="text-emerald-300">{campaign.budgetRemaining}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {advertiserInstructions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">AI Instructions</h3>
                <div className="mt-4 space-y-3">
                  {advertiserInstructions.map((instruction) => (
                    <div key={instruction.id} className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                      <p className="text-sm text-white/70">#{instruction.id}</p>
                      <p className="mt-1 text-white">{instruction.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
