"use client";
import type { Filters } from "@/lib/filters";
import { FilterPanel } from "./FilterPanel";

export interface FilterSidebarProps {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  counts: { byCategory: Record<string, number> };
  appliedCount: number;
  onClear: () => void;
}

/**
 * FilterSidebar — desktop. 280px de ancho, sticky.
 * En mobile se oculta — usa FilterDrawer.
 */
export function FilterSidebar({
  filters, set, counts, appliedCount, onClear,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0 self-start
                      sticky top-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto px-1">
      <div className="flex items-center justify-between py-2">
        <h3 className="font-display font-bold text-lg">Filtros</h3>
        {appliedCount > 0 && (
          <button
            type="button" onClick={onClear}
            className="border-0 bg-transparent text-brand-700 font-display text-[13px] font-semibold
                       cursor-pointer px-1.5 py-1 hover:text-brand-800 transition"
          >
            Limpiar ({appliedCount})
          </button>
        )}
      </div>
      <FilterPanel filters={filters} set={set} counts={counts} />
    </aside>
  );
}
