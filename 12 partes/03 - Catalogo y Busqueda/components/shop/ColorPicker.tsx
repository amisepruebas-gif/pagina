"use client";
import { Icon } from "@/components";
import { COLORS } from "@/lib/shop-data";
import { cn } from "@/lib/cn";

interface ColorPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * ColorPicker — swatches circulares con tap target 44×44.
 * Check overlay visible al seleccionar.
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="flex flex-wrap gap-2.5">
      {COLORS.map((c) => {
        const active = value.includes(c.value);
        const lightBg = c.value === "blanco" || c.value === "amarillo";
        return (
          <button
            key={c.value} type="button" onClick={() => toggle(c.value)}
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
  );
}
