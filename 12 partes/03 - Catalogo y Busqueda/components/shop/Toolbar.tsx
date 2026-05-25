"use client";
import { Icon, Select } from "@/components";
import { SORT_OPTIONS, type SortBy } from "@/lib/filters";
import { cn } from "@/lib/cn";

export type ProductView = "grid" | "list";

export interface ToolbarProps {
  total: number;
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
  view: ProductView;
  onViewChange: (v: ProductView) => void;
  /** Click al botón "Filtros" (mobile only) */
  onOpenFilters: () => void;
  appliedCount: number;
}

/**
 * Toolbar — barra de controles sobre el grid.
 *
 * - **Mobile**: botón "Filtros" + conteo + selector de orden full-width
 * - **Desktop**: conteo · orden · toggle vista grid/lista
 */
export function Toolbar({
  total, sortBy, onSortChange, view, onViewChange, onOpenFilters, appliedCount,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 justify-between flex-wrap
                    py-3 border-y border-border">
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile filter button */}
        <button
          type="button" onClick={onOpenFilters}
          className="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-pill
                     border-[1.5px] border-border-strong bg-surface text-text
                     font-display font-semibold text-sm cursor-pointer shrink-0"
        >
          <Icon name="grid" size={16} strokeWidth={2} />
          Filtros
          {appliedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full
                             bg-brand-500 text-white text-[11px] font-bold">
              {appliedCount}
            </span>
          )}
        </button>
        <span className="text-[13px] text-text-soft hidden xs:inline">
          {total.toLocaleString("es-MX")} {total === 1 ? "producto" : "productos"}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-full sm:w-[220px]">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            options={SORT_OPTIONS}
            className="!h-11"
          />
        </div>
        {/* View toggle: desktop only */}
        <div className="hidden lg:inline-flex p-0.5 bg-surface-2 rounded-md gap-0.5">
          {(["grid", "list"] as const).map((m) => (
            <button
              key={m} type="button" onClick={() => onViewChange(m)}
              aria-label={m === "grid" ? "Vista grid" : "Vista lista"}
              aria-pressed={view === m}
              className={cn(
                "size-9 rounded-md cursor-pointer inline-flex items-center justify-center",
                view === m
                  ? "bg-surface text-text shadow-xs"
                  : "bg-transparent text-text-soft hover:text-text",
              )}
            >
              <Icon name={m === "grid" ? "grid" : "menu"} size={16} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
