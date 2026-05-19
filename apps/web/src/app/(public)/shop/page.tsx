import Link from 'next/link';
import { getProducts } from '@/lib/products';
import ProductGrid from '@/components/home/ProductGrid';
import { placeholderCategories } from '@/data/placeholder';

export const revalidate = 0;

interface ShopSearchParams {
  cat?: string;
  sale?: string;
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;

  const products = await getProducts({
    categoryId: params.cat,
    onlySale: params.sale === 'true',
    limit: 60
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
          Tienda
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
          {params.cat ? ` en ${params.cat}` : ''}
          {params.sale === 'true' ? ' en oferta' : ''}
        </p>
      </header>

      <CategoryPills active={params.cat} sale={params.sale === 'true'} />

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

function CategoryPills({ active, sale }: { active?: string; sale?: boolean }) {
  const pillBase =
    'shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors whitespace-nowrap';
  const pillIdle = 'bg-white text-gray-700 border-gray-200 hover:border-accent';
  const pillActive = 'bg-accent text-white border-accent';

  return (
    <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
      <Link
        href="/shop"
        className={`${pillBase} ${!active && !sale ? pillActive : pillIdle}`}
      >
        Todos
      </Link>
      <Link
        href="/shop?sale=true"
        className={`${pillBase} ${sale ? pillActive : pillIdle}`}
      >
        En oferta
      </Link>
      {placeholderCategories.map((c) => (
        <Link
          key={c.id}
          href={`/shop?cat=${c.id}`}
          className={`${pillBase} ${active === c.id ? pillActive : pillIdle}`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <p className="text-gray-700 font-semibold">No hay productos que coincidan.</p>
      <p className="mt-2 text-sm text-gray-500">
        Para agregar productos, ve a la consola de Firestore.
      </p>
      <a
        href="https://console.firebase.google.com/project/pgina-48477/firestore/data/~2Fproducts"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4"
      >
        Abrir Firestore Console →
      </a>
    </div>
  );
}
