import { FormEvent, useState } from 'react';
import { useLocalAppData } from '../hooks/useLocalAppData';

export default function PaymentsPage() {
  const {
    data: { payments },
    addPaymentEntry,
  } = useLocalAppData();
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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-wide text-white/50">Treasury balance</p>
          <p className="mt-2 text-3xl font-semibold text-white">{payments.balance}</p>
          <p className="mt-1 text-sm text-white/60">Next payout {payments.nextPayout}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-wide text-white/50">Latest transaction</p>
          <p className="mt-2 text-lg font-semibold text-white">{payments.transactions[0].amount}</p>
          <p className="text-sm text-white/60">{payments.transactions[0].type}</p>
          <p className="text-xs text-white/50">{payments.transactions[0].time}</p>
        </div>
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

      <section className="rounded-3xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-5 gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-wide text-white/40">
          <span>ID</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Counterparty</span>
          <span>Time</span>
        </div>
        <div className="divide-y divide-white/10 text-sm text-white/80">
          {payments.transactions.map((tx) => (
            <div key={tx.id} className="grid grid-cols-5 gap-3 px-4 py-3">
              <span>{tx.id}</span>
              <span>{tx.type}</span>
              <span className={tx.amount.startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}>{tx.amount}</span>
              <span>{tx.counterparty}</span>
              <span className="text-white/60">{tx.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

