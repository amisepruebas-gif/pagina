"use client";
import { Icon, Stars } from "@/components";
import type { RatingBucket } from "@/lib/sample-product";
import { cn } from "@/lib/cn";

interface RatingDistributionProps {
  avg: number;
  total: number;
  buckets: RatingBucket[];
  /** "all" | "5" | "4" | … */
  filter: string;
  onFilterChange: (next: string) => void;
}

/**
 * RatingDistribution — promedio + barras por estrella, clickeables como filtro.
 */
export function RatingDistribution({
  avg, total, buckets, filter, onFilterChange,
}: RatingDistributionProps) {
  return (
    <div className="grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-[auto_1fr]
                    p-5 sm:p-7 bg-surface border border-border rounded-xl mb-7">
      <div className="text-center">
        <div className="font-display font-bold text-[64px] leading-none tracking-[-0.04em]">
          {avg.toFixed(1)}
        </div>
        <div className="mt-2"><Stars value={avg} showValue={false} size={18} /></div>
        <div className="mt-2 text-[13px] text-text-soft">
          {total.toLocaleString("es-MX")} reseñas
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        {buckets.map((d) => {
          const active = filter === String(d.stars);
          return (
            <button
              key={d.stars} type="button"
              onClick={() => onFilterChange(active ? "all" : String(d.stars))}
              className={cn(
                "grid items-center gap-3 grid-cols-[60px_1fr_56px] px-2 py-1.5 rounded-sm border-0 text-left cursor-pointer",
                active ? "bg-brand-50" : "bg-transparent",
              )}>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                {d.stars} <Icon name="star-filled" size={13} strokeWidth={1.4} className="text-accent" />
              </span>
              <span className="block h-2 bg-surface-2 rounded-full overflow-hidden">
                <span
                  style={{ width: `${d.pct}%` }}
                  className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-accent"
                />
              </span>
              <span className="text-xs text-text-soft tabular-nums text-right">{d.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
