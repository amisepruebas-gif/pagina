'use client';

import type { ReactNode } from 'react';
import { useHomeEdit } from './HomeEditContext';

/**
 * Editable — envuelve un bloque del Home en el preview del editor.
 * Una capa transparente cubre el bloque: captura los clics (para
 * seleccionarlo) y de paso neutraliza enlaces y formularios internos.
 */
export function Editable({
  blockRef,
  label,
  children
}: {
  blockRef: string;
  label: string;
  children: ReactNode;
}) {
  const { selectedRef, selectRef } = useHomeEdit();
  const isSelected = selectedRef === blockRef;

  return (
    <div className="group relative">
      {children}

      <button
        type="button"
        onClick={() => selectRef(blockRef)}
        aria-label={`Editar bloque: ${label}`}
        className={`absolute inset-0 z-20 w-full cursor-pointer transition-colors duration-150 ${
          isSelected
            ? 'bg-blue-600/[0.04] ring-2 ring-inset ring-blue-600'
            : 'ring-1 ring-inset ring-transparent hover:bg-blue-500/[0.03] hover:ring-blue-400'
        }`}
      />

      <span
        className={`pointer-events-none absolute left-0 top-0 z-30 px-2 py-1 font-mono text-[11px] font-semibold tracking-wide text-white transition-opacity duration-150 ${
          isSelected
            ? 'bg-blue-600 opacity-100'
            : 'bg-blue-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
