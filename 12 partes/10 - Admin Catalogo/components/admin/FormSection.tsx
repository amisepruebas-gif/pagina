import { type ReactNode } from "react";
import { Toggle } from "./Toggle";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * FormSection — bloque de formulario con título a la izquierda y campos a la derecha.
 * En móvil se apila en una columna. Separa cada bloque con un border-top.
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="grid gap-3 lg:gap-8 grid-cols-1 lg:grid-cols-[260px_1fr]
                    py-6 border-t border-border">
      <div className="lg:pt-1.5">
        <h3 className="font-display font-bold text-[15px] tracking-[-0.015em]">{title}</h3>
        {description && (
          <p className="mt-1.5 text-text-soft text-[13px] leading-relaxed">{description}</p>
        )}
      </div>
      <div className="min-w-0 flex flex-col gap-4">{children}</div>
    </div>
  );
}

export interface FlagRowProps {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

/** FlagRow — fila con toggle + título + subtítulo. Para flags activo/destacado/etc. */
export function FlagRow({ title, subtitle, checked, onChange }: FlagRowProps) {
  return (
    <label className="flex items-center gap-3.5 py-3 cursor-pointer border-t border-border first:border-t-0">
      <Toggle checked={checked} onChange={onChange} label={title} />
      <div className="flex-1">
        <div className="font-display font-semibold text-sm">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-text-soft">{subtitle}</div>}
      </div>
    </label>
  );
}
