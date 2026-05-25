# Mapeo de lógica real del Admin

Referencia para integrar el diseño de Claude Design al admin sin perder lógica.
Generado por agentes de exploración. Patrón general: `page.tsx` = server (thin
wrapper o carga datos), componentes `*Client`/`*Form` = `'use client'`.

## Catálogo (A8.2)

**Productos** — `productos/{page,nuevo,[id]}`. Lee `getProducts`, `getCategories`,
`getSubcategories`, `getMaterials`, `getTags`. Escribe `createProduct`,
`updateProduct`, `setProductActive` (`@/lib/admin/products-admin`),
`uploadImage` (`@/lib/admin/uploads`). Crear → redirige a `/admin/productos/{id}`.

**Categorías** — `categorias/{page,nuevo,[id]}`. Lee `getCategories`,
`getCategoryById`. Escribe `createCategory`, `updateCategory`,
`setCategoryActive` (`@/lib/admin/categories-admin`).

**Taxonomías** — `taxonomias/page` con tabs (Subcategorías/Materiales/Tags),
todo inline en una página. `onSnapshot` a `subcategories`/`materials`/`tags`.
Escribe `create*`/`update*`/`delete*` + `setActiveOn` (`@/lib/admin/taxonomies-admin`).

**Descuentos** — `descuentos/{page,nuevo,[id]}`. Lee `getDiscounts`,
`getDiscountById`. Escribe `createDiscount`, `updateDiscount`,
`setDiscountActive` (`@/lib/admin/discounts-admin`). Discount: `{name, code?,
type:'global'|'category'|'product', categoryId?, productId?, percentage,
season?, validFrom?, validUntil?, active}`.

## Operación (A8.3)

Todas: `page.tsx` thin wrapper → componente `'use client'`, lecturas con
`onSnapshot` (tiempo real).

**Pedidos** — `OrdersClient` / `OrderDetailClient`. Colección `orders` +
`orders/{id}/events`. Escribe `setOrderStatus`, `setFulfillment`,
`setPaymentStatus` (`@/lib/admin/orders-admin`).

**Chats** — `ChatsClient` / `ChatThreadClient`. Colección `chats` +
`chats/{id}/messages`. Escribe `sendStaffMessage`, `markChatReadByStaff`,
`setChatStatus` (`@/lib/admin/chats-admin`).

**Quejas** — `ComplaintsClient` / `ComplaintDetailClient`. Colección
`complaints`. Escribe `setComplaintStatus`, `resolveComplaint`
(`@/lib/admin/complaints-admin`).

**Tipos de queja** — `ComplaintTypesManager`. Colección `complaintTypes`.
`create/update/delete/setActive ComplaintType` (`@/lib/admin/complaint-types-admin`).

**Reseñas** — `ReviewsClient`. Colección `reviews`. `setReviewHidden`,
`deleteReview` (`@/lib/admin/reviews-admin`). `normalizeReview` de `@/lib/reviews`.

## Configuración (A8.4)

**Configuración** — `configuracion/page` → `ConfigForm`. `getConfig` /
`saveConfig` (`@/lib/admin/config-admin`). Doc único `config/global`.
SiteConfig: `{shipping, branding, contact, social}`.

**Contenido** — `contenido/{page,nuevo,[id]}` + `SiteContentForm`,
`SiteContentTableActions`. Colección `siteContent`. `getSiteContents`,
`getSiteContentById`, `createSiteContent`, `updateSiteContent`,
`setSiteContentActive` (`@/lib/admin/site-content-admin`). kinds: hero /
promo-banner / topbar.

**Vistas** — `vistas/{page,[id]}` + `PageViewsClient`, `PageViewEditor`,
`ProductMultiPicker`. Colección `vistas` (`onSnapshot`). `createPageView`,
`updatePageView`, `deletePageView` (`@/lib/admin/page-views-admin`).

**Usuarios** — `UsersClient`, `UserRowActions`. Colección `users` (`onSnapshot`).
`setUserRole`, `setUserActive` (`@/lib/admin/users-admin`).

**Reportes** — `ReportesClient`. `onSnapshot` paralelo a `orders`/`products`/
`users`, KPIs en `useMemo`. Read-only.
