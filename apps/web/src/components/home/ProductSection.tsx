import SectionHeading from './SectionHeading';
import ProductGrid from './ProductGrid';
import type { Product } from '@/types/product';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  background?: 'white' | 'gray';
  emptyHint?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  background = 'white',
  emptyHint
}: ProductSectionProps) {
  return (
    <section className={`py-12 md:py-16 px-4 ${background === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="mt-10">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
              <p className="text-sm text-gray-500">
                {emptyHint ?? 'Aún no hay productos en esta sección.'}
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </section>
  );
}
