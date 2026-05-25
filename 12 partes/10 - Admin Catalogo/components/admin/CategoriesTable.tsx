"use client";
import Link from "next/link";
import { Badge, IconButton } from "@/components";
import { ADMIN_CATEGORIES, type AdminCategory } from "@/lib/admin-catalog";
import { DataTable } from "./DataTable";

export interface CategoriesTableProps { categories?: AdminCategory[] }

/** CategoriesTable — lista de categorías con preview de color/gradiente. */
export function CategoriesTable({ categories = ADMIN_CATEGORIES }: CategoriesTableProps) {
  return (
    <div className="p-6">
      <DataTable<AdminCategory>
        columns={[
          { key: "preview", label: "", width: "72px", render: (r) => (
            <div className="w-14 h-10 rounded-sm shadow-xs"
                 style={{ background: `linear-gradient(135deg, ${r.accent}, color-mix(in oklch, ${r.accent} 60%, #fff))` }} />
          )},
          { key: "name", label: "Nombre", render: (r) => (
            <div>
              <div className="font-display font-semibold">{r.name}</div>
              <code className="font-mono text-[11px] text-text-soft">/{r.slug}</code>
            </div>
          )},
          { key: "count", label: "Productos", align: "right",
            render: (r) => <span className="font-display font-semibold">{r.count.toLocaleString("es-MX")}</span> },
          { key: "order", label: "Orden", align: "center",
            render: (r) => <span className="font-mono text-xs">{r.order}</span> },
          { key: "active", label: "Estado", render: (r) =>
            r.active ? <Badge tone="success" size="xs">Activa</Badge> : <Badge tone="neutral" size="xs">Inactiva</Badge> },
          { key: "actions", label: "Acciones", align: "right", width: "100px", render: (r) => (
            <div className="inline-flex gap-1">
              <Link href={`/admin/categorias/${r.id}`}>
                <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              </Link>
              <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" className="!text-error" />
            </div>
          )},
        ]}
        rows={categories}
      />
    </div>
  );
}
