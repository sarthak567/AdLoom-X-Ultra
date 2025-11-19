export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-6 w-24" />
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-3">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
      <LoadingSkeleton className="mt-6 h-10 w-full rounded-2xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <LoadingSkeleton className="h-4 w-24 mb-2" />
      <LoadingSkeleton className="h-8 w-32" />
    </div>
  );
}

