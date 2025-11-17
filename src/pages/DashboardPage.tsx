import { useMemo } from "react";
import { useAdloomData } from "../hooks/useAdloomData";
import { useLocalAppData } from "../hooks/useLocalAppData";

const primaryActions = [
  { label: "Launch Brand OS", variant: "primary" },
  { label: "Earn as Viewer", variant: "secondary" },
  { label: "Integrate SDK", variant: "ghost" },
];

const personaStories = [
  {
    emoji: "👀",
    title: "Viewer • Attention Earner",
    color: "from-emerald-500/20 to-lime-400/10",
    blurb:
      "Feels like watching YouTube, but every verified glance drops $ATTN into your wallet instantly.",
    experiences: [
      "+0.12 $ATTN pops up the moment an ad card finishes.",
      "“Attention Score” climbs when you stay genuine and consistent.",
      "Leaderboard nudges you to unlock premium boosts and better ad rates.",
      "Withdraw button settles to your wallet in seconds via microchain payout.",
    ],
  },
  {
    emoji: "🎥",
    title: "Creator • Instant Revenue Stream",
    color: "from-pink-500/20 to-orange-400/10",
    blurb:
      "Drop the SDK once and your dashboard turns into a living, breathing revenue cockpit.",
    experiences: [
      "Live earnings counter ticks every second someone sees an impression.",
      "Every payout shows who watched, which advertiser paid, and the shared split.",
      "AI Optimization mode blocks weak ads, elevates high bids, and protects your vibe.",
      "Stake surplus into Creator Vaults to compound while you sleep.",
    ],
  },
  {
    emoji: "🛒",
    title: "Advertiser • Brand OS in Auto-Pilot",
    color: "from-sky-500/20 to-indigo-500/10",
    blurb:
      "Upload assets, set intent, and let your autonomous BrandOS rewrite, rebid, and reallocate nonstop.",
    experiences: [
      "AI agent iterates copy, creative, and placement every 90 seconds.",
      "Heatmaps reveal the exact viewers, creators, and payouts behind every result.",
      "AdNFTs mint for top-performing creatives, giving provenance and bragging rights.",
      "Fraud checks, spend guards, and instant refunds happen on-chain with no gatekeepers.",
    ],
  },
  {
    emoji: "🧩",
    title: "Developer • Plug-and-Play Monetization",
    color: "from-yellow-400/20 to-rose-400/10",
    blurb:
      "Add the SDK to a site, extension, or game; your own microchain now meters traffic value in real time.",
    experiences: [
      "Revenue, impressions, and engagement stream as on-chain events you can query.",
      "Marketplace listing lets advertisers target your experience specifically.",
      "Shared rev split hits your wallet the second an ad fires inside your surface.",
      "Telemetry is private-by-default yet auditable by partners, so trust is built in.",
    ],
  },
];

const fallbackHeroMetrics = [
  {
    label: "Average viewer payout / session",
    value: "0.86 $ATTN",
    accent: "text-emerald-300",
  },
  { label: "Creator payout speed", value: "2.3s", accent: "text-sky-300" },
  {
    label: "AI optimizations / hour",
    value: "1,200+",
    accent: "text-rose-300",
  },
  { label: "Apps already integrated", value: "340+", accent: "text-amber-300" },
];

const brandOSPillars = [
  {
    title: "Autonomous Creative Lab",
    points: [
      "Auto-generates ad variants",
      "Personalizes per creator surface",
      "Mints AdNFT receipts",
    ],
  },
  {
    title: "Live Budget Brain",
    points: [
      "Bids per impression in sub-seconds",
      "Shifts funds to best-performing lanes",
      "Halts waste automatically",
    ],
  },
  {
    title: "Truthful Analytics",
    points: [
      "Every impression notarized on-chain",
      "Heatmaps show viewer, creator, spend",
      "Anti-fraud + refund guardrails",
    ],
  },
];

const attentionFinance = [
  {
    title: "Earn Attention Score",
    detail:
      "Consistency, authenticity, and diverse creators raise your score above 700.",
  },
  {
    title: "Unlock A-Fi Credit",
    detail:
      "Score auto-qualifies you for 5 / 10 / 25 $ATTN micro-loans instantly.",
  },
  {
    title: "Repay With Future Attention",
    detail: "Every new ad impression routes a slice to the loan until cleared.",
  },
];

