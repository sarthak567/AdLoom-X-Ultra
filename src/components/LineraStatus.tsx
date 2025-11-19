import { useAdloomData } from '../hooks/useAdloomData';
import { Wifi, WifiOff, Activity } from 'lucide-react';

export function LineraStatus() {
  const { endpoint, error, loading } = useAdloomData();

  if (!endpoint) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs">
        <WifiOff className="h-3 w-3 text-amber-400" />
        <span className="text-amber-300">Offline Mode</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs">
        <WifiOff className="h-3 w-3 text-rose-400" />
        <span className="text-rose-300">Disconnected</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs">
        <Activity className="h-3 w-3 animate-pulse text-sky-400" />
        <span className="text-sky-300">Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs">
      <Wifi className="h-3 w-3 text-emerald-400" />
      <span className="text-emerald-300">Linera Connected</span>
    </div>
  );
}

