'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createProduct,
  updateProduct,
  syncProductImages,
  DuplicateFieldError,
  type ProductFormValues
} from '@/lib/admin/products-admin';
import type { Category } from '@/types/category';
import type { Material, Subcategory, Tag } from '@/types/taxonomy';
import { Icon, Input, Select, Textarea } from '@/components/ui';
import ImageInput from './ImageInput';
import ProductImagesField from './ProductImagesField';
import { FormShell } from './FormShell';
import { FormSection, FlagRow } from './FormSection';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';

interface ProductFormProps {
  initial?: Partial<ProductFormValues> & { id?: string };
  /** URLs de las imágenes adicionales ya guardadas (modo edición). */
  initialImages?: string[];
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
  tags: Tag[];
  /**
   * Si se pasa, sobreescribe el flujo default (router.push → lista). Útil
   * cuando el form vive dentro de un modal: el padre cierra el modal en vez
   * de navegar.
   */
  onSaved?: (id: string) => void;
  /** Igual que onSaved pero al cancelar / dar atrás. */
  onCancelOverride?: () => void;
  /** Cuando true, oculta el breadcrumb del FormShell (el modal ya tiene su propio header). */
  hideBreadcrumb?: boolean;
  /**
   * El padre (modal) registra el rollback de imágenes y un flag de dirty
   * para poder limpiar al cerrar sin guardar. Si no se pasa, el form opera
   * como antes.
   */
  onMountCleanupHandle?: (handle: {
    rollback: () => Promise<void>;
    isDirty: () => boolean;
  }) => void;
}

const emptyForm: ProductFormValues = {
  name: '',
  slug: '',
  sku: '',
  description: '',
  longDescription: '',
  price: 0,
  costPrice: undefined,
  originalPrice: undefined,
  stock: undefined,
  isNew: false,
  isFeatured: false,
  active: true,
  primaryImageUrl: '',
  categoryId: '',
  subcategoryId: '',
  materialId: '',
  tagIds: []
};