const experienceTracks = [
  {
    title: "Viewer Wallet",
    bullets: [
      "Claim instantly verified $ATTN",
      "Stack streak multipliers",
      "Convert attention into micro-loans",
    ],
  },
  {
    title: "Creator Vaults",
    bullets: [
      "Accept or reject campaigns in real time",
      "Stake idle revenue for boosted reach",
      "Automated fraud scrubbing",
    ],
  },
  {
    title: "Advertiser Brand OS",
    bullets: [
      "Deploy AI co-pilot for bidding",
      "Segment by microchains not cookies",
      "Trace every micro-payment",
    ],
  },
];

const developerToolkit = [
  {
    title: "Linera SDK react-kit",
    description:
      "Pre-built hooks for wallet connect, GraphQL subscriptions, and microchain events.",
  },
  {
    title: "CLI recipes",
    description:
      "One-command scripts to mint demo wallets, seed viewers, and replay workloads.",
  },
  {
    title: "Telemetry APIs",
    description:
      "Webhooks for viewer attention streaks, advertiser pacing, and AI agent status.",
  },
];

const timelineMilestones = [
  {
    date: "Wave 2",
    title: "Attention Finance live on Testnet",
    detail:
      "Viewers collateralize verified watch history for instant micro-loans.",
  },
  {
    date: "Wave 3",
    title: "Creator Vaults launch",
    detail:
      "Programmable revenue splits, AI brand filters, vault staking, and premium drops.",
  },
  {
    date: "ETH Denver",
    title: "Brand OS beta",
    detail:
      "Autonomous marketing agents escalate budgets cross-microchain with full auditability.",
  },
];

const supportChannels = [
  { label: "Discord", detail: "WaveHack builder lounge for live support." },
  {
    label: "Docs",
    detail: "Linera microchain quick-start, GraphQL schema, SDK recipes.",
  },
  {
    label: "Mentorship",
    detail: "Weekly office hours with Linera core + AdLoom product team.",
  },
];

const fallbackEventsTable = [
  {
    viewerId: "@fluxseer",
    creatorId: "PrimeLabs",
    advertiserId: "PulseDrip",
    attnUnits: 6,
    reward: "18.0 $ATTN",
    latency: "2.3s",
  },
  {
    viewerId: "@zenwatcher",
    creatorId: "NovaPod",
    advertiserId: "EcoModa",
    attnUnits: 4,
    reward: "11.2 $ATTN",
    latency: "2.0s",
  },
  {
    viewerId: "@signalchaser",
    creatorId: "SynthForge",
    advertiserId: "HyperDrop",
    attnUnits: 5,
    reward: "15.5 $ATTN",
    latency: "1.8s",
  },
];

const fallbackCampaigns = [
  {
    id: "camp-alpha",
    advertiserId: "FluxThreads",
    budgetRemaining: "820 $ATTN",
    floorCpmMicros: 1400,
    impressionsServed: 2400,
    variantCount: 4,
  },
  {
    id: "camp-beta",
    advertiserId: "PulseDrip",
    budgetRemaining: "640 $ATTN",
    floorCpmMicros: 1650,
    impressionsServed: 1800,
    variantCount: 3,
  },
];

const fallbackVaults = [
  { creatorId: "PrimeLabs", stakedAmount: "1,200 $ATTN", apyBps: 1200 },
  { creatorId: "NovaPod", stakedAmount: "950 $ATTN", apyBps: 1050 },
];

const fallbackLoans = [
  {
    viewerId: "@focusmode",
    principal: "80 $ATTN",
    outstanding: "45 $ATTN",
    status: "active",
  },
  {
    viewerId: "@zenwatcher",
    principal: "50 $ATTN",
    outstanding: "0 $ATTN",
    status: "settled",
  },
];

