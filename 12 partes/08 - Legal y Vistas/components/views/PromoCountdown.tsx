"use client";
import { useEffect, useMemo, useState } from "react";

export interface PromoCountdownProps {
  /** ISO date string — cuando el contador termina. */
  endsAt: string;
}

/**
 * PromoCountdown — días/horas/min/seg en pildoras semi-transparentes.
 * Pensado para usarse sobre fondos saturados (`<ViewPromo/>`).
 */
export function PromoCountdown({ endsAt }: PromoCountdownProps) {
  const target = useMemo(() => new Date(endsAt).getTime(), [endsAt]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000); diff %= 86_400_000;
  const h = Math.floor(diff / 3_600_000);  diff %= 3_600_000;
  const m = Math.floor(diff / 60_000);     diff %= 60_000;
  const s = Math.floor(diff / 1000);

  const cells: [string, string][] = [
    [String(d).padStart(2, "0"), "Días"],
    [String(h).padStart(2, "0"), "Horas"],
    [String(m).padStart(2, "0"), "Min"],
    [String(s).padStart(2, "0"), "Seg"],
  ];

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {cells.flatMap(([v, l], i) => {
        const cell = (
          <div key={`c-${l}`}
               className="min-w-[44px] sm:min-w-14 px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-md text-center text-white
                          bg-white/[0.18] backdrop-blur border border-white/25">
            <div className="font-display font-bold text-xl sm:text-[28px] leading-none tabular-nums tracking-[-0.02em]">{v}</div>
            <div className="mt-1 font-mono text-[10px] tracking-widest uppercase opacity-85">{l}</div>
          </div>
        );
        if (i === cells.length - 1) return [cell];
        return [
          cell,
          <span key={`s-${l}`} className="text-lg sm:text-2xl font-display font-bold opacity-50 text-white">:</span>,
        ];
      })}
    </div>
  );
}
