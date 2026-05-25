import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Barrido diario: borra archivos de Storage en `uploads/` que NO están
 * referenciados en ningún doc de Firestore. Es la red de seguridad del
 * cleanup del cliente — cubre casos donde el navegador se cerró antes de
 * que se ejecutara el rollback/commit.
 *
 * Conservador: solo borra archivos con MÁS de 24h, por si alguien está en
 * medio de un formulario sin guardar.
 */

/** Extrae el path interno de Storage desde una URL pública de Firebase. */
function pathFromUrl(url: string): string | null {
  try {
    const m = url.match(/\/o\/([^?]+)/);
    if (!m) return null;
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

const RETENTION_MS = 24 * 60 * 60 * 1000;

export const sweepOrphanImages = onSchedule(
  {
    schedule: 'every day 04:00',
    timeZone: 'America/Mexico_City',
    retryCount: 1
  },
  async () => {
    const db = getFirestore();
    const bucket = getStorage().bucket();

    const referenced = new Set<string>();
    const addUrl = (url: unknown) => {
      if (typeof url !== 'string') return;
      const p = pathFromUrl(url);
      if (p) referenced.add(p);
    };

    // products
    const products = await db.collection('products').get();
    for (const doc of products.docs) {
      const d = doc.data();
      addUrl(d.primaryImageUrl);
      addUrl(d.imageUrl);
      addUrl(d.imagePrincipal);
      const imgs = await doc.ref.collection('images').get();
      for (const img of imgs.docs) addUrl(img.get('url'));
    }

    // vistas (landings dinámicas)
    const vistas = await db.collection('vistas').get();
    for (const doc of vistas.docs) {
      const modules = doc.get('modules');
      if (Array.isArray(modules)) {
        for (const m of modules) {
          const banners = (m as { banners?: unknown }).banners;
          if (Array.isArray(banners)) {
            for (const b of banners) {
              addUrl((b as { imageUrl?: unknown }).imageUrl);
            }
          }
        }
      }
    }

    // config/home (editor del Home)
    const home = await db.collection('config').doc('home').get();
    if (home.exists) {
      const data = home.data() ?? {};
      const hero = (data.hero ?? {}) as Record<string, unknown>;
      const cards = hero.cards;
      if (Array.isArray(cards)) {
        for (const c of cards) addUrl((c as { imageUrl?: unknown }).imageUrl);
      }
      const bgImages = hero.backgroundImages;
      if (Array.isArray(bgImages)) {
        for (const b of bgImages) addUrl((b as { url?: unknown }).url);
      }
      const promoBanner = (data as { promoBanner?: unknown }).promoBanner as
        | Record<string, unknown>
        | undefined;
      addUrl(promoBanner?.bgImageUrl);
      const promoCards = promoBanner?.cards;
      if (Array.isArray(promoCards)) {
        for (const c of promoCards) {
          addUrl((c as { imageUrl?: unknown }).imageUrl);
        }
      }
      const flashSale = (data as { flashSale?: unknown }).flashSale as
        | Record<string, unknown>
        | undefined;
      addUrl(flashSale?.bgImageUrl);
      const modules = (data as { modules?: unknown }).modules;
      if (Array.isArray(modules)) {
        for (const m of modules) {
          const banners = (m as { banners?: unknown }).banners;
          if (Array.isArray(banners)) {
            for (const b of banners) {
              addUrl((b as { imageUrl?: unknown }).imageUrl);
            }
          }
        }
      }
    }

    // siteContent (hero, promo-banner, topbar)
    const siteContent = await db.collection('siteContent').get();
    for (const doc of siteContent.docs) addUrl(doc.get('imageUrl'));

    // categories
    const cats = await db.collection('categories').get();
    for (const doc of cats.docs) addUrl(doc.get('imageUrl'));

    logger.info('[sweep] imágenes referenciadas', {
      count: referenced.size
    });

    const [files] = await bucket.getFiles({ prefix: 'uploads/' });
    const cutoff = Date.now() - RETENTION_MS;

    let deleted = 0;
    let kept = 0;
    let recent = 0;
    let errors = 0;

    for (const file of files) {
      if (referenced.has(file.name)) {
        kept++;
        continue;
      }
      const meta = file.metadata as { timeCreated?: string };
      const timeCreated = meta.timeCreated
        ? new Date(meta.timeCreated).getTime()
        : 0;
      // Sin metadata o creado hace menos de 24h: lo dejamos por si está en
      // un formulario sin guardar todavía.
      if (timeCreated === 0 || timeCreated > cutoff) {
        recent++;
        continue;
      }
      try {
        await file.delete();
        deleted++;
      } catch (err) {
        logger.error('[sweep] error borrando', { file: file.name, err });
        errors++;
      }
    }

    logger.info('[sweep] resultado', {
      total: files.length,
      deleted,
      kept,
      recent,
      errors
    });
  }
);
