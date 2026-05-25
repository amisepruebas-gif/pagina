import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Tone = "neutral" | "brand" | "secondary";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Si está, muestra una "x" para remover. */
  onRemove?: () => void;
}

const TONE_CLS: Record<Tone, string> = {
  neutral:   "bg-surface-2 text-text border-border",
  brand:     "bg-brand-50 text-brand-700 border-brand-200",
  secondary: "bg-[#FFE7EF] text-secondary-600 border-[#FFC8D8]",
};

/**
 * Tag — filtro aplicado removible.
 *
 * @example <Tag onRemove={() => …}>Talla M</Tag>
 */
export function Tag({ tone = "neutral", onRemove, className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-7 pl-3 pr-2.5",
        "border rounded-sm text-xs font-medium",
        TONE_CLS[tone], className,
      )}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Quitar filtro"
          className="ml-0.5 size-4 rounded-full bg-black/10 inline-flex items-center justify-center hover:bg-black/20 transition"
          type="button"
        >
          <Icon name="x" size={10} strokeWidth={2.4} />
        </button>
      )}
    </span>
  );
}
