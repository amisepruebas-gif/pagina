'use client';
import { FilterPanel, type FilterPanelProps } from './FilterPanel';

export interface FilterSidebarProps extends FilterPanelProps {
  appliedCount: number;
  onClear: () => void;
}

/** FilterSidebar — desktop. 280px, sticky. En mobile se usa FilterDrawer. */
export function FilterSidebar({
  appliedCount,
  onClear,
  ...panel
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto px-1">
      <div className="flex items-center justify-between py-2">
        <h3 className="font-display font-bold text-lg">Filtros</h3>
        {appliedCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="border-0 bg-transparent text-brand-700 font-display text-[13px] font-semibold cursor-pointer px-1.5 py-1 hover:text-brand-800 transition"
          >
            Limpiar ({appliedCount})
          </button>
        )}
      </div>
      <FilterPanel {...panel} />
    </aside>
  );
}
