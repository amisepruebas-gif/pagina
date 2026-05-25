'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageInput from './ImageInput';
import ProductPickerButton from './ProductPickerButton';
import { AdminPageHeader } from './AdminPageHeader';
import { Toggle } from './Toggle';
import { ModuleCard, MODULE_ICONS } from './ModuleCard';
import { ColorField } from './ColorField';
import { Button, Icon, Input } from '@/components/ui';
import { getPageViewById } from '@/lib/page-views';
import { updatePageView } from '@/lib/admin/page-views-admin';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';
import {
  MODULE_TYPES,
  MODULE_LABELS,
  BANNER_LINK_LABELS,
  emptyModule,
  type ViewModule,
  type ViewModuleType,
  type ViewBanner,
  type BannerLinkType
} from '@/types/page-view';

/** Junta todas las URLs de imágenes de banners vivos en la vista. */
function collectViewImages(modules: ViewModule[]): string[] {
  const out: string[] = [];
  for (const m of modules) {
    if (m.banners) {
      for (const b of m.banners) if (b.imageUrl) out.push(b.imageUrl);
    }
  }
  return out;
}

export default function PageViewEditor({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [active, setActive] = useState(false);
  const [modules, setModules] = useState<ViewModule[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageCleanup = useImageCleanup();

  useEffect(() => {
    getPageViewById(id)
      .then((v) => {
        if (!v) {
          setNotFound(true);
        } else {
          setName(v.name);
          setSlug(v.slug);
          setActive(v.active);
          setModules(v.modules);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[VISTAS] cargar', err);
        setLoading(false);
        setNotFound(true);
      });
  }, [id]);

  // El aviso de "guardado" se oculta solo tras unos segundos.
  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(false), 3500);
    return () => window.clearTimeout(t);
  }, [saved]);

  function patchModule(moduleId: string, patch: Partial<ViewModule>) {
    setModules((ms) =>
      ms.map((m) => (m.id === moduleId ? { ...m, ...patch } : m))
    );
  }

  function addModule(type: ViewModuleType) {
    const m = emptyModule(type);
    setModules((ms) => [...ms, m]);
    setExpandedId(m.id);
    setShowAdd(false);
  }

  function removeModule(moduleId: string) {
    setModules((ms) => ms.filter((m) => m.id !== moduleId));
  }

  function moveModule(moduleId: string, dir: -1 | 1) {
    setModules((ms) => {
      const idx = ms.findIndex((m) => m.id === moduleId);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= ms.length) return ms;
      const copy = [...ms];
      const a = copy[idx];
      const b = copy[next];
      if (!a || !b) return ms;
      copy[idx] = b;
      copy[next] = a;
      return copy;
    });
  }

  function patchBanner(
    moduleId: string,
    bannerIdx: number,
    patch: Partial<ViewBanner>
  ) {
    setModules((ms) =>
      ms.map((m) => {
        if (m.id !== moduleId) return m;
        const banners = [...(m.banners ?? [])];
        const cur = banners[bannerIdx];
        if (!cur) return m;
        banners[bannerIdx] = { ...cur, ...patch };
        return { ...m, banners };
      })
    );
  }

  function addBanner(moduleId: string) {
    const bannerId = `banner_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setModules((ms) =>
      ms.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              banners: [...(m.banners ?? []), { id: bannerId, imageUrl: '' }]
            }
          : m
      )
    );
  }

  function removeBanner(moduleId: string, bannerIdx: number) {
    setModules((ms) =>
      ms.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              banners: (m.banners ?? []).filter((_, i) => i !== bannerIdx)
            }
          : m
      )
    );
  }

  async function save() {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      // JSON round-trip elimina `undefined` (Firestore no lo acepta)
      const cleanModules = JSON.parse(JSON.stringify(modules)) as ViewModule[];
      await updatePageView(id, {
        name: name.trim(),
        slug: slug.trim(),
        active,
        modules: cleanModules
      });
      await imageCleanup.commit(collectViewImages(cleanModules));
      console.log('[VISTAS] guardada', id);
      setSaved(true);
    } catch (err) {
      console.error('[VISTAS] guardar', err);
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-text-muted py-12 text-center">Cargando…</p>
    );
  }
  if (notFound) {
    return (
      <div className="py-16 text-center">
        <p className="font-display font-semibold text-text">
          Vista no encontrada.
        </p>
        <Link
          href="/admin/vistas"
          className="mt-3 inline-block text-sm font-display font-semibold text-brand-700 hover:underline"
        >
          ← Volver a Vistas
        </Link>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: 'Admin', href: '/admin' },
          { label: 'Vistas', href: '/admin/vistas' },
          { label: name || 'Editar' }
        ]}
        title={`Editar — ${name || 'vista'}`}
        description={`URL pública: /v/${slug || '…'}`}
        action={
          <div className="flex gap-2">
            {active && slug && (
              <a href={`/v/${slug}`} target="_blank" rel="noreferrer">
                <Button variant="secondary" leadingIcon="eye">
                  Vista previa
                </Button>
              </a>
            )}
            <Link href="/admin/vistas">
              <Button variant="secondary" leadingIcon="arr-left">
                Volver
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 pb-[100px] grid gap-5 items-start xl:grid-cols-[1fr_320px]">
        {/* Columna de módulos */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex justify-between items-center gap-2.5 flex-wrap">
            <h3 className="font-display font-bold text-lg">
              Módulos ({modules.length})
            </h3>
            <Button
              leadingIcon={showAdd ? 'x' : 'plus'}
              onClick={() => setShowAdd((s) => !s)}
            >
              {showAdd ? 'Cancelar' : 'Agregar módulo'}
            </Button>
          </div>

          {showAdd && (
            <div className="p-4 bg-brand-50 border-[1.5px] border-dashed border-brand-500 rounded-md">
              <div className="font-mono text-[11px] tracking-[0.06em] uppercase text-brand-700 font-bold mb-2.5">
                Elige un tipo de módulo
              </div>
              <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                {MODULE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addModule(t)}
                    className="flex items-center gap-2.5 px-3.5 py-3 min-h-12 bg-surface border border-border
                               rounded-sm cursor-pointer font-display font-semibold text-[13px] text-text
                               transition hover:border-brand-500 hover:bg-white"
                  >
                    <Icon
                      name={MODULE_ICONS[t]}
                      size={16}
                      strokeWidth={2}
                      className="text-brand-700"
                    />
                    {MODULE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {modules.length === 0 && !showAdd && (
            <div className="p-8 bg-surface border border-dashed border-border-strong rounded-md text-center text-text-soft text-[13px]">
              Aún no hay módulos. Agrega uno para empezar a armar la vista.
            </div>
          )}

          {modules.map((m, idx) => (
            <ModuleCard
              key={m.id}
              type={m.type}
              title={m.title}
              visible={m.visible}
              index={idx}
              total={modules.length}
              expanded={expandedId === m.id}
              onToggleExpand={() =>
                setExpandedId((e) => (e === m.id ? null : m.id))
              }
              onMove={(dir) => moveModule(m.id, dir)}
              onToggleVisible={() => patchModule(m.id, { visible: !m.visible })}
              onRemove={() => removeModule(m.id)}
            >
              <ModuleEditor
                module={m}
                onPatch={(patch) => patchModule(m.id, patch)}
                onPatchBanner={(bi, patch) => patchBanner(m.id, bi, patch)}
                onAddBanner={() => addBanner(m.id)}
                onRemoveBanner={(bi) => removeBanner(m.id, bi)}
                onReplaceImage={imageCleanup.onReplace}
                onUploadedImage={imageCleanup.onUploaded}
              />
            </ModuleCard>
          ))}
        </div>

        {/* Ajustes de la vista (sticky) */}
        <aside className="xl:sticky xl:top-6 bg-surface border border-border rounded-lg p-5 flex flex-col gap-3.5">
          <h3 className="font-display font-bold text-[15px]">
            Ajustes de la vista
          </h3>
          <Input
            label="Nombre"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Slug (URL)"
            leadingIcon="tag"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            hint={`La vista vivirá en /v/${slug || '…'}`}
            className="font-mono"
          />
          <label className="flex items-center gap-3.5 py-2 cursor-pointer">
            <Toggle
              checked={active}
              onChange={setActive}
              label="Vista activa"
            />
            <div className="flex-1">
              <div className="font-display font-semibold text-sm">
                Vista activa
              </div>
              <div className="mt-0.5 text-xs text-text-soft">
                Si está inactiva, la URL pública no es visible.
              </div>
            </div>
          </label>
        </aside>
      </div>

      {/* Barra de guardado sticky */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 bg-surface border-t border-border
                   px-6 py-3 flex items-center justify-end gap-3
                   shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.12)]"
      >
        {error && <span className="text-sm text-error mr-auto">{error}</span>}
        <Button
          variant="ghost"
          onClick={async () => {
            await imageCleanup.rollback();
            router.push('/admin/vistas');
          }}
        >
          Descartar
        </Button>
        <Button onClick={save} loading={saving} trailingIcon="check">
          Guardar vista
        </Button>
      </div>

      {/* Toast de confirmación */}
      {saved && !error && (
        <div
          role="status"
          className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-3 rounded-lg bg-surface border border-success/40 shadow-lg animate-[mm-fade_220ms_cubic-bezier(.22,1,.36,1)]"
        >
          <span className="inline-flex items-center justify-center size-6 rounded-full bg-success text-white shrink-0">
            <Icon name="check" size={14} strokeWidth={3} />
          </span>
          <span className="font-display font-semibold text-sm text-text">
            Cambios guardados
          </span>
        </div>
      )}
    </>
  );
}

/** ISO (UTC) → valor para `<input type="datetime-local">` en hora local. */
function isoToLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Valor de `datetime-local` (hora local) → ISO UTC, inequívoco para el countdown. */
function localInputToIso(local: string): string {
  if (!local) return '';
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

interface ModuleEditorProps {
  module: ViewModule;
  onPatch: (patch: Partial<ViewModule>) => void;
  onPatchBanner: (bannerIdx: number, patch: Partial<ViewBanner>) => void;
  onAddBanner: () => void;
  onRemoveBanner: (bannerIdx: number) => void;
  onReplaceImage: (oldUrl: string) => void;
  onUploadedImage: (newUrl: string) => void;
}

/** Panel de edición expandido de un módulo, según su tipo. */
function ModuleEditor({
  module,
  onPatch,
  onPatchBanner,
  onAddBanner,
  onRemoveBanner,
  onReplaceImage,
  onUploadedImage
}: ModuleEditorProps) {
  const hasBanners = module.type === 'slider' || module.type === 'banners';

  return (
    <div className="flex flex-col gap-3.5">
      {/* Título / subtítulo — no aplica a categories que es automático */}
      {module.type !== 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Título"
            value={module.title ?? ''}
            onChange={(e) => onPatch({ title: e.target.value })}
          />
          <Input
            label="Subtítulo"
            value={module.subtitle ?? ''}
            onChange={(e) => onPatch({ subtitle: e.target.value })}
          />
        </div>
      )}

      {module.type === 'categories' && (
        <p className="text-[13px] text-text-soft">
          Este módulo muestra automáticamente todas las categorías activas.
        </p>
      )}

      {(module.type === 'products' || module.type === 'promo') && (
        <div>
          <div className="font-display font-semibold text-[13px] text-text mb-1.5">
            Productos
          </div>
          <ProductPickerButton
            value={module.productIds ?? []}
            onChange={(ids) => onPatch({ productIds: ids })}
          />
        </div>
      )}

      {module.type === 'promo' && (
        <div className="space-y-3.5 rounded-md bg-surface border border-border p-3.5">
          <div className="font-display font-bold text-[13px] text-text">
            Estilo promocional
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ColorField
              label="Color de fondo"
              value={module.promoConfig?.bgColor ?? '#1a1a2e'}
              onChange={(hex) =>
                onPatch({
                  promoConfig: { ...module.promoConfig, bgColor: hex }
                })
              }
            />
            <ColorField
              label="Color de texto"
              value={module.promoConfig?.textColor ?? '#ffffff'}
              onChange={(hex) =>
                onPatch({
                  promoConfig: { ...module.promoConfig, textColor: hex }
                })
              }
            />
            <ColorField
              label="Color del badge"
              value={module.promoConfig?.badgeColor ?? '#FF69B4'}
              onChange={(hex) =>
                onPatch({
                  promoConfig: { ...module.promoConfig, badgeColor: hex }
                })
              }
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Texto del badge"
              placeholder="OFERTA"
              value={module.promoConfig?.badgeText ?? ''}
              onChange={(e) =>
                onPatch({
                  promoConfig: {
                    ...module.promoConfig,
                    badgeText: e.target.value
                  }
                })
              }
            />
            <Input
              label="Fin del contador (opcional)"
              type="datetime-local"
              value={isoToLocalInput(module.promoConfig?.countdownEnd ?? '')}
              onChange={(e) =>
                onPatch({
                  promoConfig: {
                    ...module.promoConfig,
                    countdownEnd: localInputToIso(e.target.value)
                  }
                })
              }
            />
          </div>
        </div>
      )}

      {module.type === 'video' && (
        <Input
          label="URL del video (YouTube o Vimeo)"
          type="url"
          leadingIcon="eye"
          placeholder="https://www.youtube.com/watch?v=…"
          value={module.videoUrl ?? ''}
          onChange={(e) => onPatch({ videoUrl: e.target.value })}
        />
      )}

      {hasBanners && (
        <div className="flex flex-col gap-2.5">
          <div className="font-display font-semibold text-[13px] text-text">
            Banners
          </div>
          {(module.banners ?? []).map((banner, bi) => (
            <BannerEditor
              key={banner.id ?? bi}
              banner={banner}
              onPatch={(patch) => onPatchBanner(bi, patch)}
              onRemove={() => onRemoveBanner(bi)}
              onReplaceImage={onReplaceImage}
              onUploadedImage={onUploadedImage}
            />
          ))}
          <div>
            <Button
              size="sm"
              variant="secondary"
              leadingIcon="plus"
              onClick={onAddBanner}
            >
              Agregar banner
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BannerEditor({
  banner,
  onPatch,
  onRemove,
  onReplaceImage,
  onUploadedImage
}: {
  banner: ViewBanner;
  onPatch: (patch: Partial<ViewBanner>) => void;
  onRemove: () => void;
  onReplaceImage: (oldUrl: string) => void;
  onUploadedImage: (newUrl: string) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-3.5 space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-[12px] text-text-soft uppercase tracking-[0.06em]">
          Banner
        </span>
        <Button
          size="sm"
          variant="ghost"
          leadingIcon="x"
          onClick={onRemove}
          className="!text-error"
        >
          Quitar
        </Button>
      </div>
      <ImageInput
        value={banner.imageUrl}
        onChange={(url) => onPatch({ imageUrl: url })}
        onReplace={onReplaceImage}
        onUploaded={onUploadedImage}
        label="Imagen"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <BannerLinkSelect
          value={banner.linkType}
          onChange={(lt) => onPatch({ linkType: lt })}
        />
        {banner.linkType && (
          <Input
            label={
              banner.linkType === 'producto'
                ? 'Slug del producto'
                : banner.linkType === 'categoria'
                  ? 'ID de la categoría'
                  : banner.linkType === 'vista'
                    ? 'Slug de la vista'
                    : 'URL'
            }
            value={banner.linkValue ?? ''}
            onChange={(e) => onPatch({ linkValue: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

function BannerLinkSelect({
  value,
  onChange
}: {
  value: BannerLinkType | undefined;
  onChange: (lt: BannerLinkType | undefined) => void;
}) {
  return (
    <label className="block">
      <span className="font-display font-semibold text-[13px] text-text mb-1.5 block">
        Enlazar a
      </span>
      <div className="relative h-12 rounded-md bg-surface border-[1.5px] border-border-strong">
        <select
          value={value ?? ''}
          onChange={(e) =>
            onChange((e.target.value || undefined) as BannerLinkType | undefined)
          }
          className="appearance-none w-full h-full pl-3.5 pr-10 bg-transparent outline-none text-sm text-text"
        >
          <option value="">Sin enlace</option>
          {(Object.keys(BANNER_LINK_LABELS) as BannerLinkType[]).map((lt) => (
            <option key={lt} value={lt}>
              {BANNER_LINK_LABELS[lt]}
            </option>
          ))}
        </select>
        <Icon
          name="chev-down"
          size={16}
          strokeWidth={2}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-soft"
        />
      </div>
    </label>
  );
}
