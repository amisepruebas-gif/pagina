'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bannerHref, type ViewModule } from '@/types/page-view';

const ROTATE_MS = 5000;

/** Módulo "Carrusel de banners" — rota automáticamente, con indicadores. */
export default function ViewSlider({ module }: { module: ViewModule }) {
  const banners = (module.banners ?? []).filter((b) => b.imageUrl);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = window.setInterval(
      () => setIdx((i) => (i + 1) % banners.length),
      ROTATE_MS
    );
    return () => window.clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const current = banners[idx] ?? banners[0];
  if (!current) return null;
  const href = bannerHref(current);

  const slide = (
    <div
      className="aspect-[16/6] min-h-[200px] w-full bg-surface-2 bg-cover bg-center"
      style={{ backgroundImage: `url(${current.imageUrl})` }}
    />
  );

  return (
    <section className="relative">
      {href ? (
        <Link href={href} className="block">
          {slide}
        </Link>
      ) : (
        slide
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? 'w-6 bg-white' : 'w-2 bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