const fallbackInstructions = [
  {
    id: 1,
    advertiserId: "FluxThreads",
    instruction: "Boost eco creatives for EU viewers",
  },
  {
    id: 2,
    advertiserId: "PulseDrip",
    instruction: "Shift 20% budget to creator vault tier S",
  },
];

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const formatCompactNumber = (value: number | string) => {
  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numeric) ? numberFormatter.format(numeric) : value;
};

const formatTokenValue = (value: number | string, suffix = "$ATTN") => {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isFinite(numeric)) {
    return `${numberFormatter.format(numeric)} ${suffix}`;
  }
  return `${value} ${suffix}`;
};

export default function DashboardPage() {
  const {
    data: pulse,
    error: pulseError,
    loading: pulseLoading,
    endpoint,
  } = useAdloomData();
  const { data: localDb } = useLocalAppData();
  const localVaults = localDb.creatorVaults;
  const localLoans = localDb.viewerLoans;
  const localCampaigns = localDb.campaigns;
  const localInstructions = localDb.aiInstructions;

  const heroMetrics = useMemo(() => {
    if (!pulse) return fallbackHeroMetrics;
    return [
      {
        label: "Active attention earners",
        value: formatCompactNumber(pulse.global.viewers),
        accent: "text-emerald-300",
      },
      {
        label: "Creator studios live",
        value: formatCompactNumber(pulse.global.creators),
        accent: "text-sky-300",
      },
      {
        label: "Advertiser TVL",
        value: formatTokenValue(pulse.global.advertiserValueLocked),
        accent: "text-rose-300",
      },
      {
        label: "Protocol treasury",
        value: formatTokenValue(pulse.global.protocolTreasury),
        accent: "text-amber-300",
      },
    ];
  }, [pulse]);

  const leaderboardEntries = useMemo(() => {
    if (pulse?.leaderboard?.length) {
      return pulse.leaderboard.map((entry) => ({
        name: entry.handle,
        earnings: `+${formatTokenValue(entry.totalEarned)}`,
      }));
    }
    return [
      { name: "@focusmode", earnings: "+12.4 $ATTN" },
      { name: "@zenwatcher", earnings: "+10.1 $ATTN" },
      { name: "@signalchaser", earnings: "+9.8 $ATTN" },
    ];
  }, [pulse]);

  const realtimeMoments = useMemo(() => {
    if (pulse?.events?.length) {
      return pulse.events.slice(0, 4).map((event) => {
        const reward = formatTokenValue(event.reward);
        return `Viewer ${event.viewerId} fueled ${event.creatorId} via ${event.advertiserId} · ${reward}`;
      });
    }
    return [
      "Viewer finishes a 15s interactive spot → +0.20 $ATTN hits wallet instantly.",
      "Creator dashboard pings: “AdLoom Labs boosted eco-fashion CPM +18% for your audience.”",
      "BrandOS swaps in a bold headline after detecting higher engagement on Gen Z segments.",
      "Developer microchain logs 1,400 impressions from a mini-game surge in Brazil.",
    ];
  }, [pulse]);

  const liveEventsTable = useMemo(() => {
    if (pulse?.events?.length) {
      return pulse.events.slice(0, 5).map((event) => ({
        viewerId: event.viewerId,
        creatorId: event.creatorId,
        advertiserId: event.advertiserId,
        attnUnits: event.attnUnits,
        reward: formatTokenValue(event.reward),
        latency: "1.9s",
      }));
    }
    return fallbackEventsTable;
  }, [pulse]);

  const globalPulseStats = useMemo(() => {
    if (!pulse) {
      return [
        { label: "Real-time attention streamed", value: "8.4M impressions" },
        { label: "Outstanding A-Fi credit", value: "52K $ATTN" },
        { label: "Average settlement latency", value: "2.1s finality" },
      ];
    }
    return [
      {
        label: "Total impressions",
        value: formatCompactNumber(pulse.global.totalImpressions),
      },
      {
        label: "Outstanding A-Fi credit",
        value: formatTokenValue(pulse.global.outstandingCredit),
      },
      { label: "Settlement latency", value: "2.0s (Linera microchain)" },
    ];
  }, [pulse]);

  const campaignBoard = useMemo(() => {
    if (localCampaigns?.length) {
      return localCampaigns;
    }
    return fallbackCampaigns;
  }, [localCampaigns]);

  const vaultRows = useMemo(() => {
    if (localVaults) {
      return localVaults;
    }
    return fallbackVaults;
  }, [localVaults]);

  const loanRows = useMemo(() => {
    if (localLoans) {
      return localLoans;
    }
    return fallbackLoans;
  }, [localLoans]);

  const aiInstructionFeed = useMemo(() => {
    if (localInstructions?.length) {
      return localInstructions;
    }
    return fallbackInstructions;
  }, [localInstructions]);

  const liveStatus = endpoint
    ? pulseError
      ? `Telemetry error · ${pulseError}`
      : pulseLoading
      ? "Syncing with Linera microchain…"
      : "Live Linera microchain feed active"
    : null;

  return (
    <div className="flex flex-col gap-20">
      <section className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
          Built on Linera microchains · Feels Web2 fast · Pays Web3 fair
        </p>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl">
          AdLoom X Ultra
          <span className="block text-transparent bg-gradient-to-r from-emerald-300 via-sky-300 to-rose-300 bg-clip-text">
            Real-time attention economy from every user’s seat
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-white/70">
          Imagine YouTube, TikTok, Google Ads, AdSense, DeFi, and AI agents
          fused into one living interface. Every view, creation, bid, and
          integration pays out instantly. That is AdLoom X Ultra — the first
          platform where attention, creativity, and ad budgets operate in sync
          on-chain.
        </p>
        {liveStatus && (
          <p className="mx-auto mt-4 max-w-3xl text-xs text-white/60">
            {liveStatus}
            {endpoint ? ` · ${endpoint}` : ""}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryActions.map((action) => (
            <button
              key={action.label}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                action.variant === "primary"
                  ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950"
                  : action.variant === "secondary"
                  ? "border border-white/30 text-white/80 hover:text-white"
                  : "border border-transparent text-white/60 hover:text-white/90"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {heroMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
            >
              <p className={`text-3xl font-semibold ${metric.accent}`}>
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-white/60">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="story" className="grid gap-6">
        <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
          Four simultaneous POVs — one unified attention flywheel
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {personaStories.map((persona) => (
            <article
              key={persona.title}
              className={`rounded-3xl border border-white/10 bg-gradient-to-br ${persona.color} p-6 backdrop-blur`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{persona.emoji}</span>
                <div>
                  <p className="text-white/70 text-sm uppercase tracking-wide">
                    User POV
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {persona.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-white/80">{persona.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {persona.experiences.map((experience) => (
                  <li key={experience} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{experience}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="grid gap-8 md:grid-cols-3">
          {experienceTracks.map((track) => (
            <article
              key={track.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-black/40 p-6"
            >
              <div className="text-xs uppercase tracking-wide text-white/60">
                {track.title}
              </div>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                {track.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-sky-300" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-300">
              Viewer Journey
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              “I watch, I earn, instantly.”
            </h2>
            <p className="mt-4 text-white/70">
              Ads feel native — mini cards, swipeable spots, micro games — never
              intrusive. Each verified interaction lights up your wallet feed
              with sub-second microchain receipts.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Your Attention Earnings</span>
                <span>Monthly +42%</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "Eco Futures · +0.20 $ATTN",
                  "Indie Game Drop · +0.09 $ATTN",
                  "Creator Boost · +0.12 $ATTN",
                ].map((entry) => (
                  <div
                    key={entry}
                    className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80"
                  >
                    {entry}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-white/50">
                    Attention Score
                  </p>
                  <p className="text-2xl font-semibold text-emerald-300">
                    742 Prime
                  </p>
                </div>
                <button className="rounded-full bg-emerald-500/80 px-4 py-2 text-sm font-medium text-slate-950">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <p className="text-sm uppercase tracking-wide text-sky-300">
                Leaderboard snapshot
              </p>
              <div className="mt-4 space-y-4 text-sm text-white/70">
                {leaderboardEntries.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between"
                  >
                    <span>{user.name}</span>
                    <span className="text-emerald-300">{user.earnings}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-sky-500/10 p-6">
              <p className="text-sm uppercase tracking-wide text-white/70">
                Attention Score unlocks
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li>700+ · Bonus tokens + better ad rates</li>
                <li>760+ · Premium ad lanes + ambassador drops</li>
                <li>800+ · Instant A-Fi credit & VIP campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="live"
        className="grid gap-8 rounded-3xl border border-white/10 bg-black/40 p-8 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <p aclassName="text-sm uppercase tracking-wide text-rose-300">
            Live Telemetry
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Attention engine dashboard
          </h2>
          <p className="mt-3 text-white/70">
            Every card below is live data from the Linera service. Swap
            endpoints, replay attention flows, and watch the AI agent pivot
            budgets in milliseconds.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            {globalPulseStats.map((stat) => (
              <li
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="text-white/60">{stat.label}</span>
                <span className="font-semibold text-white">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 text-sm text-white/60">
            <span>Latest attention receipts</span>
            <span>{pulse ? "Streaming" : "Demo feed"}</span>
          </div>
          <div className="divide-y divide-white/5 px-4 text-xs text-white/70">
            <div className="grid grid-cols-5 gap-3 px-2 py-3 text-[0.65rem] uppercase tracking-wide text-white/40">
              <span>Viewer</span>
              <span>Creator</span>
              <span>Advertiser</span>
              <span>Units</span>
              <span>Reward</span>
            </div>
            {liveEventsTable.map((event) => (
              <div
                key={`${event.viewerId}-${event.creatorId}-${event.advertiserId}`}
                className="grid grid-cols-5 gap-3 px-2 py-3 text-sm"
              >
                <span>{event.viewerId}</span>
                <span>{event.creatorId}</span>
                <span>{event.advertiserId}</span>
                <span>{event.attnUnits}</span>
                <span className="text-emerald-300">{event.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="brand-os">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/50 to-black/50 p-8 md:p-12">
          <div className="md:flex md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-wide text-rose-300">
                Advertiser Operating System
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                BrandOS runs campaigns in real time
              </h2>
              <p className="mt-4 text-white/70">
                Toggle “AI Mode” and your agent handles creatives, bidding,
                allocations, verifications, and even refunds. You watch the
                operating system evolve ads every 1–3 minutes based on what
                users respond to.
              </p>
            </div>
            <button className="mt-6 w-full rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 md:mt-0 md:w-auto">
              Launch AI Agent
            </button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {brandOSPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-black/30 p-6"
              >
                <p className="text-sm uppercase tracking-wide text-white/60">
                  {pillar.title}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-white/50">▹</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            {realtimeMoments.map((moment) => (
              <div
                key={moment}
                className="border-b border-white/5 py-3 last:border-b-0"
              >
                {moment}
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Adaptive campaigns</span>
                <span>{pulse ? "Live microchains" : "Demo dataset"}</span>
              </div>
              <div className="mt-4 space-y-4 text-sm text-white/80">
                {campaignBoard.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="flex items-center justify-between text-white/60">
                      <span>{campaign.id}</span>
                      <span>{campaign.variantCount} variants</span>
                    </div>
                    <p className="mt-2 text-white text-lg font-semibold">
                      {campaign.advertiserId}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                      <span>Budget</span>
                      <span className="text-emerald-300">
                        {campaign.budgetRemaining}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                      <span>Floor CPM</span>
                      <span>{campaign.floorCpmMicros} µ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>AI directives</span>
                <span>{pulse ? "Streaming" : "Sample backlog"}</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-white/80">
                {aiInstructionFeed.map((instruction) => (
                  <div
                    key={instruction.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="text-xs uppercase tracking-wide text-white/50">
                      {instruction.advertiserId}
                    </div>
                    <p className="mt-2 text-white">{instruction.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="creators" className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="text-sm uppercase tracking-wide text-amber-300">
            Developer POV
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            “I integrate once, revenue streams forever.”
          </h2>
          <p className="mt-4 text-white/70">
            Whether it’s a game, browser extension, or social experiment,
            AdLoom’s SDK wraps your UX with transparent monetization. The
            microchain logs every impression, giving you verifiable data and
            instant payouts.
          </p>
          <div className="mt-6 space-y-4 text-sm text-white/80">
            {[
              "SDK install · 4 lines of code",
              "Revenue share auto-splits with creators + viewers",
              "Marketplace lets advertisers choose your app",
              "Telemetry stays private yet auditable",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <span className="text-white/50">◎</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-rose-500/10 p-6 md:p-8">
          <p className="text-sm uppercase tracking-wide text-emerald-200">
            Attention Finance (A-Fi)
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Turn loyalty into credit
          </h2>
          <p className="mt-4 text-white/70">
            Power users unlock micro-loans purely from their Attention Score. No
            bank. No paperwork. Just provable on-chain history of genuine
            engagement.
          </p>
          <div className="mt-6 space-y-4">
            {attentionFinance.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="text-sm text-white/60">Step {index + 1}</p>
                <p className="text-lg font-semibold text-white">{step.title}</p>
                <p className="mt-2 text-sm text-white/70">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/50">
              Creator vaults
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Stake revenue, amplify reach
            </h3>
            <div className="mt-4 space-y-3">
              {vaultRows.map((vault) => (
                <div
                  key={vault.creatorId}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{vault.creatorId}</span>
                    <span>{vault.apyBps / 100}% APY</span>
                  </div>
                  <p className="mt-2 text-white text-lg font-semibold">
                    {vault.stakedAmount}
                  </p>
                  <p className="text-xs text-white/50">
                    Auto-compounding vault managed by Linera microchain timers.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-white/50">
              A-Fi loan desk
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Attention-backed credit lines
            </h3>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/40 text-sm text-white/80">
              <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs uppercase tracking-wide text-white/40">
                <span>Viewer</span>
                <span>Principal</span>
                <span>Outstanding</span>
                <span>Status</span>
              </div>
              {loanRows.map((loan) => (
                <div
                  key={loan.viewerId}
                  className="grid grid-cols-4 gap-2 px-4 py-3"
                >
                  <span>{loan.viewerId}</span>
                  <span className="text-white">{loan.principal}</span>
                  <span className="text-emerald-300">{loan.outstanding}</span>
                  <span className="text-white/60">{loan.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="developers"
        className="rounded-3xl border border-white/10 bg-white/5 p-8"
      >
        <div className="md:flex md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-wide text-sky-300">
              Developer toolkit
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Build fully on-chain experiences without the drag
            </h2>
            <p className="mt-4 text-white/70">
              Use the Linera SDK, GraphQL subscriptions, and our React hooks to
              mirror microchain state across desktop, mobile, and ambient
              installations.
            </p>
          </div>
          <button className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white md:mt-0">
            Open Docs ↗
          </button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {developerToolkit.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-white/70">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8">
        <p className="text-sm uppercase tracking-wide text-white/60">
          Live timeline
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">
          Road to ETH Denver demo day
        </h2>
        <div className="mt-8 space-y-6">
          {timelineMilestones.map((milestone) => (
            <div
              key={milestone.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-xs uppercase tracking-wide text-white/40">
                {milestone.date}
              </div>
              <p className="mt-1 text-xl font-semibold text-white">
                {milestone.title}
              </p>
              <p className="mt-2 text-white/70">{milestone.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 text-center">
        <p className="text-sm uppercase tracking-wide text-white/60">
          What it feels like overall
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white">
          A Web3 super-app that feels alive
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-white/70">
          Earnings, leaderboards, AI tweaks, and wallet payouts refresh the
          moment they happen. That&apos;s the magic of Linera microchains: Web2
          speed, Web3 fairness, zero middlemen. You watch → you earn. You create
          → you earn. You advertise → your AI agent works for you. Everything
          updates instantly, transparently, and fairly on-chain.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-wide text-white/50">
          {[
            "YouTube energy",
            "TikTok engagement",
            "Google Ads precision",
            "DeFi liquidity",
            "AI autonomy",
            "On-chain trust",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-4 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="rounded-full bg-gradient-to-r from-rose-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-950">
            Join WaveHack Submission →
          </button>
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white hover:text-white">
            Download Pitch Deck
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {supportChannels.map((channel) => (
          <div
            key={channel.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <p className="text-sm uppercase tracking-wide text-white/50">
              {channel.label}
            </p>
            <p className="mt-2 text-white/80">{channel.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
