import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  accent?: 'emerald' | 'sky' | 'rose' | 'amber' | 'purple';
}

const accentColors = {
  emerald: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5',
  sky: 'text-sky-300 border-sky-500/20 bg-sky-500/5',
  rose: 'text-rose-300 border-rose-500/20 bg-rose-500/5',
  amber: 'text-amber-300 border-amber-500/20 bg-amber-500/5',
  purple: 'text-purple-300 border-purple-500/20 bg-purple-500/5',
};

export function MetricCard({ label, value, change, icon, accent = 'emerald' }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const accentClass = accentColors[accent];

  return (
    <div className={`rounded-2xl border ${accentClass} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {icon && <div className="text-white/20">{icon}</div>}
      </div>
    </div>
  );
}

