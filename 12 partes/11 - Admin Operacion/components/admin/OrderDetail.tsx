"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Input, Select } from "@/components";
import { ADMIN_ORDERS, ORDER_STATUS_LABEL, type AdminOrder, type OrderStatus } from "@/lib/admin-ops";
import { fmtMx } from "@/lib/admin-catalog";
import { AdminPageHeader } from "./AdminPageHeader";
import { OrderTimeline } from "./OrderTimeline";

export interface OrderDetailProps { order: AdminOrder }

/**
 * OrderDetail — vista completa de un pedido: productos + timeline en la
 * columna izquierda, y estado / cliente / totales en una sidebar a la derecha.
 */
export function OrderDetail({ order }: OrderDetailProps) {
  const [status, setStatus]     = useState<OrderStatus>(order.status);
  const [courier, setCourier]   = useState(order.courier ?? "");
  const [tracking, setTracking] = useState(order.tracking ?? "");

  const st = ORDER_STATUS_LABEL[status];
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = Math.round(subtotal * 0.05);
  const total    = subtotal - discount + shipping;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: "Admin",   href: "/admin" },
          { label: "Pedidos", href: "/admin/pedidos" },
          { label: order.id },
        ]}
        title={`Pedido ${order.id}`}
        description={`${order.date} · ${order.customer.name}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/pedidos">
              <Button variant="secondary" leadingIcon="arr-left">Volver</Button>
            </Link>
            <Button variant="secondary" leadingIcon="grid">Imprimir</Button>
            <Button leadingIcon="check">Guardar cambios</Button>
          </div>
        }
      />

      <div className="p-6 grid gap-5 items-start xl:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="flex flex-col gap-5 min-w-0">
          <Card>
            <CardHeader title="Productos" badge={`${order.items.length} ítems`} />
            <div>
              {order.items.length === 0 ? (
                <div className="py-5 text-center text-text-soft text-[13px]">Sin productos guardados en esta demo.</div>
              ) : (
                order.items.map((it, i) => (
                  <div key={it.id} className={`grid grid-cols-[44px_1fr_auto] gap-3 p-3.5 items-center
                                                ${i === 0 ? "" : "border-t border-border"}`}>
                    <span className="size-11 rounded-sm" style={{ background: it.accent }} />
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm">{it.name}</div>
                      <div className="text-[11px] text-text-soft font-mono">
                        {it.sku}
                        {it.variant?.size  && ` · Talla ${it.variant.size}`}
                        {it.variant?.color && ` · ${it.variant.color}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold">{fmtMx(it.price * it.qty)}</div>
                      <div className="text-[11px] text-text-soft">{it.qty} × {fmtMx(it.price)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Timeline" />
            <OrderTimeline events={order.timeline} />
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5 min-w-0">
          <Card>
            <div className="p-3.5 flex justify-between items-center">
              <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-text-soft">Estado actual</span>
              <Badge tone={st.tone} size="sm">{st.label}</Badge>
            </div>
            <div className="px-3.5 pb-3.5 flex flex-col gap-2.5">
              <Select label="Cambiar estado"
                      value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      options={(Object.entries(ORDER_STATUS_LABEL) as [OrderStatus, { label: string; tone: any }][]).map(
                        ([k, v]) => ({ value: k, label: v.label }))} />
              <Input label="Paquetería" placeholder="FedEx / Estafeta / DHL"
                     value={courier} onChange={(e) => setCourier(e.target.value)} />
              <Input label="Número de guía" placeholder="EST-9482-MX"
                     value={tracking} onChange={(e) => setTracking(e.target.value)} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Cliente" />
            <div className="p-3.5 flex items-center gap-3 border-b border-border">
              <span className="size-10 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                               font-display font-bold text-[13px]">{order.customer.initials}</span>
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm">{order.customer.name}</div>
                <div className="text-xs text-text-soft">{order.customer.email}</div>
              </div>
            </div>
            <div className="p-3.5 text-[13px] text-text-muted flex flex-col gap-1">
              <div>{order.customer.phone}</div>
              <div className="pt-1.5 border-t border-dashed border-border">
                <div className="font-display font-semibold text-xs text-text mb-0.5">Envío</div>
                {order.shipping}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Totales" />
            <div className="p-3.5 flex flex-col gap-2 text-[13px]">
              <Row label="Subtotal" value={fmtMx(subtotal)} />
              <Row label="Descuento" value={`− ${fmtMx(discount)}`} positive />
              <Row label="Envío" value={shipping === 0 ? "Gratis" : fmtMx(shipping)} />
              <div className="flex justify-between pt-2.5 border-t border-border">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display font-bold text-lg">{fmtMx(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface border border-border rounded-lg">{children}</div>;
}
function CardHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="px-3.5 py-3 flex justify-between items-center border-b border-border">
      <h3 className="font-display font-bold text-sm">{title}</h3>
      {badge && <span className="text-[11px] text-text-soft font-mono">{badge}</span>}
    </div>
  );
}
function Row({ label, value, positive }: { label: string; value: React.ReactNode; positive?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted">{label}</span>
      <span className={`font-display font-semibold ${positive ? "text-success" : "text-text"}`}>{value}</span>
    </div>
  );
}
