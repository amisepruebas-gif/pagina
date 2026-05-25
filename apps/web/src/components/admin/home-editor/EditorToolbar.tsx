'use client';

import { useHomeEdit } from './HomeEditContext';

/** EditorToolbar — barra superior fija del editor del Home. */
export function EditorToolbar({ onBack }: { onBack: () => void }) {
  const { isDirty, saving, justSaved, error, save } = useHomeEdit();

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
        >
          ← Volver
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <div className="text-[13px] font-bold leading-tight text-gray-900">
            Editor de la página de inicio
          </div>
          <div className="text-[11px] leading-tight text-gray-500">
            Vista principal
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {error ? (
          <span className="text-[12px] font-medium text-red-600">{error}</span>
        ) : justSaved ? (
          <span className="text-[12px] font-semibold text-green-600">
            ✓ Cambios guardados
          </span>
        ) : isDirty ? (
          <span className="text-[12px] font-medium text-amber-600">
            ● Cambios sin guardar
          </span>
        ) : null}

        <button
          type="button"
          onClick={save}
          disabled={saving || !isDirty}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
