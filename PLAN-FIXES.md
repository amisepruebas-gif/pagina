# Plan de fixeo — hallazgos de auditoría (2026-05-20)

> Correcciones de los problemas detectados en la auditoría profunda.
> Se marca ✅ al completar. Cada fase cierra con typecheck + test:rules.

## FASE A — Críticos (seguridad viva + checkout roto)

### A1 — Escalada de privilegios en `users/{uid}` 🔴
- [x] Hecho — rules desplegadas a `pgina-48477`; +5 tests de field-locking
- **Problema**: `allow write: if isOwner(uid)` no restringe campos → un cliente escribe `role:'admin'` en su doc y `syncRoleClaim` lo propaga.
- **Fix**: separar `create`/`update` en `firestore.rules`; el dueño NO puede cambiar `role` ni `active`; solo `isAdmin()` (o el Admin SDK) puede.
- **Deploy**: `firebase deploy --only firestore:rules` inmediato.

### A2 — Checkout roto por límite de metadata de Stripe 🔴
- [x] Hecho — items siempre vía `pendingCheckouts`; webhook refactorizado
- **Problema**: `metadata.itemsJson` excede el límite de 500 chars de Stripe → `sessions.create` falla con carritos de 2+ productos.
- **Fix**: NO usar metadata para los items. Guardar SIEMPRE `orderItems` en `pendingCheckouts/{sessionId}`. El webhook siempre lee de ahí.

## FASE B — Altos

### B1 — OXXO: `async_payment` antes que `completed` 🟠
- [x] Hecho — `createOrderFromSession` reutilizable; `async_payment_succeeded` crea la orden si no existe
- **Problema**: si `async_payment_succeeded` llega antes, crea una orden-fragmento; la idempotencia la bloquea.
- **Fix**: extraer la creación de orden a una función; `async_payment_succeeded` crea la orden completa si no existe.

### B2 — Reglas de reseñas sin validar 🟠
- [x] Hecho — ID determinístico + rating 1-5 + text acotado + `hidden` bloqueado al dueño; +3 tests; rules desplegadas
- **Problema**: ID `{productId}_{userId}` no validado (reseñas ilimitadas), `rating` sin rango, autor revierte `hidden`.
- **Fix**: validar en `firestore.rules` el ID determinístico, rango de rating, longitud de text, e impedir que el dueño cambie `hidden`. Tests + deploy.

### B3 — Webhook: órdenes con ítems mutilados 🟠
- [x] Hecho — flag `needsReview: true` cuando los ítems vienen del fallback de Stripe
- **Problema**: si la reconstrucción de ítems falla, la orden se guarda sin `productId`, como válida y sin alerta.
- **Fix**: marcar la orden con `needsReview: true` cuando los ítems no se pudieron resolver.

## FASE C — Medios

### C1 — `complaints` create no valida `userId` 🟡
- [x] Hecho — `create: if isAuth() && resource.data.userId == auth.uid`; +1 test
- **Fix**: `allow create: if isAuth() && request.resource.data.userId == request.auth.uid`.

### C2 — `orders` update sin field-locking 🟡
- [x] Hecho — staff no puede cambiar `total`/`subtotal`/`discountTotal`/`userId`/`orderNumber`; +1 test
- **Fix**: staff solo puede cambiar estado/paquetería, no los montos ni el dueño.

### C3 — Cupón producto/categoría descuadra carrito vs cobro 🟡
- [x] Hecho — si el server no aplica el cupón, devuelve 400 con error claro
- **Fix**: si el server no puede aplicar el cupón, rechazar el checkout con error claro en vez de cobrar sin descuento.

### C4 — Slug duplicado en Vistas 🟡
- [x] Hecho — `uniqueSlug` en create y update; `getPageViewBySlug` prefiere la activa
- **Fix**: `createPageView` genera slug único; el editor lo normaliza/valida al guardar.

### C5 — `storage.rules` sin límite de tamaño/tipo 🟡
- [x] Hecho — `validImage()`: solo `image/*`, máx 5 MB; storage desplegado
- **Fix**: limitar uploads a imágenes y tamaño máximo.

### C6 — `generateMetadata` filtra borradores de Vistas 🟡
- [x] Hecho — gate `view.active` también en `generateMetadata`
- **Fix**: aplicar el gate `!view.active` también en `generateMetadata`.

---

## Fuera de este plan (bajos / aceptados)
Re-ordenar a precio histórico (el cobro se revalida server-side — solo display), `orderNumber` con colisión teórica, debounce de carrito sin flush, keys por índice en banners, memoización de SearchBar, `aggregateRating` en JSON-LD. Se anotan pero no bloquean.
