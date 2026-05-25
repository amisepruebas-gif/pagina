import type { Product } from '@/types/product';

/** Estado de filtros del catálogo. Todo opera sobre IDs de Firestore. */
export type Filters = {
  category: string | null;
  subcategories: string[];
  materials: string[];
  price: [number, number];
  inStockOnly: boolean;
};

export type SortBy = 'relevance' | 'price-asc' | 'price-desc' | 'new';

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'new', label: 'Novedades' }
];

export function makeDefaultFilters(
  maxPrice: number,
  category: string | null = null
): Filters {
  return {
    category,
    subcategories: [],
    materials: [],
    price: [0, maxPrice],
    inStockOnly: false
  };
}

/** Cuenta cuántos filtros están activos (para el badge). */
export function countAppliedFilters(f: Filters, maxPrice: number): number {
  let n = 0;
  if (f.category) n++;
  n += f.subcategories.length;
  n += f.materials.length;
  if (f.inStockOnly) n++;
  if (f.price[0] > 0 || f.price[1] < maxPrice) n++;
  return n;
}

/** Aplica los filtros al dataset. */
export function applyFilters(products: Product[], f: Filters): Product[] {
  let r = products;
  if (f.category) r = r.filter((p) => p.categoryId === f.category);
  if (f.subcategories.length) {
    r = r.filter(
      (p) => p.subcategoryId != null && f.subcategories.includes(p.subcategoryId)
    );
  }
  if (f.materials.length) {
    r = r.filter(
      (p) => p.materialId != null && f.materials.includes(p.materialId)
    );
  }
  r = r.filter((p) => p.price >= f.price[0] && p.price <= f.price[1]);
  if (f.inStockOnly) {
    r = r.filter((p) => p.stock === undefined || p.stock > 0);
  }
  return r;
}

/** Ordena el set ya filtrado. */
export function applySort(products: Product[], sortBy: SortBy): Product[] {
  const r = [...products];
  switch (sortBy) {
    case 'price-asc':
      return r.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return r.sort((a, b) => b.price - a.price);
    case 'new':
      return r.sort(
        (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
    default:
      return r;
  }
}

/** Precio máximo del catálogo, redondeado hacia arriba (para el slider). */
export function maxPriceOf(products: Product[]): number {
  const max = products.reduce((m, p) => Math.max(m, p.price), 0);
  if (max <= 0) return 1000;
  return Math.ceil(max / 50) * 50;
}

/** Cuenta productos por categoría ignorando el filtro de categoría actual. */
export function countByCategory(
  products: Product[],
  f: Filters
): Record<string, number> {
  const counts: Record<string, number> = {};
  const base = applyFilters(products, { ...f, category: null });
  for (const p of base) {
    if (p.categoryId) counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
  }
  return counts;
}
