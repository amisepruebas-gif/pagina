'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createSiteContent,
  updateSiteContent,
  type SiteContentFormValues
} from '@/lib/admin/site-content-admin';
import type { SiteContentKind } from '@/types/site-content';
import { GRADIENT_PRESETS } from '@/types/category';
import { Input, Select, Icon } from '@/components/ui';
import { FormShell } from './FormShell';
import { FormSection, FlagRow } from './FormSection';
import ImageInput from './ImageInput';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';

interface SiteContentFormProps {
  initial?: Partial<SiteContentFormValues> & { id?: string };
}

const empty: SiteContentFormValues = {
  kind: 'hero',
  name: '',
  page: '/',
  order: 0,
  active: true,
  title: '',
  subtitle: '',
  ctaText: 'Ver catálogo',
  ctaHref: '/shop',
  imageUrl: '',
  gradient: '',
  href: '/shop',
  message: '',
  backgroundColor: '#FF69B4',
  textColor: '#000000',
  validFrom: '',
  validUntil: ''
};

const KIND_LABEL: Record<SiteContentKind, string> = {
  hero: 'Hero del home',
  'promo-banner': 'Banner promocional',
  topbar: 'Topbar (mensaje superior)'
};

const KIND_OPTIONS: { value: SiteContentKind; label: string }[] = (
  Object.keys(KIND_LABEL) as SiteContentKind[]
).map((k) => ({ value: k, label: KIND_LABEL[k] }));

