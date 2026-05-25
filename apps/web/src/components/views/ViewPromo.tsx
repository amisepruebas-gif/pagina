import Link from 'next/link';
import type { ViewModule } from '@/types/page-view';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/ui';
import { toUiProduct, productHref } from '@/lib/ui-adapters';
import PromoCountdown from './PromoCountdown';

/**
 * Módulo "Sección promocional" — grid de productos con estilo configurable
 * (fondo, badge, contador regresivo) para campañas con fecha límite.
 */
export default function ViewPromo({
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

  const cfg = module.promoConfig ?? {};
  const bg = cfg.bgColor || '#1A1A14';
  const text = cfg.textColor || '#ffffff';

  return (
    <section className="py-12 px-4 sm:px-6" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-7xl">
        {cfg.badgeText && (
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-display font-bold uppercase tracking-wide"
            style={{
              backgroundColor: cfg.badgeColor || 'var(--secondary)',
              color: '#fff'
            }}
          >
            {cfg.badgeText}
          </span>
        )}

        <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {module.title && (
              <h2
                className="font-display text-2xl md:text-3xl font-bold tracking-[-0.025em]"
                style={{ color: text }}
              >
                {module.title}
              </h2>
            )}
            {module.subtitle && (
              <p
                className="mt-1 text-sm"
                style={{ color: text, opacity: 0.85 }}
              >
                {module.subtitle}
              </p>
            )}
          </div>
          {cfg.countdownEnd && (
            <PromoCountdown endsAt={cfg.countdownEnd} color={text} />
          )}
        </div>

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
