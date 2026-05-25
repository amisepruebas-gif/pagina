# 03 — SEO

## Por qué importa
Para un e-commerce el tráfico orgánico de búsqueda es uno de los canales más rentables. Sin meta tags, sitemap, structured data y URLs limpias, el catálogo es invisible para Google y Bing.

## Qué se evalúa típicamente
- `<title>` y `<meta description>` únicos por página.
- Open Graph + Twitter Cards.
- Canonical URLs (sobre todo en `/shop?filter=…`).
- `robots.txt` y `sitemap.xml`.
- Structured data JSON-LD: `Product`, `Offer`, `BreadcrumbList`, `Organization`, `WebSite` con SearchAction.
- Headings semánticos (un solo `h1` por página).
- URLs cortas, descriptivas, con slug; sin params innecesarios.
- Velocidad y mobile-friendliness (Google Search Console).
- hreflang si hay i18n (no aplica hoy: solo MX/español).
- Imágenes con `alt` significativo.
- 404 con sugerencias / search en vez de página muerta.
- Manejo de productos descontinuados (301 a categoría, no 404 directo).

## Plan para `pagina`

- [ ] Auditar `apps/web/src/app/(public)/**/page.tsx` y verificar que cada ruta exporta `generateMetadata` o `metadata` con `title` y `description` específicos.
- [ ] `/producto/[slug]/page.tsx`: meta + JSON-LD `Product` con `name`, `image`, `description`, `sku`, `brand`, `offers.price`, `offers.priceCurrency`, `offers.availability`. Crítico para Rich Results.
- [ ] `/shop` y `/search`: canonical sin filtros para evitar duplicate content; `noindex` cuando hay filtros activos (decisión).
- [ ] Confirmar `sitemap.xml` y `robots.txt`. Hoy existen `apps/web/src/app/sitemap.xml/` y `robots.txt/`. Revisar que el sitemap liste productos activos y categorías, y que se regenere (no estático).
- [ ] Añadir `BreadcrumbList` JSON-LD en categorías y producto.
- [ ] Añadir `Organization` JSON-LD en el layout raíz con `name`, `url`, `logo`, `sameAs` (redes).
- [ ] Verificar que todos los `next/image` tienen `alt` real (no vacío salvo decorativos).
- [ ] OG image dinámica con `app/opengraph-image.tsx` para `/` y `/producto/[slug]`.
- [ ] 404 (`apps/web/src/app/not-found.tsx`): debe ofrecer buscador y links a categorías populares.
- [ ] Slug stability: confirmar que cambiar el nombre de un producto NO cambia el slug — los enlaces externos quedan rotos. Si cambia, redireccionar.
- [ ] Logging de errores 404 (en Vercel) para detectar enlaces rotos antes de que Google los penalice.

## Cómo ejecutar
- [Rich Results Test](https://search.google.com/test/rich-results) para validar JSON-LD producto.
- `pnpm dlx unlighthouse` para auditar SEO score por ruta.
- Google Search Console: dar de alta el dominio y revisar Coverage + Performance.
- Screaming Frog (gratis hasta 500 URLs) o Sitebulb para crawl completo.
- `curl -s https://pagina-gomu.vercel.app/sitemap.xml | xmllint --format -` para inspeccionar el sitemap.

## Notas preliminares
- El build muestra `/sitemap.xml` y `/robots.txt` como rutas dinámicas (`ƒ`). Bueno.
- `/producto/[slug]` también es dinámica (`ƒ`). Aceptable, pero si se hace SSG con `generateStaticParams` mejora SEO y performance.
- Pendiente confirmar si ya hay JSON-LD producto.

## Estado
Pendiente
