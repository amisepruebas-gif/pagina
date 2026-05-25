"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  leadingIcon?: IconName;
}

/**
 * Pill — botón redondeado para categorías navegables.
 * En touch (`pointer: coarse`) crece a 44px de alto para cumplir tap target.
 *
 * @example <Pill active>Todos</Pill>
 */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(function Pill(
  { active, leadingIcon, className, children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "pill inline-flex items-center gap-1.5 h-9 px-4 coarse:!h-11 coarse:!px-5",
        "font-display font-semibold text-[13px] rounded-pill",
        "border-[1.5px] transition duration-base ease-out",
        active
          ? "bg-brand-grad text-on-brand border-transparent shadow-brand"
          : "bg-surface text-text border-border-strong hover:border-brand-500",
        className,
      )}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={14} strokeWidth={2} />}
      {children}
    </button>
  );
});
