"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, Button, Input, Select, Textarea } from "@/components";
import { COMPLAINT_STATUS_LABEL, type AdminComplaint, type ComplaintStatus } from "@/lib/admin-ops";
import { AdminPageHeader } from "./AdminPageHeader";

export interface ComplaintDetailProps { complaint: AdminComplaint }

/** ComplaintDetail — detalle del ticket con formulario de resolución. */
export function ComplaintDetail({ complaint }: ComplaintDetailProps) {
  const [status, setStatus]         = useState<ComplaintStatus>(complaint.status);
  const [resolution, setResolution] = useState("");
  const [refund, setRefund]         = useState("");
  const st = COMPLAINT_STATUS_LABEL[status];

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: "Admin",  href: "/admin" },
          { label: "Quejas", href: "/admin/quejas" },
          { label: complaint.id },
        ]}
        title={complaint.title}
        description={`${complaint.id} · ${complaint.date}`}
        action={
          <div className="flex gap-2">
            <Link href="/admin/quejas"><Button variant="secondary" leadingIcon="arr-left">Volver</Button></Link>
            <Button leadingIcon="check">Guardar resolución</Button>
          </div>
        }
      />
      <div className="p-6 grid gap-5 items-start xl:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5 min-w-0">
          <div className="bg-surface border border-border rounded-lg">
            <div className="px-3.5 py-3 flex justify-between items-center border-b border-border">
              <h3 className="font-display font-bold text-sm">Descripción de la queja</h3>
              <span className="text-[11px] text-text-soft font-mono">{complaint.type}</span>
            </div>
            <div className="p-4 text-sm leading-relaxed text-text">{complaint.body}</div>
          </div>

          <div className="bg-surface border border-border rounded-lg">
            <div className="px-3.5 py-3 border-b border-border">
              <h3 className="font-display font-bold text-sm">Resolución</h3>
            </div>
            <div className="p-4 flex flex-col gap-3.5">
              <Textarea label="Respuesta al cliente" rows={5}
                        placeholder="Describe la resolución que se aplicó…"
                        value={resolution} onChange={(e) => setResolution(e.target.value)} />
              <Input label="Monto de reembolso (opcional)" type="number" inputMode="decimal" leadingIcon="bolt"
                     value={refund} onChange={(e) => setRefund(e.target.value)}
                     hint="Deja vacío si no aplica reembolso." />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 min-w-0">
          <div className="bg-surface border border-border rounded-lg">
            <div className="p-3.5 flex justify-between items-center">
              <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-text-soft">Estado</span>
              <Badge tone={st.tone} size="sm">{st.label}</Badge>
            </div>
            <div className="px-3.5 pb-3.5">
              <Select label="Cambiar estado"
                      value={status} onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                      options={(Object.entries(COMPLAINT_STATUS_LABEL) as [ComplaintStatus, { label: string; tone: any }][]).map(
                        ([k, v]) => ({ value: k, label: v.label }))} />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg">
            <div className="px-3.5 py-3 border-b border-border">
              <h3 className="font-display font-bold text-sm">Cliente</h3>
            </div>
            <div className="p-3.5 text-sm">
              <div className="font-display font-semibold">{complaint.customer}</div>
              {complaint.order && (
                <div className="mt-1.5 text-xs text-text-muted">
                  Pedido: <code className="font-mono text-brand-700">{complaint.order}</code>
                </div>
              )}
              {complaint.order && (
                <Link href={`/admin/pedidos/${complaint.order}`}>
                  <Button size="sm" variant="secondary" leadingIcon="cart" className="mt-3">Ver pedido</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
