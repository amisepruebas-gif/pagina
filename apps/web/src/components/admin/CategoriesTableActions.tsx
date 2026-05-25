'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconButton } from '@/components/ui';
import { Toggle } from './Toggle';
import { setCategoryActive } from '@/lib/admin/categories-admin';

export default function CategoriesTableActions({
  categoryId,
  active
}: {
  categoryId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    if (busy) return;
    const next = !active;
    if (
      !window.confirm(
        next
          ? '¿Reactivar esta categoría?'
          : '¿Desactivarla? Quedará oculta en la tienda.'
      )
    )
      return;
    setBusy(true);
    try {
      await setCategoryActive(categoryId, next);
      router.refresh();
    } catch (err) {
      console.error('[ADMIN] toggle active categoría falló:', err);
      window.alert('Error al cambiar estado. Revisa F12 console.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Toggle
        checked={active}
        onChange={() => {
          if (!busy) void toggleActive();
        }}
        label={active ? 'Desactivar categoría' : 'Reactivar categoría'}
      />
      <Link href={`/admin/categorias/${categoryId}`}>
        <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
      </Link>
    </div>
  );
}
