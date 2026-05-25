"use client";
import { type SelectHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { FormField } from "./FormField";

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
}

/**
 * Select — desplegable estándar con label/hint/error.
 *
 * @example <Select label="País" options={["México","Argentina","España"]} />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, required, placeholder, className, onFocus, onBlur, ...rest }, ref) {
  const [focus, setFocus] = useState(false);
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <div className={cn(
        "relative h-12 rounded-md bg-surface border-[1.5px] transition duration-base ease-out",
        error ? "border-error" : focus ? "border-brand-500 ring-4 ring-brand-500/15" : "border-border-strong",
      )}>
        <select
          ref={ref}
          className={cn(
            "appearance-none w-full h-full pl-3.5 pr-10 bg-transparent",
            "outline-none text-sm text-text", className,
          )}
          onFocus={(e) => { setFocus(true);  onFocus?.(e); }}
          onBlur={(e)  => { setFocus(false); onBlur?.(e);  }}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? o : o.label;
            return <option key={v} value={v}>{l}</option>;
          })}
        </select>
        <Icon name="chev-down" size={16} strokeWidth={2}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-soft" />
      </div>
    </FormField>
  );
});
