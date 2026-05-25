'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setUserRole, setUserActive } from '@/lib/admin/users-admin';
import { Button } from '@/components/ui';
import type { AdminUser, UserRole } from '@/types/admin-user';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' }
];

export default function UserRowActions({ row }: { row: AdminUser }) {
  const { user: me } = useAuth();
  const [busy, setBusy] = useState(false);

  const isMe = me?.uid === row.uid;

  async function changeRole(newRole: UserRole) {
    if (newRole === row.role || busy) return;
    if (
      newRole === 'admin' &&
      !window.confirm(
        `¿Promover a "${row.email || row.uid}" a admin? Tendrá control total del sitio.`
      )
    )
      return;
    if (
      isMe &&
      row.role === 'admin' &&
      newRole !== 'admin' &&
      !window.confirm(
        'Te vas a quitar permisos de admin. Perderás acceso al panel admin inmediatamente. ¿Seguro?'
      )
    )
      return;
    setBusy(true);
    try {
      await setUserRole(row.uid, newRole);
      console.log('[USERS] rol cambiado', row.uid, '->', newRole);
    } catch (err) {
      console.error('[USERS] setUserRole error', err);
      window.alert('Error al cambiar rol. Revisa F12.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive() {
    if (busy) return;
    if (
      isMe &&
      row.active &&
      !window.confirm('¿Desactivar tu propia cuenta? No podrás volver a iniciar sesión.')
    )
      return;
    if (
      !window.confirm(
        row.active ? '¿Desactivar este usuario?' : '¿Reactivar este usuario?'
      )
    )
      return;
    setBusy(true);
    try {
      await setUserActive(row.uid, !row.active);
      console.log('[USERS] activo cambiado', row.uid, '->', !row.active);
    } catch (err) {
      console.error('[USERS] toggle active error', err);
      window.alert('Error al cambiar estado.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-1.5 justify-end">
      <div className="relative">
        <select
          value={row.role}
          onChange={(e) => changeRole(e.target.value as UserRole)}
          disabled={busy}
          aria-label="Rol del usuario"
          className="appearance-none pl-3 pr-7 h-9 bg-surface border-[1.5px] border-border-strong
                     rounded-pill text-xs font-display font-semibold text-text cursor-pointer
                     outline-none transition duration-base ease-out
                     focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15
                     disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-soft"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <Button
        size="sm"
        variant="ghost"
        disabled={busy}
        onClick={toggleActive}
        className={row.active ? '!text-error' : undefined}
      >
        {row.active ? 'Desactivar' : 'Reactivar'}
      </Button>
    </div>
  );
}
