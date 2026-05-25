'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';
import ProductPickerModal from './ProductPickerModal';

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
  /** Límite opcional. Sin valor = sin límite. */
  max?: number;
}

/**
 * ProductPickerButton — selector de productos con la misma API que
 * `ProductMultiPicker` (value/onChange) pero abre un modal tipo explorador
 * con sidebar de categorías. Muestra preview de seleccionados como chips
 * con miniatura.
 */
export default function ProductPickerButton({ value, onChange, max }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error('[ProductPickerButton]', err));
  }, []);

  const selected = value
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div>
      {selected.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-pill border border-brand-200 bg-brand-50 py-0.5 pl-0.5 pr-2 text-brand-700"
              title={p.name}
            >
              <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-surface">
                {p.primaryImageUrl ? (
                  <Image
                    src={p.primaryImageUrl}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <span className="max-w-[140px] truncate text-[12px] font-display font-semibold">
                {p.name}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((id) => id !== p.id))}
                aria-label={`Quitar ${p.name}`}
                className="rounded-full p-0.5 transition hover:bg-error hover:text-white"
              >
                <Icon name="x" size={11} strokeWidth={2.6} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mb-2 text-[13px] text-text-soft">
          Ningún producto seleccionado.
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3.5 py-2 text-sm font-display font-semibold text-text transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
      >
        <Icon name="grid" size={15} strokeWidth={2} />
        {selected.length > 0 ? 'Editar selección' : 'Elegir productos'}
        {max !== undefined && (
          <span className="font-mono text-[11px] text-text-soft">
            ({selected.length}/{max})
          </span>
        )}
      </button>

      <ProductPickerModal
        open={open}
        onClose={() => setOpen(false)}
        value={value}
        onConfirm={onChange}
        max={max}
      />
    </div>
  );
}
