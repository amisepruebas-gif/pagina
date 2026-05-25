"use client";
import { Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface ColorVariant {
  value: string;
  label: string;
  hex: string;
}

export interface VariantPickerProps {
  colors?: ColorVariant[];
  selectedColor?: string;
  onColorChange?: (v: string) => void;

  sizes?: string[];
  selectedSize?: string | null;
  onSizeChange?: (v: string) => void;
}

/**
 * VariantPicker — selectores de color (swatches) + talla (chips).
 *
 * Tap targets 44×44 (color) / 48×56 (talla). Si `colors` o `sizes` no se pasan,
 * esa sección no se renderiza (producto sin variantes).
 */
export function VariantPicker({
  colors, selectedColor, onColorChange,
  sizes, selectedSize, onSizeChange,
}: VariantPickerProps) {
  return (
    <div className="flex flex-col gap-5">
      {colors && colors.length > 0 && (
        <div>
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="font-display font-semibold text-sm">
              Color: <span className="font-normal text-text-muted">
                {colors.find((c) => c.value === selectedColor)?.label}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => {
              const active = c.value === selectedColor;
              const lightBg = c.value === "blanco" || c.value === "amarillo";
              return (
                <button
                  key={c.value} type="button"
                  onClick={() => onColorChange?.(c.value)}
                  aria-label={c.label} aria-pressed={active} title={c.label}
                  style={{ background: c.hex }}
                  className={cn(
                    "relative size-11 p-0 rounded-full cursor-pointer transition duration-fast ease-out",
                    active ? "ring-[3px] ring-brand-500" : "border-[1.5px] border-border-strong",
                    c.value === "blanco" && "shadow-[inset_0_0_0_1px_var(--border)]",
                  )}
                >
                  {active && (
                    <span className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      lightBg ? "text-text" : "text-white",
                    )}>
                      <Icon name="check" size={18} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="font-display font-semibold text-sm">
              Talla: <span className="font-normal text-text-muted">{selectedSize || "Selecciona"}</span>
            </span>
            <a href="#" className="text-[13px] text-brand-700 no-underline font-display font-semibold">
              Guía de tallas
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const active = s === selectedSize;
              return (
                <button
                  key={s} type="button"
                  onClick={() => onSizeChange?.(s)}
                  aria-pressed={active}
                  className={cn(
                    "min-w-14 h-12 px-3.5 rounded-md cursor-pointer",
                    "font-display font-semibold text-sm transition duration-fast ease-out",
                    "border-[1.5px]",
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-border-strong bg-surface text-text hover:border-brand-300",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
