import Link from 'next/link';
import type { ViewModule } from '@/types/page-view';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';

/** Módulo "Sección de productos" — grid con los productos seleccionados. */
export default function ViewProducts({
  module,
  products
}: {
  module: ViewModule;
  products: Product[];
}) {
  const ids = [...new Set(module.productIds ?? [])];
  const picked = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (picked.length === 0) return null;

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {module.title && (
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em]">
            {module.title}
          </h2>
        )}
        {module.subtitle && (
          <p className="mt-1 text-sm text-text-muted">{module.subtitle}</p>
        )}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {picked.map((p, i) => (
            <Link key={p.id} href={productHref(p)} className="block">
              <ProductCard variant="canonical" product={toUiProduct(p, i)} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
