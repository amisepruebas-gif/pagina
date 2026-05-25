"use client";
import { useState } from "react";
import { Button, IconButton, Input, Select } from "@/components";
import type { Address } from "@/lib/sample-account";
import { PROFILE } from "@/lib/sample-account";

export interface AddressFormProps {
  /** Si se pasa, el form abre en modo "editar"; si no, en modo "nueva". */
  initial?: Partial<Address>;
  onCancel: () => void;
  onSave: (address: Address) => void;
}

const COUNTRIES = ["México", "Argentina", "Colombia", "España", "Chile"];

/**
 * AddressForm — formulario inline para agregar o editar una dirección.
 */
export function AddressForm({ initial, onCancel, onSave }: AddressFormProps) {
  const [form, setForm] = useState({
    label:   initial?.label   ?? "",
    name:    initial?.name    ?? PROFILE.name,
    street:  initial?.street  ?? "",
    city:    initial?.city    ?? "",
    state:   initial?.state   ?? "",
    zip:     initial?.zip     ?? "",
    country: initial?.country ?? "México",
    phone:   initial?.phone   ?? PROFILE.phone,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initial?.id ?? `a-${Date.now()}`,
      default: initial?.default ?? false,
      ...form,
    });
  };

  return (
    <form onSubmit={submit}
          className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3.5">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-lg">
          {initial?.id ? "Editar dirección" : "Agregar dirección"}
        </h3>
        <IconButton variant="ghost" icon="x" label="Cancelar" onClick={onCancel} />
      </div>

      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
        <Input label="Etiqueta" placeholder="Casa, oficina…" required
               value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Input label="Nombre del receptor" required
               value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="col-span-1 sm:col-span-2">
          <Input label="Calle y número, interior" required
                 value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
        </div>
        <Input label="Ciudad / colonia" required
               value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="Estado" required
               value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Input label="Código postal" required inputMode="numeric"
               value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        <Select label="País" options={COUNTRIES}
                value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <div className="col-span-1 sm:col-span-2">
          <Input label="Teléfono de contacto" type="tel"
                 value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" trailingIcon="check">Guardar dirección</Button>
      </div>
    </form>
  );
}
