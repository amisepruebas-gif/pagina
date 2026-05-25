import Link from 'next/link';
import { ProductCard } from '@/components/ui';
import type { Product } from '@/types/product';
import type { FeaturedConfig } from '@/types/home-config';
import { toUiProduct, productHref } from '@/lib/ui-adapters';

/** FeaturedProducts — grid de productos destacados (isFeatured=true). */
export function FeaturedProducts({
  config,
  products
}: {
  config: FeaturedConfig;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-surface-2">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6 sm:mb-9">
          <div>
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {config.eyebrow}
            </span>
            <h2 className="mt-3.5 font-display font-bold leading-none tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[clamp(32px,4.5vw,52px)]">
              {config.titlePre}
              <span className="bg-brand-grad bg-clip-text text-transparent">
                {config.titleAccent}
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-muted max-w-lg">
              {config.paragraph}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {products.map((p, i) => (
            <Link key={p.id} href={productHref(p)} className="block">
              <ProductCard variant="canonical" product={toUiProduct(p, i)} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
