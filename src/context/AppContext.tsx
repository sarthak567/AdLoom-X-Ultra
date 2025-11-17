import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, mockAppState } from '../data/mockData';
import { loadAppState, persistAppState } from '../lib/storage';

type LoginPayload = { name: string; email: string; role: 'viewer' | 'creator' | 'advertiser' | 'developer' };

interface AppContextValue {
  state: AppState;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  addNotification: (message: string) => void;
  addPayment: (payment: AppState['payments'][number]) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(mockAppState);

  useEffect(() => {
    setState(loadAppState());
  }, []);

  const updateState = (updater: (draft: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      persistAppState(next);
      return next;
    });
  };

  const login = (payload: LoginPayload) => {
    updateState((draft) => ({
      ...draft,
      session: {
        isAuthenticated: true,
        user: {
          ...draft.session.user,
          name: payload.name,
          role: payload.role,
          email: payload.email,
        },
      },
    }));
  };

  const logout = () => {
    updateState((draft) => ({
      ...draft,
      session: { ...draft.session, isAuthenticated: false },
    }));
  };

  const connectWallet = () => {
    const randomAddress = `0x${crypto.randomUUID().replace(/-/g, '').slice(0, 40)}`;
    updateState((draft) => ({
      ...draft,
      wallet: { ...draft.wallet, connected: true, address: randomAddress },
    }));
    addNotification(`Wallet connected: ${randomAddress.slice(0, 6)}...`);
  };

  const disconnectWallet = () => {
    updateState((draft) => ({
      ...draft,
      wallet: { ...draft.wallet, connected: false, address: '' },
    }));
  };

  const addNotification = (message: string) => {
    updateState((draft) => ({
      ...draft,
      notifications: [{ id: Date.now(), message, timestamp: 'Just now' }, ...draft.notifications].slice(0, 10),
    }));
  };

  const addPayment = (payment: AppState['payments'][number]) => {
    updateState((draft) => ({
      ...draft,
      payments: [payment, ...draft.payments].slice(0, 20),
    }));
  };

  return (
    <AppContext.Provider value={{ state, login, logout, connectWallet, disconnectWallet, addNotification, addPayment }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
};

