"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "destructive";
type Size = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nombre del icono (obligatorio) */
  icon: IconName;
  /** aria-label accesible (obligatorio) */
  label: string;
  variant?: Variant;
  size?: Size;
  active?: boolean;
}

const SIZE_CLS: Record<Size, string> = {
  sm: "size-9", md: "size-11", lg: "size-[54px]",
};
const ICON_PX: Record<Size, number> = { sm: 16, md: 20, lg: 22 };

const VARIANT_CLS: Record<Variant, string> = {
  primary:     "bg-brand-grad text-on-brand shadow-brand",
  secondary:   "bg-surface text-text border border-border-strong shadow-xs",
  ghost:       "bg-transparent text-text hover:bg-surface-2",
  soft:        "bg-brand-50 text-brand-700",
  destructive: "bg-error text-white",
};

/**
 * IconButton — botón circular sin texto. Siempre lleva `label` (aria).
 *
 * @example <IconButton icon="cart" label="Carrito" />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "secondary", size = "md", active, className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-pill border border-transparent",
        "transition duration-base ease-out hover:scale-110 active:scale-95",
        SIZE_CLS[size], VARIANT_CLS[variant],
        active && "!bg-brand-500 !text-white !border-transparent",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={ICON_PX[size]} />
    </button>
  );
});
