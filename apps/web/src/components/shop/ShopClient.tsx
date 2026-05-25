'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import type { Subcategory, Material } from '@/types/taxonomy';
import { Button } from '@/components/ui';
import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import {
  type Filters,
  type SortBy,
  makeDefaultFilters,
  applyFilters,
  applySort,
  countAppliedFilters,
  countByCategory
} from '@/lib/shop-filters';
import { CatalogHeader, SearchHeader } from './CatalogHeader';
import { FilterSidebar } from './FilterSidebar';
import { FilterDrawer } from './FilterDrawer';
import { Toolbar, type ProductView } from './Toolbar';
import { AppliedTags } from './AppliedTags';
import { ProductGrid } from './ProductGrid';
import { EmptyState } from './EmptyState';
import { NoResults } from './NoResults';

export interface ShopClientProps {
  mode: 'catalog' | 'search';
  /** Dataset base: catálogo completo o resultados de búsqueda. */
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
  maxPrice: number;
  /** Solo en modo search. */
  query?: string;
  /** Categoría inicial desde la URL (`?cat=`). */
  initialCategory?: string | null;
  /** Título alternativo del catálogo (ej. "Ofertas") cuando no hay categoría. */
  catalogTitle?: string;
}

const PAGE_SIZE = 24;

/** ShopClient — composición client-side compartida entre /shop y /search. */
export function ShopClient({
  mode,
  products,
  categories,
  subcategories,
  materials,
  maxPrice,
  query = '',
  initialCategory = null,
  catalogTitle
}: ShopClientProps) {
  const [filters, setFilters] = useState<Filters>(() =>
    makeDefaultFilters(maxPrice, initialCategory)
  );
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [view, setView] = useState<ProductView>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => {
      const next = { ...f, [key]: value };
      // Al cambiar de categoría, las subcategorías dejan de aplicar.
      if (key === 'category') next.subcategories = [];
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  }
  function clearAll() {
    setFilters(makeDefaultFilters(maxPrice));
    setVisibleCount(PAGE_SIZE);
  }

  const filteredAll = useMemo(
    () => applyFilters(products, filters),
    [products, filters]
  );
  const sorted = useMemo(
    () => applySort(filteredAll, sortBy),
    [filteredAll, sortBy]
  );
  const visible = sorted.slice(0, visibleCount);
  const total = sorted.length;
  const appliedCount = countAppliedFilters(filters, maxPrice);
  const counts = useMemo(
    () => ({ byCategory: countByCategory(products, filters) }),
    [products, filters]
  );

  const categoryName = filters.category
    ? categories.find((c) => c.id === filters.category)?.name ?? null
    : null;

  const crumbs: Crumb[] =
    mode === 'search'
      ? [{ label: 'Inicio', href: '/' }, { label: 'Búsqueda' }]
      : [
          { label: 'Inicio', href: '/' },
          { label: 'Tienda', href: '/shop' },
          ...(categoryName ? [{ label: categoryName }] : [])
        ];

  const isEmpty = total === 0;
  const panelProps = {
    filters,
    set,
    counts,
    categories,
    subcategories,
    materials,
    maxPrice
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
      <Breadcrumbs items={crumbs} />

      {mode === 'search' ? (
        <SearchHeader query={query} count={total} />
      ) : (
        <CatalogHeader
          title={categoryName || catalogTitle || 'Toda la tienda'}
          description="Explora el catálogo. Usa los filtros para acotar por categoría, precio o material."
          count={total}
        />
      )}

      {mode === 'search' && isEmpty ? (
        <NoResults query={query} categories={categories} />
      ) : (
        <div className="mt-2 grid gap-2 lg:gap-8 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
          <FilterSidebar
            {...panelProps}
            appliedCount={appliedCount}
            onClear={clearAll}
          />

          <div className="min-w-0">
            <Toolbar
              total={total}
              sortBy={sortBy}
              onSortChange={setSortBy}
              view={view}
              onViewChange={setView}
              onOpenFilters={() => setDrawerOpen(true)}
              appliedCount={appliedCount}
            />

            <AppliedTags
              filters={filters}
              set={set}
              onClear={clearAll}
              categories={categories}
              subcategories={subcategories}
              materials={materials}
              maxPrice={maxPrice}
            />

            {isEmpty ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <>
                <ProductGrid products={visible} view={view} />

                {visible.length < total && (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <span className="text-[13px] text-text-soft">
                      Mostrando {visible.length} de {total} productos
                    </span>
                    <Button
                      variant="secondary"
                      size="lg"
                      trailingIcon="arr-right"
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      Cargar más productos
                    </Button>
                  </div>
                )}

                {visible.length === total && total > 0 && (
                  <div className="mt-8 text-center text-text-soft text-[13px]">
                    Has visto los {total} productos.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <FilterDrawer
        {...panelProps}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={total}
        onClear={clearAll}
      />
    </div>
  );
}
