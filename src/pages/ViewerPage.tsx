import { useState } from 'react';
import { useLocalAppData } from '../hooks/useLocalAppData';
import { useAdloomMutations } from '../hooks/useAdloomMutations';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { LoadingSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { useAdloomData } from '../hooks/useAdloomData';

export default function ViewerPage() {
  const {
    data: { viewers, viewerLoans },
    registerViewer,
    requestAfiLoan,
    repayAfiLoan,
  } = useLocalAppData();
  const mutations = useAdloomMutations();
  const { data: remoteData, loading: remoteLoading } = useAdloomData(10);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{ action: string; data: any } | null>(null);
  const [registerForm, setRegisterForm] = useState({ viewerId: '', handle: '' });
  const [loanForm, setLoanForm] = useState({ viewerId: '', amount: '' });

  const handleRegister = () => {
    if (!registerForm.viewerId || !registerForm.handle) return;
    const viewerId = registerForm.viewerId || `viewer-${Date.now()}`;
    mutations.registerViewer(viewerId, registerForm.handle, () => {
      registerViewer(viewerId, registerForm.handle);
      setShowRegisterModal(false);
      setRegisterForm({ viewerId: '', handle: '' });
    });
  };

  const handleRequestLoan = () => {
    if (!loanForm.viewerId || !loanForm.amount) return;
    mutations.requestAfiLoan(loanForm.viewerId, loanForm.amount, () => {
      requestAfiLoan(loanForm.viewerId, loanForm.amount);
      setShowLoanModal(false);
      setLoanForm({ viewerId: '', amount: '' });
    });
  };

  const handleRepayLoan = (viewerId: string, amount: string) => {
    setShowConfirmDialog({
      action: 'repay',
      data: { viewerId, amount },
    });
  };

  const confirmRepayLoan = () => {
    if (showConfirmDialog?.action === 'repay') {
      const { viewerId, amount } = showConfirmDialog.data;
      mutations.repayAfiLoan(viewerId, amount, () => {
        repayAfiLoan(viewerId, amount);
      });
    }
  };

  const selectedViewer = showDetailModal
    ? viewers.find((v) => v.handle === showDetailModal)
    : null;
  const viewerLoan = selectedViewer
    ? viewerLoans.find((l) => l.viewerId === selectedViewer.handle)
    : null;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">Viewer intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Attention earners & A-Fi readiness</h1>
          <p className="mt-2 text-white/60">
            Real-time snapshots of the most active viewers inside AdLoom. Tap any handle to inspect streaks, A-Fi limit, and rewards.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
          >
            + Register Viewer
          </button>
          <button
            onClick={() => setShowLoanModal(true)}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/20"
          >
            Request A-Fi Loan
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {remoteLoading && viewers.length === 0 ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          viewers.map((viewer) => (
          <article key={viewer.handle} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">Viewer</p>
                <p className="text-xl font-semibold text-white">{viewer.handle}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{viewer.streak}</span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Attention Score</span>
                <span className="text-white">{viewer.attentionScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total earnings</span>
                <span className="text-emerald-300">{viewer.earnings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>A-Fi limit</span>
                <span>{viewer.afiLimit}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowDetailModal(viewer.handle)}
                className="flex-1 rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  const amount = '10';
                  mutations.repayAfiLoan(viewer.handle, amount, () => {
                    repayAfiLoan(viewer.handle, amount);
                  });
                }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition hover:border-emerald-500/50"
              >
                Withdraw
              </button>
            </div>
          </article>
        ))
        )}
      </div>

      {/* Register Viewer Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Register New Viewer</h2>
            <p className="mt-2 text-sm text-white/60">Create a new viewer account on AdLoom</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Viewer ID</label>
                <input
                  type="text"
                  value={registerForm.viewerId}
                  onChange={(e) => setRegisterForm({ ...registerForm, viewerId: e.target.value })}
                  placeholder="viewer-123"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Handle</label>
                <input
                  type="text"
                  value={registerForm.handle}
                  onChange={(e) => setRegisterForm({ ...registerForm, handle: e.target.value })}
                  placeholder="@viewerhandle"
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
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Loan Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Request A-Fi Loan</h2>
            <p className="mt-2 text-sm text-white/60">Borrow against your future attention earnings</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70">Viewer ID</label>
                <input
                  type="text"
                  value={loanForm.viewerId}
                  onChange={(e) => setLoanForm({ ...loanForm, viewerId: e.target.value })}
                  placeholder="@viewerhandle"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70">Loan Amount ($ATTN)</label>
                <input
                  type="text"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                  placeholder="50"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLoanModal(false)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestLoan}
                disabled={mutations.loading}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {mutations.loading ? 'Processing...' : 'Request Loan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Detail Modal */}
      {showDetailModal && selectedViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">{selectedViewer.handle}</h2>
                <p className="mt-1 text-sm text-white/60">Viewer Profile & Analytics</p>
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
                <p className="text-xs text-white/50">Attention Score</p>
                <p className="mt-1 text-2xl font-semibold text-white">{selectedViewer.attentionScore}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Total Earnings</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-300">{selectedViewer.earnings}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">A-Fi Credit Limit</p>
                <p className="mt-1 text-2xl font-semibold text-sky-300">{selectedViewer.afiLimit}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/50">Active Streak</p>
                <p className="mt-1 text-2xl font-semibold text-amber-300">{selectedViewer.streak}</p>
              </div>
            </div>
            {viewerLoan && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-lg font-semibold text-white">Active A-Fi Loan</h3>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Principal</p>
                    <p className="mt-1 text-white">{viewerLoan.principal}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Outstanding</p>
                    <p className="mt-1 text-white">{viewerLoan.outstanding}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Status</p>
                    <p className={`mt-1 ${viewerLoan.status === 'active' ? 'text-emerald-300' : 'text-white/70'}`}>
                      {viewerLoan.status}
                    </p>
                  </div>
                </div>
                {viewerLoan.status === 'active' && (
                  <button
                    onClick={() => handleRepayLoan(selectedViewer.handle, viewerLoan.outstanding)}
                    className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                  >
                    Repay Loan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          isOpen={!!showConfirmDialog}
          onClose={() => setShowConfirmDialog(null)}
          onConfirm={confirmRepayLoan}
          title="Repay A-Fi Loan"
          message={
            showConfirmDialog.action === 'repay' ? (
              <span>
                Are you sure you want to repay <strong>{showConfirmDialog.data.amount} $ATTN</strong> on this loan?
              </span>
            ) : (
              'Confirm this action?'
            )
          }
          confirmText="Repay"
          variant="default"
        />
      )}
    </div>
  );
}
