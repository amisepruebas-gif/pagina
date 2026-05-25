"use client";
import { Icon } from "@/components";
import { Button } from "@/components";
import { CouponBox } from "./CouponBox";
import {
  computeTotals, fmt, FREE_SHIPPING_THRESHOLD,
  type CartItem, type AppliedCoupon,
} from "@/lib/sample-cart";

export interface OrderSummaryProps {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  onApplyCoupon: (coupon: AppliedCoupon) => void;
  onRemoveCoupon: () => void;
  onCheckout?: () => void;
  /** Si `true`, no aplica sticky (útil cuando el resumen va inline en móvil). */
  compact?: boolean;
}

/**
 * OrderSummary — bloque lateral del carrito.
 *
 * Estructura: título · cupón · subtotal + ahorros + cupón + envío · total destacado
 * · CTA "Continuar al pago" · link "Seguir comprando" · trust signals + pagos.
 *
 * Sticky en desktop, inline en móvil (`compact`).
 */
export function OrderSummary({
  items, coupon, onApplyCoupon, onRemoveCoupon, onCheckout, compact,
}: OrderSummaryProps) {
  const { subtotal, itemsSavings, couponDisc, shipping, total, count } = computeTotals(items, coupon);

  return (
    <aside className={`bg-surface border border-border rounded-xl p-6 flex flex-col gap-[18px]
                       ${compact ? "static" : "sticky top-6"}`}>
      <h2 className="font-display font-bold text-xl tracking-[-0.015em]">Resumen del pedido</h2>

      <CouponBox applied={coupon} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />

      <div className="flex flex-col gap-2.5">
        <Row label={`Subtotal (${count} ${count === 1 ? "artículo" : "artículos"})`} value={fmt(subtotal)} />
        {itemsSavings > 0 && (
          <Row label="Descuentos del producto" value={`− ${fmt(itemsSavings)}`} positive />
        )}
        {coupon && couponDisc > 0 && (
          <Row label={`Cupón (${coupon.label})`} value={`− ${fmt(couponDisc)}`} positive />
        )}
        <Row
          label="Envío"
          value={shipping === 0
            ? <span className="text-success font-semibold">Gratis</span>
            : fmt(shipping)
          }
        />
        {shipping > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="px-3 py-2.5 rounded-sm bg-brand-50 text-brand-700 text-xs leading-relaxed flex items-center gap-2">
            <Icon name="truck" size={14} strokeWidth={2} />
            Agrega <strong className="font-bold">{fmt(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> más y tu envío es gratis.
          </div>
        )}
      </div>

      <div className="flex justify-between items-baseline pt-4 border-t border-border">
        <span className="font-display font-semibold text-sm text-text-muted">Total</span>
        <span className="font-display font-bold text-3xl tracking-[-0.025em]">{fmt(total)}</span>
      </div>

      <Button size="lg" trailingIcon="arr-right" onClick={onCheckout} fullWidth className="!h-[54px]">
        Continuar al pago
      </Button>

      <a href="/shop" className="text-center no-underline text-brand-700 text-[13px] font-semibold font-display py-2">
        Seguir comprando
      </a>

      <div className="flex flex-col gap-2 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Icon name="shield" size={14} strokeWidth={2} className="text-brand-700" />
          Pago seguro con encriptación SSL
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["VISA", "MC", "AMEX", "OXXO", "MP"].map((p) => (
            <span key={p} className="px-2 py-1 rounded-xs border border-border font-mono text-[10px] font-semibold text-text-soft tracking-wider">
              {p}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, positive }: { label: string; value: React.ReactNode; positive?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className={`font-display font-semibold ${positive ? "text-success" : "text-text"}`}>{value}</span>
    </div>
  );
}
