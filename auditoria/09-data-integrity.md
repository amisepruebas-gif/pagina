# 09 — Integridad de datos (Firestore)

## Por qué importa
En un e-commerce los datos cuentan plata: stock, precios, pedidos, descuentos. Una transacción que falla a medias o una doble escritura por dos clientes simultáneos puede vender producto que no existe o cobrar mal.

## Qué se evalúa típicamente
- Validación de schemas en la capa del cliente Y en reglas Firestore Y en Functions.
- Transacciones para operaciones que tocan varias docs (descontar stock + crear pedido).
- Operaciones idempotentes (webhook puede llegar dos veces — no debe duplicar).
- Race conditions: dos clientes restando el último stock al mismo tiempo.
- Migraciones para cambios de schema: cómo se actualizan docs viejos.
- Defaults para campos nuevos en docs antiguos (merge en el lector).
- Soft delete vs hard delete y filtros en lectura.
- Backups periódicos (ver `11-backup-recovery.md`).
- TTL para datos efímeros (sessions, carts huérfanos).
- Index hints — Firestore exige composite indexes para queries con `where + orderBy`.

## Plan para `pagina`

- [ ] Listar todas las colecciones tocadas: `Grep "collection\('"` en `apps/web/src/lib` y `functions/src`. Cruzarlas contra `firestore.rules` (audita seguridad pero también schema).
- [ ] Definir un schema mental para cada colección principal:
  - `products`: `name, slug, price, stock, active, images[], categoryId, subcategoryId, tags[], description, sku, createdAt, updatedAt`.
  - `orders`: `userId, items[], subtotal, shipping, discount, total, status, stripeSessionId, createdAt`.
  - `carts/{uid}`: `items[], updatedAt`.
  - `discounts`: `code, type, percentage, productId?, categoryId?, validFrom, validUntil, active`.
  - `siteContent`: `kind, page, order, active, validFrom, validUntil, ...` (ya está bien tipado).
  - `config/home`: estructura `HomeConfig` (ya está bien con merge).
  - `pendingCheckouts/{sessionId}`: `items, userId, createdAt` (vi en route.ts).
- [ ] **Webhook de Stripe (`/api/stripe/webhook`)** — caso crítico:
  - ¿Verifica firma? (probable, revisar).
  - ¿Es idempotente? Si Stripe reenvía el mismo `checkout.session.completed`, no debe crear dos `orders`. Solución: usar `event.id` como id del doc o un campo `processedEvents[]`.
  - ¿Actualiza stock atomically con `FieldValue.increment(-qty)`?
  - ¿Marca `pendingCheckouts/{sessionId}` como `consumed` para limpieza?
- [ ] **Stock**: ¿se descuenta antes o después de pagar? Si antes, hay que liberar al cancelar/timeout. Si después (en el webhook), hay riesgo de oversell entre que el cliente "compra" y el webhook llega. Confirmar la política y documentarla.
- [ ] **Cupones**: hoy `discounts` se valida server-side al crear sesión (bien). ¿Hay límite de usos? ¿Por usuario? Si sí, registrar uso en webhook.
- [ ] **Carritos abandonados**: `pendingCheckouts` y `carts/{uid}` crecen sin límite. Cloud Function `sweep` que borre los > 30 días.
- [ ] **Imágenes huérfanas en Storage**: memory menciona Phase A (`useImageCleanup`) + Phase B (`sweepOrphanImages` scheduled function). Verificar que está activa.
- [ ] **Migraciones** de schema: cuando se agregue/cambie un campo, el merge default debe cubrir docs antiguos. Patrón ya aplicado en `mergeHomeConfig`, `mergePromoBanner`. Extender a otras lecturas.
- [ ] **Composite indexes**: cuando una query falla con "needs an index", Firestore propone el comando. Listar todos en `firestore.indexes.json` y commitearlo. Revisar si está al día.
- [ ] **Timestamps consistentes**: `createdAt` y `updatedAt` en cada doc, usar `FieldValue.serverTimestamp()` siempre.

## Cómo ejecutar
- Reglas + emulador: `firebase emulators:start --only firestore` y suite de tests.
- Para race conditions: simular con `Promise.all` haciendo 10 add-to-cart del último stock disponible.
- Stripe local: `stripe listen --forward-to localhost:3030/api/stripe/webhook` y `stripe trigger checkout.session.completed`.
- Backups: ver `11-backup-recovery.md`.

## Notas preliminares
- `mergePromoBanner` y `mergeHomeConfig` ya manejan defaults para docs viejos (excelente).
- `pendingCheckouts/{sessionId}` se crea en `/api/checkout/session`, no limpieza obvia.
- `sweepOrphanImages` (Cloud Function scheduled) — memoria lo menciona como desplegado.
- Memory: backend Express/Prisma/MySQL existe en otro repo (`gomux_backend-main`); `pagina` es Firebase-only — no mezclar.

## Estado
Pendiente
