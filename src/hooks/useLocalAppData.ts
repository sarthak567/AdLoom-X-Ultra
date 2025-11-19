import { useEffect, useMemo, useState } from 'react';
import defaultAppData, { LocalAppData } from '../data/mockAppData';

const STORAGE_KEY = 'adloom-local-db';
type PaymentEntry = LocalAppData['payments']['transactions'][number];

function loadInitialState(): LocalAppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as LocalAppData;
    } catch {
      return structuredClone(defaultAppData);
    }
  }
  return structuredClone(defaultAppData);
}

export function useLocalAppData() {
  const [db, setDb] = useState<LocalAppData>(() => loadInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db]);

  const addPaymentEntry = (entry: PaymentEntry) => {
    setDb((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        transactions: [entry, ...prev.payments.transactions].slice(0, 25),
      },
    }));
  };

  const resetDatabase = () => {
    const snapshot = structuredClone(defaultAppData);
    setDb(snapshot);
  };

  // Viewer operations
  const registerViewer = (viewerId: string, handle: string) => {
    setDb((prev) => {
      const newViewer = {
        handle,
        attentionScore: 0,
        earnings: '0 $ATTN',
        afiLimit: '5 $ATTN',
        streak: '0 days',
      };
      return {
        ...prev,
        viewers: [...prev.viewers, newViewer],
      };
    });
  };

  const requestAfiLoan = (viewerId: string, amount: string) => {
    setDb((prev) => {
      const newLoan = {
        viewerId,
        principal: amount,
        outstanding: amount,
        status: 'active',
      };
      return {
        ...prev,
        viewerLoans: [...prev.viewerLoans, newLoan],
      };
    });
    addPaymentEntry({
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Loan Repay',
      amount: `+${amount} $ATTN`,
      counterparty: 'A-Fi Desk',
      time: 'just now',
    });
  };

  const repayAfiLoan = (viewerId: string, amount: string) => {
    setDb((prev) => ({
      ...prev,
      viewerLoans: prev.viewerLoans.map((loan) =>
        loan.viewerId === viewerId
          ? { ...loan, outstanding: '0 $ATTN', status: 'settled' }
          : loan,
      ),
    }));
    addPaymentEntry({
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Loan Repay',
      amount: `-${amount} $ATTN`,
      counterparty: 'A-Fi Desk',
      time: 'just now',
    });
  };

  // Creator operations
  const registerCreator = (creatorId: string, handle: string, category: string) => {
    setDb((prev) => {
      const newCreator = {
        id: creatorId,
        handle,
        category,
        rpm: '$0',
        vault: '0 $ATTN',
        aiMode: true,
      };
      return {
        ...prev,
        creators: [...prev.creators, newCreator],
      };
    });
  };

  const stakeVault = (creatorId: string, amount: string) => {
    setDb((prev) => ({
      ...prev,
      creators: prev.creators.map((creator) =>
        creator.id === creatorId
          ? { ...creator, vault: `${parseInt(creator.vault.replace(/[^0-9]/g, '')) + parseInt(amount.replace(/[^0-9]/g, ''))} $ATTN` }
          : creator,
      ),
      creatorVaults: prev.creatorVaults.some((v) => v.creatorId === creatorId)
        ? prev.creatorVaults.map((v) =>
            v.creatorId === creatorId
              ? { ...v, stakedAmount: `${parseInt(v.stakedAmount.replace(/[^0-9]/g, '')) + parseInt(amount.replace(/[^0-9]/g, ''))} $ATTN` }
              : v,
          )
        : [
            ...prev.creatorVaults,
            {
              creatorId,
              stakedAmount: amount,
              apyBps: 1200,
            },
          ],
    }));
    addPaymentEntry({
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Vault Stake',
      amount: `-${amount} $ATTN`,
      counterparty: 'Creator Vaults',
      time: 'just now',
    });
  };

  const harvestVault = (creatorId: string) => {
    setDb((prev) => {
      const vault = prev.creatorVaults.find((v) => v.creatorId === creatorId);
      if (!vault) return prev;
      const staked = parseInt(vault.stakedAmount.replace(/[^0-9]/g, ''));
      const yieldAmount = Math.floor((staked * vault.apyBps) / 10000 / 12); // Monthly yield
      return {
        ...prev,
        creators: prev.creators.map((creator) =>
          creator.id === creatorId
            ? { ...creator, vault: `${parseInt(creator.vault.replace(/[^0-9]/g, '')) + yieldAmount} $ATTN` }
            : creator,
        ),
      };
    });
    addPaymentEntry({
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Payout',
      amount: `+${Math.floor(Math.random() * 50) + 10} $ATTN`,
      counterparty: 'Creator Vault',
      time: 'just now',
    });
  };

  const toggleCreatorAiMode = (creatorId: string) => {
    setDb((prev) => ({
      ...prev,
      creators: prev.creators.map((creator) =>
        creator.id === creatorId ? { ...creator, aiMode: !creator.aiMode } : creator,
      ),
    }));
  };

  // Advertiser operations
  const registerAdvertiser = (advertiserId: string, brand: string, floorCpmMicros: number) => {
    setDb((prev) => {
      const newAdvertiser = {
        id: advertiserId,
        brand,
        campaigns: 0,
        budget: '0 $ATTN',
        aiStatus: 'Auto',
      };
      return {
        ...prev,
        advertisers: [...prev.advertisers, newAdvertiser],
      };
    });
  };

  const fundCampaign = (advertiserId: string, amount: string) => {
    setDb((prev) => ({
      ...prev,
      advertisers: prev.advertisers.map((adv) =>
        adv.id === advertiserId
          ? { ...adv, budget: `${parseInt(adv.budget.replace(/[^0-9]/g, '')) + parseInt(amount.replace(/[^0-9]/g, ''))} $ATTN` }
          : adv,
      ),
    }));
    addPaymentEntry({
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'Payout',
      amount: `+${amount} $ATTN`,
      counterparty: 'Campaign Fund',
      time: 'just now',
    });
  };

  const registerCampaign = (advertiserId: string, campaignId: string, budget: string, floorCpmMicros: number) => {
    setDb((prev) => {
      const newCampaign = {
        id: campaignId,
        advertiserId,
        budgetRemaining: budget,
        floorCpmMicros,
        impressionsServed: 0,
        variantCount: 1,
      };
      return {
        ...prev,
        campaigns: [...prev.campaigns, newCampaign],
        advertisers: prev.advertisers.map((adv) =>
          adv.id === advertiserId ? { ...adv, campaigns: adv.campaigns + 1 } : adv,
        ),
      };
    });
  };

  const submitBrandInstruction = (advertiserId: string, instruction: string) => {
    setDb((prev) => {
      const newInstruction = {
        id: prev.aiInstructions.length + 1,
        advertiserId,
        instruction,
      };
      return {
        ...prev,
        aiInstructions: [...prev.aiInstructions, newInstruction],
      };
    });
  };

  return useMemo(
    () => ({
      data: db,
      addPaymentEntry,
      resetDatabase,
      // Viewer operations
      registerViewer,
      requestAfiLoan,
      repayAfiLoan,
      // Creator operations
      registerCreator,
      stakeVault,
      harvestVault,
      toggleCreatorAiMode,
      // Advertiser operations
      registerAdvertiser,
      fundCampaign,
      registerCampaign,
      submitBrandInstruction,
    }),
    [db],
  );
}

