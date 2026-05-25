"use client";
import { useState } from "react";
import { Button, Input, Textarea, Select } from "@/components";
import { AdminPageHeader } from "./AdminPageHeader";
import { FormSection } from "./FormSection";

/**
 * ConfigForm — configuración global del sitio.
 * Secciones: branding · envío · contacto · redes sociales.
 */
export function ConfigForm() {
  const [form, setForm] = useState({
    name: "página/",
    description: "Marketplace que se adapta a cualquier producto.",
    brandColor: "#00C853",
    shippingFree: 999, shippingCost: 99, carrier: "Estafeta",
    email: "contacto@pagina.com", phone: "+52 55 0000 0000", whatsapp: "+52 55 0000 0000",
    instagram: "https://instagram.com/pagina", facebook: "",
    twitter:   "https://x.com/pagina",          tiktok:   "",
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm((s) => ({ ...s, [k]: v }));
  const submit = () => { setSaving(true); setTimeout(() => setSaving(false), 500); };

  return (
    <>
      <AdminPageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Configuración" }]}
        title="Configuración global"
        description="Branding, envíos, contacto y redes sociales del sitio."
        action={<Button onClick={submit} loading={saving} trailingIcon="check">Guardar cambios</Button>}
      />
      <div className="p-6">
        <div className="max-w-4xl bg-surface border border-border rounded-lg px-6 pt-2 pb-6">
          <FormSection title="Branding" description="Identidad básica del sitio.">
            <Input label="Nombre de la tienda" required
                   value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Textarea label="Descripción" rows={2}
                      value={form.description} onChange={(e) => set("description", e.target.value)}
                      hint="Aparece en metadata SEO y en el footer." />
            <div>
              <div className="font-display font-semibold text-[13px] mb-1.5">Color de marca</div>
              <div className="flex items-center gap-2.5">
                <input type="color" value={form.brandColor} onChange={(e) => set("brandColor", e.target.value)}
                       className="size-12 p-0.5 border-[1.5px] border-border-strong rounded-sm bg-surface cursor-pointer" />
                <code className="font-mono text-sm">{form.brandColor}</code>
              </div>
            </div>
          </FormSection>

          <FormSection title="Envío" description="Costo, umbral de envío gratis y paquetería predeterminada.">
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input label="Umbral de envío gratis" type="number" inputMode="decimal" leadingIcon="bolt"
                     value={String(form.shippingFree)} onChange={(e) => set("shippingFree", Number(e.target.value))}
                     hint="Pedidos por encima de este monto no cobran envío." />
              <Input label="Costo de envío estándar" type="number" inputMode="decimal"
                     value={String(form.shippingCost)} onChange={(e) => set("shippingCost", Number(e.target.value))} />
              <Select label="Paquetería predeterminada"
                      options={["Estafeta", "FedEx", "DHL", "UPS"]}
                      value={form.carrier} onChange={(e) => set("carrier", e.target.value)} />
            </div>
          </FormSection>

          <FormSection title="Contacto" description="Información de contacto pública.">
            <Input label="Correo de contacto" type="email" leadingIcon="user"
                   value={form.email} onChange={(e) => set("email", e.target.value)} />
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              <Input label="Teléfono" type="tel"
                     value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              <Input label="WhatsApp" type="tel"
                     value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
          </FormSection>

          <FormSection title="Redes sociales" description="Aparecen en el footer del sitio.">
            <Input label="Instagram" placeholder="https://instagram.com/…"
                   value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
            <Input label="Facebook"  placeholder="https://facebook.com/…"
                   value={form.facebook}  onChange={(e) => set("facebook", e.target.value)} />
            <Input label="Twitter / X" placeholder="https://x.com/…"
                   value={form.twitter}   onChange={(e) => set("twitter", e.target.value)} />
            <Input label="TikTok"    placeholder="https://tiktok.com/@…"
                   value={form.tiktok}    onChange={(e) => set("tiktok", e.target.value)} />
          </FormSection>
        </div>
      </div>
    </>
  );
}
