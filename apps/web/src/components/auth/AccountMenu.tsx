'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';

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
    return <div className="w-16 h-6 rounded bg-gray-100 animate-pulse" aria-hidden />;
  }

  if (!user) {
    return (
      <>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="text-gray-900 hover:text-accent transition-colors"
          >
            Iniciar sesión
          </Link>
          <span className="text-gray-300" aria-hidden>
            |
          </span>
          <Link
            href="/register"
            className="text-gray-900 hover:text-accent transition-colors"
          >
            Registrarse
          </Link>
        </div>
        <Link
          href="/login"
          aria-label="Cuenta"
          className="sm:hidden p-1 text-gray-900"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </>
    );
  }

  const firstName =
    (profile?.displayName || user.displayName || user.email || '')
      .split(' ')[0] || 'Usuario';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-gray-900 hover:text-accent transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="hidden lg:inline">Hola, {firstName}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2 z-50"
        >
          <Link
            href="/mi-cuenta"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Mi cuenta
          </Link>
          <Link
            href="/mi-cuenta?tab=pedidos"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Mis pedidos
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
