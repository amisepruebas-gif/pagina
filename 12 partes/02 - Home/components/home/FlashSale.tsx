"use client";
import { useEffect, useRef, useState } from "react";
import { Icon, ProductCard } from "@/components";
import { FLASH_PRODUCTS } from "@/lib/sample-products";

function useCountdown(seedSeconds: number) {
  const target = useRef(Date.now() + seedSeconds * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  let diff = Math.max(0, target.current - now);
  const h = Math.floor(diff / 3_600_000); diff %= 3_600_000;
  const m = Math.floor(diff / 60_000);    diff %= 60_000;
  const s = Math.floor(diff / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")) as [string, string, string];
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-12 sm:min-w-16 px-2 py-2 sm:px-3.5 sm:py-3 rounded-md text-white text-center
                    bg-white/15 backdrop-blur border border-white/25">
      <div className="font-display font-bold text-xl sm:text-3xl tracking-tight leading-none tabular-nums">
        {value}
      </div>
      <div className="mt-1 sm:mt-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase opacity-85">
        {label}
      </div>
    </div>
  );
}

/**
 * FlashSale — banner de oferta relámpago con countdown + 4 tarjetas
 * en variante `discount`. El countdown se compacta en móvil.
 */
export function FlashSale() {
  const [h, m, s] = useCountdown(6 * 3600 + 42 * 60 + 18);
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl text-white
                        bg-[linear-gradient(120deg,#FF5C8A_0%,#ED3A6E_50%,#7C3AED_100%)]
                        p-6 sm:p-10">
          <span aria-hidden className="absolute -top-32 -left-20 size-[400px] rounded-full blur-[40px]"
                style={{ background: "rgba(255,210,63,0.35)" }} />

          <div className="relative flex flex-wrap justify-between items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                               bg-black/20 text-accent font-mono text-[11px] tracking-widest uppercase font-semibold">
                <Icon name="bolt" size={13} strokeWidth={2.4} /> Oferta relámpago
              </span>
              <h2 className="mt-3 sm:mt-4 font-display font-bold leading-[0.95] tracking-[-0.035em] text-white
                             text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
                Termina en…
              </h2>
            </div>
            <div className="flex gap-2 sm:gap-3 items-center">
              <CountdownUnit value={h} label="Horas" />
              <span className="text-xl sm:text-3xl font-display font-bold opacity-60">:</span>
              <CountdownUnit value={m} label="Min" />
              <span className="text-xl sm:text-3xl font-display font-bold opacity-60">:</span>
              <CountdownUnit value={s} label="Seg" />
            </div>
          </div>

          <div className="relative grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {FLASH_PRODUCTS.map((p) => (
              <ProductCard key={p.id} variant="discount" product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
