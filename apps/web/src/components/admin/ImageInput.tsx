'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/admin/uploads';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  /**
   * Se llama con la URL anterior cuando la imagen se sustituye o se quita.
   * El formulario padre debe acumularla y borrarla SOLO al guardar con éxito
   * (ver `useImageCleanup`). Sin esto, la imagen anterior no se borra.
   */
  onReplace?: (oldUrl: string) => void;
  /** Se llama con la URL recién subida — permite hacer rollback si se cancela. */
  onUploaded?: (newUrl: string) => void;
  label?: string;
  required?: boolean;
  hint?: string;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Selector de imagen desde el equipo del usuario. Sube al elegir el archivo.
 * NO borra nada de Storage: delega la imagen anterior vía `onReplace` para
 * que el formulario la borre al guardar (evita romper el registro si se cancela).
 */
export default function ImageInput({
  value,
  onChange,
  onReplace,
  onUploaded,
  label,
  required,
  hint
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('La imagen supera el máximo de 5 MB.');
      return;
    }

    setBusy(true);
    const previous = value; // imagen a sustituir, si la hay
    try {
      const url = await uploadImage(file);
      onUploaded?.(url);
      onChange(url);
      if (previous && previous !== url) onReplace?.(previous);
    } catch (err) {
      console.error('[ImageInput] error al subir', err);
      setError('No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    const previous = value;
    onChange('');
    if (previous) onReplace?.(previous);
  }

  return (
    <div>
      {label && (
        <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      )}

      <div className="flex items-stretch gap-3">
        {value ? (
          <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={value}
              alt="Imagen seleccionada"
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] text-center px-1">
            (sin imagen)
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = ''; // permite re-elegir el mismo archivo
            }}
          />
          <div className="flex flex-wrap gap-3 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="font-semibold text-brand-500 hover:underline disabled:opacity-50"
            >
              {busy ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            {value && !busy && (
              <button
                type="button"
                onClick={handleRemove}
                className="font-semibold text-gray-500 hover:text-red-600"
              >
                Quitar
              </button>
            )}
          </div>
          <span className="text-[11px] text-gray-400">
            Desde tu equipo · PNG/JPG/WEBP · máx 5 MB
          </span>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {hint && <span className="mt-2 block text-xs text-gray-500">{hint}</span>}
    </div>
  );
}
