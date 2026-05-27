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
  const [modalOpen, setModalOpen] = useState(false);

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

  // Bloquear scroll del body mientras el modal está abierto + cerrar con Esc.
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

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
    <>
      <div className="sticky top-0 z-50 bg-amber-400 text-amber-950">
        <div className="mx-auto max-w-7xl px-10 sm:px-12 h-8 flex items-center justify-center gap-1.5 text-center text-[11px] sm:text-xs font-semibold tracking-wide relative">
          <span className="truncate">Página demostrativa · info</span>
          <a
            href="tel:+527473570112"
            className="underline underline-offset-2 hover:no-underline whitespace-nowrap"
          >
            747 357 0112
          </a>
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="underline underline-offset-2 hover:no-underline whitespace-nowrap"
          >
            Saber más
          </button>
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

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 inline-flex items-center justify-center size-8 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size={18} strokeWidth={2.2} />
            </button>
            <div className="p-6 sm:p-8">
              <h2
                id="demo-modal-title"
                className="font-display font-bold text-xl sm:text-2xl tracking-tight pr-8"
              >
                Bienvenido a esta página de muestra
              </h2>
              <div className="mt-4 space-y-3 text-sm sm:text-[15px] leading-relaxed text-gray-700">
                <p>
                  Esta página web es solo una demostración de lo que podemos
                  crear para tu negocio o proyecto.
                </p>
                <p>
                  Tu página puede tener un dominio propio, es decir, una
                  dirección personalizada con el nombre que más te guste,
                  siempre que se encuentre disponible.
                </p>
                <p>
                  Recuerda que cada sección puede adaptarse a tus necesidades:
                  colores, textos, imágenes, botones, servicios, productos y
                  funciones especiales.
                </p>
                <p>
                  Actualmente, esta muestra ya cuenta con una estructura
                  moderna, simple y completa, pensada para que tus clientes
                  naveguen fácilmente y conozcan lo que ofreces.
                </p>
                <p className="font-semibold text-gray-900">
                  No te quedes atrás. Promueve tu negocio, vende a tu manera y
                  dale una mejor presencia digital a tu marca.
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <a
                  href="tel:+527473570112"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 text-white px-4 py-2.5 text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  Hablar al 747 357 0112
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
