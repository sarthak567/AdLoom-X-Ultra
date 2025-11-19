import { useState, useCallback, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export interface LineraWalletState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useLineraWallet() {
  const [state, setState] = useState<LineraWalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    isLoading: false,
    error: null,
  });
  const toast = useToast();

  // Check if Linera wallet is available
  const isLineraAvailable = typeof window !== 'undefined' && 'linera' in window;

  // Load saved wallet state
  useEffect(() => {
    const saved = localStorage.getItem('linera-wallet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          isConnected: parsed.isConnected || false,
          address: parsed.address || null,
          chainId: parsed.chainId || null,
        }));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (isLineraAvailable && (window as any).linera) {
        // Real Linera wallet integration
        const accounts = await (window as any).linera.requestAccounts();
        const address = accounts[0];
        const chainId = await (window as any).linera.getChainId();

        const newState = {
          isConnected: true,
          address,
          chainId,
          balance: null,
          isLoading: false,
          error: null,
        };

        setState(newState);
        localStorage.setItem('linera-wallet', JSON.stringify(newState));
        toast.success('Linera wallet connected successfully');
      } else {
        // Fallback: Mock wallet for development
        const mockAddress = `0xAL${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
        const mockChainId = 'linera-testnet-conway';

        const newState = {
          isConnected: true,
          address: mockAddress,
          chainId: mockChainId,
          balance: '0',
          isLoading: false,
          error: null,
        };

        setState(newState);
        localStorage.setItem('linera-wallet', JSON.stringify(newState));
        toast.success('Wallet connected (mock mode)');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to connect wallet';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error,
      }));
      toast.error(`Wallet connection failed: ${error}`);
    }
  }, [isLineraAvailable, toast]);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      isLoading: false,
      error: null,
    });
    localStorage.removeItem('linera-wallet');
    toast.info('Wallet disconnected');
  }, [toast]);

  const refreshBalance = useCallback(async () => {
    if (!state.isConnected || !state.address) return;

    try {
      // In a real implementation, this would query the Linera chain
      // For now, we'll use a mock balance
      const mockBalance = (Math.random() * 1000).toFixed(4);
      setState((prev) => ({ ...prev, balance: mockBalance }));
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [state.isConnected, state.address]);

  // Auto-refresh balance every 30 seconds when connected
  useEffect(() => {
    if (state.isConnected) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [state.isConnected, refreshBalance]);

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance,
    isLineraAvailable,
  };
}

