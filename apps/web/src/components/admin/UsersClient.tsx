'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable';
import UserRowActions from './UserRowActions';
import { Badge, Input, Pill } from '@/components/ui';
import type { AdminUser, RawUserDoc, UserRole } from '@/types/admin-user';

function normalize(uid: string, data: DocumentData): AdminUser {
  const raw = data as RawUserDoc;
  return {
    uid,
    email: raw.email ?? '',
    displayName: raw.displayName ?? '',
    role: (raw.role ?? 'customer') as UserRole,
    active: raw.active !== false,
    providers: raw.providers ?? [],
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

type Filter = 'todos' | 'admin' | 'staff' | 'customer' | 'inactivos';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'customer', label: 'Customer' },
  { value: 'inactivos', label: 'Inactivos' }
];

function initialOf(u: AdminUser): string {
  return (u.displayName || u.email || '?')[0]?.toUpperCase() ?? '?';
}

/** Fila tipada para DataTable (necesita `id`). */
type UserRow = AdminUser & { id: string; isMe: boolean };

export default function UsersClient() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const unsub = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        console.log('[USERS] snapshot', list.length, 'usuarios');
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[USERS] snapshot error', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  const filtered = useMemo(() => {
    let out = items;
    if (filter === 'inactivos') out = out.filter((u) => !u.active);
    else if (filter !== 'todos') out = out.filter((u) => u.role === filter);
    const s = search.trim().toLowerCase();
    if (s) {
      out = out.filter(
        (u) =>
          u.email.toLowerCase().includes(s) ||
          u.displayName.toLowerCase().includes(s) ||
          u.uid.toLowerCase().includes(s)
      );
    }
    return out;
  }, [items, filter, search]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      admins: items.filter((u) => u.role === 'admin').length,
      staff: items.filter((u) => u.role === 'staff').length,
      inactivos: items.filter((u) => !u.active).length
    };
  }, [items]);

  const rows: UserRow[] = useMemo(
    () =>
      filtered.map((u) => ({
        ...u,
        id: u.uid,
        isMe: user?.uid === u.uid
      })),
    [filtered, user]
  );

  const columns: DataTableColumn<UserRow>[] = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span
            className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex
                       items-center justify-center font-display font-bold text-xs"
          >
            {initialOf(r)}
          </span>
          <div className="min-w-0">
            <div className="font-display font-semibold inline-flex items-center gap-1.5">
              <span className="truncate">{r.displayName || '(sin nombre)'}</span>
              {r.isMe && (
                <Badge tone="brand" size="xs">
                  tú
                </Badge>
              )}
            </div>
            <div className="text-xs text-text-soft truncate">
              {r.email || r.uid}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'providers',
      label: 'Acceso',
      render: (r) =>
        r.providers.length > 0 ? (
          <div className="inline-flex gap-1 flex-wrap">
            {r.providers.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-pill text-[10px] font-mono font-semibold
                           bg-surface-2 text-text-muted uppercase tracking-wider"
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-text-soft">—</span>
        )
    },
    {
      key: 'estado',
      label: 'Estado',
      align: 'center',
      render: (r) =>
        r.active ? (
          <Badge tone="success" size="xs">
            Activo
          </Badge>
        ) : (
          <Badge tone="neutral" size="xs">
            Inactivo
          </Badge>
        )
    },
    {
      key: 'registro',
      label: 'Registro',
      render: (r) => (
        <span className="text-xs text-text-soft">
          {r.createdAt
            ? r.createdAt.toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : '—'}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Rol · Acciones',
      align: 'right',
      width: '260px',
      render: (r) => <UserRowActions row={r} />
    }
  ];

  const description = authLoading
    ? 'Cargando…'
    : loading
      ? 'Cargando…'
      : `${stats.total} en total · ${stats.admins} admin · ${stats.staff} staff · ${stats.inactivos} inactivos`;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Usuarios' }]}
        title="Usuarios"
        description={description}
      />

      <div className="p-6 flex flex-col gap-3.5">
        {error && (
          <div className="rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-3">
            Error al cargar: {error}
          </div>
        )}

        <div className="flex gap-2.5 flex-wrap items-center p-3 bg-surface border border-border rounded-md">
          <div className="flex-1 min-w-[200px] max-w-[340px]">
            <Input
              leadingIcon="search"
              placeholder="Buscar por email, nombre o uid…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!h-9"
            />
          </div>
          <div className="inline-flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <Pill
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Pill>
            ))}
          </div>
        </div>

        <DataTable<UserRow>
          columns={columns}
          rows={authLoading || loading ? [] : rows}
          empty={{
            icon: 'user',
            title:
              authLoading || loading
                ? 'Cargando…'
                : 'Ningún usuario coincide',
            body:
              authLoading || loading
                ? 'Obteniendo la lista de usuarios.'
                : 'Ajusta la búsqueda o el filtro para ver resultados.'
          }}
        />
      </div>
    </>
  );
}
