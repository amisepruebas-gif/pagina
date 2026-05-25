import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import {
  DEFAULT_HOME_CONFIG,
  HOME_NATIVE_BLOCKS,
  type HomeConfig,
  type HomeLayoutEntry,
  type PromoBannerConfig
} from '@/types/home-config';
import type { ViewModule } from '@/types/page-view';

/**
 * Mapea los campos antiguos del banner promocional (bgFrom, bgTo,
 * overlayColor, overlayOpacity) a los nuevos campos unificados
 * (coverType/coverFrom/coverTo/coverOpacity), para que los docs guardados
 * antes del refactor sigan funcionando.
 */
function mergePromoBanner(
  d: PromoBannerConfig,
  raw: Partial<PromoBannerConfig> | undefined
): PromoBannerConfig {
  if (!raw) return d;
  const legacy = raw as Partial<PromoBannerConfig> & {
    bgFrom?: string;
    bgTo?: string;
    overlayOpacity?: number;
  };
  return {
    ...d,
    ...raw,
    coverType: legacy.coverType ?? 'gradient',
    coverFrom: legacy.coverFrom ?? legacy.bgFrom ?? d.coverFrom,
    coverTo: legacy.coverTo ?? legacy.bgTo ?? d.coverTo,
    coverOpacity:
      legacy.coverOpacity ?? legacy.overlayOpacity ?? d.coverOpacity
  };
}

/**
 * Documento único de Firestore donde vive la configuración del Home.
 * Se usa la colección `config` (lectura pública, escritura solo admin según
 * las reglas de Firestore ya existentes).
 */
export const HOME_CONFIG_DOC = { collection: 'config', id: 'home' } as const;

/**
 * Reconstruye el `layout` a partir de lo guardado: conserva el orden y la
 * visibilidad válidos, descarta referencias muertas y agrega al final los
 * bloques nativos o módulos que falten. Así un documento viejo (sin layout)
 * o desfasado siempre produce un layout coherente.
 */
function reconcileLayout(
  rawLayout: unknown,
  modules: ViewModule[]
): HomeLayoutEntry[] {
  const validRefs = new Set<string>([
    ...HOME_NATIVE_BLOCKS,
    ...modules.map((m) => m.id)
  ]);
  const seen = new Set<string>();
  const result: HomeLayoutEntry[] = [];

  if (Array.isArray(rawLayout)) {
    for (const entry of rawLayout) {
      if (
        entry &&
        typeof entry === 'object' &&
        typeof (entry as { ref?: unknown }).ref === 'string'
      ) {
        const ref = (entry as { ref: string }).ref;
        const visible = (entry as { visible?: unknown }).visible !== false;
        if (validRefs.has(ref) && !seen.has(ref)) {
          seen.add(ref);
          result.push({ ref, visible });
        }
      }
    }
  }
  // Bloques nativos que falten — al final, visibles.
  for (const ref of HOME_NATIVE_BLOCKS) {
    if (!seen.has(ref)) {
      seen.add(ref);
      result.push({ ref, visible: true });
    }
  }
  // Módulos que falten en el layout — al final, visibles.
  for (const m of modules) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      result.push({ ref: m.id, visible: true });
    }
  }
  return result;
}

/**
 * Combina los datos crudos de Firestore con los valores por defecto. El
 * merge es por sección; `layout` y `modules` se reconcilian aparte para
 * tolerar documentos guardados con un esquema anterior.
 */
export function mergeHomeConfig(raw: DocumentData | undefined): HomeConfig {
  const d = DEFAULT_HOME_CONFIG;
  if (!raw) return d;
  const r = raw as Partial<HomeConfig>;
  const modules: ViewModule[] = Array.isArray(r.modules) ? r.modules : [];
  return {
    hero: { ...d.hero, ...r.hero },
    trustBar: { ...d.trustBar, ...r.trustBar },
    categoryGrid: { ...d.categoryGrid, ...r.categoryGrid },
    featured: { ...d.featured, ...r.featured },
    promoBanner: mergePromoBanner(d.promoBanner, r.promoBanner),
    newArrivals: { ...d.newArrivals, ...r.newArrivals },
    flashSale: { ...d.flashSale, ...r.flashSale },
    bestSellers: { ...d.bestSellers, ...r.bestSellers },
    newsletter: { ...d.newsletter, ...r.newsletter },
    modules,
    layout: reconcileLayout(r.layout, modules)
  };
}

/**
 * Devuelve la configuración del Home. Si el documento no existe todavía,
 * devuelve los valores por defecto — el Home nunca queda en blanco.
 */
export async function getHomeConfig(): Promise<HomeConfig> {
  const snap = await getDoc(doc(db, HOME_CONFIG_DOC.collection, HOME_CONFIG_DOC.id));
  if (!snap.exists()) return DEFAULT_HOME_CONFIG;
  return mergeHomeConfig(snap.data());
}
