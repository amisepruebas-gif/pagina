"use client";
import { cn } from "@/lib/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  /** aria-label cuando se usa sin contexto visible */
  label?: string;
}

/** Toggle — switch accesible 44×26. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-11 h-[26px] rounded-full border-0 p-0.5 cursor-pointer shrink-0 inline-flex items-center",
        "transition-colors duration-fast ease-out",
        checked ? "bg-brand-500" : "bg-border-strong",
      )}
    >
      <span
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
        className="size-[22px] rounded-full bg-white shadow-xs transition-transform duration-fast ease-out"
      />
    </button>
  );
}
