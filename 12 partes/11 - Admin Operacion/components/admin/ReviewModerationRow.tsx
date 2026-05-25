"use client";
import { Badge, Button, Stars } from "@/components";
import type { AdminReview } from "@/lib/admin-ops";
import { cn } from "@/lib/cn";

export interface ReviewModerationRowProps {
  review: AdminReview;
  onToggleVisible: (id: string) => void;
  onDelete: (id: string) => void;
}

/** ReviewModerationRow — tarjeta de una reseña con acciones de moderación. */
export function ReviewModerationRow({ review: r, onToggleVisible, onDelete }: ReviewModerationRowProps) {
  return (
    <article className={cn(
      "bg-surface rounded-lg p-[18px]",
      "grid gap-3.5 grid-cols-[44px_1fr_auto] sm:grid-cols-[44px_1fr_auto] items-start",
      r.flagged ? "border-[1.5px] border-warning" : "border border-border",
      !r.visible && "opacity-70",
    )}>
      <span className="size-11 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center
                       font-display font-bold text-sm">{r.initials}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-display font-semibold text-sm">{r.author}</span>
          <Stars value={r.rating} showValue={false} size={13} />
          <span className="text-[11px] text-text-soft">· {r.date}</span>
          {r.flagged && <Badge tone="warning" size="xs" leadingIcon="warn">Flagged</Badge>}
          {!r.visible && <Badge tone="neutral" size="xs">Oculta</Badge>}
        </div>
        <div className="mt-1 text-xs text-text-soft font-mono">Sobre: {r.product}</div>
        <p className="mt-2 text-sm text-text leading-relaxed">{r.text}</p>
      </div>
      <div className="flex flex-row sm:flex-col gap-1.5 col-span-3 sm:col-span-1">
        <Button size="sm" variant="secondary"
                leadingIcon={r.visible ? "eye" : "check"}
                onClick={() => onToggleVisible(r.id)}>
          {r.visible ? "Ocultar" : "Mostrar"}
        </Button>
        <Button size="sm" variant="ghost" leadingIcon="x"
                onClick={() => onDelete(r.id)} className="!text-error">
          Eliminar
        </Button>
      </div>
    </article>
  );
}
