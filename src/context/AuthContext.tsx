import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    organization?: string;
  };
  wallet?: string;
};

type AuthContextValue = AuthState & {
  login: (user: AuthState['user']) => void;
  logout: () => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const STORAGE_KEY = 'adloom-auth';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadAuthState(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      return { isAuthenticated: false };
    }
  }
  return { isAuthenticated: false };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => loadAuthState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = (user: AuthState['user']) => {
    setAuth((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: user ?? prev.user ?? {
        name: 'AdLoom Builder',
        email: 'builder@adloom.xyz',
      },
    }));
  };

  const logout = () => {
    setAuth({ isAuthenticated: false });
  };

  const connectWallet = () => {
    const randomSuffix = Math.random().toString(16).slice(2, 8).toUpperCase();
    setAuth((prev) => ({
      ...prev,
      wallet: prev.wallet ?? `0xAL${randomSuffix}`,
    }));
  };

  const disconnectWallet = () => {
    setAuth((prev) => ({
      ...prev,
      wallet: undefined,
    }));
  };

  const value = useMemo(
    () => ({
      ...auth,
      login,
      logout,
      connectWallet,
      disconnectWallet,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

