"use client";
import { Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface CartQtyStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  /** `sm` (32px) usado dentro del mini-cart drawer; `md` (44px) en cart page. */
  size?: "sm" | "md";
}

/**
 * CartQtyStepper — control ± con valor central, optimizado para tap.
 * En `md` los botones son 44×44.
 */
export function CartQtyStepper({
  value, onChange, min = 1, max = 99, size = "md",
}: CartQtyStepperProps) {
  const dim = size === "sm" ? "size-8" : "size-11";
  const ic  = size === "sm" ? 12 : 16;
  const fz  = size === "sm" ? "text-sm" : "text-base";
  const w   = size === "sm" ? "min-w-7" : "min-w-9";
  return (
    <div className="inline-flex items-center border-[1.5px] border-border-strong rounded-pill bg-surface">
      <Btn label="Disminuir cantidad" icon="minus" disabled={value <= min} dim={dim} ic={ic}
           onClick={() => onChange(Math.max(min, value - 1))} />
      <span className={cn(w, "text-center font-display font-bold tabular-nums", fz)}>{value}</span>
      <Btn label="Aumentar cantidad" icon="plus" disabled={value >= max} dim={dim} ic={ic}
           onClick={() => onChange(Math.min(max, value + 1))} />
    </div>
  );
}

function Btn({
  label, icon, disabled, dim, ic, onClick,
}: { label: string; icon: "plus" | "minus"; disabled: boolean; dim: string; ic: number; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className={cn(
        dim,
        "p-0 bg-transparent border-0 rounded-full text-text inline-flex items-center justify-center",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <Icon name={icon} size={ic} strokeWidth={2.4} />
    </button>
  );
}
