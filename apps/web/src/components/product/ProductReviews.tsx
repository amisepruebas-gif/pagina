'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { submitReview, normalizeReview } from '@/lib/reviews';
import { averageRating, type Review } from '@/types/review';
import { Button, Icon, Pill, Stars } from '@/components/ui';
import { SectionTitle } from './SectionTitle';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Selector de estrellas interactivo para el formulario. */
function StarPicker({
  value,
  onPick
}: {
  value: number;
  onPick: (n: number) => void;
}) {
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPick(n)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          className={`size-11 inline-flex items-center justify-center transition ${
            n <= value ? 'text-accent' : 'text-border-strong'
          }`}
        >
          <Icon
            name={n <= value ? 'star-filled' : 'star'}
            size={28}
            strokeWidth={1.4}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const prefilled = useRef(false);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => normalizeReview(d.id, d.data()))
          .filter((r) => !r.hidden);
        list.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        setReviews(list);
        setLoading(false);
      },
      (err) => {
        console.error('[REVIEWS] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [productId]);

  const myReview = user ? reviews.find((r) => r.userId === user.uid) : null;

  useEffect(() => {
    if (myReview && !prefilled.current) {
      setRating(myReview.rating);
      setText(myReview.text);
      prefilled.current = true;
    }
  }, [myReview]);

  const avg = averageRating(reviews);

  const buckets = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter(
          (r) => Math.round(r.rating) === stars
        ).length;
        return {
          stars,
          count,
          pct: reviews.length ? (count / reviews.length) * 100 : 0
        };
      }),
    [reviews]
  );

  const visible =
    filter === 'all'
      ? reviews
      : reviews.filter((r) => Math.round(r.rating) === Number(filter));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || rating < 1) {
      setError('Selecciona una calificación.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitReview({
        productId,
        userId: user.uid,
        userName: profile?.displayName || user.email || 'Cliente',
        rating,
        text
      });
    } catch (err) {
      console.error('[REVIEWS] submit error', err);
      setError('No se pudo enviar tu reseña. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="py-12 border-t border-border scroll-mt-24">
      <SectionTitle eyebrow="Reseñas">Lo que dicen los clientes</SectionTitle>

      {/* Distribución */}
      {reviews.length > 0 && (
        <div className="grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-[auto_1fr] p-5 sm:p-7 bg-surface border border-border rounded-xl mb-7">
          <div className="text-center">
            <div className="font-display font-bold text-[64px] leading-none tracking-[-0.04em]">
              {avg.toFixed(1)}
            </div>
            <div className="mt-2">
              <Stars value={avg} showValue={false} size={18} />
            </div>
            <div className="mt-2 text-[13px] text-text-soft">
              {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            {buckets.map((d) => {
              const active = filter === String(d.stars);
              return (
                <button
                  key={d.stars}
                  type="button"
                  onClick={() => setFilter(active ? 'all' : String(d.stars))}
                  className={`grid items-center gap-3 grid-cols-[60px_1fr_56px] px-2 py-1.5 rounded-sm text-left ${
                    active ? 'bg-brand-50' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold">
                    {d.stars}
                    <Icon
                      name="star-filled"
                      size={13}
                      strokeWidth={1.4}
                      className="text-accent"
                    />
                  </span>
                  <span className="block h-2 bg-surface-2 rounded-full overflow-hidden">
                    <span
                      style={{ width: `${d.pct}%` }}
                      className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-accent"
                    />
                  </span>
                  <span className="text-xs text-text-soft tabular-nums text-right">
                    {d.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtros */}
      {reviews.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <Pill active={filter === 'all'} onClick={() => setFilter('all')}>
            Todas
          </Pill>
          {[5, 4, 3, 2, 1].map((s) => (
            <Pill
              key={s}
              active={filter === String(s)}
              onClick={() => setFilter(String(s))}
            >
              {s}★
            </Pill>
          ))}
        </div>
      )}

      {/* Formulario */}
      <div className="mb-8">
        {user ? (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-surface border border-border rounded-lg flex flex-col gap-4"
          >
            <h4 className="font-display font-bold text-lg">
              {myReview ? 'Edita tu reseña' : 'Escribe tu reseña'}
            </h4>
            <div>
              <div className="text-[13px] font-semibold mb-1.5 font-display">
                Tu calificación
              </div>
              <StarPicker value={rating} onPick={setRating} />
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Cuéntanos tu experiencia con el producto…"
              className="w-full rounded-md border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
            {error && <p className="text-xs text-error">{error}</p>}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                trailingIcon="arr-right"
              >
                {submitting
                  ? 'Enviando…'
                  : myReview
                    ? 'Actualizar reseña'
                    : 'Publicar reseña'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-5 rounded-lg border border-dashed border-border bg-surface-2 text-sm text-text-muted">
            <Link
              href="/login"
              className="text-brand-600 font-semibold hover:underline"
            >
              Inicia sesión
            </Link>{' '}
            para dejar tu opinión sobre este producto.
          </div>
        )}
      </div>

      {/* Listado */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-text-soft">Cargando reseñas…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-text-soft">
            Aún no hay reseñas. ¡Sé el primero en opinar!
          </p>
        ) : visible.length === 0 ? (
          <div className="py-8 px-6 text-center border border-dashed border-border rounded-lg text-text-soft text-sm">
            No hay reseñas con esa calificación.
          </div>
        ) : (
          visible.map((r) => (
            <article
              key={r.id}
              className="p-5 bg-surface border border-border rounded-lg flex gap-4"
            >
              <div className="size-11 shrink-0 rounded-full bg-brand-grad text-white inline-flex items-center justify-center font-display font-bold text-sm">
                {initialsOf(r.userName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm">
                  {r.userName}
                </div>
                <div className="mt-0.5 inline-flex items-center gap-2">
                  <Stars value={r.rating} showValue={false} size={13} />
                  {r.createdAt && (
                    <span className="text-xs text-text-soft">
                      {r.createdAt.toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                {r.text && (
                  <p className="mt-2 text-sm text-text-muted leading-relaxed">
                    {r.text}
                  </p>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
