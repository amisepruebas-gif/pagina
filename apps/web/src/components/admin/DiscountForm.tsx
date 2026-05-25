'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createDiscount,
  updateDiscount,
  type DiscountFormValues
} from '@/lib/admin/discounts-admin';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import type { DiscountType } from '@/types/discount';
import { Input, Select, Textarea, Badge, Icon } from '@/components/ui';
import { FormShell } from './FormShell';
import { FormSection, FlagRow } from './FormSection';

interface DiscountFormProps {
  initial?: Partial<DiscountFormValues> & { id?: string };
  categories: Category[];
  products: Product[];
}

const empty: DiscountFormValues = {
  name: '',
  description: '',
  code: '',
  type: 'global',
  categoryId: '',
  productId: '',
  percentage: 10,
  season: '',
  validFrom: '',
  validUntil: '',
  active: true
};

const TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: 'global', label: 'Global' },
  { value: 'category', label: 'Categoría' },
  { value: 'product', label: 'Producto' }
];

const TYPE_HINT: Record<DiscountType, string> = {
  global: 'Se aplica a todos los productos.',
  category: 'Se aplica solo a productos de una categoría.',
  product: 'Se aplica solo a un producto específico.'
};

export default function DiscountForm({
  initial,
  categories,
  products
}: DiscountFormProps) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [values, setValues] = useState<DiscountFormValues>({
    ...empty,
    ...initial
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof DiscountFormValues>(
    k: K,
    v: DiscountFormValues[K]
  ) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handleSave() {
    setError(null);
    setSuccess(false);

    if (!values.name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (values.type === 'category' && !values.categoryId) {
      setError('Elige una categoría para este descuento.');
      return;
    }
    if (values.type === 'product' && !values.productId) {
      setError('Elige un producto para este descuento.');
      return;
    }
    if (values.percentage < 0 || values.percentage > 100) {
      setError('El porcentaje debe estar entre 0 y 100.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && initial?.id) {
        await updateDiscount(initial.id, values);
        setSuccess(true);
        router.refresh();
      } else {
        const newId = await createDiscount(values);
        router.push(`/admin/descuentos/${newId}`);
        router.refresh();
      }
    } catch (err) {
      console.error('[ADMIN] error guardando descuento:', err);
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
        { label: 'Descuentos', href: '/admin/descuentos' },
        { label: isEdit ? (initial?.name ?? 'Editar') : 'Nuevo' }
      ]}
      title={isEdit ? `Editar — ${initial?.name ?? 'descuento'}` : 'Nuevo descuento'}
      description="Aplica el descuento a todo el catálogo, una categoría específica o un producto puntual."
      onCancel={() => router.push('/admin/descuentos')}
      onSave={() => {
        void handleSave();
      }}
      saving={submitting}
    >
      <FormSection
        title="Información"
        description="Datos visibles del descuento. El código y la temporada son opcionales."
      >
        <Input
          label="Nombre"
          required
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Descuento navideño"
        />
        <Textarea
          label="Descripción"
          rows={2}
          value={values.description ?? ''}
          onChange={(e) => setField('description', e.target.value)}
        />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Código de canje"
            leadingIcon="tag"
            value={values.code ?? ''}
            onChange={(e) => setField('code', e.target.value.toUpperCase())}
            placeholder="NAVIDAD20"
            className="font-mono uppercase"
            hint="Opcional. Si lo pones, se aplica solo cuando el cliente ingresa este código. Se guarda en mayúsculas."
          />
          <Input
            label="Temporada"
            value={values.season ?? ''}
            onChange={(e) => setField('season', e.target.value)}
            placeholder="navidad-2026"
            hint="Etiqueta libre para agrupar."
          />
        </div>
      </FormSection>

      <FormSection
        title="Aplicabilidad"
        description="Define a qué productos alcanza el descuento y con qué porcentaje."
      >
        <Select
          label="Tipo"
          required
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={(e) => setField('type', e.target.value as DiscountType)}
          hint={TYPE_HINT[values.type]}
        />

        {values.type === 'category' && (
          <>
            <Select
              label="Categoría"
              required
              placeholder="— elige una —"
              options={[
                { value: '', label: '— elige una —' },
                ...categories.map((c) => ({ value: c.id, label: c.name }))
              ]}
              value={values.categoryId ?? ''}
              onChange={(e) => setField('categoryId', e.target.value)}
            />
            {categories.length === 0 && (
              <p className="text-xs text-warning -mt-2">
                No hay categorías. Crea una en /admin/categorias primero.
              </p>
            )}
          </>
        )}

        {values.type === 'product' && (
          <>
            <Select
              label="Producto"
              required
              placeholder="— elige uno —"
              options={[
                { value: '', label: '— elige uno —' },
                ...products.map((p) => ({
                  value: p.id,
                  label: p.sku ? `${p.name} · ${p.sku}` : p.name
                }))
              ]}
              value={values.productId ?? ''}
              onChange={(e) => setField('productId', e.target.value)}
            />
            {products.length === 0 && (
              <p className="text-xs text-warning -mt-2">
                No hay productos. Crea uno en /admin/productos primero.
              </p>
            )}
          </>
        )}

        <div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values.percentage}
              onChange={(e) => setField('percentage', Number(e.target.value))}
              className="flex-1 accent-brand-500"
              aria-label="Porcentaje de descuento"
            />
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={0.5}
              value={String(values.percentage)}
              onChange={(e) =>
                setField('percentage', Number(e.target.value) || 0)
              }
              className="text-center"
            />
            <Badge tone="gradient" size="md">
              −{values.percentage}%
            </Badge>
          </div>
          <p className="mt-1.5 text-[13px] text-text-soft">
            Porcentaje de 0 a 100.
          </p>
        </div>
      </FormSection>

      <FormSection
        title="Vigencia"
        description="Rango en que el descuento está disponible. Deja vacío para no limitar."
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
            hint="Vacío = sin fecha de expiración."
          />
        </div>
      </FormSection>

      <FormSection title="Estado">
        <FlagRow
          checked={values.active}
          onChange={(v) => setField('active', v)}
          title="Activo"
          subtitle="Visible en la tienda dentro de su vigencia. Si está pausado, no se aplica."
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
