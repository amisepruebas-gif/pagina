import { Badge, Button, ProductImage } from "@/components";

/**
 * PromoBanner — banner ancho con gradiente de marca y CTA principal.
 */
export function PromoBanner() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl text-white shadow-lg
                        bg-[linear-gradient(120deg,var(--brand-500),var(--brand-700)_50%,var(--accent-2))]
                        p-7 sm:p-10 lg:p-16">
          <span aria-hidden className="absolute -top-20 -right-16 size-80 rounded-full blur-[40px]"
                style={{ background: "rgba(255,210,63,0.4)" }} />
          <span aria-hidden className="absolute -bottom-16 left-[30%] size-60 rounded-full blur-[40px]"
                style={{ background: "rgba(255,92,138,0.4)" }} />
          <span aria-hidden className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }} />

          <div className="relative grid gap-6 sm:gap-8 items-center lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Badge tone="accent" leadingIcon="bolt">Solo este fin de semana</Badge>
              <h2 className="mt-4 sm:mt-5 font-display font-bold leading-[0.95] tracking-[-0.035em]
                             text-3xl sm:text-5xl lg:text-[clamp(36px,6vw,72px)] text-white">
                40% off en<br />tu segunda compra.
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg opacity-90 max-w-md">
                Agrega cualquier dos productos al carrito y aplicamos el descuento automáticamente al pagar.
              </p>
              <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-3">
                <Button size="lg" variant="secondary" trailingIcon="arr-right" fullWidth className="sm:!w-auto">
                  Comprar ahora
                </Button>
                <Button size="lg" variant="ghost" fullWidth className="!text-white hover:!bg-white/10 sm:!w-auto">
                  Términos
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-1/4 right-0 w-[70%] aspect-square rotate-[-5deg] rounded-xl overflow-hidden shadow-lg">
                <ProductImage label="PROMO · A" accent="#FFD23F" aspect="1/1" rounded="" />
              </div>
              <div className="absolute -bottom-1/4 left-0 w-[60%] aspect-square rotate-[7deg] rounded-xl overflow-hidden shadow-lg">
                <ProductImage label="PROMO · B" accent="#FF5C8A" aspect="1/1" rounded="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
