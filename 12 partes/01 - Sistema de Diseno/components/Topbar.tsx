import { type ReactNode } from "react";
import { Icon } from "./Icon";

export interface TopbarProps {
  message?: ReactNode;
  /** Items a la derecha (oculto en mobile) */
  links?: { label: string; href: string }[];
}

/**
 * Topbar — banda promocional fija arriba del Header.
 *
 * @example
 * <Topbar
 *   message="Envío gratis arriba de $499"
 *   links={[{ label: "Ayuda", href: "/ayuda" }]}
 * />
 */
export function Topbar({
  message = "Envío gratis en compras desde $499 · Devoluciones 30 días",
  links = [
    { label: "Ayuda",            href: "#" },
    { label: "Vende con nosotros", href: "#" },
    { label: "ES · MXN",         href: "#" },
  ],
}: TopbarProps) {
  return (
    <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-2 text-white text-xs font-medium">
      <div className="max-w-screen-xl mx-auto px-6 h-9 flex items-center justify-between">
        <span className="inline-flex items-center gap-2">
          <Icon name="truck" size={14} strokeWidth={2} />
          {message}
        </span>
        <span className="hidden md:inline-flex gap-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="opacity-90 hover:opacity-100">{l.label}</a>
          ))}
        </span>
      </div>
    </div>
  );
}
