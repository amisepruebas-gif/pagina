'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { ProductImage } from '@/lib/products';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

interface ProductGalleryProps {
  product: Product;
  images: ProductImage[];
}

interface Slot {
  key: string;
  url: string;
  alt: string;
}

export default function ProductGallery({ product, images }: ProductGalleryProps) {
  const slots = useMemo<Slot[]>(() => {
    const out: Slot[] = [];
    if (product.primaryImageUrl) {
      out.push({ key: 'primary', url: product.primaryImageUrl, alt: product.name });
    }
    for (const img of images) {
      if (img.url === product.primaryImageUrl) continue;
      out.push({ key: img.id, url: img.url, alt: img.alt || product.name });
    }
    return out;
  }, [product, images]);

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      if (idx >= 0 && idx < slots.length) setActive(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [slots.length]);

  if (slots.length === 0) {
    return (
      <div className="ph-stripes aspect-square rounded-xl border border-border flex items-center justify-center">
        <span className="font-mono text-[11px] tracking-widest uppercase text-text-soft">
          Sin imagen
        </span>
      </div>
    );
  }

  const current = slots[active] ?? slots[0]!;

  return (
    <div className="min-w-0">
      {/* Desktop: miniaturas verticales + imagen con zoom */}
      <div className="hidden lg:grid grid-cols-[80px_1fr] gap-4">
        <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pb-1">
          {slots.map((img, i) => (
            <button
              key={img.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                'relative size-20 rounded-md overflow-hidden cursor-pointer shrink-0 transition-colors',
                active === i
                  ? 'border-2 border-brand-500'
                  : 'border-[1.5px] border-border'
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Ampliar imagen"
          onClick={() => setLightbox(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setLightbox(true);
          }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100
            });
          }}
          onMouseLeave={() => setZoom(null)}
          className="relative aspect-square max-h-[600px] rounded-xl overflow-hidden border border-border cursor-zoom-in"
        >
          <Image
            src={current.url}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
            className="object-cover transition-transform duration-base ease-out"
            style={
              zoom
                ? {
                    transform: 'scale(1.9)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`
                  }
                : undefined
            }
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-pill bg-white/90 text-text font-mono text-[11px] tracking-wider uppercase font-semibold shadow-xs pointer-events-none">
            <Icon name="search" size={12} strokeWidth={2} /> Ver grande
          </span>
        </div>
      </div>

      {/* Mobile: carrusel horizontal con dots */}
      <div className="lg:hidden">
        <div
          ref={railRef}
          onClick={() => setLightbox(true)}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-xl border border-border cursor-zoom-in [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slots.map((img) => (
            <div
              key={img.key}
              className="relative flex-[0_0_100%] aspect-square snap-start"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {slots.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {slots.map((img, i) => (
              <button
                key={img.key}
                type="button"
                onClick={() => {
                  setActive(i);
                  railRef.current?.scrollTo({
                    left: railRef.current.clientWidth * i,
                    behavior: 'smooth'
                  });
                }}
                aria-label={`Ir a imagen ${i + 1}`}
                className="min-w-[22px] h-[22px] inline-flex items-center justify-center"
              >
                <span
                  className={cn(
                    'h-2 rounded-full transition-all duration-base ease-out',
                    i === active ? 'w-5 bg-brand-500' : 'w-2 bg-border-strong'
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
          aria-label="Imagen ampliada"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <Icon name="x" size={28} strokeWidth={2} />
          </button>
          <div className="relative w-full max-w-3xl aspect-square">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
