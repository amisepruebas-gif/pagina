import { type ReactNode } from "react";

export interface SectionTitleProps {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
}

/**
 * SectionTitle — encabezado consistente para secciones de la PDP.
 * El `scroll-margin-top` deja espacio para el header sticky cuando se ancla.
 */
export function SectionTitle({ id, eyebrow, children }: SectionTitleProps) {
  return (
    <div id={id} className="mb-6 scroll-mt-20">
      {eyebrow && (
        <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                         inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
          {eyebrow}
        </span>
      )}
      <h2 className={`${eyebrow ? "mt-2.5" : ""} font-display font-bold leading-[1.1] tracking-[-0.025em]
                     text-2xl sm:text-3xl lg:text-[clamp(26px,3.5vw,36px)]`}>
        {children}
      </h2>
    </div>
  );
}
