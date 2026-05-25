"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size    = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estilo del botón. Default: primary */
  variant?: Variant;
  /** Tamaño. Default: md */
  size?: Size;
  /** Muestra spinner y bloquea clicks */
  loading?: boolean;
  /** Icono al inicio */
  leadingIcon?: IconName;
  /** Icono al final */
  trailingIcon?: IconName;
  /** Ocupa todo el ancho disponible */
  fullWidth?: boolean;
}

const SIZE_CLS: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-[18px] text-sm gap-2",
  lg: "h-[54px] px-6 text-base gap-2.5",
};

const VARIANT_CLS: Record<Variant, string> = {
  primary:     "bg-brand-grad text-on-brand shadow-brand hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  secondary:   "bg-surface text-text border border-border-strong shadow-xs hover:border-brand-500 hover:-translate-y-0.5",
  ghost:       "bg-transparent text-text hover:bg-surface-2",
  destructive: "bg-error text-white shadow-[0_14px_30px_-10px_rgba(239,68,68,0.45)] hover:brightness-105 hover:-translate-y-0.5",
};

/**
 * Button — botón principal del sistema.
 *
 * @example
 * <Button leadingIcon="cart">Agregar al carrito</Button>
 * <Button variant="secondary" size="lg" trailingIcon="arr-right">Continuar</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, leadingIcon, trailingIcon,
    fullWidth, className, disabled, children, ...rest }, ref) {
  const isDisabled = disabled || loading;
  const ic = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center font-display font-semibold",
        "rounded-pill border border-transparent select-none whitespace-nowrap",
        "transition duration-base ease-out",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        SIZE_CLS[size],
        VARIANT_CLS[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size={ic} />
          <span>Cargando…</span>
        </>
      ) : (
        <>
          {leadingIcon  && <Icon name={leadingIcon}  size={ic} />}
          <span>{children}</span>
          {trailingIcon && <Icon name={trailingIcon} size={ic} />}
        </>
      )}
    </button>
  );
});

function Spinner({ size }: { size: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
