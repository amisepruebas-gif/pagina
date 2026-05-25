"use client";
import { useState } from "react";
import { Button, Icon, IconButton, Input, Select, Textarea } from "@/components";
import { ACCOUNT_ORDERS } from "@/lib/sample-account";

const TYPES = ["", "Producto dañado", "Producto incorrecto", "Devolución", "Problema de envío", "Otro"];

export interface ComplaintFormProps {
  onCancel: () => void;
  onSubmit?: (data: { type: string; order: string; title: string; body: string }) => void;
}

/**
 * ComplaintForm — formulario para abrir un ticket de soporte.
 * Tras enviar muestra estado de éxito con CTA "Volver al listado".
 */
export function ComplaintForm({ onCancel, onSubmit }: ComplaintFormProps) {
  const [form, setForm] = useState({ type: "", order: "", title: "", body: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center bg-brand-50 border border-brand-200 rounded-xl
                      flex flex-col items-center gap-2">
        <span className="size-14 rounded-full mb-1.5 text-white inline-flex items-center justify-center
                         shadow-brand bg-brand-grad">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <div className="font-display font-bold text-lg text-brand-700">Hemos recibido tu reporte</div>
        <div className="text-[13px] text-text-muted max-w-sm">
          Te responderemos por correo en menos de 24 horas.
        </div>
        <Button variant="secondary" onClick={onCancel} className="mt-2">Volver al listado</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}
          className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3.5">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-lg">Nueva queja</h3>
        <IconButton variant="ghost" icon="x" label="Cancelar" onClick={onCancel} />
      </div>

      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
        <Select
          label="Tipo de queja" required
          options={TYPES.map((o) => ({ value: o, label: o || "Selecciona" }))}
          value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <Select
          label="Pedido relacionado"
          options={[
            { value: "", label: "Ninguno" },
            ...ACCOUNT_ORDERS.map((o) => ({ value: o.id, label: `${o.id} · ${o.date}` })),
          ]}
          value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}
        />
      </div>

      <Input
        label="Asunto" placeholder="Resume tu queja en una línea" required
        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Textarea
        label="Descripción" rows={5} required
        placeholder="Cuéntanos qué pasó con tanto detalle como puedas."
        value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
      />

      <div className="p-3.5 rounded-md bg-surface-2 border border-dashed border-border-strong
                      flex items-center gap-3">
        <Icon name="plus" size={18} strokeWidth={2} className="text-text-soft" />
        <span className="flex-1 text-[13px] text-text-muted">Agregar fotos o evidencia (opcional)</span>
        <Button size="sm" variant="secondary">Seleccionar</Button>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" trailingIcon="arr-right">Enviar queja</Button>
      </div>
    </form>
  );
}
