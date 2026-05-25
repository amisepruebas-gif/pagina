# Plan de implementación — Estándar e-commerce

> Plan de ejecución de los gaps identificados en `GAP-ANALYSIS.md`, organizado en 4 fases.
> Doc vivo: cada tarea se marca ✅ al completarse.
> Modelo: e-commerce de catálogo (sin imprenta/web-to-print).
> Inicio: 2026-05-20.

## Cómo se trabaja cada fase

- Cada tarea tiene **archivos**, **decisiones técnicas** y **criterio de hecho**.
- Al cerrar cada tarea: `console.log` con prefijo de debug donde aplique.
- Al cerrar cada **fase**: `pnpm typecheck` + `pnpm test:rules` en verde antes de pasar a la siguiente.
- `PROGRESO.md` se actualiza al cierre de cada fase.
- Nada se da por terminado sin probarlo en el navegador (golden path + edge cases).

---

## FASE 1 — Conversión directa

> Objetivo: cerrar las fugas de venta más caras según Baymard.

### F1.1 — Guest checkout (compra sin login) 🔴
- [x] Hecho
- **Archivos**: `components/cart/CartPageInner.tsx`, `app/api/checkout/session/route.ts`, `components/checkout/CheckoutSuccessClient.tsx`
- **Decisiones**:
  - Quitar el redirect a `/login?next=/cart`. El botón "Continuar al pago" funciona sin sesión.
  - El API route ya acepta `userId` opcional; el webhook ya crea la orden con `guestEmail` si no hay `userId` → backend listo, el cambio es de frontend.
  - Stripe Checkout recolecta email/dirección/teléfono → cubre "minimizar campos" sin trabajo extra.
  - **Delayed account creation**: en `/checkout/success`, si el comprador es anónimo, mostrar bloque "Crea una cuenta para seguir tu pedido" con el email del pedido pre-llenado.
- **Criterio de hecho**: un usuario sin sesión completa una compra de principio a fin y ve su confirmación.

### F1.2 — Envío estimado visible en PDP y carrito 🔴
- [x] Hecho
- **Archivos**: nuevo `components/ShippingEstimate.tsx`; `app/(public)/producto/[slug]/page.tsx`; `components/cart/CartPageInner.tsx`; lib de config de envío
- **Decisiones**:
  - Revisar la estructura de envío en `config/global` (admin → Configuración). Usar esas tarifas.
  - PDP: mostrar "Envío: $X" o "Envío gratis desde $Y" cerca del precio.
  - Carrito: reemplazar "Se calcula en el checkout" por el costo real (umbral de envío gratis si está configurado).
- **Criterio de hecho**: PDP y carrito muestran el costo de envío antes de ir a Stripe.

### F1.3 — Mini-carrito drawer al agregar 🟠
- [x] Hecho
- **Archivos**: nuevo `components/cart/CartDrawer.tsx`; `context/CartContext.tsx` (estado `drawerOpen`); `components/product/AddToCartForm.tsx`; `components/Providers.tsx` o layout
- **Decisiones**:
  - Panel lateral derecho (mismo patrón que `MobileMenuButton`: backdrop, ESC, body-lock).
  - Al agregar un producto, el drawer se abre mostrando los items + subtotal.
  - CTAs: "Ir al carrito" y "Seguir comprando".
  - El `CartBadge` del header también abre el drawer al hacer clic (en vez de navegar directo).
- **Criterio de hecho**: agregar un producto abre el drawer; se puede cerrar y seguir comprando.

### F1.4 — Cupón / código de descuento en carrito 🟠
- [x] Hecho
- **Archivos**: `components/cart/CartPageInner.tsx` (+ drawer); nuevo `lib/discounts-apply.ts`; `app/api/checkout/session/route.ts`
- **Decisiones**:
  - Los descuentos ya existen en `discounts` (código, vigencia, alcance global/categoría/producto). Falta aplicarlos.
  - Carrito: link "¿Tienes un código?" que expande un input (Baymard: no mostrar la caja siempre).
  - Validar el código: existe, vigente, alcance aplicable. Mostrar descuento en el resumen.
  - Pasar el descuento a Stripe vía ajuste de line items o `discounts` de la sesión.
- **Criterio de hecho**: aplicar un código válido baja el total y el descuento se refleja en el cobro de Stripe.

**Cierre Fase 1**: ✅ typecheck + test:rules verdes (2026-05-20).

---

