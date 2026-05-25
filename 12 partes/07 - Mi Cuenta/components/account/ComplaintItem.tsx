import { Badge, Button, Tag } from "@/components";
import type { Complaint } from "@/lib/sample-account";

const STATUS = {
  open:          { label: "Abierto",    tone: "warning" },
  "in-progress": { label: "En proceso", tone: "info"    },
  resolved:      { label: "Resuelto",   tone: "success" },
} as const;

/** ComplaintItem — tarjeta de un ticket de soporte. */
export function ComplaintItem({ c }: { c: Complaint }) {
  const st = STATUS[c.status];
  return (
    <article className="bg-surface border border-border rounded-xl p-[18px] flex flex-col gap-3">
      <div className="flex justify-between flex-wrap gap-2">
        <div>
          <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-text-soft">
            Ticket {c.id} · {c.date}
          </div>
          <h3 className="mt-1 font-display font-bold text-base tracking-[-0.015em]">{c.title}</h3>
        </div>
        <Badge tone={st.tone}>{st.label}</Badge>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Tag>{c.type}</Tag>
        {c.order && <Tag tone="brand">Pedido: {c.order}</Tag>}
      </div>
      <p className="text-sm text-text-muted leading-relaxed m-0">{c.body}</p>
      <div className="flex justify-between items-center pt-3 border-t border-border gap-2 flex-wrap">
        <span className="text-xs text-text-soft">
          {c.replies} {c.replies === 1 ? "respuesta del equipo" : "respuestas del equipo"}
        </span>
        <Button size="sm" variant="secondary" trailingIcon="arr-right">Ver conversación</Button>
      </div>
    </article>
  );
}
