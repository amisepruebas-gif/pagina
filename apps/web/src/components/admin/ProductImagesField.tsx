'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/admin/uploads';
import { Icon } from '@/components/ui';

interface ProductImagesFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  /** Se llama con la URL de cada imagen quitada — para borrarla de Storage al guardar. */
  onRemove?: (url: string) => void;
  /** Se llama con cada URL recién subida — permite hacer rollback si se cancela. */
  onUploaded?: (url: string) => void;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Gestor de imágenes adicionales del producto (galería).
 * Sube varias imágenes desde el equipo y las muestra como miniaturas
 * reordenables por su posición en la lista.
 */
export default function ProductImagesField({
  value,
  onChange,
  onRemove,
  onUploaded
}: ProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    // Acumulador fuera del try: si una subida falla a mitad, las imágenes ya
    // subidas se aplican igual en el `finally` (no se pierden del formulario).
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Solo se permiten imágenes.');
          continue;
        }
        if (file.size > MAX_BYTES) {
          setError('Alguna imagen supera el máximo de 5 MB.');
          continue;
        }
        const url = await uploadImage(file);
        uploaded.push(url);
        onUploaded?.(url);
      }
    } catch (err) {
      console.error('[ProductImagesField] error al subir', err);
      setError('No se pudieron subir algunas imágenes. Intenta de nuevo.');
    } finally {
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
      setBusy(false);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }

  function remove(index: number) {
    const url = value[index]!;
    onChange(value.filter((_, i) => i !== index));
    onRemove?.(url);
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative aspect-square rounded-md overflow-hidden border border-border bg-surface-2"
          >
            <Image
              src={url}
              alt={`Imagen adicional ${i + 1}`}
              fill
              sizes="120px"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Quitar imagen"
              className="absolute top-1 right-1 size-6 rounded-full bg-black/55 text-white inline-flex items-center justify-center hover:bg-error transition"
            >
              <Icon name="x" size={12} strokeWidth={2.4} />
            </button>
            <div className="absolute bottom-1 left-1 right-1 flex justify-between">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Mover antes"
                className="size-6 rounded-full bg-black/55 text-white inline-flex items-center justify-center disabled:opacity-0 hover:bg-black/75 transition"
              >
                <Icon name="arr-left" size={12} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                aria-label="Mover después"
                className="size-6 rounded-full bg-black/55 text-white inline-flex items-center justify-center disabled:opacity-0 hover:bg-black/75 transition"
              >
                <Icon name="arr-right" size={12} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-md border-2 border-dashed border-border-strong flex flex-col items-center justify-center gap-1 text-text-soft hover:border-brand-500 hover:text-brand-600 transition disabled:opacity-50"
        >
          <Icon name="plus" size={20} strokeWidth={2} />
          <span className="text-[11px] font-display font-semibold">
            {busy ? 'Subiendo…' : 'Agregar'}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {error && <p className="mt-2 text-xs text-error">{error}</p>}
      <p className="mt-2 text-[13px] text-text-soft leading-relaxed">
        Se muestran en la galería de la ficha del producto. Puedes subir varias
        a la vez · PNG/JPG/WEBP · máx 5 MB c/u.
      </p>
    </div>
  );
}
