'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, IconButton, ProductCard } from '@/components/ui';
import type { Product } from '@/types/product';
import type { FlashSaleConfig } from '@/types/home-config';
import { toUiProduct, productHref } from '@/lib/ui-adapters';

function useCountdown(seedSeconds: number) {
  const target = useRef(Date.now() + seedSeconds * 1000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  let diff = Math.max(0, target.current - now);
  const h = Math.floor(diff / 3_600_000);
  diff %= 3_600_000;
  const m = Math.floor(diff / 60_000);
  diff %= 60_000;
  const s = Math.floor(diff / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')) as [
    string,
    string,
    string
  ];
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-12 sm:min-w-16 px-2 py-2 sm:px-3.5 sm:py-3 rounded-md text-white text-center bg-white/15 backdrop-blur border border-white/25">
      <div className="font-display font-bold text-xl sm:text-3xl tracking-tight leading-none tabular-nums">
        {value}
      </div>
      <div className="mt-1 sm:mt-1.5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase opacity-85">
        {label}
      </div>
    </div>
  );
}

/** FlashSale — banner de oferta con countdown + tarjetas en oferta. */
export function FlashSale({
  config,
  products
}: {
  config: FlashSaleConfig;
  products: Product[];
}) {
  const [h, m, s] = useCountdown(
    config.countdownHours * 3600 +
      config.countdownMinutes * 60 +
      config.countdownSeconds
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  if (products.length === 0) return null;

  const hasBg = !!config.bgImageUrl;
  const coverBg =
    config.coverType === 'gradient'
      ? `linear-gradient(120deg, ${config.coverFrom}, ${config.coverTo})`
      : config.coverFrom;
  const coverAlpha =
    Math.min(100, Math.max(0, config.coverOpacity)) / 100;
  const imageAlpha =
    Math.min(100, Math.max(0, config.bgImageOpacity)) / 100;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-white p-6 sm:p-10"
          style={hasBg ? { backgroundColor: '#FFFFFF' } : undefined}
        >
          {hasBg && (
            <Image
              src={config.bgImageUrl!}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ opacity: imageAlpha }}
            />
          )}

          {/* Capa de color: encima de la imagen, o como fondo cuando no hay imagen. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: coverBg, opacity: coverAlpha }}
          />

          {/* Mancha decorativa — siempre visible. */}
          <span
            aria-hidden
            className="absolute -top-32 -left-20 size-[400px] rounded-full blur-[40px] opacity-35"
            style={{ background: config.blob1Color }}
          />

          <div className="relative z-10 flex flex-wrap justify-between items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 text-accent font-mono text-[11px] tracking-widest uppercase font-semibold">
                <Icon name="bolt" size={13} strokeWidth={2.4} /> {config.badge}
              </span>
              <h2 className="mt-3 sm:mt-4 font-display font-bold leading-[0.95] tracking-[-0.035em] text-white text-3xl sm:text-5xl lg:text-[clamp(32px,5vw,56px)]">
                {config.title}
              </h2>
            </div>
            <div className="flex gap-2 sm:gap-3 items-center">
              <CountdownUnit value={h} label="Horas" />
              <span className="text-xl sm:text-3xl font-display font-bold opacity-60">
                :
              </span>
              <CountdownUnit value={m} label="Min" />
              <span className="text-xl sm:text-3xl font-display font-bold opacity-60">
                :
              </span>
              <CountdownUnit value={s} label="Seg" />
            </div>
          </div>

          <div className="relative z-10 mb-3 hidden justify-end gap-2 sm:flex">
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

          <div
            ref={scrollRef}
            className="relative z-10 overflow-x-auto pt-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            <div className="flex gap-4 sm:gap-5">
              {products.map((p, i) => (
                <Link
                  key={p.id}
                  href={productHref(p)}
                  className="basis-[220px] sm:basis-[260px] md:basis-[280px] shrink-0 snap-start block"
                >
                  <ProductCard variant="discount" product={toUiProduct(p, i)} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
