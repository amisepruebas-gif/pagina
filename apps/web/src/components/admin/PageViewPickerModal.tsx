'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui';
import { getPageViews } from '@/lib/page-views';
import type { PageView } from '@/types/page-view';

interface PageViewPickerModalProps {
  open: boolean;
  onClose: () => void;
  /** Slug actualmente apuntado (sin el `/v/` — null si no hay). */
  selectedSlug: string | null;
  /** Se llama al pulsar "Listo" con el path final `/v/<slug>`. */
  onConfirm: (href: string) => void;
}

/**
 * PageViewPickerModal — selector simple de una vista publicada. Lista solo
 * vistas activas con buscador. Single-select. Confirmar setea el href a
 * `/v/<slug>` directamente.
 */
export default function PageViewPickerModal({
  open,
  onClose,
  selectedSlug,
  onConfirm
}: PageViewPickerModalProps) {
  const [views, setViews] = useState<PageView[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || loaded) return;
    getPageViews()
      .then((list) => {
        setViews(list);
        setLoaded(true);
      })
      .catch((err) => {
        console.error('[PageViewPickerModal]', err);
        setLoaded(true);
      });
  }, [open, loaded]);

  // Cada vez que se abre, sincroniza el pick inicial con el slug actual.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    const match = views.find((v) => v.slug === selectedSlug);
    setPickedId(match?.id ?? null);
  }, [open, selectedSlug, views]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return views;
    return views.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q)
    );
  }, [views, query]);

  if (!open || !mounted) return null;

  function handleConfirm() {
    const view = views.find((v) => v.id === pickedId);
    if (!view) return;
    onConfirm(`/v/${view.slug}`);
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="presentation"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Seleccionar página creada"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            <h2 className="font-display text-lg font-bold">
              Seleccionar página creada
            </h2>
            <p className="text-[12px] text-text-soft">
              Una sola vista. Al confirmar, el botón apuntará a su URL pública.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancelar"
            className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="shrink-0 border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 h-9">
            <Icon name="search" size={15} className="text-text-soft" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o slug…"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="text-text-soft hover:text-text"
              >
                <Icon name="x" size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {!loaded ? (
            <p className="py-12 text-center text-sm text-text-soft">
              Cargando vistas…
            </p>
          ) : views.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-text">
                No hay vistas creadas todavía.
              </p>
              <p className="mt-1 text-[13px] text-text-muted">
                Crea una desde <code className="font-mono">Admin → Vistas → Nueva vista</code>.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-soft">
              Sin resultados.
            </p>
          ) : (
            <ul className="flex flex-col gap-1 p-2">
              {filtered.map((v) => {
                const isPicked = v.id === pickedId;
                const visibleModules = v.modules.filter((m) => m.visible).length;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setPickedId(v.id)}
                      aria-pressed={isPicked}
                      className={`flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left transition ${
                        isPicked
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/15'
                          : 'border-border hover:border-brand-300 hover:bg-surface-2'
                      }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          isPicked
                            ? 'bg-brand-500 text-white'
                            : 'bg-surface-2 text-text-soft'
                        }`}
                      >
                        <Icon name="grid" size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-[14px] text-text">
                            {v.name}
                          </span>
                        </div>
                        <code className="block font-mono text-[11px] text-text-soft">
                          {`/v/${v.slug}`}
                        </code>
                      </div>
                      <span className="font-mono text-[11px] text-text-soft">
                        {visibleModules} mód.
                      </span>
                      {isPicked && (
                        <Icon
                          name="check"
                          size={16}
                          strokeWidth={3}
                          className="text-brand-500"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted transition hover:bg-surface-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!pickedId}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Listo
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
