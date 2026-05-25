"use client";
import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface GoogleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * GoogleButton — botón "Continuar con Google" con el logo multicolor inline.
 *
 * @example <GoogleButton>Continuar con Google</GoogleButton>
 */
export function GoogleButton({ className, children, ...rest }: GoogleButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full min-h-[52px] px-[18px] inline-flex items-center justify-center gap-2.5",
        "bg-surface text-text border-[1.5px] border-border-strong rounded-pill",
        "font-display font-semibold text-[15px] cursor-pointer",
        "transition duration-base ease-out",
        "hover:border-brand-500 hover:-translate-y-px",
        className,
      )}
      {...rest}
    >
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
        <path fill="#FBBC05" d="M11.69 28.18A13.99 13.99 0 0 1 10.96 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A22.01 22.01 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
        <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7C13.42 13.62 18.27 9.75 24 9.75z"/>
      </svg>
      {children}
    </button>
  );
}
