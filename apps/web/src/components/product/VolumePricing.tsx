import type { Product } from '@/types/product';
import { SectionTitle } from './SectionTitle';

const money = (n: number) => '$' + n.toLocaleString('es-MX', { maximumFractionDigits: 2 });

/** VolumePricing — precios por volumen. El último tier se destaca como mejor. */
export function VolumePricing({ product }: { product: Product }) {
  if (!product.bulkPricing || product.bulkPricing.length === 0) return null;
  const tiers = [...product.bulkPricing].sort((a, b) => a.minQty - b.minQty);

  return (
    <section className="py-12 border-t border-border">
      <SectionTitle eyebrow="Mayoreo">Más cantidad, mejor precio</SectionTitle>
      <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {tiers.map((t, i) => {
          const best = i === tiers.length - 1;
          const perUnit = t.totalPrice / t.minQty;
          return (
            <div
              key={i}
              className={`relative p-6 rounded-xl ${
                best
                  ? 'bg-brand-50 border-2 border-brand-500'
                  : 'bg-surface border border-border'
              }`}
            >
              {best && (
                <span className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-brand-grad text-white shadow-brand font-display font-bold text-[11px] tracking-wider uppercase">
                  Mejor precio
                </span>
              )}
              <div className="font-mono text-[11px] tracking-widest uppercase text-text-soft">
                {t.minQty}+ piezas
              </div>
              <div className="mt-2 font-display font-bold text-3xl tracking-[-0.025em]">
                {money(t.totalPrice)}
              </div>
              <div className="mt-1.5 text-[13px] text-text-soft">
                {money(perUnit)} c/u
              </div>
              {t.discountPct !== undefined && t.discountPct > 0 && (
                <div className="mt-1 text-[13px] text-secondary-600 font-semibold">
                  Ahorras {t.discountPct}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
