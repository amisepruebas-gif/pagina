'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Icon, Input, Select } from '@/components/ui';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import type { Subcategory } from '@/types/taxonomy';
import { DataTable, type DataTableColumn } from './DataTable';
import { StockBadge } from './StockBadge';
import ProductsTableActions from './ProductsTableActions';
import { AdminProductCard } from './AdminProductCard';
import { ProductGroupModal } from './ProductGroupModal';

const LOW_STOCK_THRESHOLD = 5;
const PAGE_SIZE = 20;

type ViewMode = 'list' | 'grid';
type GroupBy = 'none' | 'category' | 'subcategory';

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
}

/** Clave del grupo de un producto (id de categoría/subcategoría o "sin"). */
function groupKeyOf(p: Product, by: 'category' | 'subcategory'): string {
  const id = by === 'category' ? p.categoryId : p.subcategoryId;
  return id || '__none__';
}

/** Columnas de la tabla de productos. */
const PRODUCT_COLUMNS: DataTableColumn<Product>[] = [
  {
    key: 'name',
    label: 'Producto',
    render: (p) => (
      <div className="flex items-center gap-2.5">
        {p.primaryImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.primaryImageUrl}
            alt=""
            className="size-9 shrink-0 rounded-sm bg-surface-2 object-cover"
          />
        ) : (
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-text-soft">
            <Icon name="grid" size={16} strokeWidth={1.8} />
          </span>
        )}
        <div className="min-w-0">
          <Link
            href={`/admin/productos/${p.id}`}
            className="block max-w-[240px] truncate font-display font-semibold transition hover:text-brand-700"
          >
            {p.name}
          </Link>
          <div className="inline-flex flex-wrap items-center gap-1.5 text-[11px] text-text-soft">
            {p.isFeatured && (
              <Badge tone="brand" size="xs">
                Destacado
              </Badge>
            )}
            {p.isNew && (
              <Badge tone="accent" size="xs">
                Nuevo
              </Badge>
            )}
            {!p.active && (
              <Badge tone="neutral" size="xs">
                Inactivo
              </Badge>
            )}
            {!p.isFeatured && !p.isNew && p.active && (
              <span className="font-mono">{p.slug}</span>
            )}
          </div>
        </div>
      </div>
    )
  },
  {
    key: 'sku',
    label: 'SKU',
    render: (p) => (
      <code className="font-mono text-xs text-text-muted">
        {p.sku ?? '—'}
      </code>
    )
  },
  {
    key: 'price',
    label: 'Precio',
    align: 'right',
    render: (p) => (
      <div className="text-right">
        <div className="font-display font-bold">${p.price.toFixed(2)}</div>
        {typeof p.originalPrice === 'number' && (
          <div className="text-[11px] text-text-soft line-through">
            ${p.originalPrice.toFixed(2)}
          </div>
        )}
      </div>
    )
  },
  {
    key: 'stock',
    label: 'Stock',
    align: 'center',
    render: (p) =>
      typeof p.stock === 'number' ? (
        <StockBadge stock={p.stock} />
      ) : (
        <span className="text-text-soft">—</span>
      )
  },
  {
    key: 'actions',
    label: 'Acciones',
    align: 'right',
    width: '160px',
    render: (p) => (
      <div className="inline-flex justify-end">
        <ProductsTableActions productId={p.id} active={p.active} />
      </div>
    )
  }
];

/**
 * ProductsTable — vista de productos del admin. Soporta dos estilos de
 * visualización (lista / cuadrícula) combinables con una agrupación por
 * categoría o subcategoría; cada grupo abre un modal con sus productos.
 */
