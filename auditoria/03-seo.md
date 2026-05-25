# 03 — SEO

## Por qué importa
Para un e-commerce el tráfico orgánico de búsqueda es uno de los canales más rentables. Sin meta tags, sitemap, structured data y URLs limpias, el catálogo es invisible para Google y Bing.

## Qué se evalúa típicamente
- `<title>` y `<meta description>` únicos por página.
- Open Graph + Twitter Cards.
- Canonical URLs.
- `robots.txt` y `sitemap.xml`.
- Structured data JSON-LD (`Product`, `Offer`, `BreadcrumbList`, `Organization`, `WebSite`).
- Headings semánticos.
- URLs limpias.
- Velocidad y mobile-friendliness.
- Imágenes con `alt`.
- 404 útil.

---

## Cambios al plan original

- **Google Search Console** se documenta como pendiente — requiere acceso al dominio y propiedad del usuario.
- **Crawl con Screaming Frog / Sitebulb** se posterga — más útil con tráfico real ya recibiendo de Google.
- **Validación en Rich Results Test** se posterga a sesión interactiva.

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

**Robots y sitemap**
- `apps/web/src/app/robots.ts`: `disallow` para `/admin`, `/api`, `/checkout`, `/cart`, `/mi-cuenta`, `/login`, `/register`, `/forgot-password`, `/test`. Apunta al sitemap correcto.
- `apps/web/src/app/sitemap.ts`: dinámico con productos, categorías, vistas (`/v/[slug]`). Incluye `lastModified`, `changeFrequency`, `priority`. Revalida cada hora.

**PDP (`/producto/[slug]`)** — la pieza más importante para SEO de catálogo, está bien hecha:
- `generateMetadata` con `title`, `description`, `alternates.canonical`, `openGraph` (con imagen del producto), `twitter` card.
- JSON-LD **Product** con `name`, `description`, `image`, `sku`, `offers.url`, `offers.priceCurrency`, `offers.price`, `offers.availability` (`InStock`/`OutOfStock` calculado).
- JSON-LD **BreadcrumbList** coincidente con los breadcrumbs visuales.
- Breadcrumb component (`Breadcrumbs.tsx`) con `aria-label="Breadcrumb"`.

**Home (`/`)**
- JSON-LD **Organization** + **WebSite** con `potentialAction.SearchAction` (Google sitelinks search box).
- `metadataBase` en `app/layout.tsx` → OG resuelve a URLs absolutas.
- `lang="es"` en `<html>`.
- Robots `index, follow` con `max-image-preview: large`.

**Otros**
- Build output confirma `/sitemap.xml` y `/robots.txt` como rutas dinámicas servidas.
- No hay `noindex` accidental.

### Hallazgos con acción

**🔴 ALTA — Categorías en sitemap son query params (`/shop?cat=…`)**
`sitemap.ts:43` lista categorías como `${base}/shop?cat=${slug}`. Google indexa query params con menor peso que paths limpios, y se genera duplicate content potencial entre `/shop`, `/shop?cat=X`, `/shop?sale=true`.

Fix definitivo: crear rutas `/c/[slug]` o `/categorias/[slug]` que renderizen el mismo `ShopClient` pero con la categoría ya filtrada y URL limpia. Rework moderado (mover componente, redirigir el query param viejo).
**Pendiente** — backlog. Tarea de 1-2 h, alto valor SEO.

**🟡 MEDIA — `/shop` sin canonical**
La metadata estática solo declara `title` y `description`. Con filtros (`?cat`, `?sale`), cada combinación es indexable como página distinta → duplicate content.

**Fix aplicado**: agregar `alternates.canonical: '/shop'` para que Google apunte siempre al listado base. Las páginas con filtro siguen siendo crawleables pero no compiten contra el listado principal.

**🟡 MEDIA — `/login` y `/register` en sitemap**
`sitemap.ts:22-23` incluye `/login` y `/register` con priority 0.2. `robots.ts` ya los `disallow`. Mensaje mixto a Google.

**Fix aplicado**: quitar del sitemap.

**🟢 BAJA — Home (`/`) hereda metadata genérica**
`app/(public)/page.tsx` no exporta `metadata` propia → cae al default de `layout.tsx` (`title: 'pagina'`, `description: 'Accesorios y llaveros personalizados'`). Aceptable, pero el Home merece un título y descripción específicos que incluyan keywords del catálogo.
**Pendiente**: backlog. Una sola línea de `export const metadata = { … }` que el equipo de marketing pueda iterar.

**🟢 BAJA — PDP sin `generateStaticParams`**
`/producto/[slug]` está como `ƒ` (dynamic) en build output. Con `revalidate=300` (ahora) cachea por 5 min, pero `generateStaticParams` permitiría pre-render de todas las URLs al deploy → mejor crawl inicial.
**Pendiente**: backlog. Requiere decidir si los productos inactivos también se rendean.

**🟢 BAJA — Sin OpenGraph image dinámica para Home**
No hay `app/opengraph-image.tsx`. La PDP usa imagen del producto como OG (bien); el Home no tiene OG image específica → Twitter/WhatsApp/Slack mostrarán solo texto al compartir el link.
**Pendiente**: backlog. Un `opengraph-image.tsx` que renderice un PNG dinámico con el branding (Next 16 lo hace fácil con JSX en `og`).

**🟢 BAJA — `/search` debería ser `noindex`**
Lo audité indirecto: `/search` es query-dependent y sus resultados cambian con cada `?q`. Indexar resultados de búsqueda es anti-pattern (Google penaliza "search results as content"). Verificar si la metadata de `/search` incluye `robots: { index: false }`.
**Pendiente**: leer la página y agregar `noindex` si falta.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 1 | 0 | 1 (rutas limpias para categorías) |
| Media | 2 | 2 | 0 |
| Baja | 4 | 0 | 4 |

La base SEO es sólida: la PDP está bien hecha (lo más importante en una tienda), JSON-LD correcto en producto + organization + breadcrumbs. El gap mayor es las URLs de categoría — pasar de `/shop?cat=X` a `/c/X` puede triplicar el valor SEO de cada categoría con el catálogo creciendo. Va en el backlog con prioridad alta para cuando se decida invertir tiempo en SEO.

## Estado
Hecho — fixes de hoy aplicados (canonical en /shop, limpieza de sitemap). Backlog claro de 5 items para sesiones futuras.
