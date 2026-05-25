'use client';

import { useState } from 'react';
import {
  createAddress,
  updateAddress,
  type AddressInput
} from '@/lib/addresses';
import type { Address } from '@/types/address';
import { Button } from '@/components/ui';

interface AddressFormProps {
  uid: string;
  initial?: Address | null;
  onDone: () => void;
  onCancel: () => void;
}

const empty: AddressInput = {
  alias: '',
  fullName: '',
  phone: '',
  street: '',
  reference: '',
  city: '',
  state: '',
  zip: '',
  country: 'México',
  isDefault: false
};

const inputCls =
  'w-full rounded-md border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 transition';

export default function AddressForm({
  uid,
  initial,
  onDone,
  onCancel
}: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>(
    initial
      ? {
          alias: initial.alias,
          fullName: initial.fullName,
          phone: initial.phone ?? '',
          street: initial.street,
          reference: initial.reference ?? '',
          city: initial.city,
          state: initial.state,
          zip: initial.zip,
          country: initial.country,
          isDefault: initial.isDefault
        }
      : empty
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof AddressInput>(k: K, v: AddressInput[K]) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (initial) {
        await updateAddress(uid, initial.id, values);
      } else {
        await createAddress(uid, values);
      }
      onDone();
    } catch (err) {
      console.error('[ADDR] form error:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar dirección');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-4 md:p-6 space-y-4"
    >
      <h3 className="font-display text-lg font-bold">
        {initial ? 'Editar dirección' : 'Nueva dirección'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Alias *" hint="Casa, oficina, etc.">
          <input
            type="text"
            required
            value={values.alias}
            onChange={(e) => setField('alias', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Destinatario *">
          <input
            type="text"
            required
            value={values.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Teléfono">
          <input
            type="tel"
            value={values.phone ?? ''}
            onChange={(e) => setField('phone', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Código postal *">
          <input
            type="text"
            required
            value={values.zip}
            onChange={(e) => setField('zip', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Calle y número *">
        <input
          type="text"
          required
          value={values.street}
          onChange={(e) => setField('street', e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Referencia" hint="Entre calles, color de fachada, etc.">
        <input
          type="text"
          value={values.reference ?? ''}
          onChange={(e) => setField('reference', e.target.value)}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Ciudad *">
          <input
            type="text"
            required
            value={values.city}
            onChange={(e) => setField('city', e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Estado *">
          <input
            type="text"
            required
            value={values.state}
            onChange={(e) => setField('state', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-text cursor-pointer">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(e) => setField('isDefault', e.target.checked)}
          className="size-[18px] accent-brand-500"
        />
        Hacer esta mi dirección predeterminada
      </label>

      {error && (
        <div className="rounded-md bg-error/10 border border-error/30 text-error text-sm px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting}>
          {initial ? 'Guardar' : 'Crear'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-display text-[13px] font-semibold text-text mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-text-soft">{hint}</span>}
    </label>
  );
}
