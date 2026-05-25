'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon, Input, Select } from '@/components/ui';
import { slugify } from '@/lib/slugify';
import { createProduct, syncProductImages } from '@/lib/admin/products-admin';
import { useImageCleanup } from '@/lib/admin/use-image-cleanup';
import { Toggle } from './Toggle';
import ImageInput from './ImageInput';
import ProductImagesField from './ProductImagesField';
import type { Category } from '@/types/category';
import type { Subcategory, Material } from '@/types/taxonomy';

interface CommonValues {
  stock?: number;
  price: number;
  costPrice?: number;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
  active: boolean;
}

interface BatchRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  primaryImageUrl: string;
  additionalImages: string[];
}

const DEFAULT_COMMON: CommonValues = {
  stock: undefined,
  price: 0,
  costPrice: undefined,
  categoryId: undefined,
  subcategoryId: undefined,
  materialId: undefined,
  active: true
};

function makeRow(): BatchRow {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    slug: '',
    sku: '',
    primaryImageUrl: '',
    additionalImages: []
  };
}

/**
 * BatchProductModal — modal para crear varios productos a la vez.
 * Los datos comunes (precios, stock, taxonomía) se llenan una sola vez;
 * cada renglón aporta su nombre + imágenes propias. Solo cierra con la ✕.
 */
