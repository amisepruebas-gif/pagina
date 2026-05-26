'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';

const STORAGE_KEY = 'demo-banner-dismissed';
const BANNER_HEIGHT = '32px';

/**
 * Banda permanente que aclara que es un demo. Sticky a top:0 — sobrevive
 * al scroll. La X la oculta y la decisión se persiste en localStorage para
 * que valga en todas las páginas y otras pestañas abiertas (vía evento
 * `storage` nativo + dispatch manual porque ese evento no se dispara en la
 * misma pestaña que escribe).
 *
 * Sets `--demo-banner-h` en el <html> para que el Header sticky se asome
 * abajo del banner en lugar de quedar tapado.
 */
export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setDismissed(localStorage.getItem(STORAGE_KEY) === 'true');

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setDismissed(e.newValue === 'true');
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (dismissed) {
      root.style.removeProperty('--demo-banner-h');
    } else {
      root.style.setProperty('--demo-banner-h', BANNER_HEIGHT);
    }
  }, [hydrated, dismissed]);

  function handleClose() {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    // El evento `storage` nativo no se dispara en la pestaña que escribió.
    // Para mantener en sync cualquier otro DemoBanner en otra ruta SPA del
    // mismo tab, despachamos manualmente.
    window.dispatchEvent(
      new StorageEvent('storage', { key: STORAGE_KEY, newValue: 'true' })
    );
  }

  if (hydrated && dismissed) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-400 text-amber-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-8 flex items-center justify-center gap-1.5 text-center text-[11px] sm:text-xs font-semibold tracking-wide relative">
        <span>Página demostrativa · info</span>
        <a
          href="tel:+527473570112"
          className="underline underline-offset-2 hover:no-underline"
        >
          747 357 0112
        </a>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar aviso de demo"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-6 rounded hover:bg-amber-500/40 transition-colors"
        >
          <Icon name="x" size={14} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
