'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui';
import type { HomeConfig } from '@/types/home-config';
import { HomeBlocks, type HomeBlocksData } from '@/components/home/HomeBlocks';
import { HomeEditProvider, useHomeEdit } from './HomeEditContext';
import { EditorToolbar } from './EditorToolbar';
import { InlineEditPanel } from './InlineEditPanel';
import { StructurePanel } from './StructurePanel';
import { Editable } from './Editable';

/**
 * HomeEditorClient — editor visual del Home. Ocupa toda la pantalla:
 * barra superior + panel de Estructura + preview en vivo + panel de
 * propiedades.
 */
export function HomeEditorClient({
  initialConfig,
  data
}: {
  initialConfig: HomeConfig;
  data: HomeBlocksData;
}) {
  return (
    <HomeEditProvider initialConfig={initialConfig}>
      <EditorShell data={data} />
    </HomeEditProvider>
  );
}

function EditorShell({ data }: { data: HomeBlocksData }) {
  const router = useRouter();
  const { form, isDirty, rollbackImages } = useHomeEdit();
  const [structureOpen, setStructureOpen] = useState(true);

  // Avisa antes de cerrar/recargar la pestaña con cambios pendientes.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  async function handleBack() {
    if (
      isDirty &&
      !window.confirm(
        'Tienes cambios sin guardar. ¿Salir del editor de todos modos?'
      )
    ) {
      return;
    }
    // Borra de Storage cualquier imagen subida sin guardar.
    await rollbackImages();
    router.push('/admin/vistas');
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-100">
      <EditorToolbar onBack={handleBack} />
      <div className="flex min-h-0 flex-1">
        {structureOpen ? (
          <aside className="w-[264px] shrink-0 overflow-hidden border-r border-gray-200 bg-white">
            <StructurePanel onCollapse={() => setStructureOpen(false)} />
          </aside>
        ) : (
          <button
            type="button"
            onClick={() => setStructureOpen(true)}
            aria-label="Mostrar panel de estructura"
            title="Mostrar estructura"
            className="flex w-9 shrink-0 items-start justify-center border-r border-gray-200 bg-white pt-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
          >
            <Icon name="chev-right" size={18} />
          </button>
        )}
        <div className="min-w-0 flex-1 overflow-y-auto bg-white">
          <HomeBlocks
            config={form}
            data={data}
            wrap={(ref, label, node) => (
              <Editable blockRef={ref} label={label}>
                {node}
              </Editable>
            )}
          />
        </div>
        <aside className="w-[380px] shrink-0 overflow-hidden border-l border-gray-200 bg-white">
          <InlineEditPanel />
        </aside>
      </div>
    </div>
  );
}
