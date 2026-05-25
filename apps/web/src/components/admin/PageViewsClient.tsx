'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  createPageView,
  deletePageView
} from '@/lib/admin/page-views-admin';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import type { PageView, RawPageViewDoc } from '@/types/page-view';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import { Badge, Button, IconButton, Icon } from '@/components/ui';
import { AdminPageHeader } from './AdminPageHeader';
import { ViewThumbnail } from './ViewThumbnail';

function normalize(id: string, data: DocumentData): PageView {
  const raw = data as RawPageViewDoc;
  return {
    id,
    name: raw.name ?? 'Vista',
    slug: raw.slug ?? id,
    active: raw.active !== false,
    modules: Array.isArray(raw.modules) ? raw.modules : [],
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

type Panel = 'inicial' | 'creadas';

export default function PageViewsClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [views, setViews] = useState<PageView[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState<Panel>('inicial');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, 'vistas'),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.id, d.data()));
        list.sort(
          (a, b) =>
            (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
        );
        setViews(list);
        setLoading(false);
      },
      (err) => {
        console.error('[VISTAS] error', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Datos para las miniaturas en vivo de las vistas creadas.
  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((err) => console.error('[VISTAS] datos miniatura', err));
  }, []);

  // Si la lista queda vacía, no dejar al usuario varado en el panel "creadas".
  useEffect(() => {
    if (!loading && views.length === 0 && panel === 'creadas') {
      setPanel('inicial');
    }
  }, [loading, views.length, panel]);

  async function handleCreate() {
    const name = window.prompt('Nombre de la nueva vista:');
    if (!name || !name.trim()) return;
    setBusy(true);
    try {
      const id = await createPageView(name.trim());
      console.log('[VISTAS] creada', id);
      router.push(`/admin/vistas/${id}`);
    } catch (err) {
      console.error('[VISTAS] crear', err);
      window.alert('No se pudo crear la vista.');
      setBusy(false);
    }
  }

  async function handleDelete(v: PageView) {
    if (!window.confirm(`¿Eliminar la vista "${v.name}"?`)) return;
    setBusy(true);
    try {
      await deletePageView(v.id);
      console.log('[VISTAS] eliminada', v.id);
    } catch (err) {
      console.error('[VISTAS] eliminar', err);
      window.alert('No se pudo eliminar.');
    } finally {
      setBusy(false);
    }
  }

  const hasViews = views.length > 0;

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Vistas' }]}
        title="Vistas"
        description="Edita la página de inicio y gestiona las landings configurables del sitio."
      />

      {/* Barra: pestaña navegador + acciones */}
      <div className="px-6 pt-5">
        <div className="flex items-end justify-between gap-3 border-b border-border">
          <button
            type="button"
            onClick={() => setPanel('inicial')}
            className={`relative -mb-px inline-flex items-center gap-2 rounded-t-lg border px-4 py-2.5 font-display text-sm font-semibold transition-colors ${
              panel === 'inicial'
                ? 'bg-surface border-border border-b-surface text-text'
                : 'bg-surface-2 border-transparent text-text-muted hover:text-text'
            }`}
          >
            <Icon name="grid" size={15} strokeWidth={2} />
            Vista inicial
          </button>

          <div className="flex items-center gap-2 pb-2">
            {hasViews && (
              <Button
                variant={panel === 'creadas' ? 'primary' : 'secondary'}
                size="sm"
                leadingIcon="eye"
                onClick={() => setPanel('creadas')}
              >
                Ver vistas creadas ({views.length})
              </Button>
            )}
            <Button
              size="sm"
              leadingIcon="plus"
              onClick={handleCreate}
              disabled={busy}
            >
              Nueva vista
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-sm text-text-muted py-12 text-center">Cargando…</p>
        ) : panel === 'inicial' ? (
          <HomePanel onEdit={() => router.push('/admin/vistas/inicio')} />
        ) : (
          <CreatedPanel
            views={views}
            products={products}
            categories={categories}
            busy={busy}
            onEdit={(id) => router.push(`/admin/vistas/${id}`)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}

/* ── Panel: Vista inicial ──────────────────────────────────────────── */

function HomePanel({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-start gap-5">
        <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon name="grid" size={26} strokeWidth={1.8} />
        </span>
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="gradient" size="xs" leadingIcon="star-filled">
              Vista principal
            </Badge>
            <Badge tone="success" size="xs">
              Siempre activa
            </Badge>
          </div>
          <h3 className="mt-2 font-display font-bold text-xl tracking-[-0.015em]">
            Página de inicio
          </h3>
          <p className="mt-1 max-w-xl text-sm text-text-muted">
            Es el Home del sitio (
            <code className="font-mono text-[12px]">/</code>). Edita sus textos,
            botones, enlaces y demás contenido con el editor visual: haz clic
            sobre cualquier sección y ajusta sus propiedades en vivo.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" leadingIcon="grid" onClick={onEdit}>
              Abrir editor visual
            </Button>
            <a href="/" target="_blank" rel="noreferrer">
              <Button size="sm" variant="secondary" leadingIcon="eye">
                Ver el inicio
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Panel: Vistas creadas ─────────────────────────────────────────── */

function CreatedPanel({
  views,
  products,
  categories,
  busy,
  onEdit,
  onDelete
}: {
  views: PageView[];
  products: Product[];
  categories: Category[];
  busy: boolean;
  onEdit: (id: string) => void;
  onDelete: (v: PageView) => void;
}) {
  if (views.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-surface py-16 px-6 text-center text-text-soft text-sm">
        No hay vistas creadas todavía.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {views.map((v) => {
        const visibles = v.modules.filter((m) => m.visible).length;
        return (
          <article
            key={v.id}
            className="flex gap-4 p-4 bg-surface border border-border rounded-lg flex-wrap sm:flex-nowrap"
          >
            <ViewThumbnail
              view={v}
              products={products}
              categories={categories}
            />

            <div className="flex-1 min-w-[200px] flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-[15px]">{v.name}</h3>
                {v.active ? (
                  <Badge tone="success" size="xs">
                    Activa
                  </Badge>
                ) : (
                  <Badge tone="neutral" size="xs">
                    Borrador
                  </Badge>
                )}
              </div>
              <code className="font-mono text-[11px] text-text-soft">
                {`/v/${v.slug}`}
              </code>
              <div className="text-[13px] text-text-muted">
                {v.modules.length} módulo{v.modules.length === 1 ? '' : 's'} ·{' '}
                {visibles} visible{visibles === 1 ? '' : 's'}
              </div>
              {v.updatedAt && (
                <div className="text-[11px] text-text-soft mt-auto">
                  Actualizada el{' '}
                  {v.updatedAt.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>

            <div className="flex items-start gap-1">
              {v.active && (
                <a href={`/v/${v.slug}`} target="_blank" rel="noreferrer">
                  <IconButton
                    variant="ghost"
                    icon="eye"
                    label="Ver vista"
                    size="sm"
                  />
                </a>
              )}
              <IconButton
                variant="ghost"
                icon="grid"
                label="Editar"
                size="sm"
                onClick={() => onEdit(v.id)}
              />
              <IconButton
                variant="ghost"
                icon="x"
                label="Eliminar"
                size="sm"
                disabled={busy}
                onClick={() => onDelete(v)}
                className="!text-error"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
