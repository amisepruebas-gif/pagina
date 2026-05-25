# 02 — Performance

## Por qué importa
Cada 100 ms extra de LCP recorta conversión de manera medible (Amazon, Walmart, Pinterest lo han publicado). Un Home con LCP > 2.5 s o un PDP que tarde en ser interactivo cuesta dinero directo.

## Qué se evalúa típicamente
- **Core Web Vitals**: LCP, INP, CLS (cuartiles del CrUX si hay tráfico real).
- Imágenes: formatos modernos (AVIF/WebP), `loading="lazy"` fuera del fold, dimensiones explícitas para evitar CLS.
- Bundle JS: tamaño por ruta, code splitting, tree-shaking, dynamic imports.
- Caching: `Cache-Control` y `s-maxage` en respuestas, ISR donde aplique.
- Render strategy por página: SSG vs SSR vs ISR vs CSR. ¿Coincide con la naturaleza de la página?
- Fonts: `font-display: swap`, subsetting, preconnect.
- Critical CSS / styled-components SSR.
- Long tasks (> 50 ms) en el thread principal.
- Reflows por mediciones síncronas en useEffect.
- Llamadas N+1 a Firestore desde el server.

## Plan para `pagina`

- [ ] Correr Lighthouse (móvil) sobre las páginas críticas: `/`, `/shop`, `/producto/[slug]`, `/cart`, `/checkout/success`. Anotar LCP / INP / CLS / TTI / bundle.
- [ ] Revisar `next.config.ts` — `images.formats: ['image/avif', 'image/webp']`, `remotePatterns` para Firebase Storage, `deviceSizes` adecuados.
- [ ] Confirmar que todo `<img>` está reemplazado por `next/image` con `width`/`height` o `fill`+contenedor con aspect-ratio.
- [ ] Confirmar render mode por ruta:
  - `/` debería ser ISR (revalidate ~60 s) — hoy probablemente es dinámica.
  - `/producto/[slug]` debería ser SSG (build) o ISR (60 s).
  - `/cart`, `/checkout/*` deben ser dinámicas (correcto).
  - `/admin/**` dinámicas con `force-dynamic` (correcto).
- [ ] Revisar fetches en el Home: `getHomeConfig()` + producción de listas. Asegurar que sea **una** lectura de Firestore con prefetch en paralelo (`Promise.all`) y no encadenado.
- [ ] Bundle: `pnpm -C apps/web build` y revisar el output de tamaños. Identificar las rutas más grandes y ver qué importan que no deberían (ej. cargar el editor del Home en una ruta pública).
- [ ] Eliminar imports de `firebase-admin` en client components (si los hay) — bundle se infla.
- [ ] Lazy-load del editor del Home (`InlineEditPanel`, `ProductPickerModal`) si no se hace ya — solo se carga en admin.
- [ ] Confirmar prefetch de imágenes `priority` SOLO en hero/encima del fold. El resto sin priority.
- [ ] `cacheControl` en webhook de Stripe debe ser `no-store`; en imágenes de Storage debería ser largo (`public, max-age=31536000, immutable`).
- [ ] Revisar carrusel de imágenes del Hero — preload solo de la primera; las demás `loading="lazy"`.
- [ ] Buscar `useEffect` con dependencias incorrectas que provoquen renders en cadena (mirando productos, filtros).

## Cómo ejecutar
- Lighthouse desde Chrome DevTools (modo Mobile, Network "Slow 4G", CPU 4x slowdown) o PageSpeed Insights.
- `next build` con `--debug` o `ANALYZE=true` y `@next/bundle-analyzer`.
- WebPageTest para waterfall realista desde MX.
- `pnpm dlx unlighthouse` para auditar todas las rutas de una.

## Notas preliminares
- Next.js 16 + Turbopack y React 19 ya ayudan mucho (RSC, automatic batching).
- `apps/web/src/components/home/Hero.tsx` y `FlashSale.tsx` usan `<Image fill>` con opacidad — bien.
- Hay varios `'use client'` agresivos (FlashSale, BestSellers, Newsletter, FeaturedProducts, NewArrivals). Razonable para los carruseles, pero hay que confirmar que el contenido estático del Home se renderiza server-side.
- El admin importa Firestore client SDK; si llega al bundle público sería un problema. Verificar.

## Estado
Pendiente
