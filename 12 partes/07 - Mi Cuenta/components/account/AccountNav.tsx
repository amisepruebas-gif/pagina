"use client";
import { Icon, Pill, type IconName } from "@/components";
import { PROFILE } from "@/lib/sample-account";
import { cn } from "@/lib/cn";

export type AccountTab = "profile" | "orders" | "favorites" | "addresses" | "complaints";

const TABS: { value: AccountTab; label: string; icon: IconName }[] = [
  { value: "profile",    label: "Perfil",       icon: "user"  },
  { value: "orders",     label: "Pedidos",      icon: "cart"  },
  { value: "favorites",  label: "Favoritos",    icon: "heart" },
  { value: "addresses",  label: "Direcciones",  icon: "truck" },
  { value: "complaints", label: "Soporte",      icon: "info"  },
];

export interface AccountNavProps {
  active: AccountTab;
  onChange: (tab: AccountTab) => void;
  /** Conteos por tab (pedidos, favoritos, etc) para el badge */
  counts?: Partial<Record<AccountTab, number>>;
  onSignOut?: () => void;
}

/**
 * AccountNav — sidebar en desktop / pills sticky horizontales en móvil.
 *
 * Desktop incluye bloque superior con avatar de iniciales + nombre/email
 * y botón "Cerrar sesión" abajo. Mobile colapsa a una fila scrolleable.
 */
export function AccountNav({ active, onChange, counts, onSignOut }: AccountNavProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 self-start sticky top-6
                        bg-surface border border-border rounded-xl p-3">
        <div className="flex items-center gap-3 p-3.5">
          <span className="size-11 rounded-full shrink-0 inline-flex items-center justify-center
                           text-white font-display font-bold text-[15px] shadow-brand bg-brand-grad">
            {PROFILE.initials}
          </span>
          <div className="min-w-0">
            <div className="font-display font-semibold text-sm truncate">{PROFILE.name}</div>
            <div className="text-xs text-text-soft truncate">{PROFILE.email}</div>
          </div>
        </div>

        <div className="h-px bg-border mx-1 mb-2" />

        <nav className="flex flex-col gap-0.5">
          {TABS.map((t) => {
            const isActive = active === t.value;
            const c = counts?.[t.value];
            return (
              <button
                key={t.value} type="button"
                onClick={() => onChange(t.value)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 min-h-11 rounded-md cursor-pointer text-left",
                  "border-0 font-display text-sm transition-colors duration-fast ease-out",
                  isActive
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "bg-transparent text-text font-medium hover:bg-surface-2",
                )}
              >
                <Icon name={t.icon} size={18} strokeWidth={1.8} />
                <span className="flex-1">{t.label}</span>
                {c != null && (
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-[22px] h-[22px] px-[7px] rounded-full",
                    "font-display text-[11px] font-bold",
                    isActive ? "bg-brand-500 text-white" : "bg-surface-2 text-text-muted",
                  )}>
                    {c}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="h-px bg-border mx-1 my-2" />
        <button
          type="button" onClick={onSignOut}
          className="flex items-center gap-3 px-3.5 py-2.5 min-h-11 w-full rounded-md
                     border-0 bg-transparent text-text-muted font-display font-medium text-sm
                     text-left cursor-pointer hover:bg-surface-2"
        >
          <Icon name="x" size={18} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </aside>

      {/* Mobile pills row */}
      <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-2 overflow-x-auto
                      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                      border-b border-border sticky top-0 z-10 bg-bg">
        <div className="inline-flex gap-2">
          {TABS.map((t) => {
            const isActive = active === t.value;
            const c = counts?.[t.value];
            return (
              <Pill key={t.value} active={isActive} onClick={() => onChange(t.value)} className="shrink-0">
                <Icon name={t.icon} size={13} strokeWidth={2} />
                {t.label}
                {c != null && (
                  <span className={cn(
                    "ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full",
                    "font-display text-[10px] font-bold",
                    isActive ? "bg-white/25 text-white" : "bg-surface-2 text-text-muted",
                  )}>
                    {c}
                  </span>
                )}
              </Pill>
            );
          })}
        </div>
      </div>
    </>
  );
}
