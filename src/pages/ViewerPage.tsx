import { useLocalAppData } from '../hooks/useLocalAppData';

export default function ViewerPage() {
  const {
    data: { viewers },
  } = useLocalAppData();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Viewer intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Attention earners & A-Fi readiness</h1>
        <p className="mt-2 text-white/60">
          Real-time snapshots of the most active viewers inside AdLoom. Tap any handle to inspect streaks, A-Fi limit, and rewards.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {viewers.map((viewer) => (
          <article key={viewer.handle} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
            <button className="mt-6 w-full rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white">
              Open viewer dossier
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

