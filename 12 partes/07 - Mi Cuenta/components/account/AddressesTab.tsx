"use client";
import { useState } from "react";
import { Button } from "@/components";
import { ACCOUNT_ADDRESSES, type Address } from "@/lib/sample-account";
import { SectionHeader } from "./SectionHeader";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { AccountEmptyState } from "./EmptyState";

/** AddressesTab — lista + form inline para crear / editar. */
export function AddressesTab() {
  const [list, setList] = useState<Address[]>(ACCOUNT_ADDRESSES);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  const makeDefault = (id: string) =>
    setList((arr) => arr.map((a) => ({ ...a, default: a.id === id })));
  const remove = (id: string) => setList((arr) => arr.filter((a) => a.id !== id));
  const save = (a: Address) => {
    setList((arr) => {
      const exists = arr.some((x) => x.id === a.id);
      return exists ? arr.map((x) => x.id === a.id ? a : x) : [...arr, a];
    });
    setAdding(false); setEditing(null);
  };

  if (list.length === 0 && !adding) {
    return (
      <AccountEmptyState
        icon="truck" title="Aún no tienes direcciones"
        body="Agrega una para recibir tus pedidos más rápido."
        cta="Agregar dirección" onCta={() => setAdding(true)}
      />
    );
  }

  return (
    <div>
      <SectionHeader
        title="Tus direcciones"
        subtitle="Gestiona dónde te enviamos tus pedidos."
        action={!adding && !editing && (
          <Button leadingIcon="plus" onClick={() => setAdding(true)}>Agregar dirección</Button>
        )}
      />

      {(adding || editing) && (
        <div className="mb-4">
          <AddressForm
            initial={editing ?? undefined}
            onCancel={() => { setAdding(false); setEditing(null); }}
            onSave={save}
          />
        </div>
      )}

      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {list.map((a) => (
          <AddressCard key={a.id} address={a}
            onMakeDefault={() => makeDefault(a.id)}
            onEdit={() => setEditing(a)}
            onDelete={() => remove(a.id)}
          />
        ))}
      </div>
    </div>
  );
}
