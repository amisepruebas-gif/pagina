import {
  collection,
  getDocs,
  query,
  where,
  limit as fsLimit,
  doc,
  getDoc,
  type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, RawProductDoc } from '@/types/product';

function normalize(id: string, data: DocumentData): Product {
  const raw = data as RawProductDoc;

  let price = 0;
  let currency = 'MXN';
  if (typeof raw.price === 'number') {
    price = raw.price;
  } else if (raw.price && typeof raw.price === 'object') {
    if (typeof raw.price.sale === 'number') price = raw.price.sale;
    if (raw.price.currency) currency = raw.price.currency;
  }

  return {
    id,
    name: raw.name ?? 'Producto sin nombre',
    slug: raw.slug ?? id,
    sku: raw.sku,
    description: raw.description,
    longDescription: raw.longDescription,
    price,
    costPrice: raw.costPrice,
    originalPrice: raw.originalPrice,
    currency,
    stock: raw.stock,
    isNew: raw.isNew,
    isFeatured: raw.isFeatured,
    active: raw.active !== false,
    primaryImageUrl: raw.primaryImageUrl ?? raw.imageUrl ?? raw.imagePrincipal,
    imageCount: raw.imageCount,
    categoryId: raw.categoryId,
    subcategoryId: raw.subcategoryId,
    materialId: raw.materialId,
    tagIds: raw.tagIds ?? [],
    bulkPricing: raw.bulkPricing,
    createdAt: raw.createdAt?.toDate(),
    updatedAt: raw.updatedAt?.toDate()
  };
}

interface FetchOpts {
  onlyFeatured?: boolean;
  onlyNew?: boolean;
  onlySale?: boolean;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
  tagId?: string;
  limit?: number;
}

export async function getProducts(opts: FetchOpts = {}): Promise<Product[]> {
  const ref = collection(db, 'products');
  const snap = await getDocs(ref);

  let products = snap.docs
    .map((d) => normalize(d.id, d.data()))
    .filter((p) => p.active);

  if (opts.onlyFeatured) products = products.filter((p) => p.isFeatured === true);
  if (opts.onlyNew) products = products.filter((p) => p.isNew === true);
  if (opts.onlySale) {
    products = products.filter(
      (p) => p.originalPrice !== undefined && p.price < p.originalPrice
    );
  }
  if (opts.categoryId) products = products.filter((p) => p.categoryId === opts.categoryId);
  if (opts.subcategoryId) products = products.filter((p) => p.subcategoryId === opts.subcategoryId);
  if (opts.materialId) products = products.filter((p) => p.materialId === opts.materialId);
  if (opts.tagId) products = products.filter((p) => p.tagIds.includes(opts.tagId!));

  products.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

  if (opts.limit !== undefined) products = products.slice(0, opts.limit);

  return products;
}

export async function getFeaturedProducts(n = 4): Promise<Product[]> {
  return getProducts({ onlyFeatured: true, limit: n });
}

export async function getNewProducts(n = 4): Promise<Product[]> {
  return getProducts({ onlyNew: true, limit: n });
}

export async function getLatestProducts(n = 4): Promise<Product[]> {
  return getProducts({ limit: n });
}

/**
 * Match in-memory para búsqueda de texto. Multi-término AND:
 * "llavero deportivo" → todos los términos deben aparecer.
 * Busca en: name, description, sku, slug, tags.
 *
 * Cuando el catálogo crezca (~5k+ SKUs activos), migrar a Algolia o
 * Typesense para evitar bajar todo el dataset al cliente/server.
 */
function matchesSearch(product: Product, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return false;

  const haystack = [
    product.name,
    product.description,
    product.longDescription,
    product.sku,
    product.slug,
    ...product.tagIds
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return terms.every((t) => haystack.includes(t));
}

export async function searchProducts(
  q: string,
  opts: { limit?: number } = {}
): Promise<Product[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];
  // Cota superior para no bajar catálogos enormes en una sola query.
  const all = await getProducts({ limit: 500 });
  const matched = all.filter((p) => matchesSearch(p, trimmed));
  return opts.limit !== undefined ? matched.slice(0, opts.limit) : matched;
}

/**
 * Trae N productos por sus IDs (en paralelo). Filtra los inactivos
 * y los que no existen.
 */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const snaps = await Promise.all(ids.map((id) => getDoc(doc(db, 'products', id))));
  const out: Product[] = [];
  for (const s of snaps) {
    if (!s.exists()) continue;
    const p = normalize(s.id, s.data());
    if (!p.active) continue;
    out.push(p);
  }
  return out;
}

/**
 * Busca producto por slug. Si no encuentra, intenta como doc ID
 * (para soportar productos sin campo `slug` explícito).
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // 1) Lookup por campo slug
  const q = query(collection(db, 'products'), where('slug', '==', slug), fsLimit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const found = snap.docs[0]!;
    return normalize(found.id, found.data());
  }

  // 2) Fallback: tratar el slug como doc ID
  const ref = doc(db, 'products', slug);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return normalize(docSnap.id, docSnap.data());
  }

  return null;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const ref = collection(db, 'products', productId, 'images');
  const snap = await getDocs(ref);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        url: (data.url as string) ?? '',
        alt: (data.alt as string) ?? '',
        order: (data.order as number) ?? 0
      };
    })
    .filter((img) => img.url)
    .sort((a, b) => a.order - b.order);
}
