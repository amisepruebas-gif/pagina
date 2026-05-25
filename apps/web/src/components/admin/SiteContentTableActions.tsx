'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setSiteContentActive } from '@/lib/admin/site-content-admin';
import { IconButton } from '@/components/ui';
import { Toggle } from './Toggle';

export default function SiteContentTableActions({
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
    if (!window.confirm(active ? '¿Desactivar bloque?' : '¿Reactivar bloque?'))
      return;
    setBusy(true);
    try {
      await setSiteContentActive(id, !active);
      console.log('[ADMIN] siteContent toggle', id, '→', !active);
      router.refresh();
    } catch (err) {
      console.error('[ADMIN] toggle siteContent falló:', err);
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
        label={active ? 'Desactivar bloque' : 'Reactivar bloque'}
      />
      <Link href={`/admin/contenido/${id}`}>
        <IconButton variant="ghost" icon="grid" label="Editar" size="sm" />
      </Link>
    </div>
  );
}