export default function ProductForm({
  initial,
  initialImages,
  categories,
  subcategories,
  materials,
  tags,
  onSaved,
  onCancelOverride,
  hideBreadcrumb,
  onMountCleanupHandle
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [values, setValues] = useState<ProductFormValues>({
    ...emptyForm,
    ...initial
  });
  const [additionalImages, setAdditionalImagesState] = useState<string[]>(
    initialImages ?? []
  );
  const setAdditionalImages: typeof setAdditionalImagesState = (next) => {
    setAdditionalImagesState(next);
    setTouched(true);
  };
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dupError, setDupError] = useState<{
    field: 'slug' | 'sku';
    conflictingName: string;
    suggestion: string;
  } | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  const imageCleanup = useImageCleanup();

  // Expone rollback + dirty-flag al padre (modal) para que pueda limpiar
  // si el usuario cierra con X o Esc sin guardar.
  useEffect(() => {
    if (!onMountCleanupHandle) return;
    onMountCleanupHandle({
      rollback: imageCleanup.rollback,
      isDirty: () => touched
    });
  }, [onMountCleanupHandle, imageCleanup.rollback, touched]);

  function setField<K extends keyof ProductFormValues>(
    key: K,
    val: ProductFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: val }));
    setTouched(true);
    // Al editar slug/sku tras un conflicto, retiro el aviso para no
    // dejar la sugerencia vieja apuntando a un valor que ya cambió.
    if (dupError && (key === 'slug' || key === 'sku') && key === dupError.field) {
      setDupError(null);
    }
  }

  // Subcategorías filtradas por la categoría actualmente seleccionada
  const filteredSubcategories = useMemo(() => {
    if (!values.categoryId) return [];
    return subcategories.filter((s) => s.categoryId === values.categoryId);
  }, [subcategories, values.categoryId]);

  function handleCategoryChange(newCatId: string) {
    setField('categoryId', newCatId);
    // Si la subcategoría seleccionada no pertenece a esta categoría, limpiarla
    if (values.subcategoryId) {
      const stillValid = subcategories.some(
        (s) => s.id === values.subcategoryId && s.categoryId === newCatId
      );
      if (!stillValid) setField('subcategoryId', '');
    }
  }

  function toggleTag(tagId: string) {
    const next = values.tagIds.includes(tagId)
      ? values.tagIds.filter((id) => id !== tagId)
      : [...values.tagIds, tagId];
    setField('tagIds', next);
  }

  async function handleSubmit() {
    setError(null);
    setDupError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      if (isEdit && initial?.id) {
        await updateProduct(initial.id, values);
        await syncProductImages(initial.id, additionalImages);
        await imageCleanup.commit(
          [values.primaryImageUrl, ...additionalImages].filter(
            (u): u is string => Boolean(u)
          )
        );
        setSuccess(true);
        setTouched(false);
        router.refresh();
        onSaved?.(initial.id);
      } else {
        const newId = await createProduct(values);
        // El producto ya existe; si falla el guardado de imágenes igual
        // redirigimos a su edición para no crear un duplicado al reintentar.
        try {
          await syncProductImages(newId, additionalImages);
        } catch (imgErr) {
          console.error(
            '[ADMIN] producto creado, falló guardar imágenes:',
            imgErr
          );
          await imageCleanup.commit(
          [values.primaryImageUrl, ...additionalImages].filter(
            (u): u is string => Boolean(u)
          )
        );
          window.alert(
            'El producto se creó correctamente, pero hubo un error al guardar las imágenes adicionales. Vuelve a agregarlas desde esta pantalla de edición.'
          );
          if (onSaved) {
            onSaved(newId);
          } else {
            router.push(`/admin/productos/${newId}`);
          }
          router.refresh();
          return;
        }
        await imageCleanup.commit(
          [values.primaryImageUrl, ...additionalImages].filter(
            (u): u is string => Boolean(u)
          )
        );
        if (onSaved) {
          onSaved(newId);
        } else {
          router.push(`/admin/productos/${newId}`);
        }
        router.refresh();
      }
    } catch (err) {
      console.error('[ADMIN] error guardando producto:', err);
      if (err instanceof DuplicateFieldError) {
        setDupError({
          field: err.field,
          conflictingName: err.conflictingName,
          suggestion: err.suggestion
        });
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setError(
          msg.includes('PERMISSION_DENIED') ||
            msg.includes('insufficient permissions')
            ? 'Permiso denegado. Verifica que tu usuario tiene role=admin en users/{tu-uid}.'
            : `Error: ${msg}`
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormShell
      breadcrumb={
        hideBreadcrumb
          ? undefined
          : [
              { label: 'Admin', href: '/admin' },
              { label: 'Productos', href: '/admin/productos' },
              { label: isEdit ? (initial?.name ?? 'Editar') : 'Nuevo' }
            ]
      }
      title={isEdit ? `Editar — ${initial?.name ?? 'producto'}` : 'Nuevo producto'}
      description={
        isEdit
          ? 'Modifica los datos del producto en Firestore.'
          : 'Crea un producto nuevo en el catálogo.'
      }
      onCancel={async () => {
        await imageCleanup.rollback();
        if (onCancelOverride) onCancelOverride();
        else router.push('/admin/productos');
      }}
      onSave={handleSubmit}
      saving={submitting}
    >
      <FormSection
        title="Información básica"
        description="Datos visibles públicamente."
      >
        <Input
          label="Nombre del producto"
          required
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
        />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Slug"
            leadingIcon="tag"
            placeholder="llavero-tipo-a"
            value={values.slug ?? ''}
            onChange={(e) => setField('slug', e.target.value)}
            hint="Si lo dejas vacío se genera desde el nombre."
          />
          <Input
            label="SKU"
            placeholder="AT-7001"
            value={values.sku ?? ''}
            onChange={(e) => setField('sku', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection
        title="Precio y stock"
        description="Configura precios y disponibilidad."
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Precio venta MXN"
            required
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            leadingIcon="bolt"
            value={values.price}
            onChange={(e) => setField('price', Number(e.target.value))}
          />
          <Input
            label="Precio de compra"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={values.costPrice ?? ''}
            onChange={(e) =>
              setField(
                'costPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            hint="Costo interno. No se muestra al cliente."
          />
          <Input
            label="Precio anterior"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={values.originalPrice ?? ''}
            onChange={(e) =>
              setField(
                'originalPrice',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            hint="Aparece tachado si hay descuento."
          />
          <Input
            label="Stock"
            type="number"
            inputMode="numeric"
            min={0}
            step="1"
            value={values.stock ?? ''}
            onChange={(e) =>
              setField(
                'stock',
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
      </FormSection>

      <FormSection
        title="Clasificación"
        description="Para que el producto sea fácil de encontrar."
      >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select
            label="Categoría"
            value={values.categoryId ?? ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            hint={
              categories.length === 0
                ? 'No hay categorías. Crea una en /admin/categorias.'
                : undefined
            }
            options={[
              { value: '', label: '— sin categoría —' },
              ...categories.map((c) => ({ value: c.id, label: c.name }))
            ]}
          />
          <Select
            label="Subcategoría"
            value={values.subcategoryId ?? ''}
            onChange={(e) => setField('subcategoryId', e.target.value)}
            disabled={!values.categoryId || filteredSubcategories.length === 0}
            hint={
              !values.categoryId
                ? 'Elige una categoría primero.'
                : filteredSubcategories.length === 0
                  ? 'No hay subcategorías para esta categoría.'
                  : undefined
            }
            options={[
              { value: '', label: '— ninguna —' },
              ...filteredSubcategories.map((s) => ({
                value: s.id,
                label: s.name
              }))
            ]}
          />
          <Select
            label="Material"
            value={values.materialId ?? ''}
            onChange={(e) => setField('materialId', e.target.value)}
            hint={
              materials.length === 0
                ? 'No hay materiales. Crea uno en /admin/taxonomias → Materiales.'
                : undefined
            }
            options={[
              { value: '', label: '— sin material —' },
              ...materials.map((m) => ({ value: m.id, label: m.name }))
            ]}
          />
          <TagsPicker
            tags={tags}
            selected={values.tagIds}
            onToggle={toggleTag}
          />
        </div>
      </FormSection>

      <FormSection
        title="Imagen principal"
        description="Aparece en la lista y como portada en la ficha del producto."
      >
        <ImageInput
          label="Imagen principal"
          value={values.primaryImageUrl ?? ''}
          onChange={(url) => setField('primaryImageUrl', url)}
          onReplace={imageCleanup.onReplace}
          onUploaded={imageCleanup.onUploaded}
          hint="Sube la imagen principal del producto desde tu equipo."
        />
      </FormSection>

      <FormSection
        title="Imágenes adicionales"
        description="Galería de la ficha del producto. La portada sigue siendo la imagen principal."
      >
        <ProductImagesField
          value={additionalImages}
          onChange={setAdditionalImages}
          onRemove={imageCleanup.onReplace}
          onUploaded={imageCleanup.onUploaded}
        />
      </FormSection>

      <FormSection title="Descripción">
        <Input
          label="Descripción corta"
          placeholder="Frase para listados y previews"
          value={values.description ?? ''}
          onChange={(e) => setField('description', e.target.value)}
          hint="Aparece en tarjetas y resultados de búsqueda."
        />
        <Textarea
          label="Descripción larga"
          rows={5}
          placeholder="Detalle del producto, materiales, cuidados…"
          value={values.longDescription ?? ''}
          onChange={(e) => setField('longDescription', e.target.value)}
        />
      </FormSection>

      <FormSection
        title="Visibilidad"
        description="Flags y disponibilidad pública."
      >
        <FlagRow
          checked={values.active}
          onChange={(v) => setField('active', v)}
          title="Activo"
          subtitle="El producto aparece en la tienda. Desactivar lo oculta sin borrarlo."
        />
        <FlagRow
          checked={values.isFeatured}
          onChange={(v) => setField('isFeatured', v)}
          title="Destacado"
          subtitle="Aparece en la home — sección Destacados."
        />
        <FlagRow
          checked={values.isNew}
          onChange={(v) => setField('isNew', v)}
          title="Marcado como nuevo"
          subtitle="Aparece en la home — sección Recién llegados, con badge."
        />
      </FormSection>

      {dupError && (
        <div className="mt-4 px-4 py-3 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex-1">
            <p>
              Ya existe el producto{' '}
              <span className="font-semibold">«{dupError.conflictingName}»</span>{' '}
              con ese {dupError.field === 'slug' ? 'slug' : 'SKU'}. Elige otro
              valor para que no se pisen.
            </p>
            <p className="mt-1 text-amber-800">
              Sugerencia libre:{' '}
              <span className="font-mono">{dupError.suggestion}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setField(dupError.field, dupError.suggestion);
              setDupError(null);
            }}
            className="shrink-0 rounded-md bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-600 transition"
          >
            Usar sugerencia
          </button>
        </div>
      )}
      {error && !dupError && (
        <div className="mt-4 px-4 py-3 rounded-md bg-error/[0.12] border border-error/30 text-error text-sm">
          {error}
        </div>
      )}
      {success && !error && !dupError && (
        <div className="mt-4 px-4 py-3 rounded-md bg-success/[0.12] border border-success/30 text-success text-sm">
          Cambios guardados correctamente.
        </div>
      )}
    </FormShell>
  );
}

function TagsPicker({
  tags,
  selected,
  onToggle
}: {
  tags: Tag[];
  selected: string[];
  onToggle: (tagId: string) => void;
}) {
  return (
    <div>
      <div className="font-display font-semibold text-[13px] mb-1.5">
        Etiquetas
      </div>
      {tags.length === 0 ? (
        <div className="min-h-12 px-3.5 flex items-center text-text-soft text-[13px] bg-surface border-[1.5px] border-border-strong rounded-md">
          No hay etiquetas. Crea algunas en /admin/taxonomias.
        </div>
      ) : (
        <div className="min-h-12 px-2.5 py-2 bg-surface border-[1.5px] border-border-strong rounded-md flex flex-wrap gap-1.5 items-center">
          {tags.map((t) => {
            const isSelected = selected.includes(t.id);
            const style = t.color
              ? isSelected
                ? { background: t.color }
                : { borderColor: t.color, color: t.color }
              : undefined;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onToggle(t.id)}
                style={style}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-display border transition-colors ${
                  isSelected
                    ? 'text-white border-transparent bg-brand-500'
                    : 'bg-surface text-text border-border-strong hover:border-brand-500'
                }`}
              >
                {t.name}
                {isSelected && (
                  <Icon name="x" size={11} strokeWidth={2.4} />
                )}
              </button>
            );
          })}
        </div>
      )}
      <p className="mt-1.5 text-text-soft text-[13px] leading-relaxed">
        Click para alternar. Selección múltiple.
      </p>
    </div>
  );
}
