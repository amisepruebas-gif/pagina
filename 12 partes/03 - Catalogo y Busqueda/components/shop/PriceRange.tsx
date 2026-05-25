"use client";

interface PriceRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

/**
 * PriceRange — slider de rango dual.
 *
 * @example
 * <PriceRange min={0} max={3000} value={[100, 2000]} onChange={setRange} />
 */
export function PriceRange({ min, max, value, onChange, step = 50 }: PriceRangeProps) {
  const [lo, hi] = value;
  const set = (newLo: number, newHi: number) =>
    onChange([
      Math.min(newLo, newHi - step),
      Math.max(newHi, newLo + step),
    ]);
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <div className="pt-1.5">
      <div className="flex justify-between mb-3.5">
        <span className="px-3 py-1.5 rounded-sm bg-surface-2 text-[13px] font-semibold font-display">
          ${lo.toLocaleString("es-MX")}
        </span>
        <span className="px-3 py-1.5 rounded-sm bg-surface-2 text-[13px] font-semibold font-display">
          ${hi.toLocaleString("es-MX")}
        </span>
      </div>

      <div className="relative h-8 mb-1">
        <div className="absolute top-3.5 left-0 right-0 h-1 bg-surface-2 rounded-full" />
        <div
          className="absolute top-3.5 h-1 rounded-full bg-brand-grad"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={lo}
          onChange={(e) => set(Number(e.target.value), hi)}
          aria-label="Precio mínimo"
          className="price-range"
        />
        <input
          type="range" min={min} max={max} step={step} value={hi}
          onChange={(e) => set(lo, Number(e.target.value))}
          aria-label="Precio máximo"
          className="price-range"
        />
      </div>

      <style jsx>{`
        .price-range {
          position: absolute; top: 0; left: 0; width: 100%; height: 32px;
          -webkit-appearance: none; appearance: none;
          background: transparent; pointer-events: none;
        }
        .price-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 999px;
          background: #fff; border: 2px solid var(--brand-500);
          box-shadow: var(--sh-sm); cursor: pointer;
          pointer-events: auto; margin-top: -9px;
        }
        .price-range::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 999px;
          background: #fff; border: 2px solid var(--brand-500);
          box-shadow: var(--sh-sm); cursor: pointer; pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
