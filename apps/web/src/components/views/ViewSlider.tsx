'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui';
import { bannerHref, type ViewModule } from '@/types/page-view';
import { safeHref } from '@/lib/safe-href';

const ROTATE_MS = 5000;
/** Distancia mínima (px) que el dedo debe arrastrar para cambiar de slide. */
const SWIPE_THRESHOLD = 50;

/**
 * Módulo "Carrusel de banners" — rotación automática + flechas en desktop
 * + swipe en móvil. Track horizontal con transform: translateX(-idx*100%)
 * para transición suave. Contenido contenido en max-w-7xl (antes ocupaba
 * todo el viewport — quedaba desproporcionado en pantallas grandes).
 */
export default function ViewSlider({ module }: { module: ViewModule }) {
  const banners = (module.banners ?? []).filter((b) => b.imageUrl);
  const [idx, setIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragDx, setDragDx] = useState(0);
  // Cuando el usuario toca cualquier control (flecha, dot, swipe), se pausa
  // la rotación automática para no pelearse con su intención.
  const userTookOver = useRef(false);

  // Auto-rotación. Si banners cambia o el usuario interactúa, se reinicia.
  useEffect(() => {
    if (banners.length <= 1) return;
    if (userTookOver.current) return;
    const t = window.setTimeout(() => {
      setIdx((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [idx, banners.length]);

  if (banners.length === 0) return null;

  function go(next: number) {
    userTookOver.current = true;
    const total = banners.length;
    setIdx(((next % total) + total) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    if (banners.length <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setDragDx(0);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX === null) return;
    setDragDx(e.touches[0].clientX - touchStartX);
  }

  function onTouchEnd() {
    if (touchStartX === null) return;
    if (dragDx < -SWIPE_THRESHOLD) go(idx + 1);
    else if (dragDx > SWIPE_THRESHOLD) go(idx - 1);
    setTouchStartX(null);
    setDragDx(0);
  }

  // Solo un banner → render simple, sin track ni controles.
  if (banners.length === 1) {
    const only = banners[0]!;
    const href = bannerHref(only);
    const slide = (
      <div
        className="aspect-[16/6] w-full bg-surface-2 bg-cover bg-center"
        style={{ backgroundImage: `url(${only.imageUrl})` }}
      />
    );
    return (
      <section className="py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-xl">
          {href ? (
            <Link href={safeHref(href)} className="block">
              {slide}
            </Link>
          ) : (
            slide
          )}
        </div>
      </section>
    );
  }

  const dragging = touchStartX !== null;

  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Track: cada slide w-full, se desliza con translateX. */}
          <div
            className={`flex ${
              dragging ? '' : 'transition-transform duration-500 ease-in-out'
            }`}
            style={{
              transform: `translateX(calc(${-idx * 100}% + ${dragDx}px))`
            }}
          >
            {banners.map((b, i) => {
              const href = bannerHref(b);
              const slide = (
                <div
                  className="aspect-[16/6] w-full bg-surface-2 bg-cover bg-center"
                  style={{ backgroundImage: `url(${b.imageUrl})` }}
                />
              );
              return (
                <div key={i} className="w-full shrink-0">
                  {href ? (
                    <Link
                      href={safeHref(href)}
                      className="block"
                      draggable={false}
                      // Evita navegar si fue arrastrado en móvil.
                      onClick={(e) => {
                        if (Math.abs(dragDx) > 5) e.preventDefault();
                      }}
                    >
                      {slide}
                    </Link>
                  ) : (
                    slide
                  )}
                </div>
              );
            })}
          </div>

          {/* Flechas — solo en desktop. Translúcidas con backdrop blur. */}
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/35 text-white backdrop-blur transition hover:bg-white/55 sm:flex"
          >
            <Icon name="arr-left" size={20} strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/35 text-white backdrop-blur transition hover:bg-white/55 sm:flex"
          >
            <Icon name="arr-right" size={20} strokeWidth={2.2} />
          </button>

          {/* Indicadores (dots) */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir al banner ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
