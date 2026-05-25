"use client";
import { Pill } from "./Pill";
import { Icon } from "./Icon";

export interface CategoryNavProps {
  /** Lista de categorías */
  items?: string[];
  /** Categoría activa */
  active?: string;
  /** Callback al seleccionar */
  onChange?: (cat: string) => void;
}

const DEFAULTS = [
  "Novedades", "Más vendidos", "Tendencias", "Ropa",
  "Calzado", "Accesorios", "Electrónica", "Hogar", "Oferta",
];

/**
 * CategoryNav — pildoras horizontales, scrolleable en mobile.
 *
 * @example <CategoryNav active={cat} onChange={setCat} />
 */
export function CategoryNav({ items = DEFAULTS, active, onChange }: CategoryNavProps) {
  const cur = active ?? items[0];
  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <Pill key={it} active={it === cur} onClick={() => onChange?.(it)}>
            {it === "Oferta" && <Icon name="bolt" size={13} strokeWidth={2.4} />}
            {it}
          </Pill>
        ))}
      </div>
    </div>
  );
}
