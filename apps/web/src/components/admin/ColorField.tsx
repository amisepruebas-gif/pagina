'use client';

/**
 * ColorField — selector de color hex con preview, label y valor visible.
 * Usado por el editor de Vistas para los colores del módulo promocional.
 */
export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div>
      <div className="font-display font-semibold text-[13px] text-text mb-1.5">
        {label}
      </div>
      <div className="flex items-center gap-2 h-12 px-2 rounded-md bg-surface border-[1.5px] border-border-strong">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="size-8 shrink-0 cursor-pointer rounded-sm border border-border bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 h-full bg-transparent outline-none text-sm font-mono text-text uppercase"
        />
      </div>
    </div>
  );
}
