/**
 * Compresión de imágenes antes de subirlas a Storage.
 *
 * Política del proyecto (ver README — sección "Subida de imágenes"):
 *  - Si la imagen original pesa < 1 MB → se omite la compresión y se sube
 *    tal cual. Mantenemos la calidad cuando el peso ya es razonable.
 *  - Si pesa ≥ 1 MB → se fuerza a `image/webp` con un peso final < 800 KB,
 *    intentando preservar la mejor resolución visual posible: primero se
 *    baja la calidad iterativamente; solo cuando eso no alcanza se reduce
 *    también la dimensión.
 *
 * Implementación cliente con Canvas API — no requiere dependencias externas.
 * Soportada en todos los navegadores modernos. WebP encoding via
 * `canvas.toBlob('image/webp', quality)`.
 */

const SKIP_BELOW_BYTES = 1024 * 1024; // 1 MB
const TARGET_MAX_BYTES = 800 * 1024; // 800 KB
const TARGET_MIME = 'image/webp';

/** Niveles de calidad WebP probados, de mejor a peor. */
const QUALITY_STEPS = [0.92, 0.85, 0.78, 0.72, 0.65, 0.58, 0.5];

/** Cada vez que la calidad mínima no alcanza, reducimos dimensiones a este factor. */
const DOWNSCALE_FACTOR = 0.85;
/** Hasta cuánto encoger antes de tirar la toalla (≈ 20% del original). */
const MIN_SCALE = 0.2;

/**
 * Aplica el filtro de la política. Devuelve un `File` nuevo cuando comprime,
 * o el mismo archivo original cuando no se requiere compresión.
 *
 * No lanza por imágenes mal formadas — si algo falla, devuelve el original
 * y deja que el caller (uploadImage) lo suba sin comprimir.
 */
export async function compressImage(file: File): Promise<File> {
  // 1. Política: omitir si pesa < 1 MB.
  if (file.size < SKIP_BELOW_BYTES) {
    return file;
  }
  // 2. Solo imágenes — si no lo es, no tocamos.
  if (!file.type.startsWith('image/')) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (err) {
    console.warn('[COMPRESS] no se pudo decodificar la imagen, se sube sin comprimir', err);
    return file;
  }

  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  let bestBlob: Blob | null = null;
  let scale = 1;

  // Loop: para cada escala, probar bajando calidad. Si ninguna calidad llega
  // a la meta a esta escala, downscale y volver a probar.
  while (scale >= MIN_SCALE) {
    const w = Math.max(1, Math.round(originalWidth * scale));
    const h = Math.max(1, Math.round(originalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('[COMPRESS] sin contexto 2D, se sube sin comprimir');
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, TARGET_MIME, quality);
      if (!blob) continue;
      // Quedamos con el más pequeño visto, aunque no haya alcanzado la meta —
      // por si el loop entero falla, al menos devolvemos algo mejor que el
      // original.
      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }
      if (blob.size <= TARGET_MAX_BYTES) {
        bitmap.close();
        return blobToFile(blob, file.name);
      }
    }
    scale *= DOWNSCALE_FACTOR;
  }

  bitmap.close();
  if (bestBlob && bestBlob.size < file.size) {
    console.warn(
      '[COMPRESS] no se alcanzó la meta de 800 KB; se sube la mejor versión lograda',
      bestBlob.size
    );
    return blobToFile(bestBlob, file.name);
  }
  return file;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), type, quality);
  });
}

function blobToFile(blob: Blob, originalName: string): File {
  const base = originalName.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${base}.webp`, { type: 'image/webp' });
}
