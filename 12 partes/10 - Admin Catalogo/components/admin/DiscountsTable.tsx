"use client";
import Link from "next/link";
import { Badge, IconButton } from "@/components";
import { ADMIN_DISCOUNTS, type AdminDiscount, type DiscountType } from "@/lib/admin-catalog";
import { DataTable } from "./DataTable";

const TYPE_TONE: Record<DiscountType, "info" | "secondary" | "accent"> = {
  "global":    "info",
  "categoría": "secondary",
  "producto":  "accent",
};

export interface DiscountsTableProps { discounts?: AdminDiscount[] }

/** DiscountsTable — lista de descuentos con tipo, %, vigencia y estado. */
export function DiscountsTable({ discounts = ADMIN_DISCOUNTS }: DiscountsTableProps) {
  return (
    <div className="p-6">
      <DataTable<AdminDiscount>
        columns={[
          { key: "name", label: "Nombre", render: (r) => (
            <div>
              <div className="font-display font-semibold">{r.name}</div>
              {r.code && <code className="font-mono text-[11px] text-text-soft">{r.code}</code>}
            </div>
          )},
          { key: "type", label: "Tipo", render: (r) => <Badge tone={TYPE_TONE[r.type]} size="xs">{r.type}</Badge> },
          { key: "pct", label: "Porcentaje", align: "right",
            render: (r) => <span className="font-display font-bold">{r.pct}%</span> },
          { key: "range", label: "Vigencia", render: (r) => (
            <span className="text-xs text-text-muted">{r.from} → {r.to}</span>
          )},
          { key: "active", label: "Estado", render: (r) =>
            r.active ? <Badge tone="success" size="xs">Activo</Badge> : <Badge tone="neutral" size="xs">Pausado</Badge> },
          { key: "actions", label: "Acciones", align: "right", width: "100px", render: (r) => (
            <div className="inline-flex gap-1">
              <Link href={`/admin/descuentos/${r.id}`}>
                <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              </Link>
              <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" className="!text-error" />
            </div>
          )},
        ]}
        rows={discounts}
      />
    </div>
  );
}
