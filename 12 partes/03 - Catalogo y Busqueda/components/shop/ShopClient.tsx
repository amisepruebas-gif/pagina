"use client";
import { useMemo, useState } from "react";
import { Topbar, Header, CategoryNav, Footer, Button } from "@/components";
import {
  Breadcrumbs, CatalogHeader, SearchHeader,
  FilterSidebar, FilterDrawer, Toolbar, AppliedTags,
  ProductGrid, EmptyState, NoResults,
  type BreadcrumbItem, type ProductView,
} from "./";
import { SHOP_PRODUCTS, CATEGORIES } from "@/lib/shop-data";
import {
  DEFAULT_FILTERS, applyFilters, applySort, countByCategory, countAppliedFilters,
  type Filters, type SortBy,
} from "@/lib/filters";

export interface ShopClientProps {
  mode: "catalog" | "search";
  /** Solo en modo search */
  query?: string;
  /** Filtro inicial por categoría (opcional) */
  initialCategory?: string | null;
}

const PAGE_SIZE = 8;

/**
 * ShopClient — composición compartida entre /shop y /search.
 *
 * Mantiene en estado: filtros, orden, vista (grid/list), drawer móvil,
 * visibleCount (paginación "Cargar más"). Cuando no hay matches:
 * - mode="catalog" → `<EmptyState/>` con CTA "limpiar filtros"
 * - mode="search"  → `<NoResults/>` con sugerencias y categorías populares
 */
export function ShopClient({ mode, query = "", initialCategory = null }: ShopClientProps) {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, category: initialCategory });
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [view, setView] = useState<ProductView>("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCat, setActiveCat] = useState("Novedades");

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));
  const clearAll = () => { setFilters(DEFAULT_FILTERS); setVisibleCount(PAGE_SIZE); };

  const filteredAll = useMemo(
    () => applyFilters(SHOP_PRODUCTS, filters, mode === "search" ? query : ""),
    [filters, mode, query],
  );
  const sorted  = useMemo(() => applySort(filteredAll, sortBy), [filteredAll, sortBy]);
  const visible = sorted.slice(0, visibleCount);
  const total   = sorted.length;
  const appliedCount = countAppliedFilters(filters);
  const counts  = { byCategory: countByCategory(SHOP_PRODUCTS, filters, mode === "search" ? query : "") };

  const crumbs = useMemo<BreadcrumbItem[]>(() => {
    if (mode === "search") return [{ label: "Inicio", href: "/" }, { label: "Búsqueda" }];
    const items: BreadcrumbItem[] = [
      { label: "Inicio", href: "/" }, { label: "Tienda", href: "/shop" },
    ];
    if (filters.category) {
      const c = CATEGORIES.find((x) => x.value === filters.category);
      if (c) items.push({ label: c.label });
    }
    return items;
  }, [mode, filters.category]);

  const isEmpty = total === 0;
  const categoryLabel = filters.category
    ? CATEGORIES.find((c) => c.value === filters.category)?.label ?? null
    : null;

  return (
    <>
      <Topbar />
      <Header cartCount={3} />
      <CategoryNav active={activeCat} onChange={setActiveCat} />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16">
        <Breadcrumbs items={crumbs} />

        {mode === "search" ? (
          <SearchHeader query={query} count={total} />
        ) : (
          <CatalogHeader
            title={categoryLabel || "Toda la tienda"}
            description="Explora el catálogo completo. Usa los filtros para acotar por categoría, precio, color, talla o material."
            count={total}
          />
        )}

        {mode === "search" && isEmpty ? (
          <NoResults query={query} />
        ) : (
          <div className="grid gap-2 lg:gap-8 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
            <FilterSidebar
              filters={filters} set={set} counts={counts}
              appliedCount={appliedCount} onClear={clearAll}
            />

            <div className="min-w-0">
              <Toolbar
                total={total}
                sortBy={sortBy} onSortChange={setSortBy}
                view={view} onViewChange={setView}
                onOpenFilters={() => setDrawerOpen(true)}
                appliedCount={appliedCount}
              />

              <AppliedTags filters={filters} set={set} onClear={clearAll} />

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
                        variant="secondary" size="lg" trailingIcon="arr-right"
                        onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}
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
      </main>

      <Footer />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters} set={set} counts={counts}
        resultCount={total} onClear={clearAll}
      />
    </>
  );
}
