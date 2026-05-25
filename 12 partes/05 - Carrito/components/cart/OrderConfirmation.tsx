import { Button, Icon, ProductImage } from "@/components";
import { fmt, type Order } from "@/lib/sample-cart";
import { CheckPulse } from "./CheckPulse";

export interface OrderConfirmationProps {
  order: Order;
}

/**
 * OrderConfirmation — pantalla de éxito tras el pago.
 *
 * Estructura:
 * 1. Check animado + heading "¡Gracias por tu compra!"
 * 2. Tarjeta de pedido: número + total + lista de items + dirección/ETA
 * 3. Bloque destacado "Crea tu cuenta" (guest checkout)
 * 4. CTAs: "Ver mis pedidos" + "Seguir comprando"
 */
export function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2
                                   size-[520px] rounded-full opacity-55 blur-[60px]"
            style={{ background: "var(--grad-from)" }} />
      <span aria-hidden className="pointer-events-none absolute top-32 -right-28 size-[360px] rounded-full opacity-35 blur-[60px]"
            style={{ background: "var(--accent-2)" }} />

      <div className="relative max-w-3xl mx-auto text-center pt-14 pb-8 px-6">
        <CheckPulse />
        <h1 className="mt-7 font-display font-bold leading-[1.05] tracking-[-0.035em]
                       text-4xl sm:text-5xl lg:text-[clamp(36px,5.5vw,56px)]">
          ¡Gracias por tu compra!
        </h1>
        <p className="mt-3.5 text-base sm:text-[17px] text-text-muted max-w-md mx-auto leading-relaxed">
          Recibimos tu pedido y ya lo estamos preparando.
          Te enviamos una confirmación a <strong className="text-text">{order.email}</strong>.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto bg-surface border border-border rounded-xl overflow-hidden shadow-md">
        <div className="px-6 sm:px-7 py-6 grid gap-5 grid-cols-1 sm:grid-cols-2 border-b border-border
                        bg-[linear-gradient(120deg,var(--brand-50),transparent_50%,#FFF9E6)]">
          <div>
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-soft">Pedido</div>
            <div className="mt-1.5 font-display font-bold text-[22px] tracking-[-0.015em]">{order.number}</div>
            <div className="mt-1 text-xs text-text-muted">{order.date}</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-soft">Total pagado</div>
            <div className="mt-1.5 font-display font-bold text-3xl tracking-[-0.025em] bg-brand-grad bg-clip-text text-transparent">
              {fmt(order.total)}
            </div>
            <div className="mt-1 text-xs text-text-muted">Pago con {order.paymentMethod}</div>
          </div>
        </div>

        <div className="px-3 py-2">
          {order.items.map((it, i) => (
            <div key={it.id}
                 className={`grid gap-3.5 grid-cols-[64px_1fr_auto] p-3.5 items-center
                             ${i === 0 ? "" : "border-t border-border"}`}>
              <div className="size-16 rounded-sm overflow-hidden">
                <ProductImage src={it.image} label="" accent={it.accent} aspect="1/1" rounded="" />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-text-soft">{it.brand}</div>
                <div className="mt-0.5 font-display font-semibold text-sm leading-snug line-clamp-1">{it.name}</div>
                <div className="mt-0.5 text-xs text-text-soft">
                  Cant. {it.qty}
                  {it.variant?.size && ` · Talla ${it.variant.size}`}
                  {it.variant?.color && ` · ${it.variant.color}`}
                </div>
              </div>
              <div className="font-display font-bold text-[15px] whitespace-nowrap">
                {fmt(it.price * it.qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-surface-2 border-t border-border flex items-center gap-3 flex-wrap">
          <span className="size-9 rounded-full shrink-0 bg-surface text-brand-700 inline-flex items-center justify-center shadow-xs">
            <Icon name="truck" size={18} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-[200px]">
            <div className="font-display font-semibold text-sm">
              Llega entre el {order.eta.from} y {order.eta.to}
            </div>
            <div className="mt-0.5 text-xs text-text-muted">Envío a: {order.shippingAddress}</div>
          </div>
        </div>
      </div>

      {/* Create account block */}
      <div className="relative max-w-3xl mx-auto mt-8 p-6 border border-border rounded-xl
                      grid gap-4 grid-cols-1 sm:grid-cols-[1fr_auto] items-center
                      bg-[linear-gradient(120deg,var(--brand-50),#FFF9E6_60%,#FFE7EF)]">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-brand-700 font-semibold">
            <Icon name="spark" size={12} strokeWidth={2.4} />
            Solo te toma 30 segundos
          </div>
          <h3 className="mt-2 font-display font-bold tracking-[-0.015em]
                         text-lg sm:text-xl lg:text-[clamp(18px,2.5vw,22px)]">
            Crea tu cuenta y sigue tu pedido en tiempo real
          </h3>
          <p className="mt-1.5 text-[13px] text-text-muted max-w-sm">
            Guarda tus direcciones, accede al historial y recibe ofertas exclusivas.
          </p>
        </div>
        <Button trailingIcon="arr-right">Crear cuenta</Button>
      </div>

      {/* CTAs */}
      <div className="relative max-w-3xl mx-auto mt-8 flex gap-3 justify-center flex-wrap">
        <Button size="lg" variant="secondary" leadingIcon="grid">Ver mis pedidos</Button>
        <Button size="lg" trailingIcon="arr-right">Seguir comprando</Button>
      </div>
    </div>
  );
}
