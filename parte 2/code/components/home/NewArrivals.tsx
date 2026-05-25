"use client";
import { useRef } from "react";
import { IconButton, ProductCard } from "@/components";
import { HOME_PRODUCTS } from "@/lib/sample-products";

/**
 * NewArrivals — carrusel horizontal con scroll-snap.
 *
 * - **Móvil**: gesto natural de swipe; las flechas se ocultan
 *   (las pueden usar gestos en pantalla; ocupar espacio visible es contraproducente).
 * - **Desktop**: flechas para controlar el scroll en pasos.
 */
export function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-8">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              Esta semana
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em]
                           text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              Recién <span className="bg-brand-grad bg-clip-text text-transparent">llegados</span>
            </h2>
          </div>
          {/* Arrows: desktop only — touch users swipe */}
          <div className="hidden sm:flex gap-2">
            <IconButton variant="secondary" icon="arr-left"  label="Anterior"  onClick={() => scroll(-1)} />
            <IconButton variant="secondary" icon="arr-right" label="Siguiente" onClick={() => scroll( 1)} />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        style={{
          paddingLeft:  "max(16px, calc((100vw - 1280px)/2 + 24px))",
          paddingRight: "max(16px, calc((100vw - 1280px)/2 + 24px))",
        }}
      >
        <div className="flex gap-4 sm:gap-5">
          {HOME_PRODUCTS.map((p) => (
            <div key={p.id} className="basis-[180px] sm:basis-[240px] md:basis-[260px] shrink-0 snap-start">
              <ProductCard variant="minimal" product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
