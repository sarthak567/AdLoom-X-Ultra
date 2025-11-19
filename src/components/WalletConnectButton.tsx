import { Wallet } from 'lucide-react';
import { useLineraWallet } from '../hooks/useLineraWallet';

export function WalletConnectButton() {
  const { isConnected, address, connect, disconnect, isLoading, balance } = useLineraWallet();

  if (isConnected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        {balance && (
          <span className="text-xs text-white/60">{parseFloat(balance).toFixed(2)} $ATTN</span>
        )}
        <button
          onClick={disconnect}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white hover:text-white disabled:opacity-50"
        >
          <Wallet className="h-4 w-4" />
          {short}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:from-emerald-300 hover:to-sky-300 disabled:opacity-50"
    >
      <Wallet className="h-4 w-4" />
      {isLoading ? 'Connecting...' : 'Connect Linera'}
    </button>
  );
}
