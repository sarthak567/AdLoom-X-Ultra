import { FormEvent, useState } from 'react';
import { useLocalAppData } from '../hooks/useLocalAppData';
import { TransactionHistory } from '../components/TransactionHistory';
import { MetricCard } from '../components/MetricCard';
import { useToast } from '../context/ToastContext';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

export default function PaymentsPage() {
  const {
    data: { payments },
    addPaymentEntry,
  } = useLocalAppData();
  const toast = useToast();
  const [amount, setAmount] = useState('100');
  const [counterparty, setCounterparty] = useState('Creator Vault');
  const [type, setType] = useState<'Payout' | 'Viewer Reward' | 'Loan Repay'>('Payout');

  const submitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry = {
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      type,
      amount: `${type === 'Viewer Reward' ? '-' : '+'}${amount} $ATTN`,
      counterparty,
      time: 'just now',
    };
    addPaymentEntry(entry);
    toast.success(`Transaction ${entry.id} recorded successfully`);
    setAmount('100');
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Treasury & payouts</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Manage settlements, loans, and vault flow</h1>
        <p className="mt-2 text-white/60">
          Every transaction settles via Linera microchains. Use the mock desk below to create deposits, rewards, or loan repayments.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard
          label="Treasury Balance"
          value={payments.balance}
          icon={<DollarSign className="h-8 w-8" />}
          accent="emerald"
        />
        <MetricCard
          label="Latest Transaction"
          value={payments.transactions[0]?.amount || '0 $ATTN'}
          icon={<TrendingUp className="h-8 w-8" />}
          accent="sky"
        />
        <MetricCard
          label="Next Payout"
          value={payments.nextPayout}
          icon={<Clock className="h-8 w-8" />}
          accent="amber"
        />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-wide text-white/50">Create manual transfer</p>
          <form className="mt-3 space-y-3 text-sm" onSubmit={submitPayment}>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof type)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <option value="Payout">Creator Payout</option>
              <option value="Viewer Reward">Viewer Reward</option>
              <option value="Loan Repay">A-Fi Loan Repay</option>
            </select>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              placeholder="Amount in ATTN"
            />
            <input
              value={counterparty}
              onChange={(event) => setCounterparty(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              placeholder="Counterparty"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 px-3 py-2 text-sm font-semibold text-slate-900"
            >
              Record transaction
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">Transaction History</h2>
        <TransactionHistory limit={20} />
      </section>
    </div>
  );
}

