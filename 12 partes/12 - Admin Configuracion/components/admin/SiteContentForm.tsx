"use client";
import { useState } from "react";
import { Button, Input, Select } from "@/components";
import {
  SITE_CONTENT_TYPE, type SiteContentBlock, type SiteContentType,
} from "@/lib/admin-rest";
import { AdminPageHeader } from "./AdminPageHeader";
import { FormSection, FlagRow } from "./FormSection";
import { GradientPicker } from "./GradientPicker";

export interface SiteContentFormProps {
  block?: SiteContentBlock;
  onCancel: () => void;
  onSave: (data: Partial<SiteContentBlock>) => Promise<void> | void;
}

/**
 * SiteContentForm — crear/editar bloque de contenido (hero / promo / topbar).
 * Los campos cambian según el tipo seleccionado.
 */
export function SiteContentForm({ block, onCancel, onSave }: SiteContentFormProps) {
  const isNew = !block;
  const [type, setType] = useState<SiteContentType>(block?.type ?? "hero");
  const [form, setForm] = useState({
    name:    block?.name    ?? "",
    page:    block?.page    ?? "Home",
    order:   block?.order   ?? 1,
    fromAt:  block?.fromAt  ?? "",
    toAt:    block?.toAt    ?? "",
    active:  block?.active  ?? true,
    title:    block?.data?.title    ?? "",
    subtitle: block?.data?.subtitle ?? "",
    cta:      block?.data?.cta      ?? "",
    gradient: block?.data?.gradient ?? "g1",
    bg:       block?.data?.bg       ?? "g2",
    badge:    block?.data?.badge    ?? "",
    message:  block?.data?.message  ?? "",
    linkText: block?.data?.linkText ?? "",
    linkHref: block?.data?.linkHref ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((s) => ({ ...s, [k]: v }));
  const submit = async () => {
    setSaving(true);
    try { await onSave({ ...(block ?? {}), type, name: form.name, page: form.page, order: form.order, active: form.active, fromAt: form.fromAt, toAt: form.toAt, data: form }); }
    finally { setSaving(false); }
  };

  return (
    <>
      <AdminPageHeader
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Contenido", href: "/admin/contenido" },
          { label: isNew ? "Nuevo" : block?.name ?? "Editar" },
        ]}
        title={isNew ? "Nuevo bloque de contenido" : `Editar — ${block?.name}`}
        description="Los campos cambian según el tipo seleccionado."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button onClick={submit} loading={saving} trailingIcon="check">Guardar</Button>
          </div>
        }
      />
      <div className="p-6">
        <div className="max-w-4xl bg-surface border border-border rounded-lg px-6 pt-2 pb-6">
          <FormSection title="General" description="Tipo del bloque y dónde aparece.">
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Select label="Tipo" required
                      options={(Object.entries(SITE_CONTENT_TYPE) as [SiteContentType, { label: string; tone: any }][]).map(
                        ([k, v]) => ({ value: k, label: v.label }))}
                      value={type} onChange={(e) => setType(e.target.value as SiteContentType)} />
              <Input label="Nombre interno" required
                     value={form.name} onChange={(e) => set("name", e.target.value)}
                     hint="Solo visible en el admin." />
              <Select label="Página"
                      options={["Home", "Categoría", "PDP", "Global"]}
                      value={form.page} onChange={(e) => set("page", e.target.value)} />
              <Input label="Orden" type="number" inputMode="numeric"
                     value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
          </FormSection>

          {type === "hero" && (
            <FormSection title="Hero" description="Bloque grande en una página.">
              <Input label="Título principal" required
                     value={form.title} onChange={(e) => set("title", e.target.value)} />
              <Input label="Subtítulo"
                     value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              <Input label="Texto del CTA" placeholder="Explorar"
                     value={form.cta} onChange={(e) => set("cta", e.target.value)} />
              <GradientPicker value={form.gradient} onChange={(v) => set("gradient", v)} />
            </FormSection>
          )}

          {type === "promo" && (
            <FormSection title="Banner promocional" description="Bloque ancho de promoción.">
              <Input label="Título" required value={form.title} onChange={(e) => set("title", e.target.value)} />
              <Input label="Subtítulo" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              <Input label="Texto del CTA" value={form.cta} onChange={(e) => set("cta", e.target.value)} />
              <Input label="Badge (opcional)" placeholder="OFERTA, HOT, etc."
                     value={form.badge} onChange={(e) => set("badge", e.target.value)} />
              <GradientPicker value={form.bg} onChange={(v) => set("bg", v)} />
            </FormSection>
          )}

          {type === "topbar" && (
            <FormSection title="Topbar" description="Banda fina arriba del sitio (global).">
              <Input label="Mensaje" required
                     value={form.message} onChange={(e) => set("message", e.target.value)}
                     hint="Aparece centrado en la banda superior." />
              <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                <Input label="Texto del enlace (opcional)"
                       value={form.linkText} onChange={(e) => set("linkText", e.target.value)} />
                <Input label="URL del enlace" placeholder="/envios"
                       value={form.linkHref} onChange={(e) => set("linkHref", e.target.value)} />
              </div>
            </FormSection>
          )}

          <FormSection title="Vigencia">
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input label="Desde" type="date" value={form.fromAt} onChange={(e) => set("fromAt", e.target.value)} />
              <Input label="Hasta" type="date" value={form.toAt ?? ""} onChange={(e) => set("toAt", e.target.value)}
                     hint="Deja vacío para sin fin." />
            </div>
          </FormSection>

          <FormSection title="Estado">
            <FlagRow checked={form.active} onChange={(v) => set("active", v)}
                     title="Activo" subtitle="Si está pausado, no aparece en el sitio." />
          </FormSection>
        </div>
      </div>
    </>
  );
}
