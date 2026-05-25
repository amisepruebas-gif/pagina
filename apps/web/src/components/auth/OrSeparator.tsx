import { type ReactNode } from 'react';

/** Separador horizontal con texto centrado ("o con tu correo"). */
export function OrSeparator({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 text-text-soft">
      <span className="flex-1 h-px bg-border" />
      <span className="text-xs font-mono tracking-widest uppercase">
        {children}
      </span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
