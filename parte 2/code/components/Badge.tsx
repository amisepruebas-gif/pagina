import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Tone =
  | "brand" | "gradient" | "secondary" | "accent"
  | "success" | "error" | "warning" | "info" | "neutral";

type Size = "xs" | "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  leadingIcon?: IconName;
}

const TONE_CLS: Record<Tone, string> = {
  brand:     "bg-brand-500 text-white",
  gradient:  "bg-brand-grad text-white",
  secondary: "bg-secondary text-white",
  accent:    "bg-accent text-[#1A1A14]",
  success:   "bg-success text-white",
  error:     "bg-error text-white",
  warning:   "bg-warning text-[#1A1A14]",
  info:      "bg-info text-white",
  neutral:   "bg-surface-2 text-text border border-border",
};

const SIZE_CLS: Record<Size, string> = {
  xs: "h-[18px] px-1.5 text-[10px] gap-0.5",
  sm: "h-6 px-2 text-[11px] gap-1",
  md: "h-7 px-2.5 text-xs gap-1",
};

/**
 * Badge — etiquetas pequeñas con alta visibilidad (descuento, novedad, estado).
 *
 * @example
 * <Badge tone="gradient" leadingIcon="bolt">-40%</Badge>
 */
export function Badge({ tone = "brand", size = "sm", leadingIcon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-display font-bold uppercase tracking-wider",
        "rounded-pill",
        TONE_CLS[tone], SIZE_CLS[size], className,
      )}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={size === "xs" ? 10 : 12} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
