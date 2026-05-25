import { Icon, type IconName } from "@/components";

const ITEMS: { icon: IconName; title: string; sub: string }[] = [
  { icon: "truck",   title: "Envío rápido",  sub: "24–48h en ciudades principales" },
  { icon: "shield",  title: "Pago seguro",   sub: "Encriptación bancaria SSL" },
  { icon: "refresh", title: "Devoluciones",  sub: "30 días sin preguntas" },
  { icon: "spark",   title: "Soporte 24/7",  sub: "Chat, email y teléfono" },
];

/**
 * TrustBar — fila de beneficios. 2×2 en móvil, 1×4 en desktop.
 */
export function TrustBar() {
  return (
    <section className="bg-surface border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8
                      grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3 sm:gap-3.5">
            <span className="shrink-0 size-10 sm:size-11 rounded-md bg-brand-50 text-brand-700 inline-flex items-center justify-center">
              <Icon name={it.icon} size={20} />
            </span>
            <div className="min-w-0">
              <div className="font-display font-semibold text-[13px] sm:text-sm leading-tight">{it.title}</div>
              <div className="mt-0.5 text-[11px] sm:text-xs text-text-soft leading-tight">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
