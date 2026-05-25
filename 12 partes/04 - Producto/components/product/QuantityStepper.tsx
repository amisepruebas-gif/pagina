"use client";
import { Icon } from "@/components";
import { cn } from "@/lib/cn";

export interface QuantityStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

/**
 * QuantityStepper — control ± con valor central. Tap target 44×44 por botón.
 *
 * @example <QuantityStepper value={qty} onChange={setQty} max={product.stock} />
 */
export function QuantityStepper({ value, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center border-[1.5px] border-border-strong rounded-pill bg-surface">
      <StepperBtn label="Disminuir cantidad" icon="minus" disabled={value <= min}
                  onClick={() => onChange(Math.max(min, value - 1))} />
      <span className="min-w-10 text-center font-display font-bold text-base tabular-nums">
        {value}
      </span>
      <StepperBtn label="Aumentar cantidad" icon="plus" disabled={value >= max}
                  onClick={() => onChange(Math.min(max, value + 1))} />
    </div>
  );
}

function StepperBtn({
  label, icon, disabled, onClick,
}: { label: string; icon: "plus" | "minus"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className={cn(
        "size-11 p-0 bg-transparent border-0 rounded-full text-text",
        "inline-flex items-center justify-center",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <Icon name={icon} size={16} strokeWidth={2.4} />
    </button>
  );
}
