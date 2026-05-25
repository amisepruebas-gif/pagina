'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { Icon } from '@/components/ui';

interface MenuLink {
  href: string;
  label: string;
}

const NAV_LINKS: MenuLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/shop', label: 'Tienda' },
  { href: '/shop?sale=true', label: 'Ofertas' }
];

const ITEM =
  'block rounded-md px-3 py-3 text-[15px] font-medium text-text hover:bg-surface-2 transition';

export default function MobileMenuButton() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Bloquear scroll del body cuando abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="md:hidden inline-flex items-center justify-center size-11 rounded-pill text-text hover:bg-surface-2 transition"
      >
        <Icon name="menu" size={22} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/45 md:hidden animate-[mm-fade_200ms_cubic-bezier(.22,1,.36,1)]"
          />

          {/* Drawer */}
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-surface shadow-lg md:hidden flex flex-col"
            role="dialog"
            aria-modal
          >
            <header className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display text-xl font-bold">
                <span className="bg-brand-grad bg-clip-text text-transparent">
                  pagina
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="inline-flex items-center justify-center size-9 rounded-pill text-text-soft hover:bg-surface-2 transition"
              >
                <Icon name="x" size={20} />
              </button>
            </header>

            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={ITEM}
                >
                  {l.label}
                </Link>
              ))}

              <div className="h-px bg-border my-3 mx-2" />

              {user ? (
                <>
                  <div className="px-3 py-2 text-xs text-text-soft">
                    Sesión:{' '}
                    <span className="font-medium text-text">
                      {profile?.displayName ?? user.email}
                    </span>
                  </div>
                  <Link
                    href="/mi-cuenta"
                    onClick={() => setOpen(false)}
                    className={ITEM}
                  >
                    Mi cuenta
                  </Link>
                  <Link
                    href="/mi-cuenta?tab=pedidos"
                    onClick={() => setOpen(false)}
                    className={ITEM}
                  >
                    Mis pedidos
                  </Link>
                  <Link
                    href="/mi-cuenta?tab=favoritos"
                    onClick={() => setOpen(false)}
                    className={ITEM}
                  >
                    Favoritos
                  </Link>
                  {(profile?.role === 'admin' || profile?.role === 'staff') && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-3 text-[15px] font-semibold text-brand-600 hover:bg-brand-50 transition"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                    }}
                    className={`${ITEM} w-full text-left`}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-pill bg-brand-grad text-on-brand shadow-brand px-3 py-3 text-sm font-display font-semibold text-center"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block rounded-pill border border-border-strong px-3 py-3 text-sm font-display font-semibold text-center text-text hover:border-brand-500 transition mt-2"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
