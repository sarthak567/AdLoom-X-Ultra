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
      viewerId
      creatorId
      advertiserId
      attnUnits
      reward
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
  viewerId: string;
  creatorId: string;
  advertiserId: string;
  attnUnits: number;
  reward: string;
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

