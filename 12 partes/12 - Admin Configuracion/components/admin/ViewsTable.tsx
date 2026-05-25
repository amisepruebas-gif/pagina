"use client";
import Link from "next/link";
import { Badge, IconButton } from "@/components";
import { ADMIN_VIEWS, type AdminView } from "@/lib/admin-rest";
import { DataTable } from "./DataTable";

/** ViewsTable — listado de vistas dinámicas (/v/[slug]). */
export function ViewsTable({ views = ADMIN_VIEWS }: { views?: AdminView[] }) {
  return (
    <div className="p-6">
      <DataTable<AdminView>
        columns={[
          { key: "name", label: "Nombre", render: (r) => (
            <div>
              <div className="font-display font-semibold">{r.name}</div>
              <code className="font-mono text-[11px] text-text-soft">/v/{r.slug}</code>
            </div>
          )},
          { key: "modules", label: "Módulos", align: "center",
            render: (r) => <span className="font-display font-semibold">{r.modules}</span> },
          { key: "active", label: "Estado", render: (r) =>
            r.active ? <Badge tone="success" size="xs">Activa</Badge> : <Badge tone="neutral" size="xs">Borrador</Badge> },
          { key: "actions", label: "", align: "right", width: "140px", render: (r) => (
            <div className="inline-flex gap-1">
              <IconButton variant="ghost" icon="eye" label="Ver" size="sm" />
              <Link href={`/admin/vistas/${r.id}`}>
                <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              </Link>
              <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" className="!text-error" />
            </div>
          )},
        ]}
        rows={views}
      />
    </div>
  );
}
