import { Badge, Button, ProductImage } from "@/components";
import { ORDER_STATUS, type AccountOrder } from "@/lib/sample-account";
import { fmt } from "@/lib/sample-cart";
import { OrderTracker } from "./OrderTracker";

export interface OrderCardProps {
  order: AccountOrder;
  onReorder?: (order: AccountOrder) => void;
  onView?: (order: AccountOrder) => void;
}

/**
 * OrderCard — tarjeta de un pedido en el historial: header (id/fecha + estado/total)
 * + thumbnails de productos + `<OrderTracker/>` embebido + CTAs.
 */
export function OrderCard({ order, onReorder, onView }: OrderCardProps) {
  const st = ORDER_STATUS[order.status];
  return (
    <article className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex justify-between flex-wrap gap-3 pb-3.5 border-b border-border">
        <div>
          <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft">Pedido</div>
          <div className="mt-1 font-display font-bold text-[17px] tracking-[-0.015em]">{order.id}</div>
          <div className="mt-1 text-xs text-text-muted">{order.date}</div>
        </div>
        <div className="text-right">
          <Badge tone={st.tone}>{st.label}</Badge>
          <div className="mt-2 font-display font-bold text-xl tracking-[-0.02em]">{fmt(order.total)}</div>
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        {order.items.slice(0, 4).map((it, i) => (
          <div key={i} className="size-14 rounded-sm overflow-hidden shrink-0">
            <ProductImage src={it.image} label="" accent={it.accent} aspect="1/1" rounded="" />
          </div>
        ))}
        <span className="text-xs text-text-muted">
          {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
        </span>
      </div>

      <OrderTracker status={order.status} courier={order.courier} tracking={order.tracking} />

      <div className="flex gap-2 flex-wrap justify-end">
        <Button variant="secondary" size="sm" leadingIcon="refresh" onClick={() => onReorder?.(order)}>
          Re-ordenar
        </Button>
        <Button variant="secondary" size="sm" trailingIcon="arr-right" onClick={() => onView?.(order)}>
          Ver detalle
        </Button>
      </div>
    </article>
  );
}
