import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';
import { getPageViews } from '@/lib/page-views';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // refresca cada hora

function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3030'
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();

  // Las rutas de auth (/login, /register) viven en robots.ts como disallow.
  // No tiene sentido listarlas en el sitemap también (señal mixta a Google).
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/shop`, changeFrequency: 'daily', priority: 0.9 }
  ];

  try {
    const [products, categories, views] = await Promise.all([
      getProducts(),
      getCategories(),
      getPageViews()
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/producto/${p.slug}`,
      lastModified: p.updatedAt ?? p.createdAt ?? new Date(),
      changeFrequency: 'weekly',
      priority: p.isFeatured ? 0.8 : 0.6
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((c) => c.active !== false && c.slug)
      .map((c) => ({
        url: `${base}/shop?cat=${encodeURIComponent(c.slug)}`,
        changeFrequency: 'weekly',
        priority: 0.5
      }));

    const viewRoutes: MetadataRoute.Sitemap = views
      .filter((v) => v.slug)
      .map((v) => ({
        url: `${base}/v/${v.slug}`,
        lastModified: v.updatedAt ?? v.createdAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.6
      }));

    return [...staticRoutes, ...categoryRoutes, ...viewRoutes, ...productRoutes];
  } catch (err) {
    console.error('[sitemap] error generando dinámico, sirvo solo static', err);
    return staticRoutes;
  }
}