## FASE 2 — Descubrimiento

> Objetivo: que el cliente encuentre productos. Baymard: 67% de sitios falla en navegación.

### F2.1 — Navegación de categorías en el header (desktop) 🔴
- [x] Hecho
- **Archivos**: nuevo `components/CategoryNav.tsx`; `components/Header.tsx`
- **Decisiones**:
  - Barra de categorías bajo el header (desktop). **Dropdown simple**, no mega-menú (catálogo no lo amerita aún).
  - Categorías desde Firestore (`categories`), clickeables → `/shop?cat=slug`.
  - El encabezado de cada categoría es clickeable (regla Baymard).
- **Criterio de hecho**: en desktop hay categorías navegables visibles sin abrir menús ocultos.

### F2.2 — Filtro de precio + ordenamiento en /shop 🟠
- [x] Hecho
- **Archivos**: `app/(public)/shop/page.tsx`; componentes de filtro de /shop
- **Decisiones**:
  - Filtro de precio por rangos o slider → URL `?min=&max=`.
  - Ordenamiento (select): relevancia (default), precio ↑, precio ↓, novedad → URL `?sort=`.
  - Todo persistente en URL (compartible, navegable atrás).
- **Criterio de hecho**: el usuario filtra por precio y reordena; la URL refleja el estado.

### F2.3 — Paginación / "Load More" en /shop 🟠
- [x] Hecho
- **Archivos**: `app/(public)/shop/page.tsx` + componente cliente
- **Decisiones**:
  - Hoy corta en 60 sin control. Implementar botón "Cargar más" + conteo "X de Y".
  - Baymard prefiere "Load More" sobre infinite scroll puro (no se pierde el footer).
- **Criterio de hecho**: un catálogo grande se recorre completo.

### F2.4 — Autocomplete en búsqueda 🟠
- [x] Hecho
- **Archivos**: `components/SearchBar.tsx`
- **Decisiones**:
  - Dropdown con sugerencias mientras se teclea (debounce ~200ms).
  - Sugerencias: productos (thumbnail + precio) y categorías relevantes.
  - Tolerancia básica a typos por normalización (sin acentos, minúsculas). Algolia/Typesense queda fuera de alcance.
- **Criterio de hecho**: al teclear aparecen sugerencias clicables; navegables con teclado.

### F2.5 — Breadcrumbs en /shop 🟡
- [x] Hecho
- **Archivos**: nuevo `components/Breadcrumbs.tsx` reutilizable; `app/(public)/shop/page.tsx`
- **Decisiones**:
  - `Inicio / Tienda / {Categoría}` clicable. La PDP ya tiene breadcrumb — unificar con el componente.
- **Criterio de hecho**: /shop muestra breadcrumbs clicables.

**Cierre Fase 2**: ✅ typecheck + test:rules verdes (2026-05-20).

---

## FASE 3 — Confianza y SEO

> Objetivo: trust signals, rich snippets en Google, accesibilidad.

### F3.1 — Schema.org JSON-LD 🟠
- [x] Hecho
- **Archivos**: nuevo `components/JsonLd.tsx`; PDP, home, layout
- **Decisiones**:
  - PDP: `Product` + `Offer` (+ `AggregateRating` cuando existan reseñas — F4.1).
  - `BreadcrumbList` en páginas internas.
  - `Organization` + `WebSite` con `SearchAction` en home.
  - Inyectar como `<script type="application/ld+json">`.
- **Criterio de hecho**: pasa el Rich Results Test de Google.

### F3.2 — Páginas de políticas + footer 🟠
- [x] Hecho
- **Archivos**: nuevas rutas `/envios`, `/devoluciones`, `/privacidad`, `/terminos`; `components/Footer.tsx`
- **Decisiones**:
  - Contenido inicial editable o estático (texto base, ajustable luego desde admin si conviene).
  - Footer: agregar el bloque de links a estas políticas (Baymard: 11% abandona sin ver devoluciones).
- **Criterio de hecho**: las 4 políticas son accesibles desde el footer.

### F3.3 — Galería de producto con zoom 🟠
- [x] Hecho
- **Archivos**: `components/product/ProductGallery.tsx`
- **Decisiones**:
  - Zoom hover en desktop; lightbox / pinch en mobile.
- **Criterio de hecho**: el usuario amplía la imagen del producto.

