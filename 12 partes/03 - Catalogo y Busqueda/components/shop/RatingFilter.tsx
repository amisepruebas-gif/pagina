"use client";
import { Stars } from "@/components";
import { cn } from "@/lib/cn";

interface RatingFilterProps {
  /** 0 = sin filtro */
  value: number;
  onChange: (next: number) => void;
}

/**
 * RatingFilter — "4★ y más", "3★ y más", "2★ y más". Tap target 44px.
 */
export function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {[4, 3, 2].map((n) => {
        const active = value === n;
        return (
          <button
            key={n} type="button" onClick={() => onChange(active ? 0 : n)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 min-h-11 rounded-sm",
              "transition duration-fast ease-out text-left cursor-pointer",
              active ? "bg-brand-50 text-brand-700" : "bg-transparent text-text hover:bg-surface-2",
            )}
          >
            <Stars value={n} showValue={false} size={15} />
            <span className="text-[13px] font-medium">y más</span>
          </button>
        );
      })}
    </div>
  );
}
