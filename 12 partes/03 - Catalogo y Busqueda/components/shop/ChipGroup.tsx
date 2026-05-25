"use client";
import { cn } from "@/lib/cn";

interface ChipGroupProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * ChipGroup — selección múltiple con chips. Tap target ≥ 44px.
 *
 * @example <ChipGroup options={["XS","S","M"]} value={sizes} onChange={setSizes} />
 */
export function ChipGroup({ options, value, onChange }: ChipGroupProps) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o} type="button" onClick={() => toggle(o)} aria-pressed={active}
            className={cn(
              "min-w-11 min-h-9 px-3 rounded-sm border-[1.5px]",
              "font-display font-semibold text-[13px]",
              "transition duration-fast ease-out cursor-pointer",
              active
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-border-strong bg-surface text-text hover:border-brand-300",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
