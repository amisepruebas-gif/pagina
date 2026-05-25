'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

/** Normaliza para comparar: sin acentos, minúsculas. Da tolerancia básica a typos. */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

interface NavItem {
  type: 'product' | 'category' | 'all';
  href: string;
  label: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carga el catálogo una sola vez (al primer foco) y filtra localmente después.
  async function ensureLoaded() {
    if (loaded) return;
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
      setLoaded(true);
      console.log('[SEARCH] catálogo cargado', p.length, 'productos');
    } catch (err) {
      console.error('[SEARCH] error cargando catálogo', err);
    }
  }

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const terms = norm(query.trim()).split(/\s+/).filter(Boolean);

  const matchedProducts =
    terms.length > 0
      ? products
          .filter((p) => {
            const hay = norm(
              [p.name, p.slug, ...(p.tagIds ?? [])].filter(Boolean).join(' ')
            );
            return terms.every((t) => hay.includes(t));
          })
          .slice(0, 6)
      : [];

  const matchedCategories =
    terms.length > 0
      ? categories
          .filter((c) => terms.every((t) => norm(c.name).includes(t)))
          .slice(0, 3)
      : [];

  // Lista plana navegable con teclado
  const navItems: NavItem[] = [
    ...matchedProducts.map((p) => ({
      type: 'product' as const,
      href: `/producto/${p.slug}`,
      label: p.name
    })),
    ...matchedCategories.map((c) => ({
      type: 'category' as const,
      href: `/shop?cat=${encodeURIComponent(c.id)}`,
      label: c.name
    }))
  ];
  if (query.trim()) {
    navItems.push({
      type: 'all',
      href: `/search?q=${encodeURIComponent(query.trim())}`,
      label: `Ver todos los resultados de "${query.trim()}"`
    });
  }

  const showDropdown = open && terms.length > 0;

  function go(href: string) {
    setOpen(false);
    setActiveIndex(-1);
    router.push(href);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && navItems[activeIndex]) {
      go(navItems[activeIndex].href);
    } else if (query.trim()) {
      go(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(navItems.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => {
            ensureLoaded();
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos, categorías…"
          aria-label="Buscar productos"
          autoComplete="off"
          className="w-full rounded-pill border border-border bg-surface-2 pl-5 pr-12 h-11 text-sm text-text placeholder:text-text-soft focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="absolute right-2 inline-flex items-center justify-center size-8 rounded-pill text-text-soft hover:text-brand-600 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-surface shadow-lg overflow-hidden z-50">
          {navItems.length === 1 ? (
            // solo el item "ver todos" → no hubo coincidencias directas
            <div className="p-4 text-sm text-text-muted">
              Sin coincidencias directas.
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="ml-1 text-brand-600 font-semibold hover:underline"
              >
                Buscar de todos modos
              </button>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-1">
              {matchedProducts.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      go(`/producto/${p.slug}`);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                      activeIndex === i ? 'bg-brand-50' : 'hover:bg-surface-2'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-md bg-surface-2 overflow-hidden shrink-0">
                      {p.primaryImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.primaryImageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="min-w-0 flex-1 text-sm text-text truncate">
                      {p.name}
                    </span>
                    <span className="text-sm font-bold text-text tabular-nums">
                      ${p.price.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}

              {matchedCategories.length > 0 && (
                <li
                  className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-text-soft"
                  aria-hidden
                >
                  Categorías
                </li>
              )}
              {matchedCategories.map((c, i) => {
                const idx = matchedProducts.length + i;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        go(`/shop?cat=${encodeURIComponent(c.id)}`);
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text ${
                        activeIndex === idx ? 'bg-brand-50' : 'hover:bg-surface-2'
                      }`}
                    >
                      <span className="text-text-soft">#</span>
                      {c.name}
                    </button>
                  </li>
                );
              })}

              <li className="border-t border-border">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  onMouseEnter={() => setActiveIndex(navItems.length - 1)}
                  className={`block w-full px-3 py-2.5 text-left text-sm font-semibold text-brand-600 ${
                    activeIndex === navItems.length - 1
                      ? 'bg-brand-50'
                      : 'hover:bg-surface-2'
                  }`}
                >
                  Ver todos los resultados de “{query.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