export default function SiteContentForm({ initial }: SiteContentFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [values, setValues] = useState<SiteContentFormValues>({
    ...empty,
    ...initial
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageCleanup = useImageCleanup();

  function setField<K extends keyof SiteContentFormValues>(
    k: K,
    v: SiteContentFormValues[K]
  ) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handleSave() {
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      if (isEdit && initial?.id) {
        await updateSiteContent(initial.id, values);
        await imageCleanup.commit(values.imageUrl ? [values.imageUrl] : []);
        console.log('[ADMIN] siteContent guardado', initial.id);
        setSuccess(true);
        router.refresh();
      } else {
        const newId = await createSiteContent(values);
        await imageCleanup.commit(values.imageUrl ? [values.imageUrl] : []);
        console.log('[ADMIN] siteContent creado', newId);
        router.push(`/admin/contenido/${newId}`);
        router.refresh();
      }
    } catch (err) {
      console.error('[ADMIN] error guardando siteContent:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes('PERMISSION_DENIED') ||
          msg.includes('insufficient permissions')
          ? 'Permiso denegado. Verifica role=admin.'
          : `Error: ${msg}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormShell
      breadcrumb={[
        { label: 'Admin', href: '/admin' },
        { label: 'Contenido', href: '/admin/contenido' },
        { label: isEdit ? (initial?.name ?? 'Editar') : 'Nuevo' }
      ]}
      title={
        isEdit
          ? `Editar — ${initial?.name ?? 'bloque'}`
          : 'Nuevo bloque de contenido'
      }
      description="Los campos cambian según el tipo seleccionado. El storefront lee estos bloques automáticamente."
      onCancel={async () => {
        await imageCleanup.rollback();
        router.push('/admin/contenido');
      }}
      onSave={() => {
        void handleSave();
      }}
      saving={submitting}
    >
      <FormSection
        title="General"
        description="Tipo del bloque y nombre interno para identificarlo en el admin."
      >
        <Select
          label="Tipo"
          required
          options={KIND_OPTIONS}
          value={values.kind}
          onChange={(e) => setField('kind', e.target.value as SiteContentKind)}
        />
        <Input
          label="Nombre interno"
          required
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Hero navideño 2026"
          hint="Solo visible en el admin, no se muestra al cliente."
        />
      </FormSection>

      {values.kind === 'hero' && (
        <FormSection title="Hero" description="Bloque grande en el home.">
          <Input
            label="Título"
            required
            value={values.title ?? ''}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Llaveros personalizados"
          />
          <Input
            label="Subtítulo"
            value={values.subtitle ?? ''}
            onChange={(e) => setField('subtitle', e.target.value)}
            placeholder="Diséñalos como quieras. Envío gratis sobre $599."
          />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="Texto del botón"
              value={values.ctaText ?? ''}
              onChange={(e) => setField('ctaText', e.target.value)}
              placeholder="Ver catálogo"
            />
            <Input
              label="Link del botón"
              value={values.ctaHref ?? ''}
              onChange={(e) => setField('ctaHref', e.target.value)}
              placeholder="/shop"
            />
          </div>
          <ImageInput
            label="Imagen de fondo (opcional)"
            value={values.imageUrl ?? ''}
            onChange={(url) => setField('imageUrl', url)}
            onReplace={imageCleanup.onReplace}
            onUploaded={imageCleanup.onUploaded}
            hint="Si está vacía se usa solo el gradiente."
          />
          <div>
            <Select
              label="Gradiente"
              options={[
                { value: '', label: '— auto (rosa→púrpura por defecto) —' },
                ...GRADIENT_PRESETS.map((g) => ({
                  value: g.value,
                  label: g.label
                }))
              ]}
              value={values.gradient ?? ''}
              onChange={(e) => setField('gradient', e.target.value)}
            />
            <div
              className={`mt-2 w-full h-16 rounded-md bg-gradient-to-r ${
                values.gradient || 'from-brand-500 via-pink-400 to-purple-500'
              }`}
            />
          </div>
        </FormSection>
      )}

      {values.kind === 'promo-banner' && (
        <FormSection
          title="Banner promocional"
          description="Bloque ancho de promoción."
        >
          <Input
            label="Título"
            required
            value={values.title ?? ''}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Hasta 50% off"
          />
          <Input
            label="Subtítulo"
            value={values.subtitle ?? ''}
            onChange={(e) => setField('subtitle', e.target.value)}
            placeholder="En llaveros seleccionados"
          />
          <Input
            label="Link destino"
            required
            value={values.href ?? ''}
            onChange={(e) => setField('href', e.target.value)}
            placeholder="/shop?sale=true"
          />
          <ImageInput
            label="Imagen de fondo (opcional)"
            value={values.imageUrl ?? ''}
            onChange={(url) => setField('imageUrl', url)}
            onReplace={imageCleanup.onReplace}
            onUploaded={imageCleanup.onUploaded}
          />
          <div>
            <Select
              label="Gradiente"
              options={[
                { value: '', label: '— auto —' },
                ...GRADIENT_PRESETS.map((g) => ({
                  value: g.value,
                  label: g.label
                }))
              ]}
              value={values.gradient ?? ''}
              onChange={(e) => setField('gradient', e.target.value)}
            />
            <div
              className={`mt-2 w-full h-16 rounded-md bg-gradient-to-br ${
                values.gradient || 'from-brand-500 to-purple-500'
              }`}
            />
          </div>
        </FormSection>
      )}

      {values.kind === 'topbar' && (
        <FormSection
          title="Topbar"
          description="Banda fina arriba del sitio con un mensaje."
        >
          <Input
            label="Mensaje"
            required
            value={values.message ?? ''}
            onChange={(e) => setField('message', e.target.value)}
            placeholder="ENVÍO GRATIS SOBRE $599"
          />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="Color de fondo (hex)"
              value={values.backgroundColor ?? ''}
              onChange={(e) => setField('backgroundColor', e.target.value)}
              placeholder="#FF69B4"
              className="font-mono"
            />
            <Input
              label="Color de texto (hex)"
              value={values.textColor ?? ''}
              onChange={(e) => setField('textColor', e.target.value)}
              placeholder="#000000"
              className="font-mono"
            />
          </div>
          <div
            className="rounded-md p-3 text-center text-sm font-semibold"
            style={{
              backgroundColor: values.backgroundColor || '#FF69B4',
              color: values.textColor || '#000000'
            }}
          >
            {values.message || 'Preview'}
          </div>
        </FormSection>
      )}

      <FormSection
        title="Aplicabilidad y orden"
        description="Dónde aparece el bloque y en qué orden se prioriza."
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Página"
            value={values.page}
            onChange={(e) => setField('page', e.target.value)}
            placeholder="/"
            hint='"/" home, "/shop" tienda. Topbar suele ir "/" o vacío para todas.'
          />
          <Input
            label="Orden"
            type="number"
            inputMode="numeric"
            step="1"
            value={String(values.order)}
            onChange={(e) => setField('order', Number(e.target.value) || 0)}
            hint="Menor = aparece primero. Para Hero/Topbar solo gana el de orden menor."
          />
        </div>
      </FormSection>

      <FormSection
        title="Vigencia"
        description="Rango en que el bloque está visible. Deja vacío para no limitar."
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Desde"
            type="date"
            value={values.validFrom ?? ''}
            onChange={(e) => setField('validFrom', e.target.value)}
            hint="Vacío = sin fecha de inicio."
          />
          <Input
            label="Hasta"
            type="date"
            value={values.validUntil ?? ''}
            onChange={(e) => setField('validUntil', e.target.value)}
            hint="Vacío = sin fin."
          />
        </div>
      </FormSection>

      <FormSection title="Estado">
        <FlagRow
          checked={values.active}
          onChange={(v) => setField('active', v)}
          title="Activo"
          subtitle="Visible en la tienda dentro de su vigencia. Si está pausado, no aparece."
        />
      </FormSection>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-3">
          <Icon name="err" size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && !error && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-success/10 border border-success/30 text-success text-sm px-4 py-3">
          <Icon name="check" size={18} className="shrink-0" />
          <span>Cambios guardados.</span>
        </div>
      )}
    </FormShell>
  );
}
