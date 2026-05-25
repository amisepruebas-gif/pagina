'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';
import { getCategories } from '@/lib/categories';
import type { Category } from '@/types/category';

/** Línea guía que marca dónde caerá el registro arrastrado. */
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
 * Selector múltiple de categorías — devuelve una lista ordenada de
 * categoryIds. Las categorías seleccionadas se pueden arrastrar para
 * definir el orden en que se muestran. Lista vacía = "todas".
 */
export default function CategoryMultiPicker({
  value,
  onChange
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    getCategories()
      .then((c) => {
        setCats(c);
        setLoaded(true);
      })
      .catch((err) => console.error('[CategoryMultiPicker]', err));
  }, []);

  const selected = value
    .map((id) => cats.find((c) => c.id === id))
    .filter((c): c is Category => Boolean(c));
  const available = cats.filter((c) => !value.includes(c.id));

  function add(id: string) {
    onChange([...value, id]);
  }
  function remove(id: string) {
    onChange(value.filter((x) => x !== id));
  }
  function move(from: number, to: number) {
    if (from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }
  function handleDrop(toIndex: number) {
    if (dragIndex !== null && dragIndex !== toIndex) move(dragIndex, toIndex);
    setDragIndex(null);
    setOverIndex(null);
  }

  if (!loaded) {
    return <p className="text-[13px] text-gray-400">Cargando categorías…</p>;
  }
  if (cats.length === 0) {
    return <p className="text-[13px] text-gray-400">No hay categorías.</p>;
  }

  return (
    <div className="space-y-3">
      <div>
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Se muestran (arrastra para ordenar)
        </span>
        {selected.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 px-3 py-2.5 text-[12px] text-gray-500">
            Sin selección: se muestran todas las categorías.
          </p>
        ) : (
          <ul className="space-y-1">
            {selected.map((c, index) => (
              <li
                key={c.id}
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
                className={`relative flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-50 px-2 py-1.5 transition ${
                  dragIndex === index ? 'opacity-40' : ''
                }`}
              >
                {dragIndex !== null &&
                  overIndex === index &&
                  dragIndex > index && <DropLine position="top" />}
                {dragIndex !== null &&
                  overIndex === index &&
                  dragIndex < index && <DropLine position="bottom" />}
                <span
                  className="cursor-grab select-none px-0.5 font-mono text-blue-300"
                  aria-hidden
                >
                  ⠿
                </span>
                <span className="font-mono text-[10px] text-blue-400">
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-[13px] font-medium text-gray-800">
                  {c.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label={`Quitar ${c.name}`}
                  className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="x" size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {available.length > 0 && (
        <div>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Agregar categoría
          </span>
          <div className="flex flex-wrap gap-1.5">
            {available.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => add(c.id)}
                className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-1 text-[12px] font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon name="plus" size={12} strokeWidth={2.4} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
