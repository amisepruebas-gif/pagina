'use client';
import type { Filters } from '@/lib/shop-filters';
import type { Category } from '@/types/category';
import type { Subcategory, Material } from '@/types/taxonomy';
import { FilterGroup } from './FilterGroup';
import { CheckboxRow } from './CheckboxRow';
import { PriceRange } from './PriceRange';

export interface FilterPanelProps {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  counts: { byCategory: Record<string, number> };
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
  maxPrice: number;
}

/** FilterPanel — UI de filtros compartida entre Sidebar (desktop) y Drawer (mobile). */
export function FilterPanel({
  filters,
  set,
  counts,
  categories,
  subcategories,
  materials,
  maxPrice
}: FilterPanelProps) {
  const subs = filters.category
    ? subcategories.filter((s) => s.categoryId === filters.category)
    : [];

  return (
    <>
      <FilterGroup title="Categoría">
        <div className="flex flex-col gap-0.5">
          {categories.map((c) => (
            <CheckboxRow
              key={c.id}
              label={c.name}
              count={counts.byCategory[c.id]}
              checked={filters.category === c.id}
              onChange={(v) => set('category', v ? c.id : null)}
            />
          ))}
        </div>
      </FilterGroup>

      {subs.length > 0 && (
        <FilterGroup title="Subcategoría" count={filters.subcategories.length}>
          <div className="flex flex-col gap-0.5">
            {subs.map((s) => (
              <CheckboxRow
                key={s.id}
                label={s.name}
                checked={filters.subcategories.includes(s.id)}
                onChange={(v) =>
                  set(
                    'subcategories',
                    v
                      ? [...filters.subcategories, s.id]
                      : filters.subcategories.filter((x) => x !== s.id)
                  )
                }
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Precio">
        <PriceRange
          min={0}
          max={maxPrice}
          value={filters.price}
          onChange={(v) => set('price', v)}
        />
      </FilterGroup>

      {materials.length > 0 && (
        <FilterGroup
          title="Material"
          defaultOpen={false}
          count={filters.materials.length}
        >
          <div className="flex flex-col gap-0.5">
            {materials.map((m) => (
              <CheckboxRow
                key={m.id}
                label={m.name}
                checked={filters.materials.includes(m.id)}
                onChange={(v) =>
                  set(
                    'materials',
                    v
                      ? [...filters.materials, m.id]
                      : filters.materials.filter((x) => x !== m.id)
                  )
                }
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Disponibilidad">
        <CheckboxRow
          label="Solo en stock"
          checked={filters.inStockOnly}
          onChange={(v) => set('inStockOnly', v)}
        />
      </FilterGroup>
    </>
  );
}
