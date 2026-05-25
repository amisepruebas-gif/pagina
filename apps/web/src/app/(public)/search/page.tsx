import type { Metadata } from 'next';
import Link from 'next/link';
import { searchProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getSubcategories } from '@/lib/subcategories';
import { getMaterials } from '@/lib/materials';
import { maxPriceOf } from '@/lib/shop-filters';
import { ShopClient } from '@/components/shop';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Búsqueda',
  robots: { index: false, follow: true }
};

interface SearchParams {
  q?: string;
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? '').trim();

  if (!q) return <EmptyQuery />;

  const [results, categories, subcategories, materials] = await Promise.all([
    searchProducts(q, { limit: 200 }),
    getCategories(),
    getSubcategories(),
    getMaterials()
  ]);

  return (
    <ShopClient
      mode="search"
      query={q}
      products={results}
      categories={categories}
      subcategories={subcategories}
      materials={materials}
      maxPrice={maxPriceOf(results)}
    />
  );
}

function EmptyQuery() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-text">
        Buscar productos
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        Escribe algo en la barra de búsqueda del encabezado.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-pill bg-brand-grad text-on-brand shadow-brand font-display font-semibold text-sm"
      >
        Ver toda la tienda
      </Link>
    </div>
  );
}
