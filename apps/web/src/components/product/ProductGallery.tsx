'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import type { ProductImage } from '@/lib/products';

interface ProductGalleryProps {
  product: Product;
  images: ProductImage[];
}

interface GallerySlot {
  key: string;
  url: string;
  alt: string;
}

export default function ProductGallery({ product, images }: ProductGalleryProps) {
  const slots = useMemo<GallerySlot[]>(() => {
    const out: GallerySlot[] = [];
    if (product.primaryImageUrl) {
      out.push({ key: 'primary', url: product.primaryImageUrl, alt: product.name });
    }
    for (const img of images) {
      if (img.url === product.primaryImageUrl) continue;
      out.push({ key: img.id, url: img.url, alt: img.alt || product.name });
    }
    return out;
  }, [product, images]);

  const [activeIdx, setActiveIdx] = useState(0);
  const active = slots[activeIdx];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 text-sm">
            (sin imagen)
          </div>
        )}
      </div>

      {slots.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {slots.map((img, idx) => (
            <button
              key={img.key}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                idx === activeIdx ? 'border-accent' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
