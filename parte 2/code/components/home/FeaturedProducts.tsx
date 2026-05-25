"use client";
import { useState } from "react";
import { Pill, ProductCard } from "@/components";
import { HOME_PRODUCTS } from "@/lib/sample-products";

const TABS = ["Todo", "Mujer", "Hombre", "Hogar"] as const;

/**
 * FeaturedProducts — grid con tabs. En móvil los tabs scrollean horizontalmente
 * si no caben, y el grid colapsa a 1–2 columnas.
 */
export function FeaturedProducts() {
  const [active, setActive] = useState<typeof TABS[number]>("Todo");
  const items = HOME_PRODUCTS.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 bg-surface-2">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-9">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              Editores · selección
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em]
                           text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              Productos <span className="bg-brand-grad bg-clip-text text-transparent">destacados</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-muted max-w-lg">
              Curada cada semana por nuestro equipo.
            </p>
          </div>
          {/* tabs scrollable on mobile */}
          <div className="flex gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <Pill key={t} active={t === active} onClick={() => setActive(t)} className="shrink-0">
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {items.map((p) => <ProductCard key={p.id} variant="canonical" product={p} />)}
        </div>
      </div>
    </section>
  );
}
