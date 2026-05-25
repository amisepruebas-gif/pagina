"use client";
import Link from "next/link";
import { Badge, IconButton } from "@/components";
import { SITE_CONTENT, SITE_CONTENT_TYPE, type SiteContentBlock } from "@/lib/admin-rest";
import { DataTable } from "./DataTable";

/** SiteContentTable — lista de bloques de contenido editables del sitio. */
export function SiteContentTable({ blocks = SITE_CONTENT }: { blocks?: SiteContentBlock[] }) {
  return (
    <div className="p-6">
      <DataTable<SiteContentBlock>
        columns={[
          { key: "type", label: "Tipo", render: (r) => {
            const t = SITE_CONTENT_TYPE[r.type]; return <Badge tone={t.tone} size="xs">{t.label}</Badge>;
          }},
          { key: "name", label: "Nombre",
            render: (r) => <span className="font-display font-semibold">{r.name}</span> },
          { key: "page", label: "Página", render: (r) => <span className="text-text-muted">{r.page}</span> },
          { key: "order", label: "Orden", align: "center",
            render: (r) => <span className="font-mono text-xs">{r.order}</span> },
          { key: "range", label: "Vigencia", render: (r) => (
            <span className="text-xs text-text-soft">
              {r.fromAt}{r.toAt ? ` → ${r.toAt}` : " · sin fin"}
            </span>
          )},
          { key: "active", label: "Estado", render: (r) =>
            r.active ? <Badge tone="success" size="xs">Activo</Badge> : <Badge tone="neutral" size="xs">Pausado</Badge> },
          { key: "actions", label: "", align: "right", width: "100px", render: (r) => (
            <div className="inline-flex gap-1">
              <Link href={`/admin/contenido/${r.id}`}>
                <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
              </Link>
              <IconButton variant="ghost" icon="x" label="Eliminar" size="sm" className="!text-error" />
            </div>
          )},
        ]}
        rows={blocks}
      />
    </div>
  );
}
