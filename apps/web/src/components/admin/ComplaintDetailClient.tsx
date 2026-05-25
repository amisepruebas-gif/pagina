'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  setComplaintStatus,
  resolveComplaint
} from '@/lib/admin/complaints-admin';
import type {
  Complaint,
  ComplaintStatus,
  RawComplaintDoc
} from '@/types/complaint';
import { COMPLAINT_STATUSES, STATUS_LABEL } from '@/types/complaint';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge, Button, Input, Textarea } from '@/components/ui';

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

const STATUS_TONE: Record<
  ComplaintStatus,
  'info' | 'warning' | 'success' | 'neutral'
> = {
  open: 'info',
  in_progress: 'warning',
  resolved: 'success',
  rejected: 'neutral'
};

export default function ComplaintDetailClient({ id }: { id: string }) {
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resolution, setResolution] = useState('');
  const [refundStr, setRefundStr] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'complaints', id),
      (snap) => {
        if (!snap.exists()) {
          setNotFoundError(true);
          setLoading(false);
          console.warn('[COMPLAINT] not found', id);
          return;
        }
        const c = normalize(snap.id, snap.data());
        setComplaint(c);
        setResolution(c.resolution ?? '');
        setRefundStr(c.refundAmount?.toString() ?? '');
        setLoading(false);
        console.log('[COMPLAINT] loaded', c.id, c.status);
      },
      (err) => {
        console.error('[COMPLAINT] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [id]);

  async function changeStatus(s: ComplaintStatus) {
    if (!complaint || busy || !user || s === complaint.status) return;
    if (s === 'resolved') return; // resolved se hace con el form
    if (!window.confirm(`¿Cambiar estado a "${STATUS_LABEL[s]}"?`)) return;
    setBusy(true);
    try {
      await setComplaintStatus(id, s, user.email ?? user.uid);
    } catch (err) {
      console.error('[COMPLAINT] setStatus error', err);
      window.alert('Error al cambiar estado');
    } finally {
      setBusy(false);
    }
  }

  async function handleResolve() {
    if (!complaint || busy || !user) return;
    const refundNum = refundStr.trim() ? Number(refundStr) : null;
    if (refundNum !== null && (isNaN(refundNum) || refundNum < 0)) {
      window.alert('Monto de reembolso inválido');
      return;
    }
    if (
      !window.confirm(
        refundNum && refundNum > 0
          ? `¿Resolver esta queja con reembolso de $${refundNum.toFixed(2)}?`
          : '¿Resolver esta queja sin reembolso?'
      )
    )
      return;
    setBusy(true);
    try {
      await resolveComplaint(id, resolution, refundNum, user.email ?? user.uid);
    } catch (err) {
      console.error('[COMPLAINT] resolve error', err);
      window.alert('Error al resolver');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Quejas', href: '/admin/quejas' },
            { label: id }
          ]}
          title="Queja"
        />
        <p className="px-6 py-12 text-center text-sm text-text-muted">Cargando…</p>
      </>
    );
  }

  if (notFoundError || !complaint) {
    return (
      <>
        <AdminPageHeader
          breadcrumb={[
            { label: 'Admin', href: '/admin' },
            { label: 'Quejas', href: '/admin/quejas' }
          ]}
          title="Queja no encontrada"
        />
        <div className="p-6">
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="font-display font-semibold text-text">
              Esta queja no existe o fue eliminada.
            </p>
            <Link href="/admin/quejas" className="mt-4 inline-block">
              <Button variant="secondary" leadingIcon="arr-left">
                Volver a quejas
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isResolved = complaint.status === 'resolved';

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quejas', href: '/admin/quejas' },
          { label: complaint.id }
        ]}
        title={complaint.typeName ?? 'Queja'}
        description={
          complaint.createdAt?.toLocaleString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) ?? '—'
        }
        action={
          <div className="flex gap-2">
            <Link href="/admin/quejas">
              <Button variant="secondary" leadingIcon="arr-left">
                Volver
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid items-start gap-5 p-6 xl:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Section
            title="Descripción del cliente"
            aside={
              <Badge tone={STATUS_TONE[complaint.status]} size="sm">
                {STATUS_LABEL[complaint.status]}
              </Badge>
            }
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
              {complaint.description}
            </p>
          </Section>

          {complaint.orderNumber && (
            <Section title="Pedido relacionado">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-text-muted">
                  Pedido{' '}
                  <code className="font-mono text-brand-700">
                    #{complaint.orderNumber}
                  </code>
                </span>
                <Link href={`/admin/pedidos/${complaint.orderId}`}>
                  <Button size="sm" variant="secondary" leadingIcon="cart">
                    Ver pedido
                  </Button>
                </Link>
              </div>
            </Section>
          )}

          <Section title="Resolución">
            {isResolved ? (
              <div className="space-y-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
                  {complaint.resolution || '(sin nota)'}
                </p>
                {complaint.refundAmount !== undefined &&
                  complaint.refundAmount !== null &&
                  complaint.refundAmount > 0 && (
                    <p className="text-sm text-text">
                      Reembolso:{' '}
                      <span className="font-display font-bold text-error">
                        ${complaint.refundAmount.toFixed(2)}
                      </span>
                    </p>
                  )}
                <p className="text-xs text-text-soft">
                  Resuelto por {complaint.resolvedBy ?? '?'} el{' '}
                  {complaint.resolvedAt?.toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) ?? '?'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                <Textarea
                  label="Nota de resolución"
                  rows={4}
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Lo que se hizo para resolver…"
                />
                <Input
                  label="Reembolso MXN (opcional)"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  leadingIcon="bolt"
                  value={refundStr}
                  onChange={(e) => setRefundStr(e.target.value)}
                  placeholder="0.00 = sin reembolso"
                  hint="El reembolso se ejecuta manualmente vía Stripe/Mercado Pago. Aquí solo registramos el monto."
                />
                <div>
                  <Button
                    leadingIcon="check"
                    loading={busy}
                    onClick={handleResolve}
                  >
                    Marcar como resuelta
                  </Button>
                </div>
              </div>
            )}
          </Section>
        </div>

        <div className="flex min-w-0 flex-col gap-3.5">
          <Section title="Cambiar estado">
            <div className="flex flex-col gap-1.5">
              {COMPLAINT_STATUSES.filter((s) => s !== 'resolved').map((s) => {
                const active = complaint.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeStatus(s)}
                    disabled={active || busy}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition duration-base ease-out ${
                      active
                        ? 'cursor-default border-brand-500 bg-brand-50 font-display font-semibold text-brand-700'
                        : 'border-border-strong bg-surface text-text hover:border-brand-500 disabled:opacity-55'
                    }`}
                  >
                    <span>{STATUS_LABEL[s]}</span>
                    {active && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-text-soft">
                        actual
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-text-soft">
              Para resolver, usa el formulario de la columna izquierda.
            </p>
          </Section>

          <Section title="Cliente">
            <div className="text-sm">
              <div className="font-display font-semibold text-text">
                {complaint.userName ?? '(sin nombre)'}
              </div>
              {complaint.userEmail && (
                <a
                  href={`mailto:${complaint.userEmail}`}
                  className="mt-0.5 block break-all text-text-muted transition hover:text-brand-700"
                >
                  {complaint.userEmail}
                </a>
              )}
              <div className="mt-2 font-mono text-[10px] text-text-soft">
                uid: {complaint.userId}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  aside,
  children
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3">
        <h3 className="font-display text-sm font-bold text-text">{title}</h3>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
