'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { Button, IconButton, ProductCard } from '@/components/ui';
import type { Product } from '@/types/product';
import type { BestSellersConfig } from '@/types/home-config';
import { toUiProduct, productHref } from '@/lib/ui-adapters';
import { safeHref } from '@/lib/safe-href';

/** BestSellers — carrusel horizontal con scroll-snap, mismo patrón que Recién llegados. */
export function BestSellers({
  config,
  products
}: {
  config: BestSellersConfig;
  products: Product[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-9">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {config.eyebrow}
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              {config.titlePre}
              <span className="bg-brand-grad bg-clip-text text-transparent">
                {config.titleAccent}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="hidden sm:flex gap-2">
              <IconButton
                variant="secondary"
                icon="arr-left"
                label="Anterior"
                onClick={() => scroll(-1)}
              />
              <IconButton
                variant="secondary"
                icon="arr-right"
                label="Siguiente"
                onClick={() => scroll(1)}
              />
            </div>
            <Link href={safeHref(config.cta.href)}>
              <Button variant="ghost" trailingIcon="arr-right">
                {config.cta.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        style={{
          paddingLeft: 'max(16px, calc((100vw - 1280px)/2 + 24px))',
          paddingRight: 'max(16px, calc((100vw - 1280px)/2 + 24px))'
        }}
      >
        <div className="flex gap-4 sm:gap-5">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={productHref(p)}
              className="basis-[200px] sm:basis-[260px] md:basis-[280px] shrink-0 snap-start block"
            >
              <ProductCard variant="canonical" product={toUiProduct(p, i)} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
