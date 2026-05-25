'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Icon } from '@/components/ui';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import type { Subcategory } from '@/types/taxonomy';

/** Nodo seleccionado en el sidebar del picker. */
type ActiveNode =
  | { type: 'all' }
  | { type: 'cat'; id: string }
  | { type: 'cat-nosub'; id: string }
  | { type: 'subcat'; id: string };

interface ProductPickerModalProps {
  open: boolean;
  onClose: () => void;
  /** IDs actualmente seleccionados (estado externo). */
  value: string[];
  /** Se llama al pulsar "Listo" con la nueva lista. */
  onConfirm: (ids: string[]) => void;
  /** Límite opcional de selección. Sin valor = sin límite. */
  max?: number;
  /** Título del modal. */
  title?: string;
}

/**
 * ProductPickerModal — selector de productos tipo explorador de archivos.
 * Sidebar con árbol de categorías/subcategorías y buscador; panel principal
 * con miniaturas de los productos del nodo activo; franja de seleccionados
 * abajo. La selección es local hasta pulsar "Listo".
 */
export default function ProductPickerModal({
  open,
  onClose,
  value,
  onConfirm,
  max,
  title = 'Elegir productos'
}: ProductPickerModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>(value);
  const [query, setQuery] = useState('');
  const [activeNode, setActiveNode] = useState<ActiveNode>({ type: 'all' });
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  // Portal: solo montamos al `document.body` después del hidrato para que el
  // modal escape de cualquier stacking context del editor.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Carga catálogo + taxonomía una vez.
  useEffect(() => {
    if (loaded) return;
    Promise.all([getProducts(), getCategories(), getSubcategories()])
      .then(([p, c, s]) => {
        setProducts(p);
        setCategories(c);
        setSubcategories(s);
        setLoaded(true);
      })
      .catch((err) => console.error('[ProductPickerModal]', err));
  }, [loaded]);

  // Al abrir, sincroniza selección con el valor externo.
  useEffect(() => {
    if (open) {
      setSelectedIds(value);
      setQuery('');
      setActiveNode({ type: 'all' });
    }
  }, [open, value]);

  if (!open || !mounted) return null;

  // Árbol de categorías con conteos.
  const tree = (() => {
    const q = query.trim().toLowerCase();
    return categories
      .map((cat) => {
        const inCat = products.filter((p) => p.categoryId === cat.id);
        const subs = subcategories
          .filter((s) => s.categoryId === cat.id)
          .map((s) => ({
            id: s.id,
            name: s.name,
            count: inCat.filter((p) => p.subcategoryId === s.id).length
          }));
        const noSubCount = inCat.filter((p) => !p.subcategoryId).length;
        const catMatches = !q || cat.name.toLowerCase().includes(q);
        const matchingSubs = subs.filter(
          (s) => !q || s.name.toLowerCase().includes(q)
        );
        return {
          id: cat.id,
          name: cat.name,
          totalCount: inCat.length,
          noSubCount,
          subs: q && !catMatches ? matchingSubs : subs,
          visible: q ? catMatches || matchingSubs.length > 0 : true
        };
      })
      .filter((c) => c.visible);
  })();

  // Productos a mostrar en el panel derecho.
  const displayProducts = (() => {
    const q = query.trim().toLowerCase();
    let arr = products;
    if (activeNode.type === 'cat') {
      arr = arr.filter((p) => p.categoryId === activeNode.id);
    } else if (activeNode.type === 'cat-nosub') {
      arr = arr.filter(
        (p) => p.categoryId === activeNode.id && !p.subcategoryId
      );
    } else if (activeNode.type === 'subcat') {
      arr = arr.filter((p) => p.subcategoryId === activeNode.id);
    }
    if (q) arr = arr.filter((p) => p.name.toLowerCase().includes(q));
    return arr;
  })();

  const breadcrumb = (() => {
    if (activeNode.type === 'all') return 'Todos los productos';
    if (activeNode.type === 'cat') {
      const c = categories.find((x) => x.id === activeNode.id);
      return c?.name ?? '';
    }
    if (activeNode.type === 'cat-nosub') {
      const c = categories.find((x) => x.id === activeNode.id);
      return `${c?.name ?? ''} · Sin subcategoría`;
    }
    if (activeNode.type === 'subcat') {
      const s = subcategories.find((x) => x.id === activeNode.id);
      const c = categories.find((x) => x.id === s?.categoryId);
      return `${c?.name ?? ''} · ${s?.name ?? ''}`;
    }
    return '';
  })();

  const limitReached = max !== undefined && selectedIds.length >= max;

  function toggleProduct(id: string) {
    setSelectedIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (max !== undefined && cur.length >= max) return cur;
      return [...cur, id];
    });
  }

  function removeSelected(id: string) {
    setSelectedIds((cur) => cur.filter((x) => x !== id));
  }

  function toggleCat(id: string) {
    setOpenCats((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isActive(n: ActiveNode): boolean {
    if (n.type !== activeNode.type) return false;
    if (n.type === 'all') return true;
    return (
      'id' in n &&
      'id' in activeNode &&
      n.id === (activeNode as { id: string }).id
    );
  }

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-xl bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <p className="text-[12px] text-text-soft">
              {selectedIds.length}
              {max !== undefined ? ` / ${max}` : ''} seleccionado
              {selectedIds.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancelar"
            className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface-2/40">
            <div className="shrink-0 p-3">
              <div className="flex items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 h-9">
                <Icon name="search" size={15} className="text-text-soft" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar categoría o producto…"
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="text-text-soft hover:text-text"
                  >
                    <Icon name="x" size={13} />
                  </button>
                )}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 pb-3 text-[13px]">
              <button
                type="button"
                onClick={() => setActiveNode({ type: 'all' })}
                className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition ${
                  isActive({ type: 'all' })
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'hover:bg-surface'
                }`}
              >
                <Icon name="grid" size={14} />
                Todos los productos
                <span className="ml-auto font-mono text-[11px] text-text-soft">
                  {products.length}
                </span>
              </button>

              <div className="mt-1.5 space-y-0.5">
                {tree.map((cat) => {
                  const isOpen = openCats.has(cat.id) || query.trim() !== '';
                  return (
                    <div key={cat.id}>
                      <div className="flex items-stretch">
                        <button
                          type="button"
                          onClick={() => toggleCat(cat.id)}
                          aria-label={isOpen ? 'Cerrar' : 'Abrir'}
                          className="px-1 text-text-soft hover:text-text"
                        >
                          <Icon
                            name="chev-right"
                            size={12}
                            className={
                              isOpen ? 'rotate-90 transition' : 'transition'
                            }
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveNode({ type: 'cat', id: cat.id })
                          }
                          className={`flex flex-1 items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left transition ${
                            isActive({ type: 'cat', id: cat.id })
                              ? 'bg-brand-50 text-brand-700 font-semibold'
                              : 'hover:bg-surface'
                          }`}
                        >
                          <Icon name="tag" size={13} />
                          <span className="flex-1 truncate">{cat.name}</span>
                          <span className="font-mono text-[11px] text-text-soft">
                            {cat.totalCount}
                          </span>
                        </button>
                      </div>
                      {isOpen && (
                        <div className="ml-5 mt-0.5 space-y-0.5">
                          {cat.noSubCount > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveNode({
                                  type: 'cat-nosub',
                                  id: cat.id
                                })
                              }
                              className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[12px] italic transition ${
                                isActive({ type: 'cat-nosub', id: cat.id })
                                  ? 'bg-brand-50 text-brand-700 font-semibold'
                                  : 'text-text-muted hover:bg-surface'
                              }`}
                            >
                              <span className="truncate">
                                Sin subcategoría
                              </span>
                              <span className="ml-auto font-mono text-[11px] text-text-soft">
                                {cat.noSubCount}
                              </span>
                            </button>
                          )}
                          {cat.subs.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() =>
                                setActiveNode({ type: 'subcat', id: s.id })
                              }
                              className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[12px] transition ${
                                isActive({ type: 'subcat', id: s.id })
                                  ? 'bg-brand-50 text-brand-700 font-semibold'
                                  : 'hover:bg-surface'
                              }`}
                            >
                              <span className="truncate">{s.name}</span>
                              <span className="ml-auto font-mono text-[11px] text-text-soft">
                                {s.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {tree.length === 0 && (
                  <p className="px-2 py-3 text-[12px] text-text-soft">
                    Sin categorías que coincidan.
                  </p>
                )}
              </div>
            </nav>
          </aside>

          {/* Panel principal */}
          <section className="flex min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-border px-5 py-2.5 text-[13px] text-text-muted">
              {breadcrumb} ·{' '}
              <span className="font-semibold text-text">
                {displayProducts.length} producto
                {displayProducts.length === 1 ? '' : 's'}
              </span>
              {limitReached && (
                <span className="ml-2 font-semibold text-warning">
                  Límite alcanzado
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!loaded ? (
                <p className="py-12 text-center text-sm text-text-soft">
                  Cargando catálogo…
                </p>
              ) : displayProducts.length === 0 ? (
                <p className="py-12 text-center text-sm text-text-soft">
                  Sin productos en este grupo.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {displayProducts.map((p) => {
                    const selected = selectedIds.includes(p.id);
                    const blocked = !selected && limitReached;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => !blocked && toggleProduct(p.id)}
                        disabled={blocked}
                        aria-pressed={selected}
                        className={`group relative flex flex-col overflow-hidden rounded-lg border-2 bg-surface text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          selected
                            ? 'border-brand-500 ring-2 ring-brand-500/20'
                            : 'border-border hover:border-brand-300'
                        }`}
                      >
                        <div className="relative aspect-square bg-surface-2">
                          {p.primaryImageUrl ? (
                            <Image
                              src={p.primaryImageUrl}
                              alt=""
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-text-soft">
                              <Icon name="grid" size={24} strokeWidth={1.6} />
                            </span>
                          )}
                          {selected && (
                            <span className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-brand-500 text-white shadow">
                              <Icon name="check" size={14} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div className="p-2.5">
                          <div className="line-clamp-2 text-[12px] font-semibold leading-tight text-text">
                            {p.name}
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-text-soft">
                            ${p.price.toFixed(2)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Franja de seleccionados */}
        {selectedProducts.length > 0 && (
          <div className="shrink-0 border-t border-border bg-surface-2/50 px-5 py-2.5">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-soft">
              Seleccionados
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {selectedProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-0.5 pl-0.5 pr-2 text-brand-700"
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
                  <span className="max-w-[120px] truncate text-[12px] font-semibold">
                    {p.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSelected(p.id)}
                    aria-label={`Quitar ${p.name}`}
                    className="rounded-full p-0.5 hover:bg-brand-100"
                  >
                    <Icon name="x" size={12} strokeWidth={2.4} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted transition hover:bg-surface-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(selectedIds);
              onClose();
            }}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Listo
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
