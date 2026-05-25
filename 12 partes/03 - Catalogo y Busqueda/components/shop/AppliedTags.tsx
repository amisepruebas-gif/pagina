"use client";
import { Tag } from "@/components";
import { COLORS, CATEGORIES } from "@/lib/shop-data";
import { PRICE_RANGE, type Filters } from "@/lib/filters";

interface AppliedTagsProps {
  filters: Filters;
  set: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClear: () => void;
}

/** Tags removibles que reflejan los filtros activos. */
export function AppliedTags({ filters, set, onClear }: AppliedTagsProps) {
  const tags: { label: string; onRemove: () => void }[] = [];

  if (filters.category) {
    const c = CATEGORIES.find((x) => x.value === filters.category);
    if (c) tags.push({ label: c.label, onRemove: () => set("category", null) });
  }
  filters.subcategories.forEach((s) =>
    tags.push({ label: s, onRemove: () =>
      set("subcategories", filters.subcategories.filter((x) => x !== s)) }));
  filters.colors.forEach((cv) => {
    const c = COLORS.find((x) => x.value === cv);
    if (c) tags.push({ label: `Color: ${c.label}`, onRemove: () =>
      set("colors", filters.colors.filter((x) => x !== cv)) });
  });
  filters.sizes.forEach((s) =>
    tags.push({ label: `Talla ${s}`, onRemove: () =>
      set("sizes", filters.sizes.filter((x) => x !== s)) }));
  filters.materials.forEach((m) =>
    tags.push({ label: m, onRemove: () =>
      set("materials", filters.materials.filter((x) => x !== m)) }));
  if (filters.price[0] > PRICE_RANGE[0] || filters.price[1] < PRICE_RANGE[1]) {
    tags.push({ label: `$${filters.price[0]} – $${filters.price[1]}`,
      onRemove: () => set("price", PRICE_RANGE) });
  }
  if (filters.inStockOnly)
    tags.push({ label: "En stock", onRemove: () => set("inStockOnly", false) });
  if (filters.minRating > 0)
    tags.push({ label: `${filters.minRating}★ y más`, onRemove: () => set("minRating", 0) });

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-3">
      {tags.map((t, i) => (
        <Tag key={i} tone="brand" onRemove={t.onRemove}>{t.label}</Tag>
      ))}
      <button
        type="button" onClick={onClear}
        className="border-0 bg-transparent text-brand-700 font-display text-[13px] font-semibold
                   cursor-pointer px-2 min-h-7 hover:text-brand-800 transition"
      >
        Limpiar todo
      </button>
    </div>
  );
}
