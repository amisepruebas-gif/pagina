import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export interface FormFieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shell compartida para Input, Select, Textarea. */
export function FormField({ label, hint, error, required, className, children }: FormFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      {label && (
        <span className="font-display font-semibold text-[13px] tracking-[-0.005em] text-text">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="inline-flex items-center gap-1 text-xs text-error">
          <Icon name="err" size={13} strokeWidth={2} /> {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-text-soft">{hint}</span>
      ) : null}
    </label>
  );
}
