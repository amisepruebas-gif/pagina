"use client";
import { notFound, useParams } from "next/navigation";
import { OrderDetail } from "@/components/admin";
import { ADMIN_ORDERS } from "@/lib/admin-ops";

/** /admin/pedidos/[id] — Renombrar carpeta a `[id]` al integrar. */
export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = ADMIN_ORDERS.find((o) => o.id === params.id);
  if (!order) return notFound();
  return <OrderDetail order={order} />;
}
