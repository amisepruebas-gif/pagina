'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types/product';

/**
 * Selector múltiple de productos — devuelve una lista de productIds.
 * Carga el catálogo una vez y filtra localmente.
 */
export default function ProductMultiPicker({
  value,
  onChange
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    getProducts()
      .then((ps) => {
        setProducts(ps);
        setLoaded(true);
      })
      .catch((err) => console.error('[ProductMultiPicker]', err));
  }, []);

  const selected = value
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const term = search.trim().toLowerCase();
  const matches = term
    ? products
        .filter(
          (p) => !value.includes(p.id) && p.name.toLowerCase().includes(term)
        )
        .slice(0, 8)
    : [];

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selected.length === 0 && (
          <span className="text-[13px] text-text-soft">
            Ningún producto seleccionado.
          </span>
        )}
        {selected.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 text-brand-700 text-[12px] font-display font-semibold pl-2.5 pr-1.5 py-1"
          >
            {p.name}
            <button
              type="button"
              onClick={() => onChange(value.filter((id) => id !== p.id))}
              aria-label={`Quitar ${p.name}`}
              className="inline-flex items-center justify-center size-4 rounded-full hover:bg-error hover:text-white transition"
            >
              <Icon name="x" size={11} strokeWidth={2.6} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div
          className={`flex items-center gap-2 h-12 px-3.5 rounded-md bg-surface text-text border-[1.5px] transition duration-base ease-out ${
            focus
              ? 'border-brand-500 ring-4 ring-brand-500/15'
              : 'border-border-strong'
          }`}
        >
          <Icon
            name="search"
            size={18}
            className="text-text-soft shrink-0"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder={
              loaded ? 'Buscar producto para agregar…' : 'Cargando…'
            }
            disabled={!loaded}
            className="flex-1 min-w-0 h-full bg-transparent outline-none text-sm disabled:opacity-60"
          />
        </div>
        {matches.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 mt-1 rounded-md border border-border bg-surface shadow-lg max-h-56 overflow-y-auto">
            {matches.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...value, p.id]);
                    setSearch('');
                  }}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-surface-2 transition"
                >
                  <span className="truncate text-text">{p.name}</span>
                  <span className="text-text-soft font-mono tabular-nums shrink-0">
                    ${p.price.toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
