import { useLocalAppData } from '../hooks/useLocalAppData';
import { Clock, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export function TransactionHistory({ limit = 10 }: { limit?: number }) {
  const { data } = useLocalAppData();
  const transactions = data.payments.transactions.slice(0, limit);

  const getIcon = (type: string) => {
    if (type.includes('Reward') || type.includes('Payout')) {
      return <ArrowDownRight className="h-4 w-4 text-emerald-400" />;
    }
    if (type.includes('Stake') || type.includes('Loan')) {
      return <ArrowUpRight className="h-4 w-4 text-sky-400" />;
    }
    return <Wallet className="h-4 w-4 text-white/40" />;
  };

  const getColor = (amount: string) => {
    return amount.startsWith('+') ? 'text-emerald-300' : 'text-rose-300';
  };

  return (
    <div className="space-y-2">
      {transactions.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50">No transactions yet</p>
        </div>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
              {getIcon(tx.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{tx.type}</p>
              <p className="text-xs text-white/50">{tx.counterparty}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${getColor(tx.amount)}`}>{tx.amount}</p>
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Clock className="h-3 w-3" />
                {tx.time}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

