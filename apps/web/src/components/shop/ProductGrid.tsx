import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';
import { ProductRow } from './ProductRow';
import type { ProductView } from './Toolbar';

interface ProductGridProps {
  products: Product[];
  view?: ProductView;
}

/** ProductGrid — grid de tarjetas o lista de filas según `view`. */
export function ProductGrid({ products, view = 'grid' }: ProductGridProps) {
  if (view === 'list') {
    return (
      <div className="mt-5 flex flex-col gap-3">
        {products.map((p, i) => (
          <ProductRow key={p.id} product={p} index={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="mt-5 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
      {products.map((p, i) => (
        <Link key={p.id} href={productHref(p)} className="block">
          <ProductCard variant="canonical" product={toUiProduct(p, i)} />
        </Link>
      ))}
    </div>
  );
}
