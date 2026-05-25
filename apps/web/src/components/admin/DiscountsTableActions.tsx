'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setDiscountActive } from '@/lib/admin/discounts-admin';
import { IconButton } from '@/components/ui';
import { Toggle } from './Toggle';

export default function DiscountsTableActions({
  id,
  active
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    if (busy) return;
    if (!window.confirm(active ? '¿Desactivar descuento?' : '¿Reactivar descuento?'))
      return;
    setBusy(true);
    try {
      await setDiscountActive(id, !active);
      router.refresh();
    } catch (err) {
      console.error('[ADMIN] toggle discount falló:', err);
      window.alert('Error al cambiar estado.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <Toggle
        checked={active}
        onChange={() => {
          if (!busy) void toggleActive();
        }}
        label={active ? 'Desactivar descuento' : 'Reactivar descuento'}
      />
      <Link href={`/admin/descuentos/${id}`}>
        <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
      </Link>
    </div>
  );
}
