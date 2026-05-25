# 02 — Performance

## Por qué importa
Cada 100 ms extra de LCP recorta conversión de manera medible (Amazon, Walmart, Pinterest lo han publicado). Un Home con LCP > 2.5 s o un PDP que tarde en ser interactivo cuesta dinero directo.

## Qué se evalúa típicamente
- Core Web Vitals (LCP, INP, CLS).
- Imágenes (formatos, lazy, dimensiones).
- Bundle JS (tamaño, code splitting, dynamic imports).
- Caching (`Cache-Control`, ISR).
- Render strategy por página (SSG / SSR / ISR / CSR).
- Fonts (`font-display`, subsetting).
- Long tasks, reflows.
- Llamadas N+1 a Firestore.

---

## Cambios al plan original

- **Lighthouse / WebPageTest** se posterga. Requiere browser real apuntando a la URL pública con throttling móvil. Hacer en sesión interactiva donde puedes ver los reports y comparar antes/después. Esta auditoría cubre lo que se puede leer del código.
- **Bundle analyzer** (`@next/bundle-analyzer` + `ANALYZE=true next build`) también se posterga — requiere correr build completo y abrir el HTML generado.

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

- **0 uso de `<img>` raw**: todo es `next/image` (15 archivos lo usan). ✓
- **`priority` correcto**: solo en la primera imagen del slider del Hero (`HeroBackgroundSlider.tsx:33`, `priority={i === 0}`) y en la imagen principal del PDP (`ProductGallery.tsx:128`). Las demás caen a lazy automático. ✓
- **Fonts**: `next/font/google` con `display: 'swap'` en las 3 familias (Space_Grotesk, Sora, JetBrains_Mono) → sin FOIT.
- **Home modular**: `apps/web/src/app/(public)/page.tsx` solo carga productos de las secciones visibles (`config.layout.filter(visible)`) y usa `Promise.all` para products + categories. No hay N+1.
- **Sitemap dinámico** con `revalidate = 3600`. Bien.
- **Stripe.js no se carga en cliente**: `stripe-client.ts` existe pero nadie lo importa — el flujo va por redirect a Stripe Checkout Hosted, no por Stripe Elements. Así no infla el bundle público.
- **`metadataBase`** seteado en `app/layout.tsx` → OG images y canonicals resuelven a URL absoluta.

### Hallazgos con acción

**🔴 ALTA — `revalidate = 0` en todas las rutas públicas**
Detectado con `Grep "revalidate" apps/web/src/app`:
- `/` (Home), `/producto/[slug]`, `/shop`, `/envios`, `/v/[slug]` todos están con `revalidate = 0`.
- El comentario en `page.tsx:7` dice _"Sin caché en dev — siempre vemos cambios recién agregados en Firestore Console"_ → la intención era dev, pero está activo en producción.
- Consecuencia: cada visita anónima hace lecturas a Firestore (config home + productos + categorías + reviews). En Vercel Pro + Firebase Blaze esto suma costo lineal con tráfico, y aumenta LCP porque el render espera a Firestore.

**Fix aplicado** en este commit:
- `/`: `revalidate = 60` (admin verá cambios en ≤ 1 min).
- `/producto/[slug]`: `revalidate = 300` (5 min — los productos rara vez cambian).
- `/shop`: `revalidate = 60`.
- `/v/[slug]`: `revalidate = 300`.
- `/envios`: `revalidate = 3600` (página casi estática).

NO se tocan:
- `/search` — query-dependent, debe ser dinámica.
- `/admin/**` — deben mostrar cambios al instante.
- API routes — siguen `force-dynamic`.

**🟡 MEDIA — `next.config.mjs` no declara `images.formats` ni `deviceSizes`**
Next 16 negocia AVIF/WebP por default, pero declararlo explícito hace la config auto-documentada y permite controlar las breakpoints.

**Fix aplicado** en este commit:
```js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [ ... ]
}
```

**🟢 BAJA — Código muerto `stripe-client.ts`**
Define `getStripe()` con `loadStripe()` pero nadie lo importa (`Grep "@/lib/stripe-client"` = 0 matches). Por tree-shaking no infla el bundle, pero conviene borrarlo o documentar para qué existe. Si se decide usar Stripe Elements en algún flujo futuro (form propio de pago, suscripciones), ahí se reactiva. Lo dejo como observación, no lo borro hoy.

**🟢 BAJA — 3 fonts de Google**
Space_Grotesk (4 weights) + Sora (5 weights) + JetBrains_Mono (3 weights). Cada peso es un fetch separado al subset latin. Verificar que JetBrains_Mono se usa realmente (suelo verlo en componentes "code" / "data"); si no, eliminarla baja el peso de fonts ~30%.
**Pendiente**: backlog.

**🟢 BAJA — Lectura de `getConfig`, `getCategories`, `getSubcategories`, `getMaterials` en PDP**
En `producto/[slug]/page.tsx` se hacen ~5 lecturas a Firestore para renderizar. Si no se paralelizan con `Promise.all`, hay cascada secuencial. Hay que confirmar leyendo el archivo completo.
**Pendiente**: revisar y, si aplica, paralelizar.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 1 | 1 | 0 |
| Media | 1 | 1 | 0 |
| Baja | 3 | 0 | 3 (fonts, stripe-client cleanup, PDP fetches paralelos) |

El impacto real del único hallazgo de alta severidad (`revalidate=0`) es grande: con ISR activo, una visita repetida al Home no toca Firestore para nada en ese minuto, el HTML viene del edge cache de Vercel. Lighthouse antes/después debería mostrar mejora notable en LCP de la Home y de `/producto/[slug]`.

## Pendientes para sesión interactiva
- Lighthouse móvil sobre URL pública.
- Bundle analyzer (`ANALYZE=true pnpm -C apps/web build`).
- WebPageTest desde MX (filmstrip + waterfall).
- CrUX si hay tráfico real (Vercel Analytics o Search Console).

## Estado
Hecho — fixes aplicados (ISR + images.formats). Resto en pendientes documentados (Lighthouse, bundle, fonts, cleanup).
