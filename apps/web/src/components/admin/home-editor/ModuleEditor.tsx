'use client';

import ProductPickerButton from '../ProductPickerButton';
import ImageInput from '../ImageInput';
import { Field, TextInput, ColorInput, SelectInput } from './editor-widgets';
import { useHomeEdit } from './HomeEditContext';
import {
  MODULE_LABELS,
  BANNER_LINK_LABELS,
  type ViewModule,
  type ViewBanner,
  type BannerLinkType
} from '@/types/page-view';

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
  'outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

const LINK_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Sin enlace' },
  { value: 'producto', label: BANNER_LINK_LABELS.producto },
  { value: 'categoria', label: BANNER_LINK_LABELS.categoria },
  { value: 'vista', label: BANNER_LINK_LABELS.vista },
  { value: 'url', label: BANNER_LINK_LABELS.url }
];

/** Campos del estilo promocional (fondo, badge, contador). */
function PromoConfigFields({
  module,
  set
}: {
  module: ViewModule;
  set: (patch: Partial<ViewModule>) => void;
}) {
  const cfg = module.promoConfig ?? {};
  const setCfg = (patch: Partial<typeof cfg>) =>
    set({ promoConfig: { ...cfg, ...patch } });
  return (
    <>
      <Field label="Color de fondo">
        <ColorInput
          value={cfg.bgColor ?? '#1A1A14'}
          onChange={(v) => setCfg({ bgColor: v })}
        />
      </Field>
      <Field label="Color del texto">
        <ColorInput
          value={cfg.textColor ?? '#FFFFFF'}
          onChange={(v) => setCfg({ textColor: v })}
        />
      </Field>
      <Field label="Texto del badge">
        <TextInput
          value={cfg.badgeText ?? ''}
          onChange={(v) => setCfg({ badgeText: v })}
          placeholder="OFERTA"
        />
      </Field>
      <Field label="Color del badge">
        <ColorInput
          value={cfg.badgeColor ?? '#FF5C8A'}
          onChange={(v) => setCfg({ badgeColor: v })}
        />
      </Field>
      <Field label="Fin del contador (opcional)">
        <input
          type="datetime-local"
          value={cfg.countdownEnd ?? ''}
          onChange={(e) => setCfg({ countdownEnd: e.target.value })}
          className={inputCls}
        />
      </Field>
    </>
  );
}

/** Editor de la lista de banners (imágenes con enlace). */
function BannersEditor({
  module,
  set
}: {
  module: ViewModule;
  set: (patch: Partial<ViewModule>) => void;
}) {
  const { onImageUploaded, onImageReplaced } = useHomeEdit();
  const banners = module.banners ?? [];
  const update = (index: number, patch: Partial<ViewBanner>) =>
    set({
      banners: banners.map((b, i) => (i === index ? { ...b, ...patch } : b))
    });
  const add = () =>
    set({
      banners: [
        ...banners,
        {
          id: `bn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          imageUrl: ''
        }
      ]
    });
  const remove = (index: number) => {
    const removed = banners[index];
    if (removed?.imageUrl) onImageReplaced(removed.imageUrl);
    set({ banners: banners.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <span className="mb-2 block text-[12px] font-semibold text-gray-600">
        Banners
      </span>
      <div className="space-y-3">
        {banners.map((banner, index) => (
          <div
            key={banner.id ?? index}
            className="rounded-lg border border-gray-200 bg-gray-50/60 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Banner {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
              >
                Quitar
              </button>
            </div>
            <div className="space-y-2.5">
              <Field label="Imagen">
                <ImageInput
                  value={banner.imageUrl}
                  onChange={(url) => update(index, { imageUrl: url })}
                  onUploaded={onImageUploaded}
                  onReplace={onImageReplaced}
                />
              </Field>
              <Field label="Tipo de enlace">
                <SelectInput
                  value={banner.linkType ?? ''}
                  options={LINK_OPTIONS}
                  onChange={(v) =>
                    update(index, {
                      linkType: (v || undefined) as
                        | BannerLinkType
                        | undefined
                    })
                  }
                />
              </Field>
              {banner.linkType && (
                <Field label="Destino del enlace">
                  <TextInput
                    value={banner.linkValue ?? ''}
                    onChange={(v) => update(index, { linkValue: v })}
                    placeholder={
                      banner.linkType === 'url'
                        ? 'https://…'
                        : banner.linkType === 'producto'
                          ? 'slug del producto'
                          : banner.linkType === 'vista'
                            ? 'slug de la vista'
                            : 'id de la categoría'
                    }
                  />
                </Field>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 w-full rounded-lg border border-dashed border-blue-300 py-2 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-50"
      >
        + Agregar banner
      </button>
    </div>
  );
}

/**
 * ModuleEditor — panel de propiedades de un módulo agregado al Home
 * (Sección de productos, Promocional, Banners o Video).
 */
export function ModuleEditor({ module }: { module: ViewModule }) {
  const { updateModule } = useHomeEdit();
  const set = (patch: Partial<ViewModule>) => updateModule(module.id, patch);

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-gray-200 px-4 py-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-500">
          Módulo
        </div>
        <h2 className="text-[15px] font-bold text-gray-900">
          {MODULE_LABELS[module.type]}
        </h2>
      </header>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {(module.type === 'products' || module.type === 'promo') && (
          <>
            <Field label="Título">
              <TextInput
                value={module.title ?? ''}
                onChange={(v) => set({ title: v })}
              />
            </Field>
            <Field label="Subtítulo">
              <TextInput
                value={module.subtitle ?? ''}
                onChange={(v) => set({ subtitle: v })}
              />
            </Field>
            <Field label="Productos">
              <ProductPickerButton
                value={module.productIds ?? []}
                onChange={(ids) => set({ productIds: ids })}
              />
            </Field>
          </>
        )}
        {module.type === 'promo' && (
          <PromoConfigFields module={module} set={set} />
        )}
        {module.type === 'banners' && (
          <BannersEditor module={module} set={set} />
        )}
        {module.type === 'video' && (
          <Field label="URL del video (YouTube o Vimeo)">
            <TextInput
              value={module.videoUrl ?? ''}
              onChange={(v) => set({ videoUrl: v })}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </Field>
        )}
      </div>
    </div>
  );
}
