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

  return useMemo(
    () => ({
      data: db,
      addPaymentEntry,
      resetDatabase,
    }),
    [db],
  );
}

