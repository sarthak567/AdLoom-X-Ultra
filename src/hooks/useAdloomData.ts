import { useEffect, useMemo, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const DASHBOARD_QUERY = gql`
  query AdloomPulse($limit: Int!) {
    global {
      viewers
      creators
      advertisers
      protocolTreasury
      advertiserValueLocked
      totalImpressions
      outstandingCredit
    }
    leaderboard(limit: $limit) {
      id
      handle
      attentionScore
      totalEarned
      lifetimeImpressions
      outstandingCredit
      creditLimit
    }
    events(limit: $limit) {
      id
      campaignId
      viewerId
      creatorId
      advertiserId
      attnUnits
      reward
    }
    campaigns(limit: $limit) {
      id
      advertiserId
      budgetRemaining
      floorCpmMicros
      impressionsServed
      variantCount
    }
    creatorVaults {
      creatorId
      stakedAmount
      apyBps
    }
    viewerLoans {
      viewerId
      principal
      outstanding
      status
    }
    aiInstructions(limit: $limit) {
      id
      advertiserId
      instruction
    }
  }
`;

export interface LeaderboardEntry {
  id: string;
  handle: string;
  attentionScore: number;
  totalEarned: string;
  lifetimeImpressions: number;
  outstandingCredit: string;
  creditLimit: string;
}

export interface AttentionEventRow {
  id: number;
  campaignId?: string | null;
  viewerId: string;
  creatorId: string;
  advertiserId: string;
  attnUnits: number;
  reward: string;
}

export interface CampaignRow {
  id: string;
  advertiserId: string;
  budgetRemaining: string;
  floorCpmMicros: number;
  impressionsServed: number;
  variantCount: number;
}

export interface CreatorVaultRow {
  creatorId: string;
  stakedAmount: string;
  apyBps: number;
}

export interface ViewerLoanRow {
  viewerId: string;
  principal: string;
  outstanding: string;
  status: string;
}

export interface BrandInstructionRow {
  id: number;
  advertiserId: string;
  instruction: string;
}

export interface RemotePulse {
  global: {
    viewers: number;
    creators: number;
    advertisers: number;
    protocolTreasury: string;
    advertiserValueLocked: string;
    totalImpressions: number;
    outstandingCredit: string;
  };
  leaderboard: LeaderboardEntry[];
  events: AttentionEventRow[];
  campaigns: CampaignRow[];
  creatorVaults: CreatorVaultRow[];
  viewerLoans: ViewerLoanRow[];
  aiInstructions: BrandInstructionRow[];
}

interface HookState {
  data: RemotePulse | null;
  error: string | null;
  loading: boolean;
  endpoint?: string;
}

export function useAdloomData(limit = 6): HookState {
  const endpoint = useMemo(
    () => import.meta.env.VITE_LINERA_GRAPHQL_URL?.trim(),
    [],
  );
  const [data, setData] = useState<RemotePulse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    let cancelled = false;
    const client = new GraphQLClient(endpoint, {
      fetch,
    });

    async function run() {
      try {
        const payload = await client.request<RemotePulse>(DASHBOARD_QUERY, {
          limit,
        });
        if (!cancelled) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Unable to reach Linera service',
          );
        }
      }
    }
    run();

    const interval = setInterval(run, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [endpoint, limit]);

  return {
    data,
    error: endpoint ? error : null,
    loading: !!endpoint && !data && !error,
    endpoint,
  };
}

