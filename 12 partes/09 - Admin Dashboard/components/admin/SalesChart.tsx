"use client";
import { useMemo, useState } from "react";
import { Pill } from "@/components";

export interface SalesChartProps {
  /** Datos por día. Si se omite, genera datos de ejemplo. */
  data?: { day: number; value: number }[];
  days?: number;
}

/**
 * SalesChart — gráfica simple de barras (CSS only, sin libs).
 *
 * Tooltip via `title` nativo. Pills "30 días / 90 días / Año" sirven como
 * UI placeholder; en producción cambia el rango y vuelve a fetchear datos.
 */
export function SalesChart({ data, days = 30 }: SalesChartProps) {
  const [range, setRange] = useState<"30" | "90" | "year">("30");
  const bars = useMemo(() => {
    if (data) return data;
    return Array.from({ length: days }, (_, i) => {
      const base  = 60 + 20 * Math.sin(i / 4);
      const noise = (i * 37) % 30;
      return { day: i + 1, value: Math.max(20, Math.round(base + noise)) };
    });
  }, [data, days]);
  const max = Math.max(...bars.map((d) => d.value));
  const total = bars.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex justify-between items-end flex-wrap gap-3 mb-5">
        <div>
          <h3 className="font-display font-bold text-base">Ventas · últimos {days} días</h3>
          <p className="mt-1 text-xs text-text-soft">
            Total acumulado:{" "}
            <span className="font-display font-bold text-text">
              ${(total * 247).toLocaleString("es-MX")}
            </span>
          </p>
        </div>
        <div className="inline-flex gap-1.5">
          <Pill active={range === "30"}   onClick={() => setRange("30")}>30 días</Pill>
          <Pill active={range === "90"}   onClick={() => setRange("90")}>90 días</Pill>
          <Pill active={range === "year"} onClick={() => setRange("year")}>Año</Pill>
        </div>
      </div>

      <div
        style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)`, height: 200 }}
        className="grid gap-1 items-end"
      >
        {bars.map((d) => (
          <div key={d.day}
               style={{ height: `${(d.value / max) * 100}%` }}
               title={`Día ${d.day}: $${(d.value * 247).toLocaleString("es-MX")}`}
               className="bg-gradient-to-b from-brand-400 to-brand-500 rounded-t-[4px]
                          transition-transform duration-fast ease-out hover:brightness-110 hover:scale-y-[1.04]" />
        ))}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] text-text-soft">
        <span>Día 1</span>
        <span>Día {Math.round(bars.length / 2)}</span>
        <span>Día {bars.length}</span>
      </div>
    </div>
  );
}
