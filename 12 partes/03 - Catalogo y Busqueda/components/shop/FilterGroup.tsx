"use client";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface FilterGroupProps {
  title: string;
  /** Si > 0, muestra un badge con el conteo. */
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * FilterGroup — sección colapsable de filtros. Tap target del encabezado 48px.
 */
export function FilterGroup({ title, count, defaultOpen = true, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex justify-between items-center py-4 min-h-12
                   bg-transparent border-0 cursor-pointer
                   font-display font-semibold text-sm text-text text-left"
      >
        <span className="inline-flex items-center gap-2">
          {title}
          {count && count > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full
                             bg-brand-500 text-white text-[11px] font-bold">
              {count}
            </span>
          )}
        </span>
        <Icon name="chev-down" size={16} strokeWidth={2}
              className={cn("text-text-soft transition-transform duration-base ease-out",
                            open && "rotate-180")} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
