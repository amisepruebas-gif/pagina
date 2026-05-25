"use client";
import { useEffect, useState } from "react";
import { Input } from "./Input";
import { IconButton } from "./IconButton";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { Icon, type IconName } from "./Icon";

export interface HeaderProps {
  /** Contador del carrito (badge) */
  cartCount?: number;
  /** Callback al enviar la búsqueda */
  onSearch?: (q: string) => void;
}

const CATEGORIES = [
  "Novedades", "Más vendidos", "Tendencias", "Ropa",
  "Calzado", "Accesorios", "Electrónica", "Hogar", "Oferta",
];

/**
 * Header — barra principal responsive.
 *
 * - **Desktop (≥720px)**: logo + buscador + accesos (cuenta, fav, carrito).
 * - **Mobile (<720px)**: hamburguesa + logo + carrito en la fila 1,
 *   buscador full-width en la fila 2. El menú abre un drawer lateral con
 *   accesos + categorías.
 *
 * @example <Header cartCount={3} onSearch={(q) => router.push(`/buscar?q=${q}`)} />
 */
export function Header({ cartCount = 0, onSearch }: HeaderProps) {
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);

  return (
    <>
      <header className="bg-surface border-b border-border relative z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-6 min-h-14 sm:min-h-[72px]">
          <IconButton
            variant="ghost" icon="menu" label="Abrir menú"
            className="md:!hidden"
            onClick={() => setMenu(true)}
          />
          <Logo />
          <form
            className="hidden md:block flex-1 max-w-xl"
            onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}
          >
            <Input
              leadingIcon="search"
              placeholder="Buscar productos, marcas y categorías…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>
          <nav className="inline-flex items-center gap-1 ml-auto">
            <IconButton variant="ghost" icon="user"  label="Mi cuenta" className="hidden md:!inline-flex" />
            <IconButton variant="ghost" icon="heart" label="Favoritos" className="hidden md:!inline-flex" />
            <div className="relative">
              <IconButton variant="ghost" icon="cart" label="Carrito" />
              {cartCount > 0 && (
                <span aria-hidden className="absolute top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1.5 rounded-full
                                             bg-secondary text-white text-[10px] font-bold
                                             inline-flex items-center justify-center border-2 border-surface
                                             pointer-events-none">
                  {cartCount}
                </span>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile-only second row with search */}
        <form
          className="md:hidden max-w-screen-xl mx-auto px-4 pb-3"
          onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}
        >
          <Input
            leadingIcon="search"
            placeholder="Buscar productos…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
      </header>

      {menu && <MobileMenu cartCount={cartCount} onClose={() => setMenu(false)} />}
    </>
  );
}

/* ─── MobileMenu ──────────────────────────────────────────────────────────── */

function MobileMenu({ onClose, cartCount }: { onClose: () => void; cartCount: number }) {
  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label="Menú principal" className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
      />
      <aside className="absolute top-0 right-0 bottom-0 w-[min(86vw,340px)] bg-surface shadow-lg
                        flex flex-col overflow-y-auto
                        animate-[mm-slide_280ms_cubic-bezier(.22,1,.36,1)]">
        <div className="sticky top-0 z-10 bg-surface border-b border-border
                        px-4 py-3.5 flex items-center justify-between">
          <Logo size={28} />
          <IconButton variant="ghost" icon="x" label="Cerrar menú" onClick={onClose} />
        </div>

        <div className="p-3 flex flex-col gap-0.5">
          <MenuItem icon="user"  label="Mi cuenta" onClick={onClose} />
          <MenuItem icon="heart" label="Favoritos" onClick={onClose} />
          <MenuItem icon="cart"  label={`Carrito (${cartCount})`} onClick={onClose} />
          <div className="h-px bg-border my-3 mx-2" />
          <div className="px-3 py-2 font-display font-semibold text-[11px] uppercase tracking-widest text-text-soft">
            Categorías
          </div>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} label={c} trailing="chev-right" onClick={onClose} />
          ))}
        </div>

        <div className="mt-auto sticky bottom-0 bg-surface border-t border-border p-4">
          <Button fullWidth leadingIcon="user">Iniciar sesión</Button>
        </div>
      </aside>

      {/* Local keyframes — Tailwind 3 doesn't ship these */}
      <style jsx global>{`
        @keyframes mm-fade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mm-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function MenuItem({
  icon, label, onClick, trailing,
}: {
  icon?: IconName; label: string; onClick?: () => void; trailing?: IconName;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3.5 min-h-12 px-3 py-3 rounded-md text-text text-[15px] font-medium
                 hover:bg-surface-2 transition duration-fast ease-out text-left w-full"
    >
      {icon && <Icon name={icon} size={20} className="text-text-soft shrink-0" />}
      <span className="flex-1">{label}</span>
      {trailing && <Icon name={trailing} size={16} strokeWidth={2} className="text-text-soft shrink-0" />}
    </button>
  );
}
