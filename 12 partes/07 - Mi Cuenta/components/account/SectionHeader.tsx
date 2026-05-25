import { type ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

/** Encabezado compartido de cada tab. */
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap mb-5">
      <div>
        <h2 className="font-display font-bold leading-[1.1] tracking-[-0.025em]
                       text-2xl sm:text-3xl lg:text-[clamp(22px,3vw,30px)]">{title}</h2>
        {subtitle && <p className="mt-1.5 text-text-muted text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
