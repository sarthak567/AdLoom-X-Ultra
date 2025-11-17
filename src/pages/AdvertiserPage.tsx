import { useLocalAppData } from '../hooks/useLocalAppData';

export default function AdvertiserPage() {
  const {
    data: { advertisers },
  } = useLocalAppData();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Brand OS control</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Campaign health & AI directives</h1>
        <p className="mt-2 text-white/60">
          Each advertiser runs on its own microchain with budget pacing, BrandOS directives, and adaptive ad variants.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {advertisers.map((adv) => (
          <article key={adv.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
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
            <button className="mt-6 w-full rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white">
              Inspect Brand OS
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

