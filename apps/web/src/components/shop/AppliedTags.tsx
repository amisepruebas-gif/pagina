'use client';
import { Tag } from '@/components/ui';
import type { Filters } from '@/lib/shop-filters';
import type { Category } from '@/types/category';
import type { Subcategory, Material } from '@/types/taxonomy';

interface AppliedTagsProps {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClear: () => void;
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
  maxPrice: number;
}

/** Tags removibles que reflejan los filtros activos. */
export function AppliedTags({
  filters,
  set,
  onClear,
  categories,
  subcategories,
  materials,
  maxPrice
}: AppliedTagsProps) {
  const tags: { label: string; onRemove: () => void }[] = [];

  if (filters.category) {
    const c = categories.find((x) => x.id === filters.category);
    if (c) tags.push({ label: c.name, onRemove: () => set('category', null) });
  }
  filters.subcategories.forEach((id) => {
    const s = subcategories.find((x) => x.id === id);
    if (s)
      tags.push({
        label: s.name,
        onRemove: () =>
          set(
            'subcategories',
            filters.subcategories.filter((x) => x !== id)
          )
      });
  });
  filters.materials.forEach((id) => {
    const m = materials.find((x) => x.id === id);
    if (m)
      tags.push({
        label: m.name,
        onRemove: () =>
          set(
            'materials',
            filters.materials.filter((x) => x !== id)
          )
      });
  });
  if (filters.price[0] > 0 || filters.price[1] < maxPrice) {
    tags.push({
      label: `$${filters.price[0].toLocaleString('es-MX')} – $${filters.price[1].toLocaleString('es-MX')}`,
      onRemove: () => set('price', [0, maxPrice])
    });
  }
  if (filters.inStockOnly)
    tags.push({ label: 'En stock', onRemove: () => set('inStockOnly', false) });

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-3">
      {tags.map((t, i) => (
        <Tag key={i} tone="brand" onRemove={t.onRemove}>
          {t.label}
        </Tag>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="border-0 bg-transparent text-brand-700 font-display text-[13px] font-semibold cursor-pointer px-2 min-h-7 hover:text-brand-800 transition"
      >
        Limpiar todo
      </button>
    </div>
  );
}
