import { Button, Icon } from "@/components";

/**
 * EmptyCart — estado vacío del carrito con CTA a la tienda.
 * Decorado con blob de marca y ícono circular en gradiente.
 */
export function EmptyCart() {
  return (
    <div className="relative overflow-hidden text-center bg-surface
                    border-2 border-dashed border-border rounded-xl py-20 px-6">
      <span aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
                       size-80 rounded-full opacity-55 blur-[60px]"
            style={{ background: "var(--grad-from)" }} />
      <div className="relative inline-flex items-center justify-center size-[88px] rounded-full
                      text-white shadow-brand mb-6
                      bg-brand-grad">
        <Icon name="cart" size={36} strokeWidth={1.8} />
      </div>
      <h2 className="relative font-display font-bold tracking-[-0.025em] mb-2.5
                     text-3xl sm:text-4xl lg:text-[clamp(28px,4vw,36px)]">
        Tu carrito está vacío.
      </h2>
      <p className="relative text-text-muted max-w-md mx-auto mb-7 text-base leading-relaxed">
        Cuando agregues algo, lo verás aquí. Mientras tanto, echa un vistazo a lo que está pasando en el catálogo.
      </p>
      <div className="relative inline-flex gap-2.5 flex-wrap justify-center">
        <Button size="lg" trailingIcon="arr-right">Explorar la tienda</Button>
        <Button size="lg" variant="secondary">Ver ofertas</Button>
      </div>
    </div>
  );
}
