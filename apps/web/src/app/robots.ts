import type { MetadataRoute } from 'next';

function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
    'http://localhost:3030'
  );
}

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/checkout/',
          '/mi-cuenta',
          '/cart',
          '/login',
          '/register',
          '/forgot-password',
          '/test'
        ]
      }
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base
  };
}
