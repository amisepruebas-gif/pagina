"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton, Icon, Logo } from "@/components";
import { ADMIN_NAV, ADMIN_USER } from "@/lib/admin-nav";
import { cn } from "@/lib/cn";

export interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Modo cajón móvil (overlay desde la izquierda) */
  mobile?: boolean;
  onClose?: () => void;
}

/**
 * AdminSidebar — navegación vertical del admin con 4 grupos.
 *
 * - Desktop: 248px expandido, 76px colapsado (solo iconos).
 * - Mobile: cajón con animación slide-in desde la izquierda.
 * - El ítem activo se detecta por `usePathname()`.
 */
export function AdminSidebar({ collapsed, onToggleCollapse, mobile, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside
      style={{ width: collapsed ? 76 : 248 }}
      className={cn(
        "bg-surface border-r border-border flex flex-col shrink-0 transition-[width] duration-base ease-out",
        mobile
          ? "fixed inset-y-0 left-0 !w-[280px] z-[110] shadow-lg animate-[mm-slide-left_280ms_cubic-bezier(.22,1,.36,1)]"
          : "sticky top-0 h-screen overflow-y-auto",
      )}
    >
      <div className={cn(
        "h-14 flex items-center justify-between border-b border-border",
        collapsed ? "px-3.5" : "px-4",
      )}>
        {collapsed ? (
          <span className="size-8 rounded-full inline-flex items-center justify-center
                           text-white font-display font-extrabold text-sm shadow-brand bg-brand-grad">
            p
          </span>
        ) : (
          <Logo size={26} />
        )}
        {mobile
          ? <IconButton variant="ghost" icon="x" label="Cerrar" size="sm" onClick={onClose} />
          : <IconButton variant="ghost" icon={collapsed ? "chev-right" : "menu"} label="Colapsar" size="sm" onClick={onToggleCollapse} />}
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
        {ADMIN_NAV.map((g) => (
          <div key={g.group} className="mb-1.5">
            {!collapsed && (
              <div className="px-3 pt-2 pb-1 font-mono text-[10px] tracking-[0.08em] uppercase text-text-soft font-semibold">
                {g.group}
              </div>
            )}
            {g.items.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.id} href={it.href} title={collapsed ? it.label : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => mobile && onClose?.()}
                  className={cn(
                    "relative flex items-center gap-2.5 min-h-10 rounded-sm border-0 font-display text-[13px]",
                    "transition-colors duration-fast ease-out",
                    collapsed ? "p-2.5 justify-center" : "px-3 py-2",
                    active
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "bg-transparent text-text-muted font-medium hover:bg-surface-2",
                  )}
                >
                  {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand-500 rounded-full" />}
                  <Icon name={it.icon} size={18} strokeWidth={1.8} className="shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3.5 border-t border-border flex items-center gap-2.5">
        <span className="size-9 rounded-full shrink-0 inline-flex items-center justify-center
                         text-white font-display font-bold text-[13px] bg-brand-grad">
          {ADMIN_USER.initials}
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold text-[13px] truncate">{ADMIN_USER.name}</div>
            <div className="text-[11px] text-text-soft">{ADMIN_USER.role}</div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes mm-slide-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </aside>
  );
}
