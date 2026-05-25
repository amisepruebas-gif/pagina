"use client";
import { Button } from "@/components";
import { computeTotals, fmt, type CartItem, type AppliedCoupon } from "@/lib/sample-cart";

export interface MobileCheckoutBarProps {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  onCheckout?: () => void;
}

/**
 * MobileCheckoutBar — barra fija inferior en móvil con total + "Pagar".
 *
 * Oculta en `≥lg` (donde el `<OrderSummary/>` sticky se ve siempre).
 * Respeta `env(safe-area-inset-bottom)` para iOS.
 */
export function MobileCheckoutBar({ items, coupon, onCheckout }: MobileCheckoutBarProps) {
  if (items.length === 0) return null;
  const { total, count } = computeTotals(items, coupon);
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-50
                    bg-surface/95 backdrop-blur border-t border-border
                    shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.12)]
                    px-4 py-2.5 flex items-center gap-3
                    pb-[max(10px,env(safe-area-inset-bottom))]">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-text-soft">
          Total · {count} {count === 1 ? "artículo" : "artículos"}
        </div>
        <div className="font-display font-bold text-xl tracking-[-0.02em]">{fmt(total)}</div>
      </div>
      <Button size="md" trailingIcon="arr-right" onClick={onCheckout} className="shrink-0">
        Pagar
      </Button>
    </div>
  );
}
