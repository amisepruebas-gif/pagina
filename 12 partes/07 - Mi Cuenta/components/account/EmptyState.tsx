import { Button, Icon, type IconName } from "@/components";

export interface AccountEmptyStateProps {
  icon: IconName;
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
}

/** Estado vacío genérico reutilizado por OrdersTab, FavoritesTab, etc. */
export function AccountEmptyState({ icon, title, body, cta, onCta }: AccountEmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center border-2 border-dashed border-border rounded-xl bg-surface
                    relative overflow-hidden">
      <span className="inline-flex items-center justify-center size-[72px] rounded-full
                       bg-brand-50 text-brand-700 mb-[18px]">
        <Icon name={icon} size={30} strokeWidth={1.8} />
      </span>
      <h3 className="font-display font-bold text-[22px] tracking-[-0.02em] mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mx-auto mb-[18px] text-sm leading-relaxed">{body}</p>
      {cta && <Button trailingIcon="arr-right" onClick={onCta}>{cta}</Button>}
    </div>
  );
}
