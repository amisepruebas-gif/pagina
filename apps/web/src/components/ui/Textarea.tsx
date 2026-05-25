"use client";
import { type TextareaHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { FormField } from "./FormField";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, rows = 4, className, onFocus, onBlur, ...rest }, ref) {
  const [focus, setFocus] = useState(false);
  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-3.5 py-3 rounded-md bg-surface text-text text-sm leading-relaxed",
          "border-[1.5px] transition duration-base ease-out resize-y outline-none",
          error ? "border-error" : focus ? "border-brand-500 ring-4 ring-brand-500/15" : "border-border-strong",
          className,
        )}
        onFocus={(e) => { setFocus(true);  onFocus?.(e); }}
        onBlur={(e)  => { setFocus(false); onBlur?.(e);  }}
        {...rest}
      />
    </FormField>
  );
});
