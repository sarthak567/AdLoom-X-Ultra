import { useLocalAppData } from '../hooks/useLocalAppData';

export default function CreatorPage() {
  const {
    data: { creators },
  } = useLocalAppData();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Creator command</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Vault analytics & AI optimization</h1>
        <p className="mt-2 text-white/60">
          Monitor vault performance, RPM, and AI protection for every creator microchain plugged into the marketplace.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {creators.map((creator) => (
          <article key={creator.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
            <button className="mt-6 w-full rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white">
              Review campaign fit
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

