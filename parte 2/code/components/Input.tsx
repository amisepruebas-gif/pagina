"use client";
import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { FormField } from "./FormField";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  required?: boolean;
}

/**
 * Input — campo de texto con label/hint/error opcionales.
 *
 * @example
 * <Input label="Email" leadingIcon="user" placeholder="tu@email.com" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, trailingIcon, required, className, onFocus, onBlur, ...rest }, ref) {
  const [focus, setFocus] = useState(false);
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <div className={cn(
        "flex items-center gap-2 h-12 px-3.5 rounded-md bg-surface text-text",
        "border-[1.5px] transition duration-base ease-out",
        error ? "border-error" : focus ? "border-brand-500 ring-4 ring-brand-500/15" : "border-border-strong",
      )}>
        {leadingIcon && <Icon name={leadingIcon} size={18} className="text-text-soft shrink-0" />}
        <input
          ref={ref}
          className={cn("flex-1 min-w-0 h-full bg-transparent outline-none text-sm", className)}
          onFocus={(e) => { setFocus(true);  onFocus?.(e); }}
          onBlur={(e)  => { setFocus(false); onBlur?.(e);  }}
          {...rest}
        />
        {trailingIcon && <Icon name={trailingIcon} size={18} className="text-text-soft shrink-0" />}
      </div>
    </FormField>
  );
});
