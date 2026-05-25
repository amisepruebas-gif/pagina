"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, IconButton, Input, Pill } from "@/components";
import { ADMIN_ORDERS, ORDER_STATUS_LABEL, type AdminOrder, type OrderStatus } from "@/lib/admin-ops";
import { fmtMx } from "@/lib/admin-catalog";
import { DataTable } from "./DataTable";

/** OrdersTable — lista de pedidos con filtros por estado. */
export function OrdersTable({ orders = ADMIN_ORDERS }: { orders?: AdminOrder[] }) {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex gap-2.5 flex-wrap items-center">
        <div className="flex-1 min-w-[200px] max-w-[320px]">
          <Input leadingIcon="search" placeholder="Buscar pedido o cliente…" className="!h-9" />
        </div>
        <div className="inline-flex gap-1.5 flex-wrap">
          <Pill active={filter === "all"} onClick={() => setFilter("all")}>Todos</Pill>
          {(Object.entries(ORDER_STATUS_LABEL) as [OrderStatus, { label: string; tone: any }][]).map(([k, v]) => (
            <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>{v.label}</Pill>
          ))}
        </div>
      </div>

      <DataTable<AdminOrder>
        columns={[
          { key: "id", label: "Pedido", render: (r) => <code className="font-mono font-semibold">{r.id}</code> },
          { key: "date", label: "Fecha", render: (r) => <span className="text-text-soft">{r.date}</span> },
          { key: "customer", label: "Cliente", render: (r) => (
            <div className="flex items-center gap-2">
              <span className="size-7 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                               font-display font-bold text-[11px]">{r.customer.initials}</span>
              <div>
                <div className="font-semibold">{r.customer.name}</div>
                <div className="text-[11px] text-text-soft">{r.customer.email}</div>
              </div>
            </div>
          )},
          { key: "status", label: "Estado", render: (r) => {
            const st = ORDER_STATUS_LABEL[r.status]; return <Badge tone={st.tone} size="xs">{st.label}</Badge>;
          }},
          { key: "total", label: "Total", align: "right",
            render: (r) => <span className="font-display font-bold">{fmtMx(r.total)}</span> },
          { key: "actions", label: "", align: "right", width: "80px", render: (r) => (
            <Link href={`/admin/pedidos/${r.id}`}>
              <IconButton variant="ghost" icon="arr-right" label="Abrir" size="sm" />
            </Link>
          )},
        ]}
        rows={list}
      />
    </div>
  );
}
