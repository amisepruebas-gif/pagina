import Link from 'next/link';
import { searchProducts } from '@/lib/products';
import ProductGrid from '@/components/home/ProductGrid';

export const revalidate = 0;

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

  const results = await searchProducts(q, { limit: 60 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
          Resultados para <span className="text-accent">&ldquo;{q}&rdquo;</span>
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {results.length}{' '}
          {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      </header>

      {results.length === 0 ? <NoResults q={q} /> : <ProductGrid products={results} />}
    </div>
  );
}

function EmptyQuery() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-gray-900">Buscar productos</h1>
      <p className="mt-3 text-sm text-gray-600">
        Escribe algo en la barra de búsqueda del header.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-block rounded-full bg-accent text-white px-6 py-2 text-sm font-bold hover:bg-accent-600 transition-colors"
      >
        Ver toda la tienda
      </Link>
    </div>
  );
}

function NoResults({ q }: { q: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <p className="text-gray-700 font-semibold">
        No encontramos productos para &ldquo;{q}&rdquo;.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Prueba con otra palabra o explora todo el catálogo.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-block rounded-full bg-accent text-white px-6 py-2 text-sm font-bold hover:bg-accent-600 transition-colors"
      >
        Ver toda la tienda
      </Link>
    </div>
  );
}
