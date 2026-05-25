import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { compressImage } from './compress-image';

function extOf(file: File): string {
  const fromName = file.name.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  const fromMime = file.type.split('/')[1];
  return fromMime ?? 'bin';
}

/**
 * Sube una imagen desde el equipo del usuario a Storage (`uploads/`) y
 * devuelve su URL pública de descarga.
 *
 * Antes de subir, pasa SIEMPRE por `compressImage`, que respeta la política
 * documentada en el README (sección "Subida de imágenes"): omite la
 * compresión si el original pesa < 1 MB, y la fuerza a WebP < 800 KB si pesa
 * más. Este punto es el único uploader del admin — toda subida pasa por aquí.
 */
export async function uploadImage(file: File): Promise<string> {
  const final = await compressImage(file);
  const path = `uploads/${crypto.randomUUID()}.${extOf(final)}`;
  const sref = storageRef(storage, path);
  await uploadBytes(sref, final, { contentType: final.type });
  const url = await getDownloadURL(sref);
  console.log(
    '[UPLOADS] subida',
    path,
    final === file
      ? `(${(file.size / 1024).toFixed(0)} KB, sin compresión)`
      : `(${(file.size / 1024).toFixed(0)} KB → ${(final.size / 1024).toFixed(0)} KB)`
  );
  return url;
}

/**
 * Borra una imagen de Storage a partir de su URL.
 * Solo actúa sobre URLs de Firebase Storage — ignora URLs externas.
 * No lanza: si la imagen ya no existe, lo registra y continúa.
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url) return;
  if (
    !url.includes('firebasestorage.googleapis.com') &&
    !url.includes('firebasestorage.app') &&
    !url.startsWith('gs://')
  ) {
    return; // URL externa — no es nuestra, no se toca
  }
  try {
    await deleteObject(storageRef(storage, url));
    console.log('[UPLOADS] imagen anterior eliminada');
  } catch (err) {
    console.warn('[UPLOADS] no se pudo borrar la imagen anterior:', err);
  }
}
