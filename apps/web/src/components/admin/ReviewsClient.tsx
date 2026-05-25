'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { normalizeReview } from '@/lib/reviews';
import { setReviewHidden, deleteReview } from '@/lib/admin/reviews-admin';
import { getProducts } from '@/lib/products';
import type { Review } from '@/types/review';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge, Button, Pill, Stars } from '@/components/ui';
import { cn } from '@/lib/cn';

type Filter = 'todas' | 'visibles' | 'ocultas';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'visibles', label: 'Visibles' },
  { value: 'ocultas', label: 'Ocultas' }
];

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

export default function ReviewsClient() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('todas');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, 'reviews'),
      (snap) => {
        const list = snap.docs.map((d) => normalizeReview(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        setReviews(list);
        setLoading(false);
      },
      (err) => {
        console.error('[ADMIN reviews] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    getProducts()
      .then((ps) => {
        const map: Record<string, string> = {};
        for (const p of ps) map[p.id] = p.name;
        setProductNames(map);
      })
      .catch((err) => console.error('[ADMIN reviews] productos', err));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'visibles') return reviews.filter((r) => !r.hidden);
    if (filter === 'ocultas') return reviews.filter((r) => r.hidden);
    return reviews;
  }, [reviews, filter]);

  const hiddenCount = useMemo(
    () => reviews.filter((r) => r.hidden).length,
    [reviews]
  );

  async function toggleHidden(r: Review) {
    setBusy(r.id);
    try {
      await setReviewHidden(r.id, !r.hidden);
    } catch (err) {
      console.error('[ADMIN reviews] toggle', err);
      window.alert('No se pudo actualizar la reseña.');
    } finally {
      setBusy(null);
    }
  }

  async function remove(r: Review) {
    if (!window.confirm('¿Eliminar esta reseña definitivamente?')) return;
    setBusy(r.id);
    try {
      await deleteReview(r.id);
    } catch (err) {
      console.error('[ADMIN reviews] delete', err);
      window.alert('No se pudo eliminar la reseña.');
    } finally {
      setBusy(null);
    }
  }

  const description = loading
    ? 'Cargando…'
    : `${reviews.length} reseñas · ${hiddenCount} ocultas`;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Reseñas' }]}
        title="Reseñas"
        description={description}
      />

      <div className="p-6 flex flex-col gap-4">
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

        {!loading && filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-text-soft">
            No hay reseñas que coincidan.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <article
              key={r.id}
              className={cn(
                'bg-surface rounded-lg p-[18px]',
                'grid gap-3.5 grid-cols-[44px_1fr_auto] items-start',
                'border border-border',
                r.hidden && 'opacity-70'
              )}
            >
              <span
                className="size-11 rounded-full shrink-0 bg-brand-grad text-white inline-flex
                           items-center justify-center font-display font-bold text-sm"
              >
                {initialsOf(r.userName)}
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-display font-semibold text-sm">
                    {r.userName}
                  </span>
                  <Stars value={r.rating} showValue={false} size={13} />
                  {r.createdAt && (
                    <span className="text-[11px] text-text-soft">
                      · {r.createdAt.toLocaleDateString('es-MX')}
                    </span>
                  )}
                  {r.hidden && (
                    <Badge tone="neutral" size="xs">
                      Oculta
                    </Badge>
                  )}
                </div>
                <div className="mt-1 text-xs text-text-soft font-mono">
                  Sobre: {productNames[r.productId] ?? r.productId}
                </div>
                {r.text && (
                  <p className="mt-2 text-sm text-text leading-relaxed">
                    {r.text}
                  </p>
                )}
              </div>

              <div className="flex flex-row sm:flex-col gap-1.5 col-span-3 sm:col-span-1">
                <Button
                  size="sm"
                  variant="secondary"
                  leadingIcon={r.hidden ? 'check' : 'eye'}
                  disabled={busy === r.id}
                  onClick={() => toggleHidden(r)}
                >
                  {r.hidden ? 'Mostrar' : 'Ocultar'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leadingIcon="x"
                  className="!text-error"
                  disabled={busy === r.id}
                  onClick={() => remove(r)}
                >
                  Eliminar
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