export default function BatchProductModal({
  onClose,
  categories,
  subcategories,
  materials
}: {
  onClose: () => void;
  categories: Category[];
  subcategories: Subcategory[];
  materials: Material[];
}) {
  const router = useRouter();
  const [common, setCommon] = useState<CommonValues>(DEFAULT_COMMON);
  const [rows, setRows] = useState<BatchRow[]>(() => [makeRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<
    { name: string; message: string }[]
  >([]);
  const [done, setDone] = useState<{ created: number; failed: number } | null>(
    null
  );
  const imageCleanup = useImageCleanup();

  async function handleClose() {
    if (submitting) return;
    // Si no se creó nada con éxito, las imágenes subidas no quedaron
    // referenciadas en ningún producto — las borramos para no dejar basura.
    if (!done || done.created === 0) {
      await imageCleanup.rollback();
    }
    onClose();
  }

  const filteredSubcats = common.categoryId
    ? subcategories.filter((s) => s.categoryId === common.categoryId)
    : [];
  const namedRowCount = rows.filter((r) => r.name.trim()).length;

  function setCommonField<K extends keyof CommonValues>(
    key: K,
    value: CommonValues[K]
  ) {
    setCommon((c) => ({ ...c, [key]: value }));
  }

  function handleCategoryChange(newCatId: string) {
    setCommonField('categoryId', newCatId || undefined);
    // Si la subcategoría actual no pertenece a la nueva categoría, limpiarla.
    if (
      common.subcategoryId &&
      !subcategories.some(
        (s) => s.id === common.subcategoryId && s.categoryId === newCatId
      )
    ) {
      setCommonField('subcategoryId', undefined);
    }
  }

  /** Cambia el nombre y regenera slug/SKU si el usuario no los editó manualmente. */
  function setName(id: string, name: string) {
    setRows((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const prevAutoSlug = slugify(r.name);
        const prevAutoSku = prevAutoSlug.toUpperCase();
        const nextAutoSlug = slugify(name);
        const nextAutoSku = nextAutoSlug.toUpperCase();
        // Si el slug/SKU sigue siendo el autogenerado del nombre anterior
        // (o estaban vacíos), lo regeneramos. Si el usuario lo cambió, lo conservamos.
        const keepSlug = r.slug && r.slug !== prevAutoSlug;
        const keepSku = r.sku && r.sku !== prevAutoSku;
        return {
          ...r,
          name,
          slug: keepSlug ? r.slug : nextAutoSlug,
          sku: keepSku ? r.sku : nextAutoSku
        };
      })
    );
  }

  function updateRow(id: string, patch: Partial<BatchRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((rs) => [...rs, makeRow()]);
  }
  function removeRow(id: string) {
    setRows((rs) => (rs.length <= 1 ? rs : rs.filter((r) => r.id !== id)));
  }

  async function handleSubmit() {
    setValidationError(null);
    setRowErrors([]);
    const valid = rows.filter((r) => r.name.trim());
    if (valid.length === 0) {
      setValidationError('Agrega al menos un producto con nombre.');
      return;
    }
    if (!common.price || common.price <= 0) {
      setValidationError('El precio de venta común debe ser mayor a 0.');
      return;
    }

    setSubmitting(true);
    setProgress({ done: 0, total: valid.length });
    let created = 0;
    const failures: { name: string; message: string }[] = [];
    /** URLs que sí terminaron referenciadas en algún producto creado. */
    const activeUrls: string[] = [];

    for (let i = 0; i < valid.length; i++) {
      const r = valid[i]!;
      try {
        const newId = await createProduct({
          name: r.name.trim(),
          slug: r.slug.trim() || undefined,
          sku: r.sku.trim() || undefined,
          price: common.price,
          costPrice: common.costPrice,
          stock: common.stock,
          isNew: false,
          isFeatured: false,
          active: common.active,
          primaryImageUrl: r.primaryImageUrl || undefined,
          categoryId: common.categoryId || undefined,
          subcategoryId: common.subcategoryId || undefined,
          materialId: common.materialId || undefined,
          tagIds: []
        });
        if (r.additionalImages.length > 0) {
          await syncProductImages(newId, r.additionalImages);
        }
        created++;
        if (r.primaryImageUrl) activeUrls.push(r.primaryImageUrl);
        activeUrls.push(...r.additionalImages);
      } catch (err) {
        console.error('[BATCH] error creando', r.name, err);
        failures.push({
          name: r.name,
          message: err instanceof Error ? err.message : String(err)
        });
      }
      setProgress({ done: i + 1, total: valid.length });
    }

    // Borra de Storage cualquier imagen subida/sustituida que no terminó
    // referenciada en un producto creado.
    await imageCleanup.commit(activeUrls);

    setSubmitting(false);
    setRowErrors(failures);
    setDone({ created, failed: failures.length });
    if (created > 0) router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="presentation"
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-xl bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Crear lote de productos"
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold">
              Crear lote de productos
            </h2>
            <p className="text-[12px] text-text-soft">
              Carga varios productos a la vez con campos comunes. Solo cierra
              con la <strong>✕</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Cerrar"
            className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text disabled:opacity-40"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* DATOS COMUNES */}
          <section>
            <h3 className="mb-3 font-display font-semibold">
              Datos comunes del lote
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Precio venta MXN"
                required
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={common.price || ''}
                onChange={(e) =>
                  setCommonField('price', Number(e.target.value) || 0)
                }
              />
              <Input
                label="Precio de compra"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={common.costPrice ?? ''}
                onChange={(e) =>
                  setCommonField(
                    'costPrice',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
              <Input
                label="Stock"
                type="number"
                inputMode="numeric"
                min={0}
                step="1"
                value={common.stock ?? ''}
                onChange={(e) =>
                  setCommonField(
                    'stock',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
              <label className="flex items-end gap-3 pb-2">
                <Toggle
                  checked={common.active}
                  onChange={(v) => setCommonField('active', v)}
                  label="Activo"
                />
                <div className="text-sm">
                  <div className="font-display font-semibold">Activo</div>
                  <div className="text-[11px] text-text-soft">
                    Productos visibles al crear
                  </div>
                </div>
              </label>
              <Select
                label="Categoría"
                value={common.categoryId ?? ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                placeholder="— selecciona —"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              <Select
                label="Subcategoría"
                value={common.subcategoryId ?? ''}
                onChange={(e) =>
                  setCommonField('subcategoryId', e.target.value || undefined)
                }
                placeholder={
                  common.categoryId
                    ? '— selecciona —'
                    : 'Elige una categoría primero'
                }
                disabled={!common.categoryId}
                options={filteredSubcats.map((s) => ({
                  value: s.id,
                  label: s.name
                }))}
              />
              <Select
                label="Material"
                value={common.materialId ?? ''}
                onChange={(e) =>
                  setCommonField('materialId', e.target.value || undefined)
                }
                placeholder="— selecciona —"
                options={materials.map((m) => ({ value: m.id, label: m.name }))}
              />
            </div>
          </section>

          {/* LISTA DE PRODUCTOS */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold">
                Productos del lote{' '}
                <span className="text-text-soft font-normal text-[13px]">
                  ({namedRowCount} con nombre)
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {rows.map((r, i) => (
                <article
                  key={r.id}
                  className="rounded-lg border border-border bg-surface-2/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-text-soft">
                      Producto {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRow(r.id)}
                      disabled={rows.length <= 1 || submitting}
                      aria-label="Quitar producto del lote"
                      className="rounded px-1.5 py-0.5 text-[12px] font-semibold text-error transition hover:bg-error/10 disabled:opacity-30"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input
                      label="Nombre"
                      required
                      value={r.name}
                      onChange={(e) => setName(r.id, e.target.value)}
                    />
                    <Input
                      label="Slug"
                      value={r.slug}
                      onChange={(e) =>
                        updateRow(r.id, { slug: e.target.value })
                      }
                      className="font-mono"
                      hint="Autogenerado, editable."
                    />
                    <Input
                      label="SKU"
                      value={r.sku}
                      onChange={(e) => updateRow(r.id, { sku: e.target.value })}
                      className="font-mono"
                      hint="Autogenerado, editable."
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
                    <div>
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Imagen principal
                      </span>
                      <ImageInput
                        value={r.primaryImageUrl}
                        onChange={(url) =>
                          updateRow(r.id, { primaryImageUrl: url })
                        }
                        onUploaded={imageCleanup.onUploaded}
                        onReplace={imageCleanup.onReplace}
                      />
                    </div>
                    <div>
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
                        Imágenes adicionales (opcional)
                      </span>
                      <ProductImagesField
                        value={r.additionalImages}
                        onChange={(urls) =>
                          updateRow(r.id, { additionalImages: urls })
                        }
                        onUploaded={imageCleanup.onUploaded}
                        onRemove={imageCleanup.onReplace}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              disabled={submitting}
              className="mt-3 w-full rounded-lg border border-dashed border-brand-300 py-2.5 text-sm font-display font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
            >
              + Agregar otro producto
            </button>
          </section>

          {validationError && (
            <div className="rounded-md border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
              {validationError}
            </div>
          )}

          {rowErrors.length > 0 && (
            <div className="rounded-md border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm">
              <div className="mb-1 font-display font-semibold">
                {rowErrors.length} producto{rowErrors.length === 1 ? '' : 's'}{' '}
                con error
              </div>
              <ul className="space-y-0.5 text-[12px] text-text-muted">
                {rowErrors.map((e, i) => (
                  <li key={i}>
                    <strong>{e.name || '(sin nombre)'}</strong>: {e.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <footer className="flex items-center gap-3 border-t border-border px-5 py-3.5">
          {submitting && (
            <span className="text-sm text-text-muted">
              Creando {progress.done}/{progress.total}…
            </span>
          )}
          {done && !submitting && (
            <span className="text-sm font-semibold text-success">
              ✓ {done.created} creado{done.created === 1 ? '' : 's'}
              {done.failed > 0
                ? ` · ${done.failed} con error`
                : ''}
              . Cierra con la ✕.
            </span>
          )}
          <div className="flex-1" />
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting || done !== null || namedRowCount === 0}
            trailingIcon="check"
          >
            {done
              ? 'Listo'
              : `Crear ${namedRowCount} producto${namedRowCount === 1 ? '' : 's'}`}
          </Button>
        </footer>
      </div>
    </div>
  );
}