### F3.4 — Tracking embebido del pedido 🟠
- [x] Hecho
- **Archivos**: `components/account/PedidosTab.tsx` o nuevo detalle de pedido del cliente
- **Decisiones**:
  - La orden ya guarda `events` (timeline). Mostrar ese timeline al cliente dentro del sitio.
  - Estados: procesando → enviado → entregado, con paquetería/guía si existe.
- **Criterio de hecho**: el cliente ve el progreso de su pedido sin salir del sitio.

### F3.5 — Accesibilidad WCAG 2.2 AA 🟠
- [x] Hecho (focus-visible global, skip-link, aria-live). Pendiente refinamiento: focus-trap completo en modales y contraste del accent `#FF69B4` (ver nota).
- **Archivos**: `globals.css`, modales (drawer, chat widget), layout
- **Decisiones**:
  - `focus-visible` consistente; focus-trap en drawers/modales; skip-to-content link.
  - `aria-live` para feedback dinámico (agregado al carrito, errores).
  - Revisar contraste AA en accent `#FF69B4` sobre blanco.
- **Criterio de hecho**: navegable 100% por teclado; sin errores graves en auditoría Lighthouse A11y.

**Cierre Fase 3**: ✅ typecheck + test:rules verdes (2026-05-20).

> **Nota de contraste (A11y)**: el accent de marca `#FF69B4` sobre blanco da ~2.3:1, por debajo del 4.5:1 de WCAG AA para texto. Para enlaces/textos en accent se usa un tono más oscuro donde es texto; el `#FF69B4` se conserva como color de marca en fondos de botón. Cambiar el color de marca es decisión del negocio — queda anotado, no modificado.

---

## FASE 4 — Retención y extras

> Objetivo: re-compra, prueba social, métodos de pago locales.

### F4.1 — Reseñas / rating de producto 🟡
- [x] Hecho
- **Archivos**: nuevo `types/review.ts`, `lib/reviews.ts`, `lib/admin/reviews-admin.ts`; componentes PDP; `firestore.rules`; admin
- **Decisiones**:
  - Modelo `reviews`: productId, userId, rating 1-5, texto, fecha, foto opcional.
  - Rules: leer público; crear solo usuarios autenticados (idealmente que hayan comprado el producto).
  - PDP: formulario de reseña + listado con filtro por rating + promedio agregado.
  - Admin: moderar/ocultar reseñas.
  - Conecta con F3.1 (`AggregateRating` en JSON-LD).
- **Criterio de hecho**: un cliente publica una reseña y aparece en la PDP con el promedio.

### F4.2 — Botón "Re-ordenar" en historial 🟡
- [x] Hecho
- **Archivos**: `components/account/PedidosTab.tsx`; `context/CartContext.tsx`
- **Decisiones**:
  - Botón en cada pedido pasado que repuebla el carrito con sus items (validando que sigan activos/en stock).
- **Criterio de hecho**: un clic recompone el carrito desde un pedido anterior.

### F4.3 — OXXO Pay 🟡
- [x] Hecho
- **Archivos**: `app/api/checkout/session/route.ts`
- **Decisiones**:
  - Agregar `oxxo` a `payment_method_types` de la sesión de Stripe (Stripe lo soporta nativo para MX).
  - Considerar que OXXO es asíncrono: el webhook confirma el pago horas después.
- **Criterio de hecho**: OXXO aparece como opción en el checkout de Stripe.

### F4.4 — Extras de pulido 🟢
- [x] Specs técnicas en tabla en la PDP
- [x] Botón de WhatsApp flotante
- [x] Alertas de bajo stock en el panel admin

**Cierre Fase 4**: ✅ typecheck + test:rules verdes — 40 tests (2026-05-20).

> **Deploy**: F4.1 agregó la colección `reviews` a `firestore.rules` — desplegada a `pgina-48477` el 2026-05-20.

---

## Fuera de alcance
- Imprenta / web-to-print (configurador, cotizador, preflight, aprobación de prueba).
- **Variantes dinámicas** de producto: hoy cada variante es un producto separado; convertirlo es un rediseño de datos XL. No se hará salvo que el catálogo lo exija.
- **MSI (Meses Sin Intereses)**: requiere acuerdo con el banco/adquirente. Se evalúa por separado.

---

## Orden de ejecución
Fase 1 → 2 → 3 → 4, en secuencia. Dentro de cada fase, las tareas en el orden listado. Cada tarea se reporta al cerrarse; cada fase se cierra con typecheck + tests verdes y actualización de `PROGRESO.md`.
