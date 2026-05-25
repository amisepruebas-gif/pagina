"use client";
import { useState } from "react";
import { Input, Select } from "@/components";
import { ADMIN_CATEGORIES, type AdminDiscount, type DiscountType } from "@/lib/admin-catalog";
import { FormShell } from "./FormShell";
import { FormSection, FlagRow } from "./FormSection";

export interface DiscountFormProps {
  discount?: AdminDiscount;
  onCancel: () => void;
  onSave: (data: Partial<AdminDiscount>) => Promise<void> | void;
}

/** DiscountForm — crear/editar descuento global, por categoría o por producto. */
export function DiscountForm({ discount, onCancel, onSave }: DiscountFormProps) {
  const isNew = !discount;
  const [form, setForm] = useState({
    name:   discount?.name ?? "",
    type:   (discount?.type ?? "global") as DiscountType,
    pct:    discount?.pct ?? 10,
    code:   discount?.code ?? "",
    from:   discount?.from ?? "",
    to:     discount?.to ?? "",
    target: discount?.target ?? "",
    active: discount?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((s) => ({ ...s, [k]: v }));
  const submit = async () => { setSaving(true); try { await onSave(form as Partial<AdminDiscount>); } finally { setSaving(false); } };

  return (
    <FormShell
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Descuentos", href: "/admin/descuentos" },
        { label: isNew ? "Nuevo" : discount?.name ?? "Editar" },
      ]}
      title={isNew ? "Nuevo descuento" : `Editar — ${discount?.name}`}
      description="Aplica el descuento a todo el catálogo, una categoría específica o un producto puntual."
      onCancel={onCancel} onSave={submit} saving={saving}
    >
      <FormSection title="Información">
        <Input label="Nombre interno" required
               value={form.name} onChange={(e) => set("name", e.target.value)}
               hint="Solo visible en el admin." />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Select label="Aplica a" required
                  options={[
                    { value: "global",    label: "Todo el catálogo (global)" },
                    { value: "categoría", label: "Una categoría" },
                    { value: "producto",  label: "Un producto específico" },
                  ]}
                  value={form.type} onChange={(e) => set("type", e.target.value as DiscountType)} />
          <Input label="Porcentaje" type="number" inputMode="decimal" required
                 value={String(form.pct)} onChange={(e) => set("pct", Number(e.target.value))}
                 hint="Ej: 15 para 15%." />
        </div>
        {form.type === "categoría" && (
          <Select label="Categoría"
                  options={[{ value: "", label: "Selecciona…" }, ...ADMIN_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))]}
                  value={form.target} onChange={(e) => set("target", e.target.value)} />
        )}
        {form.type === "producto" && (
          <Input label="SKU del producto" placeholder="AT-7001" leadingIcon="tag"
                 value={form.target} onChange={(e) => set("target", e.target.value)} />
        )}
      </FormSection>

      <FormSection title="Vigencia" description="Rango en que el descuento está disponible.">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input label="Desde" type="date" value={form.from} onChange={(e) => set("from", e.target.value)} />
          <Input label="Hasta" type="date" value={form.to}   onChange={(e) => set("to", e.target.value)} />
        </div>
      </FormSection>

      <FormSection title="Código de cupón" description="Opcional. Si lo dejas vacío, el descuento se aplica automáticamente.">
        <Input label="Código" leadingIcon="tag"
               value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())}
               placeholder="WELCOME10"
               hint="Mayúsculas. Sin espacios. Se mostrará al cliente al aplicarlo." />
      </FormSection>

      <FormSection title="Estado">
        <FlagRow checked={form.active} onChange={(v) => set("active", v)}
                 title="Activo"
                 subtitle="Si está pausado, no se aplica aunque esté dentro de la vigencia." />
      </FormSection>
    </FormShell>
  );
}
