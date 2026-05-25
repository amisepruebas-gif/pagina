'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge, Icon, Input, Pill } from '@/components/ui';
import type { Chat, ChatStatus, RawChatDoc } from '@/types/chat';

function normalize(id: string, data: DocumentData): Chat {
  const raw = data as RawChatDoc;
  return {
    id,
    userId: raw.userId,
    guestName: raw.guestName,
    guestEmail: raw.guestEmail,
    subject: raw.subject ?? '(sin asunto)',
    status: raw.status ?? 'open',
    assignedTo: raw.assignedTo,
    lastMessageAt: raw.lastMessageAt?.toDate(),
    lastMessagePreview: raw.lastMessagePreview,
    unreadStaff: raw.unreadStaff ?? 0,
    unreadCustomer: raw.unreadCustomer ?? 0,
    createdAt: raw.createdAt?.toDate()
  };
}

type Filter = 'todos' | 'open' | 'closed' | 'unread';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'open', label: 'Abiertos' },
  { value: 'closed', label: 'Cerrados' },
  { value: 'unread', label: 'Sin leer' }
];

export default function ChatsClient() {
  const [items, setItems] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'chats'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0)
        );
        console.log('[CHATS] snapshot', list.length, 'chats');
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[CHATS] snapshot error', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter === 'open') out = out.filter((c) => c.status === 'open');
    else if (filter === 'closed') out = out.filter((c) => c.status === 'closed');
    else if (filter === 'unread') out = out.filter((c) => c.unreadStaff > 0);
    const s = search.trim().toLowerCase();
    if (s) {
      out = out.filter(
        (c) =>
          c.subject.toLowerCase().includes(s) ||
          (c.guestEmail ?? '').toLowerCase().includes(s) ||
          (c.guestName ?? '').toLowerCase().includes(s)
      );
    }
    return out;
  }, [items, filter, search]);

  const stats = useMemo(
    () => ({
      total: items.length,
      open: items.filter((c) => c.status === 'open').length,
      unread: items.reduce((s, c) => s + c.unreadStaff, 0)
    }),
    [items]
  );

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Chats' }]}
        title="Chats"
        description={
          loading
            ? 'Cargando conversaciones…'
            : `${stats.total} en total · ${stats.open} abiertos · ${stats.unread} mensaje${
                stats.unread === 1 ? '' : 's'
              } sin leer`
        }
      />

      <div className="p-6 flex flex-col gap-4">
        {error && (
          <div className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            Error: {error}
          </div>
        )}

        {stats.total === 0 && !loading && !error && (
          <div className="rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-[13px] text-text-muted">
            Aún no hay chats. Aparecerán aquí cuando un cliente envíe el primer
            mensaje desde el widget de chat (pendiente de implementar).
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 min-w-0">
            <Input
              type="search"
              leadingIcon="search"
              placeholder="Buscar por asunto, nombre o email…"
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

        {loading ? (
          <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center text-sm text-text-soft">
            Cargando…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-text-soft">
            Ningún chat coincide con el filtro.
          </div>
        ) : (
          <ul className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
            {filtered.map((c, i) => (
              <li key={c.id}>
                <Link
                  href={`/admin/chats/${c.id}`}
                  className={`flex items-start gap-3 px-3.5 py-3 transition-colors hover:bg-surface-2 ${
                    i === 0 ? '' : 'border-t border-border'
                  }`}
                >
                  <span className="size-9 rounded-full shrink-0 bg-brand-grad text-white inline-flex items-center justify-center font-display font-bold text-xs">
                    {getInitials(c.guestName, c.guestEmail)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display font-semibold text-[13px] truncate">
                        {c.subject}
                      </span>
                      <span className="text-[10px] text-text-soft font-mono shrink-0">
                        {formatTime(c.lastMessageAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-text-soft truncate">
                      {c.guestName || '(sin nombre)'} ·{' '}
                      {c.guestEmail || c.userId || '(sin email)'}
                    </p>
                    {c.lastMessagePreview && (
                      <p className="mt-1 text-xs text-text-muted line-clamp-1">
                        {c.lastMessagePreview}
                      </p>
                    )}
                    <div className="mt-1.5 inline-flex gap-1.5 items-center">
                      <StatusBadge status={c.status} />
                      {c.unreadStaff > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-secondary text-white text-[10px] font-display font-bold inline-flex items-center justify-center">
                          {c.unreadStaff}
                        </span>
                      )}
                    </div>
                  </div>
                  <Icon
                    name="chev-right"
                    size={14}
                    strokeWidth={2}
                    className="text-text-soft shrink-0 mt-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: ChatStatus }) {
  return status === 'open' ? (
    <Badge tone="success" size="xs">
      Abierto
    </Badge>
  ) : (
    <Badge tone="neutral" size="xs">
      Cerrado
    </Badge>
  );
}

function getInitials(name?: string, email?: string): string {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

function formatTime(d?: Date): string {
  if (!d) return '—';
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return 'ahora';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} min`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} h`;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}
