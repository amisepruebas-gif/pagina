"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, IconButton, Pill } from "@/components";
import { ADMIN_COMPLAINTS, COMPLAINT_STATUS_LABEL, type AdminComplaint, type ComplaintStatus } from "@/lib/admin-ops";
import { DataTable } from "./DataTable";

/** ComplaintsTable — lista de tickets con filtros por estado. */
export function ComplaintsTable({ items = ADMIN_COMPLAINTS }: { items?: AdminComplaint[] }) {
  const [filter, setFilter] = useState<"all" | ComplaintStatus>("all");
  const list = filter === "all" ? items : items.filter((c) => c.status === filter);
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="inline-flex gap-1.5 flex-wrap">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>Todas</Pill>
        {(Object.entries(COMPLAINT_STATUS_LABEL) as [ComplaintStatus, { label: string; tone: any }][]).map(([k, v]) => (
          <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>{v.label}</Pill>
        ))}
      </div>
      <DataTable<AdminComplaint>
        columns={[
          { key: "id", label: "Ticket", render: (r) => <code className="font-mono font-semibold">{r.id}</code> },
          { key: "title", label: "Título", render: (r) => (
            <div>
              <div className="font-display font-semibold">{r.title}</div>
              <div className="text-[11px] text-text-soft">{r.type}{r.order && ` · ${r.order}`}</div>
            </div>
          )},
          { key: "customer", label: "Cliente" },
          { key: "date", label: "Fecha", render: (r) => <span className="text-text-soft">{r.date}</span> },
          { key: "status", label: "Estado", render: (r) => {
            const st = COMPLAINT_STATUS_LABEL[r.status]; return <Badge tone={st.tone} size="xs">{st.label}</Badge>;
          }},
          { key: "actions", label: "", align: "right", width: "80px", render: (r) => (
            <Link href={`/admin/quejas/${r.id}`}>
              <IconButton variant="ghost" icon="arr-right" label="Abrir" size="sm" />
            </Link>
          )},
        ]}
        rows={list}
      />
    </div>
  );
}
