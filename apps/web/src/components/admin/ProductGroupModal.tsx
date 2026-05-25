'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui';
import type { Product } from '@/types/product';
import { AdminProductCard } from './AdminProductCard';

export type ProductSort = 'recent' | 'oldest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'recent', label: 'Fecha de ingreso: más recientes' },
  { value: 'oldest', label: 'Fecha de ingreso: más antiguos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' }
];

/** Ordena una copia de la lista de productos según el criterio dado. */
export function sortProducts(list: Product[], sort: ProductSort): Product[] {
  const arr = [...list];
  switch (sort) {
    case 'oldest':
      return arr.sort(
        (a, b) =>
          (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)
      );
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'recent':
    default:
      return arr.sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
  }
}

/**
 * ProductGroupModal — modal con los productos de una categoría o
 * subcategoría, ordenables por fecha de ingreso o por precio.
 */
export function ProductGroupModal({
  groupName,
  products,
  onClose,
  onEdit
}: {
  groupName: string;
  products: Product[];
  onClose: () => void;
  /** Si se pasa, las cards dentro del modal abren el editor en modal. */
  onEdit?: (productId: string) => void;
}) {
  const [sort, setSort] = useState<ProductSort>('recent');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Productos de ${groupName}`}
      >
        <header className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-lg font-bold">
              {groupName}
            </h2>
            <p className="text-[12px] text-text-soft">
              {products.length} producto{products.length === 1 ? '' : 's'}
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSort)}
            aria-label="Ordenar productos"
            className="h-9 rounded-md border-[1.5px] border-border-strong bg-surface px-2.5 text-sm outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {sorted.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-soft">
              No hay productos en este grupo.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {sorted.map((p) => (
                <AdminProductCard key={p.id} product={p} onEdit={onEdit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
