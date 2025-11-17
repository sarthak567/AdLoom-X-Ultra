import { Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WalletConnectButton() {
  const { wallet, connectWallet, disconnectWallet } = useAuth();

  if (wallet) {
    const short = `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
    return (
      <button
        onClick={disconnectWallet}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white hover:text-white"
      >
        <Wallet className="h-4 w-4" />
        {short}
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-2 text-xs font-semibold text-slate-900"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </button>
  );
}
