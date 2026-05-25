"use client";
import { useState } from "react";
import { Badge, Icon, ProductImage, Stars } from "@/components";
import type { Review } from "@/lib/sample-product";
import { cn } from "@/lib/cn";

/**
 * ReviewItem — tarjeta de una reseña con avatar de iniciales,
 * fotos opcionales y botón "útil".
 */
export function ReviewItem({ r }: { r: Review }) {
  const [helpful, setHelpful] = useState(false);
  return (
    <article className="p-5 bg-surface border border-border rounded-lg flex gap-4">
      <div className="size-11 shrink-0 rounded-full bg-brand-grad text-white
                      inline-flex items-center justify-center font-display font-bold text-sm">
        {r.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between flex-wrap gap-2">
          <div>
            <div className="font-display font-semibold text-sm">{r.author}</div>
            <div className="mt-0.5 inline-flex items-center gap-2">
              <Stars value={r.rating} showValue={false} size={13} />
              <span className="text-xs text-text-soft">{r.date}</span>
            </div>
          </div>
          {r.hasPhoto && <Badge tone="neutral" size="xs">Con foto</Badge>}
        </div>
        <h4 className="mt-3 font-display font-semibold text-[15px]">{r.title}</h4>
        <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{r.body}</p>
        {r.hasPhoto && (
          <div className="mt-3 flex gap-1.5">
            {["#00D97A","#FF5C8A","#FFD23F"].map((a, i) => (
              <div key={i} className="size-[72px] rounded-md overflow-hidden border border-border">
                <ProductImage label="" accent={a} aspect="1/1" rounded="" />
              </div>
            ))}
          </div>
        )}
        <div className="mt-3.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHelpful(!helpful)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 min-h-9 rounded-full border-[1.5px]",
              "cursor-pointer text-xs font-display font-semibold transition",
              helpful
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-border bg-transparent text-text hover:border-brand-300",
            )}
          >
            <Icon name="check" size={13} strokeWidth={2.4} />
            {helpful ? "Útil para ti" : "¿Te fue útil?"}
            <span className="text-text-soft font-medium">· {r.helpful + (helpful ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
