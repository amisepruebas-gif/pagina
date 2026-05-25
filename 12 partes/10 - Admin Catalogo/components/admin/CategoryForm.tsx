"use client";
import { useState } from "react";
import { Icon, Input, Textarea } from "@/components";
import { GRADIENT_PRESETS, type AdminCategory } from "@/lib/admin-catalog";
import { cn } from "@/lib/cn";
import { FormShell } from "./FormShell";
import { FormSection, FlagRow } from "./FormSection";
import { ImageUploadField, type UploadedImage } from "./ImageUploadField";

export interface CategoryFormProps {
  category?: AdminCategory;
  onCancel: () => void;
  onSave: (data: Partial<AdminCategory>) => Promise<void> | void;
}

/**
 * CategoryForm — crear/editar categoría con imagen opcional + gradiente.
 *
 * Si no hay imagen, la categoría usa el gradiente seleccionado como fallback.
 */
export function CategoryForm({ category, onCancel, onSave }: CategoryFormProps) {
  const isNew = !category;
  const [form, setForm] = useState({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    order: category?.order ?? 1,
    image: (category?.image as UploadedImage | null) ?? null,
    gradient: category?.gradient ?? GRADIENT_PRESETS[0].id,
    active: category?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try { await onSave(form as Partial<AdminCategory>); } finally { setSaving(false); }
  };

  return (
    <FormShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Categorías", href: "/admin/categorias" },
        { label: isNew ? "Nueva" : category?.name ?? "Editar" },
      ]}
      title={isNew ? "Nueva categoría" : `Editar — ${category?.name}`}
      description="Las categorías agrupan productos y aparecen en la navegación."
      onCancel={onCancel} onSave={submit} saving={saving}
    >
      <FormSection title="Información">
        <Input label="Nombre" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Input label="Slug" leadingIcon="tag" placeholder="ropa" required
               value={form.slug} onChange={(e) => set("slug", e.target.value)}
               hint="Identificador en la URL. Solo minúsculas y guiones." />
        <Textarea label="Descripción" rows={3}
                  value={form.description} onChange={(e) => set("description", e.target.value)} />
        <Input label="Orden" type="number" inputMode="numeric"
               value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))}
               hint="Posición en el menú. Menor número aparece primero." />
      </FormSection>

      <FormSection title="Imagen" description="Opcional. Se usa en el grid de categorías.">
        <ImageUploadField value={form.image} onChange={(v) => set("image", v)}
                          aspect="3/4" hint="Recomendado 600×800. PNG, JPG o WebP." />
      </FormSection>

      <FormSection title="Gradiente de fondo" description="Si no subes imagen, se usa este gradiente.">
        <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          {GRADIENT_PRESETS.map((g) => {
            const active = form.gradient === g.id;
            return (
              <button key={g.id} type="button" onClick={() => set("gradient", g.id)} aria-pressed={active}
                className={cn(
                  "p-0 cursor-pointer rounded-md overflow-hidden bg-transparent flex flex-col",
                  active ? "border-2 border-brand-500" : "border-[1.5px] border-border-strong",
                )}>
                <div className="h-16" style={{ background: g.bg }} />
                <div className="px-2.5 py-2 font-display font-semibold text-xs bg-surface text-text
                                inline-flex items-center gap-1.5">
                  {active && <Icon name="check" size={12} strokeWidth={3} className="text-brand-700" />}
                  {g.label}
                </div>
              </button>
            );
          })}
        </div>
      </FormSection>

      <FormSection title="Visibilidad">
        <FlagRow checked={form.active} onChange={(v) => set("active", v)}
                 title="Activa"
                 subtitle="Si está desactivada, no aparece en la tienda pero conserva sus productos." />
      </FormSection>
    </FormShell>
  );
}
