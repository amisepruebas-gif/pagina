import { Icon, type IconName } from '@/components/ui';
import { cn } from '@/lib/cn';

export type StatTone = 'brand' | 'secondary' | 'accent' | 'info';

export interface StatCardProps {
  label: string;
  value: string;
  /** Variación porcentual con signo. Ej: 12.4 (verde), -2.4 (rojo). */
  change?: number;
  icon: IconName;
  tone?: StatTone;
}

const TONES: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  secondary: 'bg-[#FFE7EF] text-secondary-600',
  accent: 'bg-[#FFF6D6] text-[#8a5a00]',
  info: 'bg-[#E0EAFF] text-info'
};

/** StatCard — tarjeta de KPI del admin. */
export function StatCard({
  label,
  value,
  change,
  icon,
  tone = 'brand'
}: StatCardProps) {
  const positive = change != null && change >= 0;
  return (
    <div className="bg-surface border border-border rounded-lg p-[18px] flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <span className="font-mono text-[12px] tracking-[0.06em] uppercase text-text-soft font-semibold">
          {label}
        </span>
        <span
          className={cn(
            'size-9 rounded-sm inline-flex items-center justify-center shrink-0',
            TONES[tone]
          )}
        >
          <Icon name={icon} size={18} strokeWidth={2} />
        </span>
      </div>
      <div className="font-display font-bold text-3xl tracking-[-0.025em] leading-none">
        {value}
      </div>
      {change != null && (
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-bold font-display',
              positive
                ? 'bg-success/[0.12] text-success'
                : 'bg-error/[0.12] text-error'
            )}
          >
            {positive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
          <span className="text-text-soft">vs. mes anterior</span>
        </div>
      )}
    </div>
  );
}
