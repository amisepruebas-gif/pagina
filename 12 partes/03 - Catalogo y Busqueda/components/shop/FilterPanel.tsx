"use client";
import type { Filters } from "@/lib/filters";
import {
  CATEGORIES, SUBCATEGORIES, SIZES, SIZES_SHOE, MATERIALS,
} from "@/lib/shop-data";
import { FilterGroup }  from "./FilterGroup";
import { CheckboxRow }  from "./CheckboxRow";
import { PriceRange }   from "./PriceRange";
import { ChipGroup }    from "./ChipGroup";
import { ColorPicker }  from "./ColorPicker";
import { RatingFilter } from "./RatingFilter";

export interface FilterPanelProps {
  filters: Filters;
  /** Setter atómico: `set("category", "ropa")` */
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  /** Conteos por categoría desde `countByCategory()`. */
  counts: { byCategory: Record<string, number> };
}

/**
 * FilterPanel — UI compartida entre Sidebar (desktop) y Drawer (mobile).
 * Cualquier cambio se persiste al estado de filtros mediante `set()`.
 */
export function FilterPanel({ filters, set, counts }: FilterPanelProps) {
  const sub = filters.category ? SUBCATEGORIES[filters.category] || [] : [];
  return (
    <>
      <FilterGroup title="Categoría">
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((c) => (
            <CheckboxRow
              key={c.value}
              label={c.label}
              count={counts.byCategory[c.value] ?? c.count}
              checked={filters.category === c.value}
              onChange={(v) => set("category", v ? c.value : null)}
            />
          ))}
        </div>
      </FilterGroup>

      {sub.length > 0 && (
        <FilterGroup title="Subcategoría" defaultOpen={false}>
          <div className="flex flex-col gap-0.5">
            {sub.map((s) => (
              <CheckboxRow
                key={s} label={s}
                checked={filters.subcategories.includes(s)}
                onChange={(v) =>
                  set("subcategories", v
                    ? [...filters.subcategories, s]
                    : filters.subcategories.filter((x) => x !== s))
                }
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Precio">
        <PriceRange min={0} max={3000} value={filters.price} onChange={(v) => set("price", v)} />
      </FilterGroup>

      <FilterGroup title="Talla">
        <ChipGroup
          options={[...SIZES, ...SIZES_SHOE.slice(0, 5)]}
          value={filters.sizes}
          onChange={(v) => set("sizes", v)}
        />
      </FilterGroup>

      <FilterGroup title="Color" count={filters.colors.length}>
        <ColorPicker value={filters.colors} onChange={(v) => set("colors", v)} />
      </FilterGroup>

      <FilterGroup title="Material" defaultOpen={false}>
        <div className="flex flex-col gap-0.5">
          {MATERIALS.map((m) => (
            <CheckboxRow
              key={m} label={m}
              checked={filters.materials.includes(m)}
              onChange={(v) =>
                set("materials", v
                  ? [...filters.materials, m]
                  : filters.materials.filter((x) => x !== m))
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Disponibilidad">
        <CheckboxRow
          label="Solo en stock"
          checked={filters.inStockOnly}
          onChange={(v) => set("inStockOnly", v)}
        />
      </FilterGroup>

      <FilterGroup title="Calificación">
        <RatingFilter value={filters.minRating} onChange={(v) => set("minRating", v)} />
      </FilterGroup>
    </>
  );
}
