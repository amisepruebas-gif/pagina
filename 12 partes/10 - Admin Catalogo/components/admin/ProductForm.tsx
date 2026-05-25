"use client";
import { useState } from "react";
import { Icon, Input, Select, Textarea } from "@/components";
import {
  ADMIN_CATEGORIES, ADMIN_TAGS, ADMIN_MATERIALS, SUBCATEGORIES_MAP,
  type AdminProduct,
} from "@/lib/admin-catalog";
import { FormShell } from "./FormShell";
import { FormSection, FlagRow } from "./FormSection";
import { ImageUploadField, type UploadedImage } from "./ImageUploadField";

export interface ProductFormProps {
  product?: AdminProduct;
  onCancel: () => void;
  onSave: (data: Partial<AdminProduct>) => Promise<void> | void;
}

type ProductFormState = {
  name: string; slug: string; sku: string;
  price: string; oldPrice: string; stock: string;
  category: string; subcategory: string; material: string;
  tags: string[]; image: UploadedImage | null;
  shortDescription: string; longDescription: string;
  active: boolean; featured: boolean; isNew: boolean;
};

/**
 * ProductForm — formulario de creación/edición de producto.
 *
 * Secciones: información básica · precio y stock · clasificación
 * · imagen · descripción · visibilidad.
 */
export function ProductForm({ product, onCancel, onSave }: ProductFormProps) {
  const isNew = !product;
  const [form, setForm] = useState<ProductFormState>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    price: String(product?.price ?? ""),
    oldPrice: product?.oldPrice ? String(product.oldPrice) : "",
    stock: String(product?.stock ?? ""),
    category: product?.category?.toLowerCase() ?? "",
    subcategory: product?.subcategory ?? "",
    material: product?.material ?? "",
    tags: product?.tags ?? [],
    image: product?.image ?? null,
    shortDescription: product?.shortDescription ?? "",
    longDescription: product?.longDescription ?? "",
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    isNew: product?.isNew ?? false,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProductFormState>(k: K, v: ProductFormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try { await onSave(form as Partial<AdminProduct>); } finally { setSaving(false); }
  };

  const subs = SUBCATEGORIES_MAP[form.category] ?? [];

  return (
    <FormShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Productos", href: "/admin/productos" },
        { label: isNew ? "Nuevo" : product?.name ?? "Editar" },
      ]}
      title={isNew ? "Nuevo producto" : `Editar — ${product?.name}`}
      description={isNew ? "Crea un producto nuevo en el catálogo." : "Modifica los datos del producto."}
      onCancel={onCancel} onSave={submit} saving={saving}
    >
      <FormSection title="Información básica" description="Datos visibles públicamente.">
        <Input label="Nombre del producto" required
               value={form.name} onChange={(e) => set("name", e.target.value)} />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input label="Slug" placeholder="producto-destacado" leadingIcon="tag"
                 value={form.slug} onChange={(e) => set("slug", e.target.value)}
                 hint="Aparece en la URL del producto." />
          <Input label="SKU" required placeholder="AT-7001"
                 value={form.sku} onChange={(e) => set("sku", e.target.value)} />
        </div>
      </FormSection>

      <FormSection title="Precio y stock" description="Configura precios y disponibilidad.">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Input label="Precio" required type="number" inputMode="decimal" leadingIcon="bolt"
                 value={form.price} onChange={(e) => set("price", e.target.value)} />
          <Input label="Precio anterior" type="number" inputMode="decimal"
                 value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)}
                 hint="Aparece tachado." />
          <Input label="Stock disponible" required type="number" inputMode="numeric"
                 value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </div>
      </FormSection>

      <FormSection title="Clasificación" description="Para que el producto sea fácil de encontrar.">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select label="Categoría" required
                  options={[{ value: "", label: "Selecciona…" },
                    ...ADMIN_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))]}
                  value={form.category} onChange={(e) => set("category", e.target.value)} />
          <Select label="Subcategoría"
                  options={[{ value: "", label: subs.length ? "Selecciona…" : "Elige una categoría primero" },
                    ...subs.map((s) => ({ value: s, label: s }))]}
                  value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)}
                  disabled={!form.category} />
          <Select label="Material"
                  options={[{ value: "", label: "Selecciona…" },
                    ...ADMIN_MATERIALS.map((m) => ({ value: m.id, label: m.name }))]}
                  value={form.material} onChange={(e) => set("material", e.target.value)} />
          <TagsPicker value={form.tags} onChange={(v) => set("tags", v)} />
        </div>
      </FormSection>

      <FormSection title="Imagen principal" description="Aparece en la lista y en la ficha del producto.">
        <ImageUploadField value={form.image} onChange={(v) => set("image", v)}
                          aspect="1/1" hint="PNG, JPG o WebP. Recomendado 1200×1200." />
      </FormSection>

      <FormSection title="Descripción">
        <Input label="Descripción corta" placeholder="Frase para listados y previews"
               value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)}
               hint="Máximo ~120 caracteres." />
        <Textarea label="Descripción larga" rows={5}
                  placeholder="Detalle del producto, materiales, cuidados…"
                  value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
      </FormSection>

      <FormSection title="Visibilidad" description="Flags y disponibilidad pública.">
        <FlagRow checked={form.active}   onChange={(v) => set("active", v)}
                 title="Activo" subtitle="El producto aparece en la tienda. Desactivar lo oculta sin borrarlo." />
        <FlagRow checked={form.featured} onChange={(v) => set("featured", v)}
                 title="Destacado" subtitle="Aparece en secciones de destacados de la home." />
        <FlagRow checked={form.isNew}    onChange={(v) => set("isNew", v)}
                 title="Marcado como nuevo" subtitle='Muestra el badge "Nuevo" durante 30 días.' />
      </FormSection>
    </FormShell>
  );
}

function TagsPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <div>
      <div className="font-display font-semibold text-[13px] mb-1.5">Etiquetas</div>
      <div className="min-h-12 px-2.5 py-2 bg-surface border-[1.5px] border-border-strong rounded-md
                      flex flex-wrap gap-1.5 items-center">
        {value.map((id) => {
          const t = ADMIN_TAGS.find((x) => x.id === id);
          if (!t) return null;
          return (
            <span key={id} style={{ background: t.color }}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-white
                             text-xs font-semibold font-display">
              {t.name}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== id))}
                      aria-label={`Quitar ${t.name}`}
                      className="size-[18px] p-0 border-0 rounded-full bg-black/20 text-white cursor-pointer
                                 inline-flex items-center justify-center">
                <Icon name="x" size={10} strokeWidth={2.4} />
              </button>
            </span>
          );
        })}
        <select
          value=""
          onChange={(e) => { if (e.target.value && !value.includes(e.target.value)) onChange([...value, e.target.value]); }}
          className="flex-1 min-w-[100px] h-[30px] border-0 outline-none bg-transparent text-text-soft text-[13px]"
        >
          <option value="">+ agregar etiqueta</option>
          {ADMIN_TAGS.filter((t) => !value.includes(t.id)).map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
