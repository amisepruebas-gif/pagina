import { Badge, Button, ProductImage } from "@/components";

/**
 * HeroSection — bloque de impacto en el tope de la home.
 *
 * - Titular dominante con énfasis en gradiente.
 * - CTAs full-width en móvil, en línea en desktop.
 * - Composición visual en collage rotado (oculta en pantallas muy chicas).
 * - Stats compactos al pie.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border
                        bg-[linear-gradient(120deg,var(--brand-50)_0%,#FFF9E6_55%,#FFE7EF_100%)]">
      <span aria-hidden className="pointer-events-none absolute -top-40 -right-24 size-[520px] rounded-full opacity-55 blur-[60px]"
            style={{ background: "var(--grad-from)" }} />
      <span aria-hidden className="pointer-events-none absolute -bottom-40 -left-16 size-[380px] rounded-full opacity-40 blur-[60px]"
            style={{ background: "var(--secondary)" }} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:py-20 lg:py-24 relative">
        <div className="grid gap-10 lg:gap-14 items-center lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Badge tone="gradient" leadingIcon="bolt">Temporada 2026</Badge>

            <h1 className="mt-4 sm:mt-5 font-display font-bold leading-[0.92] tracking-[-0.04em]
                           text-[clamp(40px,12vw,56px)] sm:text-6xl lg:text-[clamp(48px,8vw,104px)]">
              Encuentra <span className="bg-brand-grad bg-clip-text text-transparent">lo que sea</span>,<br />
              en un solo lugar.
            </h1>

            <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-text-muted">
              Miles de productos curados de todas las categorías.
              Envío rápido, devoluciones fáciles y la mejor relación calidad-precio.
            </p>

            {/* CTAs: stack + full-width on mobile, inline on ≥sm */}
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Button size="lg" trailingIcon="arr-right" fullWidth className="sm:!w-auto">
                Explorar catálogo
              </Button>
              <Button size="lg" variant="secondary" leadingIcon="bolt" fullWidth className="sm:!w-auto">
                Ver ofertas del día
              </Button>
            </div>

            <dl className="mt-10 sm:mt-14 flex flex-wrap gap-6 sm:gap-10">
              {[
                ["50K+", "Productos"],
                ["2K+",  "Marcas"],
                ["98%",  "Compradores felices"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display font-bold text-2xl sm:text-[32px] tracking-tight leading-none">{n}</dd>
                  <dd className="mt-1 font-mono text-[11px] sm:text-[12px] tracking-widest uppercase text-text-soft">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* collage — hidden on very small screens to save vertical space */}
          <div className="relative aspect-[4/5] min-h-[260px] sm:min-h-[340px] lg:min-h-[460px]
                          hidden xs:block max-w-md mx-auto lg:mx-0 w-full">
            <div className="absolute top-[10%] left-0 w-[55%] aspect-[3/4] rotate-[-5deg] rounded-xl overflow-hidden shadow-lg">
              <ProductImage label="HERO · A" accent="#00D97A" aspect="3/4" rounded="" />
            </div>
            <div className="absolute top-0 right-0 w-[55%] aspect-[3/4] rotate-[4deg] translate-y-[8%] rounded-xl overflow-hidden shadow-lg">
              <ProductImage label="HERO · B" accent="#FF5C8A" aspect="3/4" rounded="" />
            </div>
            <div className="absolute bottom-0 left-[20%] w-[55%] aspect-square rotate-[-3deg] rounded-xl overflow-hidden shadow-lg">
              <ProductImage label="HERO · C" accent="#FFD23F" aspect="1/1" rounded="" />
            </div>

            <div className="absolute top-[5%] -right-[8%] size-24 rounded-full text-[#1A1A14] shadow-lg
                            bg-gradient-to-br from-secondary to-accent border-4 border-surface
                            flex flex-col items-center justify-center font-display font-extrabold
                            animate-wiggle origin-center text-center">
              <span className="text-[11px] tracking-widest uppercase">Hasta</span>
              <span className="text-[28px] leading-none tracking-tight">-50%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
