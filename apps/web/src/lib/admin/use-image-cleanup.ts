'use client';

import { useCallback, useRef } from 'react';
import { deleteImageByUrl } from '@/lib/admin/uploads';

/**
 * Borrado diferido de imágenes para formularios con `ImageInput` y
 * `ProductImagesField`. Evita dejar basura en Storage:
 *
 * - `onUploaded(url)`: cada vez que se sube una imagen nueva. Se anota como
 *   "candidata a borrar si no termina en el doc".
 * - `onReplace(oldUrl)`: cuando una imagen se sustituye o se quita. Se anota
 *   la URL anterior para borrarla al guardar.
 * - `commit(activeUrls)`: tras guardar OK, borra todo lo anotado que NO esté
 *   en `activeUrls` (las URLs que terminaron referenciadas en el doc).
 *   Llamado sin args, conserva el comportamiento anterior (solo borra las
 *   sustituidas / quitadas).
 * - `rollback()`: al cancelar/cerrar sin guardar, borra todo lo que se
 *   subió en esta sesión y no se llegó a guardar.
 */
export function useImageCleanup() {
  /** Imágenes subidas en esta sesión (candidatas a borrar si no se guardan). */
  const uploaded = useRef<Set<string>>(new Set());
  /** Imágenes que se sustituyeron o quitaron (a borrar al guardar OK). */
  const stale = useRef<Set<string>>(new Set());

  const onUploaded = useCallback((url: string) => {
    if (url) uploaded.current.add(url);
  }, []);

  const onReplace = useCallback((oldUrl: string) => {
    if (oldUrl) stale.current.add(oldUrl);
  }, []);

  /**
   * Borra todo lo anotado que NO siga vivo en el doc.
   * `activeUrls` = URLs que terminaron referenciadas tras el guardado.
   * Si se llama sin args, solo borra las sustituidas/quitadas (modo legacy).
   */
  const commit = useCallback(async (activeUrls?: string[]) => {
    const active = new Set(activeUrls ?? []);
    const toDelete = new Set<string>();
    for (const u of stale.current) if (!active.has(u)) toDelete.add(u);
    if (activeUrls) {
      for (const u of uploaded.current) if (!active.has(u)) toDelete.add(u);
    }
    uploaded.current.clear();
    stale.current.clear();
    await Promise.all([...toDelete].map((u) => deleteImageByUrl(u)));
  }, []);

  /** Borra TODO lo subido en esta sesión — para cancelar sin guardar. */
  const rollback = useCallback(async () => {
    const urls = [...uploaded.current];
    uploaded.current.clear();
    stale.current.clear();
    await Promise.all(urls.map((u) => deleteImageByUrl(u)));
  }, []);

  return { onUploaded, onReplace, commit, rollback };
}
