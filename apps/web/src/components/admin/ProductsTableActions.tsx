'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconButton } from '@/components/ui';
import { setProductActive } from '@/lib/admin/products-admin';

export default function ProductsTableActions({
  productId,
  active,
  onEdit
}: {
  productId: string;
  active: boolean;
  /** Si se pasa, abre el modal de edición en lugar de navegar. */
  onEdit?: (productId: string) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    if (busy) return;
    const next = !active;
    const confirmMsg = next
      ? '¿Reactivar este producto y mostrarlo en la tienda?'
      : '¿Desactivar este producto y ocultarlo de la tienda?';
    if (!window.confirm(confirmMsg)) return;
    setBusy(true);
    try {
      await setProductActive(productId, next);
      router.refresh();
    } catch (err) {
      console.error('[ADMIN] toggle active falló:', err);
      window.alert('Error al cambiar estado. Revisa F12 console.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex gap-1">
      <IconButton
        variant="ghost"
        icon="grid"
        label="Editar"
        size="sm"
        onClick={() =>
          onEdit
            ? onEdit(productId)
            : router.push(`/admin/productos/${productId}`)
        }
      />
      <IconButton
        variant="ghost"
        icon={active ? 'x' : 'refresh'}
        label={active ? 'Desactivar' : 'Reactivar'}
        size="sm"
        disabled={busy}
        onClick={toggleActive}
        className={active ? '!text-error' : '!text-success'}
      />
    </div>
  );
}