export default function ProductsTable({
  products,
  categories,
  subcategories
}: ProductsTableProps) {
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('todos');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [modalGroup, setModalGroup] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const lowStock = useMemo(
    () =>
      products.filter(
        (p) => typeof p.stock === 'number' && p.stock <= LOW_STOCK_THRESHOLD
      ),
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.sku ?? ''} ${p.slug}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (estado === 'activos' && !p.active) return false;
      if (estado === 'inactivos' && p.active) return false;
      if (
        estado === 'stock-bajo' &&
        !(typeof p.stock === 'number' && p.stock <= LOW_STOCK_THRESHOLD)
      ) {
        return false;
      }
      return true;
    });
  }, [products, query, estado]);

  const groups = useMemo(() => {
    if (groupBy === 'none') return [];
    const map = new Map<string, Product[]>();
    for (const p of filtered) {
      const k = groupKeyOf(p, groupBy);
      const arr = map.get(k);
      if (arr) arr.push(p);
      else map.set(k, [p]);
    }
    const source = groupBy === 'category' ? categories : subcategories;
    const noneLabel =
      groupBy === 'category' ? 'Sin categoría' : 'Sin subcategoría';
    return [...map.entries()]
      .map(([key, items]) => ({
        key,
        name:
          key === '__none__'
            ? noneLabel
            : (source.find((x) => x.id === key)?.name ?? key),
        items
      }))
      .sort((a, b) => {
        if (a.key === '__none__') return 1;
        if (b.key === '__none__') return -1;
        return a.name.localeCompare(b.name);
      });
  }, [filtered, groupBy, categories, subcategories]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const modalProducts = modalGroup
    ? filtered.filter(
        (p) =>
          groupBy !== 'none' &&
          groupKeyOf(p, groupBy) === modalGroup.key
      )
    : [];

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      {lowStock.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-warning/30 bg-warning/[0.12] px-4 py-3.5">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-warning text-[#1A1A14]">
            <Icon name="warn" size={18} strokeWidth={2.4} />
          </span>
          <div className="min-w-[200px] flex-1">
            <div className="font-display text-sm font-semibold">
              Atención: {lowStock.length} producto
              {lowStock.length === 1 ? '' : 's'} con stock bajo o agotado
            </div>
            <div className="text-xs text-text-muted">
              Stock ≤ {LOW_STOCK_THRESHOLD} unidades. Refuerza el inventario o
              ajusta la visibilidad para evitar quedarte sin stock.
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEstado('stock-bajo');
              resetPage();
            }}
          >
            Ver lista
          </Button>
        </div>
      )}

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-border bg-surface p-3">
        <div className="min-w-[200px] max-w-[280px] flex-1">
          <Input
            leadingIcon="search"
            placeholder="Buscar por nombre o SKU…"
            className="!h-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
          />
        </div>
        <div className="w-[160px]">
          <Select
            className="!h-9"
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value);
              resetPage();
            }}
            options={[
              { value: 'todos', label: 'Estado: todos' },
              { value: 'activos', label: 'Activos' },
              { value: 'inactivos', label: 'Inactivos' },
              { value: 'stock-bajo', label: 'Stock bajo' }
            ]}
          />
        </div>
        <div className="w-[190px]">
          <Select
            className="!h-9"
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value as GroupBy);
              resetPage();
            }}
            options={[
              { value: 'none', label: 'Agrupar: no agrupar' },
              { value: 'category', label: 'Agrupar por categoría' },
              { value: 'subcategory', label: 'Agrupar por subcategoría' }
            ]}
          />
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border-strong">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="Vista de lista"
            aria-pressed={viewMode === 'list'}
            className={`inline-flex h-9 w-9 items-center justify-center transition ${
              viewMode === 'list'
                ? 'bg-brand-500 text-white'
                : 'bg-surface text-text-muted hover:bg-surface-2'
            }`}
          >
            <Icon name="menu" size={17} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Vista de cuadrícula"
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex h-9 w-9 items-center justify-center border-l border-border-strong transition ${
              viewMode === 'grid'
                ? 'bg-brand-500 text-white'
                : 'bg-surface text-text-muted hover:bg-surface-2'
            }`}
          >
            <Icon name="grid" size={16} />
          </button>
        </div>
      </div>

      {/* Contenido */}
      {groupBy === 'none' ? (
        viewMode === 'list' ? (
          <DataTable<Product>
            columns={PRODUCT_COLUMNS}
            rows={pageRows}
            empty={{
              icon: 'grid',
              title:
                products.length === 0
                  ? 'No hay productos todavía'
                  : 'Sin resultados',
              body:
                products.length === 0
                  ? 'Crea el primer producto del catálogo.'
                  : 'Ningún producto coincide con los filtros aplicados.'
            }}
            pagination={
              filtered.length > 0
                ? {
                    page: safePage,
                    pages,
                    from: (safePage - 1) * PAGE_SIZE + 1,
                    to: Math.min(safePage * PAGE_SIZE, filtered.length),
                    total: filtered.length,
                    onPrev: () => setPage((n) => Math.max(1, n - 1)),
                    onNext: () => setPage((n) => Math.min(pages, n + 1))
                  }
                : undefined
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyBox
            title={
              products.length === 0
                ? 'No hay productos todavía'
                : 'Sin resultados'
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {pageRows.map((p) => (
                <AdminProductCard key={p.id} product={p} />
              ))}
            </div>
            <PaginationBar
              from={(safePage - 1) * PAGE_SIZE + 1}
              to={Math.min(safePage * PAGE_SIZE, filtered.length)}
              total={filtered.length}
              page={safePage}
              pages={pages}
              onPrev={() => setPage((n) => Math.max(1, n - 1))}
              onNext={() => setPage((n) => Math.min(pages, n + 1))}
            />
          </>
        )
      ) : groups.length === 0 ? (
        <EmptyBox title="Sin resultados" />
      ) : viewMode === 'list' ? (
        <div className="flex flex-col gap-1.5">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setModalGroup({ key: g.key, name: g.name })}
              className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-left transition hover:border-brand-300 hover:bg-surface-2"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-brand-50 text-brand-700">
                <Icon name="tag" size={17} strokeWidth={2} />
              </span>
              <span className="flex-1 font-display font-semibold">
                {g.name}
              </span>
              <Badge tone="neutral" size="xs">
                {g.items.length} producto{g.items.length === 1 ? '' : 's'}
              </Badge>
              <Icon name="chev-right" size={16} className="text-text-soft" />
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setModalGroup({ key: g.key, name: g.name })}
              className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface p-4 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Icon name="tag" size={20} strokeWidth={2} />
              </span>
              <span className="font-display font-semibold leading-tight">
                {g.name}
              </span>
              <Badge tone="neutral" size="xs">
                {g.items.length} producto{g.items.length === 1 ? '' : 's'}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {modalGroup && (
        <ProductGroupModal
          groupName={modalGroup.name}
          products={modalProducts}
          onClose={() => setModalGroup(null)}
        />
      )}
    </div>
  );
}

function EmptyBox({ title }: { title: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-surface py-16 text-center">
      <Icon
        name="grid"
        size={28}
        className="mx-auto mb-2 text-text-soft"
        strokeWidth={1.6}
      />
      <p className="font-display font-semibold">{title}</p>
    </div>
  );
}

function PaginationBar({
  from,
  to,
  total,
  page,
  pages,
  onPrev,
  onNext
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-2.5">
      <span className="text-[13px] text-text-muted">
        {from}–{to} de {total}
      </span>
      <div className="inline-flex gap-1.5">
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={onPrev}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= pages}
          onClick={onNext}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
