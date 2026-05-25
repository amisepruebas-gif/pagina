import { SectionTitle } from "./SectionTitle";

interface VolumePricingProps {
  volume: { qty: string; price: number; save: number }[];
}

/**
 * VolumePricing — "más cantidad, mejor precio". El último tier se destaca como mejor.
 */
export function VolumePricing({ volume }: VolumePricingProps) {
  return (
    <section className="py-12 border-t border-border">
      <SectionTitle eyebrow="03 / Mayoreo">Más cantidad, mejor precio</SectionTitle>
      <div className={`grid gap-3 grid-cols-1 sm:grid-cols-${Math.min(volume.length, 3)} lg:grid-cols-${volume.length}`}
           style={{ gridTemplateColumns: `repeat(${volume.length}, minmax(0, 1fr))` }}>
        {volume.map((v, i) => {
          const best = i === volume.length - 1;
          return (
            <div key={v.qty}
                 className={`relative p-6 rounded-xl ${best
                   ? "bg-brand-50 border-2 border-brand-500"
                   : "bg-surface border border-border"}`}>
              {best && (
                <span className="absolute -top-3 right-5 px-3 py-1 rounded-full
                                 bg-brand-grad text-white shadow-brand
                                 font-display font-bold text-[11px] tracking-wider uppercase">
                  Mejor precio
                </span>
              )}
              <div className="font-mono text-[11px] tracking-widest uppercase text-text-soft">{v.qty}</div>
              <div className="mt-2 font-display font-bold text-3xl tracking-[-0.025em]">
                ${v.price.toLocaleString("es-MX")}
              </div>
              {v.save > 0 ? (
                <div className="mt-1.5 text-[13px] text-secondary-600 font-semibold">Ahorras {v.save}%</div>
              ) : (
                <div className="mt-1.5 text-[13px] text-text-soft">Precio regular</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
