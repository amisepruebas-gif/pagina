"use client";
import { useState } from "react";
import { Button, Icon, Input, Select } from "@/components";
import { PROFILE } from "@/lib/sample-account";
import { SectionHeader } from "./SectionHeader";

/**
 * ProfileTab — datos de la cuenta + bloque de seguridad + cerrar sesión.
 */
export function ProfileTab() {
  const [form, setForm] = useState({ ...PROFILE });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 700);
  };

  return (
    <div>
      <SectionHeader title="Tu perfil" subtitle="Mantén tus datos actualizados para recibir mejor servicio." />

      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="size-[72px] rounded-full shrink-0 inline-flex items-center justify-center
                           text-white font-display font-bold text-[28px] shadow-brand bg-brand-grad">
            {PROFILE.initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-xl tracking-[-0.015em]">{form.name}</div>
            <div className="mt-1 text-[13px] text-text-soft">Cuenta creada el 4 de febrero de 2026</div>
          </div>
          <Button variant="secondary" size="sm">Cambiar avatar</Button>
        </div>

        <form onSubmit={save} className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            label="Nombre completo" autoComplete="name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Correo electrónico" type="email" inputMode="email" autoComplete="email" required
            leadingIcon="user"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            hint="Lo usaremos para confirmaciones y soporte."
          />
          <Input
            label="Teléfono" type="tel" inputMode="tel" autoComplete="tel"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            hint="Solo para coordinaciones de envío."
          />
          <Select
            label="Idioma preferido"
            options={[
              { value: "es", label: "Español" },
              { value: "en", label: "English" },
              { value: "pt", label: "Português" },
            ]}
            defaultValue="es"
          />

          <div className="col-span-1 sm:col-span-2 flex justify-between items-center pt-2 gap-3 flex-wrap">
            <span className="text-xs text-text-soft">
              Cambios se sincronizan con todos tus dispositivos.
            </span>
            <div className="flex gap-2.5 items-center">
              {saved && (
                <span className="inline-flex items-center gap-1.5 text-success text-[13px] font-semibold">
                  <Icon name="check" size={14} strokeWidth={2.4} /> Guardado
                </span>
              )}
              <Button type="submit" loading={saving}>Guardar cambios</Button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-5 p-5 bg-surface border border-border rounded-xl flex items-center gap-4 flex-wrap">
        <span className="size-11 rounded-full shrink-0 bg-brand-50 text-brand-700 inline-flex items-center justify-center">
          <Icon name="shield" size={20} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-[200px]">
          <div className="font-display font-semibold text-[15px]">Seguridad</div>
          <div className="mt-0.5 text-[13px] text-text-muted">
            Cambia tu contraseña, gestiona dispositivos conectados o activa 2FA.
          </div>
        </div>
        <Button variant="secondary">Gestionar</Button>
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="ghost" leadingIcon="x">Cerrar sesión</Button>
      </div>
    </div>
  );
}
