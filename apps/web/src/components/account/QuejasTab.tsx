'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { createComplaint } from '@/lib/client/complaints-client';
import { getComplaintTypes } from '@/lib/complaint-types';
import type {
  Complaint,
  ComplaintType,
  RawComplaintDoc
} from '@/types/complaint';
import { STATUS_LABEL, STATUS_COLORS } from '@/types/complaint';
import { Button } from '@/components/ui';

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

const fieldCls =
  'w-full rounded-md border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 transition';

export default function QuejasTab() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Complaint[]>([]);
  const [types, setTypes] = useState<ComplaintType[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [typeId, setTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getComplaintTypes()
      .then(setTypes)
      .catch((err) => console.error('[QUEJAS] types error', err));
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'complaints'),
      where('userId', '==', user.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error('[QUEJAS] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || submitting || !description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const selectedType = types.find((t) => t.id === typeId);
      await createComplaint({
        userId: user.uid,
        userEmail: user.email ?? '',
        userName: profile?.displayName ?? user.displayName ?? '',
        typeId: selectedType?.id,
        typeName: selectedType?.name,
        description
      });
      setTypeId('');
      setDescription('');
      setCreating(false);
    } catch (err) {
      console.error('[QUEJAS] create error', err);
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {loading
            ? 'Cargando…'
            : `${items.length} queja${items.length === 1 ? '' : 's'}`}
        </p>
        {!creating && (
          <Button leadingIcon="plus" onClick={() => setCreating(true)}>
            Nueva queja
          </Button>
        )}
      </div>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-border bg-surface p-4 space-y-4"
        >
          <h3 className="font-display text-sm font-semibold">
            Cuéntanos qué pasó
          </h3>
          <label className="block">
            <span className="block font-display text-[13px] font-semibold text-text mb-1.5">
              Tipo (opcional)
            </span>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className={fieldCls}
            >
              <option value="">— elige tipo —</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block font-display text-[13px] font-semibold text-text mb-1.5">
              Descripción *
            </span>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica con detalle qué pasó. Si tienes el número de orden, agrégalo."
              className={fieldCls}
            />
          </label>
          {error && (
            <div className="rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-2">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitting || !description.trim()}
              loading={submitting}
            >
              Enviar queja
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreating(false);
                setError(null);
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {!loading && items.length === 0 && !creating && (
        <div className="rounded-xl border-2 border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-text-soft">
          No has reportado quejas. Esperamos que siga así.
        </div>
      )}

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((c) => {
            const sc = STATUS_COLORS[c.status];
            return (
              <li
                key={c.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className={`rounded-full text-[10px] font-bold px-2 py-0.5 ${sc.bg} ${sc.text}`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                  {c.typeName && (
                    <span className="text-xs font-semibold text-text">
                      {c.typeName}
                    </span>
                  )}
                  {c.refundAmount !== undefined &&
                    c.refundAmount !== null &&
                    c.refundAmount > 0 && (
                      <span className="rounded-full bg-error/15 text-error text-[10px] font-bold px-2 py-0.5">
                        Reembolso ${c.refundAmount.toFixed(2)}
                      </span>
                    )}
                  <span className="text-xs text-text-soft ml-auto">
                    {c.createdAt?.toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) ?? '—'}
                  </span>
                </div>
                <p className="text-sm text-text whitespace-pre-wrap">
                  {c.description}
                </p>
                {c.resolution && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-text mb-1">
                      Respuesta:
                    </p>
                    <p className="text-sm text-text-muted whitespace-pre-wrap">
                      {c.resolution}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
