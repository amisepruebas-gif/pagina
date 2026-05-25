'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Complaint, ComplaintStatus, RawComplaintDoc } from '@/types/complaint';
import { COMPLAINT_STATUSES, STATUS_LABEL } from '@/types/complaint';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { StatCard } from '@/components/admin/StatCard';
import { Badge, Input, Pill, IconButton } from '@/components/ui';

function normalize(id: string, data: DocumentData): Complaint {
  const raw = data as RawComplaintDoc;
  return {
    id,
    userId: raw.userId ?? '',
    userEmail: raw.userEmail,
    userName: raw.userName,
    orderId: raw.orderId,
    orderNumber: raw.orderNumber,
    typeId: raw.typeId,
    typeName: raw.typeName,
    description: raw.description ?? '',
    status: raw.status ?? 'open',
    resolution: raw.resolution,
    refundAmount: raw.refundAmount,
    resolvedBy: raw.resolvedBy,
    resolvedAt: raw.resolvedAt?.toDate(),
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

type Filter = 'todos' | ComplaintStatus;

const STATUS_TONE: Record<
  ComplaintStatus,
  'info' | 'warning' | 'success' | 'neutral'
> = {
  open: 'info',
  in_progress: 'warning',
  resolved: 'success',
  rejected: 'neutral'
};

export default function ComplaintsClient() {
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'complaints'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        setItems(list);
        setLoading(false);
        console.log('[COMPLAINTS] loaded', list.length);
      },
      (err) => {
        console.error('[COMPLAINTS] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter !== 'todos') out = out.filter((c) => c.status === filter);
    const s = search.trim().toLowerCase();
    if (s) {
      out = out.filter(
        (c) =>
          c.description.toLowerCase().includes(s) ||
          (c.userEmail ?? '').toLowerCase().includes(s) ||
          (c.userName ?? '').toLowerCase().includes(s) ||
          (c.orderNumber ?? '').toLowerCase().includes(s)
      );
    }
    return out;
  }, [items, filter, search]);

  const stats = useMemo(
    () => ({
      total: items.length,
      open: items.filter((c) => c.status === 'open').length,
      inProgress: items.filter((c) => c.status === 'in_progress').length,
      refunded: items
        .filter((c) => c.refundAmount && c.refundAmount > 0)
        .reduce((s, c) => s + (c.refundAmount ?? 0), 0)
    }),
    [items]
  );

  if (loading) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Quejas' }]}
          title="Quejas"
        />
        <p className="px-6 py-12 text-center text-sm text-text-muted">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Quejas' }]}
        title="Quejas"
        description={`${stats.total} tickets · ${stats.open} abiertos · ${stats.inProgress} en proceso`}
      />

      <div className="flex flex-col gap-5 p-6">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <StatCard
            label="Total"
            value={stats.total.toLocaleString('es-MX')}
            icon="grid"
            tone="brand"
          />
          <StatCard
            label="Abiertas"
            value={stats.open.toLocaleString('es-MX')}
            icon="warn"
            tone="info"
          />
          <StatCard
            label="En proceso"
            value={stats.inProgress.toLocaleString('es-MX')}
            icon="refresh"
            tone="accent"
          />
          <StatCard
            label="Reembolsado"
            value={`$${stats.refunded.toFixed(2)}`}
            icon="bolt"
            tone="secondary"
          />
        </div>

        {stats.total === 0 && (
          <p className="rounded-lg border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
            Aún no hay quejas. El cliente las crea desde su mi-cuenta cuando tenga
            un problema.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <Input
              type="search"
              leadingIcon="search"
              placeholder="Buscar por descripción, email, #orden…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="inline-flex flex-wrap gap-1.5">
            <Pill active={filter === 'todos'} onClick={() => setFilter('todos')}>
              Todas
            </Pill>
            {COMPLAINT_STATUSES.map((s) => (
              <Pill
                key={s}
                active={filter === s}
                onClick={() => setFilter(s)}
              >
                {STATUS_LABEL[s]}
              </Pill>
            ))}
          </div>
        </div>

        <DataTable<Complaint>
          columns={[
            {
              key: 'ticket',
              label: 'Queja',
              render: (c) => (
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-display font-semibold">
                      {c.typeName ?? 'Queja'}
                    </span>
                    {c.orderNumber && (
                      <code className="font-mono text-[11px] text-text-soft">
                        #{c.orderNumber}
                      </code>
                    )}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-[12px] text-text-muted">
                    {c.description}
                  </div>
                </div>
              )
            },
            {
              key: 'customer',
              label: 'Cliente',
              render: (c) => (
                <div className="min-w-0">
                  <div className="text-text">{c.userName || '(sin nombre)'}</div>
                  <div className="text-[11px] text-text-soft">
                    {c.userEmail || '(sin email)'}
                  </div>
                </div>
              )
            },
            {
              key: 'date',
              label: 'Fecha',
              render: (c) => (
                <span className="text-text-soft">
                  {c.createdAt?.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short'
                  }) ?? '—'}
                </span>
              )
            },
            {
              key: 'refund',
              label: 'Reembolso',
              align: 'right',
              render: (c) =>
                c.refundAmount !== undefined &&
                c.refundAmount !== null &&
                c.refundAmount > 0 ? (
                  <span className="font-display font-semibold tabular-nums text-error">
                    ${c.refundAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-text-soft">—</span>
                )
            },
            {
              key: 'status',
              label: 'Estado',
              align: 'center',
              render: (c) => (
                <Badge tone={STATUS_TONE[c.status]} size="xs">
                  {STATUS_LABEL[c.status]}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: '',
              align: 'right',
              width: '80px',
              render: (c) => (
                <Link href={`/admin/quejas/${c.id}`}>
                  <IconButton
                    variant="ghost"
                    icon="arr-right"
                    label="Abrir queja"
                    size="sm"
                  />
                </Link>
              )
            }
          ]}
          rows={filtered}
          empty={{
            icon: 'warn',
            title: 'Sin quejas',
            body: 'Ninguna queja coincide con el filtro seleccionado.'
          }}
        />
      </div>
    </>
  );
}
