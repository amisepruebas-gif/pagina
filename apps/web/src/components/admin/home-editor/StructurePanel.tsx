'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { HOME_SECTION_LABELS, isNativeBlock } from '@/types/home-config';
import { MODULE_LABELS, type ViewModuleType } from '@/types/page-view';
import { useHomeEdit } from './HomeEditContext';

/** Módulos que se pueden agregar al Home (se excluyen slider y categories). */
const ADDABLE: { type: ViewModuleType; label: string }[] = [
  { type: 'products', label: 'Sección de productos' },
  { type: 'promo', label: 'Sección promocional' },
  { type: 'banners', label: 'Banners' },
  { type: 'video', label: 'Video' }
];

/** Línea guía que marca dónde caerá el bloque arrastrado. */
function DropLine({ position }: { position: 'top' | 'bottom' }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 flex items-center ${
        position === 'top' ? '-top-1' : '-bottom-1'
      }`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-blue-600" />
      <span className="h-0.5 flex-1 rounded-full bg-blue-600" />
    </span>
  );
}

/**
 * StructurePanel — panel izquierdo del editor. Lista todos los bloques del
 * Home: se reordenan arrastrando, se muestran/ocultan y se agregan o
 * eliminan módulos.
 */
export function StructurePanel({ onCollapse }: { onCollapse: () => void }) {
  const {
    form,
    selectedRef,
    selectRef,
    moveBlock,
    toggleBlockVisible,
    addModule,
    removeModule
  } = useHomeEdit();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function labelOf(ref: string): string {
    if (isNativeBlock(ref)) return HOME_SECTION_LABELS[ref];
    const m = form.modules.find((mod) => mod.id === ref);
    return m ? MODULE_LABELS[m.type] : 'Módulo';
  }

  function handleDrop(toIndex: number) {
    if (dragIndex !== null && dragIndex !== toIndex) {
      moveBlock(dragIndex, toIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Estructura</h2>
          <p className="text-[11px] text-gray-500">
            Arrastra para reordenar los bloques
          </p>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Plegar panel de estructura"
          title="Plegar"
          className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <Icon name="chev-right" size={18} className="rotate-180" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        {/* Hero — fijo, siempre arriba */}
        <button
          type="button"
          onClick={() => selectRef('hero')}
          className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition ${
            selectedRef === 'hero'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Icon name="grid" size={14} />
          <span className="flex-1 text-[13px] font-semibold text-gray-800">
            {HOME_SECTION_LABELS.hero}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-400">
            fijo
          </span>
        </button>

        <ul className="space-y-1.5">
          {form.layout.map((entry, index) => {
            const isModule = !isNativeBlock(entry.ref);
            const selected = selectedRef === entry.ref;
            return (
              <li
                key={entry.ref}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(index));
                  setDragIndex(index);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  setOverIndex(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                className={`relative flex items-center gap-1 rounded-lg border px-2 py-2 transition ${
                  selected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                } ${dragIndex === index ? 'opacity-40' : ''}`}
              >
                {dragIndex !== null &&
                  overIndex === index &&
                  dragIndex > index && <DropLine position="top" />}
                {dragIndex !== null &&
                  overIndex === index &&
                  dragIndex < index && <DropLine position="bottom" />}
                <span
                  className="cursor-grab select-none px-0.5 font-mono text-gray-300"
                  aria-hidden
                >
                  ⠿
                </span>
                <button
                  type="button"
                  onClick={() => selectRef(entry.ref)}
                  className={`flex-1 truncate text-left text-[13px] font-medium ${
                    entry.visible ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {labelOf(entry.ref)}
                  {isModule && (
                    <span className="ml-1 font-mono text-[9px] uppercase text-blue-400">
                      módulo
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleBlockVisible(entry.ref)}
                  aria-label={entry.visible ? 'Ocultar bloque' : 'Mostrar bloque'}
                  className={`rounded p-1 transition hover:bg-gray-100 ${
                    entry.visible ? 'text-gray-600' : 'text-gray-300'
                  }`}
                >
                  <Icon name="eye" size={15} />
                </button>
                {isModule && (
                  <button
                    type="button"
                    onClick={() => removeModule(entry.ref)}
                    aria-label="Eliminar módulo"
                    className="rounded p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdd((s) => !s)}
            className="w-full rounded-lg border border-dashed border-blue-300 py-2 text-[13px] font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            + Agregar módulo
          </button>
          {showAdd && (
            <div className="mt-1.5 space-y-1 rounded-lg border border-gray-200 p-1.5">
              {ADDABLE.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    const id = addModule(opt.type);
                    selectRef(id);
                    setShowAdd(false);
                  }}
                  className="block w-full rounded px-2 py-1.5 text-left text-[13px] text-gray-700 transition hover:bg-gray-100"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
