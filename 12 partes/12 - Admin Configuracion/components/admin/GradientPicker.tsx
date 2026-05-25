"use client";
import { Icon } from "@/components";
import { SITE_GRADIENTS } from "@/lib/admin-rest";
import { cn } from "@/lib/cn";

export interface GradientPickerProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
}

/** GradientPicker — selector de presets de gradiente con preview. */
export function GradientPicker({ value, onChange, label = "Fondo / Gradiente" }: GradientPickerProps) {
  return (
    <div>
      <div className="font-display font-semibold text-[13px] mb-2">{label}</div>
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
        {SITE_GRADIENTS.map((g) => {
          const active = value === g.id;
          return (
            <button key={g.id} type="button" onClick={() => onChange(g.id)} aria-pressed={active}
              className={cn(
                "p-0 cursor-pointer rounded-sm overflow-hidden bg-transparent flex flex-col",
                active ? "border-2 border-brand-500" : "border-[1.5px] border-border-strong",
              )}>
              <div className="h-11" style={{ background: g.bg }} />
              <div className="px-2.5 py-1.5 font-display font-semibold text-[11px] bg-surface text-text
                              inline-flex items-center gap-1">
                {active && <Icon name="check" size={10} strokeWidth={3} className="text-brand-700" />}
                {g.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
