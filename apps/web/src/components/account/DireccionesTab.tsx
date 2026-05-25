'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  listAddresses,
  deleteAddress,
  setDefaultAddress
} from '@/lib/addresses';
import type { Address } from '@/types/address';
import { Button } from '@/components/ui';
import AddressForm from './AddressForm';

type Mode = { kind: 'idle' } | { kind: 'new' } | { kind: 'edit'; address: Address };

export default function DireccionesTab() {
  const { user } = useAuth();
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: 'idle' });
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await listAddresses(user.uid);
      setItems(list);
    } catch (err) {
      console.error('[ADDR] list error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(addr: Address) {
    if (!user) return;
    if (!window.confirm(`¿Eliminar la dirección "${addr.alias}"?`)) return;
    setBusyId(addr.id);
    try {
      await deleteAddress(user.uid, addr.id);
      await load();
    } catch (err) {
      console.error('[ADDR] delete error:', err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleSetDefault(addr: Address) {
    if (!user || addr.isDefault) return;
    setBusyId(addr.id);
    try {
      await setDefaultAddress(user.uid, addr.id);
      await load();
    } catch (err) {
      console.error('[ADDR] set default error:', err);
    } finally {
      setBusyId(null);
    }
  }

  if (!user) return null;

  if (mode.kind !== 'idle') {
    return (
      <AddressForm
        uid={user.uid}
        initial={mode.kind === 'edit' ? mode.address : null}
        onDone={() => {
          setMode({ kind: 'idle' });
          load();
        }}
        onCancel={() => setMode({ kind: 'idle' })}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {loading
            ? 'Cargando…'
            : `${items.length} dirección${items.length === 1 ? '' : 'es'}`}
        </p>
        <Button leadingIcon="plus" onClick={() => setMode({ kind: 'new' })}>
          Nueva dirección
        </Button>
      </div>

      {!loading && items.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-border bg-surface px-6 py-16 text-center">
          <p className="font-display font-bold text-text">
            Aún no tienes direcciones guardadas.
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Agrega una para usarla en el checkout.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-sm font-bold">{a.alias}</h3>
                <p className="text-sm text-text-muted mt-1">{a.fullName}</p>
              </div>
              {a.isDefault && (
                <span className="rounded-full bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  Default
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              {a.street}
              {a.reference && (
                <span className="block text-xs text-text-soft">
                  ({a.reference})
                </span>
              )}
              <span className="block">
                {a.city}, {a.state} {a.zip}
              </span>
              <span className="block">{a.country}</span>
            </p>
            {a.phone && (
              <p className="mt-2 text-xs text-text-soft">Tel: {a.phone}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <button
                type="button"
                onClick={() => setMode({ kind: 'edit', address: a })}
                className="font-display font-semibold text-text hover:text-brand-600 transition"
              >
                Editar
              </button>
              {!a.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(a)}
                  disabled={busyId === a.id}
                  className="font-display font-semibold text-text-muted hover:text-brand-600 disabled:opacity-50 transition"
                >
                  Marcar default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(a)}
                disabled={busyId === a.id}
                className="font-display font-semibold text-text-muted hover:text-error disabled:opacity-50 ml-auto transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
