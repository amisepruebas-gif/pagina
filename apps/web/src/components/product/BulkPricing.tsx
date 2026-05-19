import type { Product } from '@/types/product';

export default function BulkPricing({ product }: { product: Product }) {
  if (!product.bulkPricing || product.bulkPricing.length === 0) return null;

  const tiers = [...product.bulkPricing].sort((a, b) => a.minQty - b.minQty);

  return (
    <div className="mt-6 rounded-xl border border-accent-200 bg-accent-50 p-4">
      <h3 className="text-sm font-bold text-accent-800 uppercase tracking-wide">
        Precios por volumen
      </h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {tiers.map((tier, i) => {
          const perUnit = tier.totalPrice / tier.minQty;
          return (
            <li
              key={i}
              className="flex flex-wrap items-baseline justify-between gap-2 text-accent-900"
            >
              <span>
                <span className="font-semibold">{tier.minQty}+</span> piezas
                {tier.discountPct !== undefined && (
                  <span className="ml-2 rounded-full bg-white text-accent-700 text-[10px] font-bold px-2 py-0.5">
                    −{tier.discountPct}%
                  </span>
                )}
              </span>
              <span className="font-semibold">
                ${tier.totalPrice.toFixed(2)}
                <span className="text-xs font-normal text-accent-700 ml-1">
                  (${perUnit.toFixed(2)} c/u)
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
