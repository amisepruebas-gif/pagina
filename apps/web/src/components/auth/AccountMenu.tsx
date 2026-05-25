'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { Icon } from '@/components/ui';

export default function AccountMenu() {
  const { user, profile, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) {
    return (
      <div className="w-16 h-6 rounded-md bg-surface-2 animate-pulse" aria-hidden />
    );
  }

  if (!user) {
    return (
      <>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="text-text hover:text-brand-600 transition-colors"
          >
            Iniciar sesión
          </Link>
          <span className="text-border-strong" aria-hidden>
            |
          </span>
          <Link
            href="/register"
            className="text-text hover:text-brand-600 transition-colors"
          >
            Registrarse
          </Link>
        </div>
        <Link
          href="/login"
          aria-label="Cuenta"
          className="sm:hidden inline-flex items-center justify-center size-11 rounded-pill text-text hover:bg-surface-2 transition"
        >
          <Icon name="user" size={20} />
        </Link>
      </>
    );
  }

  const firstName =
    (profile?.displayName || user.displayName || user.email || '').split(
      ' '
    )[0] || 'Usuario';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-11 px-2.5 rounded-pill text-sm text-text hover:bg-surface-2 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="user" size={20} />
        <span className="hidden lg:inline font-medium">Hola, {firstName}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-surface shadow-lg border border-border py-2 z-50"
        >
          <Link
            href="/mi-cuenta"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text hover:bg-surface-2"
          >
            Mi cuenta
          </Link>
          <Link
            href="/mi-cuenta?tab=pedidos"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text hover:bg-surface-2"
          >
            Mis pedidos
          </Link>
          {(profile?.role === 'admin' || profile?.role === 'staff') && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-surface-2"
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
            className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-surface-2"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
