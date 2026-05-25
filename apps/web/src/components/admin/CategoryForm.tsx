'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createCategory,
  updateCategory,
  type CategoryFormValues
} from '@/lib/admin/categories-admin';
import { GRADIENT_PRESETS } from '@/types/category';
import { Input, Textarea, Icon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { FormShell } from './FormShell';
import { FormSection, FlagRow } from './FormSection';
import ImageInput from './ImageInput';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';

interface CategoryFormProps {
  initial?: Partial<CategoryFormValues> & { id?: string };
}

const empty: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  gradient: '',
  order: 0,
  active: true
};

export default function CategoryForm({ initial }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [values, setValues] = useState<CategoryFormValues>({
    ...empty,
    ...initial
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const imageCleanup = useImageCleanup();

  function setField<K extends keyof CategoryFormValues>(
    key: K,
    val: CategoryFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSubmit() {
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      if (isEdit && initial?.id) {
        await updateCategory(initial.id, values);
        await imageCleanup.commit(values.imageUrl ? [values.imageUrl] : []);
        setSuccess(true);
        router.refresh();
      } else {
        const newId = await createCategory(values);
        await imageCleanup.commit(values.imageUrl ? [values.imageUrl] : []);
        router.push(`/admin/categorias/${newId}`);
        router.refresh();
      }
    } catch (err) {
      console.error('[ADMIN] error guardando categoría:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        msg.includes('PERMISSION_DENIED') ||
          msg.includes('insufficient permissions')
          ? 'Permiso denegado. Verifica que tu usuario tiene role=admin.'
          : `Error: ${msg}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  const gradientPreview =
    values.gradient ||
    GRADIENT_PRESETS[0]?.value ||
    'from-slate-300 to-slate-200';

  return (
    <FormShell
      breadcrumb={[
        { label: 'Admin', href: '/admin' },
        { label: 'Categorías', href: '/admin/categorias' },
        { label: isEdit ? (initial?.name ?? 'Editar') : 'Nueva' }
      ]}
      title={isEdit ? `Editar — ${initial?.name ?? ''}` : 'Nueva categoría'}
      description="Las categorías agrupan productos y aparecen en la navegación."
      onCancel={async () => {
        await imageCleanup.rollback();
        router.push('/admin/categorias');
      }}
      onSave={() => {
        void handleSubmit();
      }}
      saving={submitting}
    >
      <FormSection title="Información">
        <Input
          label="Nombre"
          required
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
        />
        <Input
          label="Slug (URL)"
          leadingIcon="tag"
          placeholder="llaveros-deportivos"
          value={values.slug ?? ''}
          onChange={(e) => setField('slug', e.target.value)}
          hint="Si lo dejas vacío se genera desde el nombre."
        />
        <Textarea
          label="Descripción"
          rows={3}
          value={values.description ?? ''}
          onChange={(e) => setField('description', e.target.value)}
        />
        <Input
          label="Orden"
          type="number"
          inputMode="numeric"
          step={1}
          value={String(values.order)}
          onChange={(e) => setField('order', Number(e.target.value) || 0)}
          hint="Menor número aparece primero en el strip del home."
        />
      </FormSection>

      <FormSection
        title="Imagen"
        description="Opcional. Si hay imagen, tapa el gradiente."
      >
        <ImageInput
          label="Imagen"
          value={values.imageUrl ?? ''}
          onChange={(url) => setField('imageUrl', url)}
          onReplace={imageCleanup.onReplace}
          onUploaded={imageCleanup.onUploaded}
          hint="Vacío = se usa solo el gradiente de abajo."
        />
      </FormSection>

      <FormSection
        title="Gradiente de fondo"
        description="Si no subes imagen, se usa este gradiente como fallback."
      >
        <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          <button
            type="button"
            onClick={() => setField('gradient', '')}
            aria-pressed={!values.gradient}
            className={cn(
              'p-0 cursor-pointer rounded-md overflow-hidden bg-transparent flex flex-col',
              !values.gradient
                ? 'border-2 border-brand-500'
                : 'border-[1.5px] border-border-strong'
            )}
          >
            <div className="h-16 bg-surface-2" />
            <div className="px-2.5 py-2 font-display font-semibold text-xs bg-surface text-text inline-flex items-center gap-1.5">
              {!values.gradient && (
                <Icon
                  name="check"
                  size={12}
                  strokeWidth={3}
                  className="text-brand-700"
                />
              )}
              Auto (por id)
            </div>
          </button>
          {GRADIENT_PRESETS.map((g) => {
            const active = values.gradient === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => setField('gradient', g.value)}
                aria-pressed={active}
                className={cn(
                  'p-0 cursor-pointer rounded-md overflow-hidden bg-transparent flex flex-col',
                  active
                    ? 'border-2 border-brand-500'
                    : 'border-[1.5px] border-border-strong'
                )}
              >
                <div className={`h-16 bg-gradient-to-br ${g.value}`} />
                <div className="px-2.5 py-2 font-display font-semibold text-xs bg-surface text-text inline-flex items-center gap-1.5">
                  {active && (
                    <Icon
                      name="check"
                      size={12}
                      strokeWidth={3}
                      className="text-brand-700"
                    />
                  )}
                  {g.label}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs text-text-soft">Preview:</span>
          <div
            className={`w-16 h-16 rounded-full shadow-xs bg-gradient-to-br ${gradientPreview}`}
            style={
              values.imageUrl
                ? {
                    backgroundImage: `url(${values.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }
                : undefined
            }
          />
          <span className="font-display font-semibold text-sm text-text">
            {values.name || 'Categoría'}
          </span>
        </div>
      </FormSection>

      <FormSection title="Visibilidad">
        <FlagRow
          checked={values.active}
          onChange={(v) => setField('active', v)}
          title="Activa"
          subtitle="Si está desactivada, no aparece en la tienda pero conserva sus productos."
        />
      </FormSection>

      {error && (
        <div className="mb-4 rounded-md border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}
      {success && !error && (
        <div className="mb-4 rounded-md border border-success/40 bg-success/10 px-4 py-3 text-sm text-success inline-flex items-center gap-2">
          <Icon name="check" size={16} strokeWidth={2.6} />
          Guardado correctamente.
        </div>
      )}
    </FormShell>
  );
}
