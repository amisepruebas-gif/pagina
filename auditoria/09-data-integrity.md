# 09 — Integridad de datos (Firestore)

## Por qué importa
En un e-commerce los datos cuentan plata: stock, precios, pedidos, descuentos. Una transacción que falla a medias o una doble escritura por dos clientes simultáneos puede vender producto que no existe o cobrar mal.

## Qué se evalúa típicamente
- Validación de schemas (cliente + rules + functions).
- Transacciones para operaciones multi-doc.
- Idempotencia (webhook puede llegar dos veces).
- Race conditions.
- Migraciones de schema.
- Defaults para campos nuevos en docs antiguos.
- TTL para datos efímeros.
- Composite indexes en `firestore.indexes.json`.

---

## Cambios al plan original

- El plan inicial incluía "Carritos abandonados — Cloud Function sweep". **Ya existe**: `functions/src/sweep-images.ts` (sweep diario de imágenes huérfanas en Storage). Lo de cart sweep sigue siendo backlog si hay growth real de `pendingCheckouts` o `carts/{uid}`.
- El plan incluía "Backup periódico" — esa pieza la cubre 11-backup-recovery.md, y descubrí que `scheduledFirestoreExport` ya está implementado.

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

**Webhook Stripe idempotente** — ya cubierto en 01-seguridad:
- Verifica firma.
- Chequea `orders/{sessionId}.exists` antes de crear.
- Maneja `async_payment_succeeded` y `_failed` por si llegan fuera de orden.

**Cleanup automático**
- `sweepOrphanImages` (Cloud Function scheduled, diaria 04:00 CDMX) borra imágenes en `uploads/` no referenciadas por ningún doc Firestore. Conservador: solo borra archivos >24h.
- Lee referencias de `products`, `vistas`, `config/home`, `siteContent`, `categories`. Cobertura sólida.
- `pendingCheckouts/{sessionId}` se borra al crear orden en webhook o al fallar OXXO.

**Defaults para docs antiguos**
- `mergeHomeConfig` y `mergePromoBanner` en `lib/home-config.ts` hacen spread con defaults — los campos nuevos del schema caen al default sin migración explícita.
- Patrón replicable: cualquier lectura de Firestore debería hacer `{ ...default, ...rawDoc }` y nunca confiar en que todos los campos existen.

**Timestamps consistentes**
- `FieldValue.serverTimestamp()` usado en webhook (`createdAt`, `updatedAt`, `paidAt`). Bien.

### Hallazgos con acción

**🔴 ALTA — No hay decremento atómico de stock**
- Búsqueda `stock` en `apps/web/src/app/api/**` → 0 matches. Ni el endpoint de checkout ni el webhook tocan stock.
- Política implícita: el cliente revisa stock en el momento de agregar al carrito; el server lo ignora.
- **Race condition**: dos clientes con el último stock de un SKU bajo (stock=1) pueden ambos completar checkout simultáneamente; ambos cobros pasan, oversell garantizado.
- **Cuándo importa**: cuando hay SKU con stock bajo o demanda alta (drop, sale, edición limitada). Para una tienda nueva con catálogo amplio y stock holgado, riesgo limitado.

**Pendiente** (no aplico hoy — requiere decisión de diseño):
- Opción A — **decrementar en webhook** (al `checkout.session.completed`):
  - Transacción Firestore: leer producto + verificar `stock >= qty` + decrementar con `FieldValue.increment(-qty)`.
  - Si stock no alcanza al llegar el webhook: marcar orden `needsReview=true`, notificar al cliente y al admin para resolver (reembolso, ajuste, sustitución).
- Opción B — **reservar al crear sesión** (en `/api/checkout/session`):
  - Decrementar stock al crear la sesión Stripe.
  - Liberar al detectar `expired` (Stripe TTL de 24h) o `payment_failed`.
  - Complejo porque hay que escuchar más eventos.
- Recomendación: A es más simple y suficiente para el 90% de los casos. B solo si los productos son "drops" virales donde stock se agota en minutos.

**🔴 ALTA — `firestore.indexes.json` está vacío**
```json
{ "indexes": [], "fieldOverrides": [] }
```
Sin indexes declarados en repo. Si hay queries compuestas (filter + orderBy, varios filters), Firestore propone los indexes desde Console al primer fallo en runtime — pero quedan solo en el proyecto de producción, no en el código.

**Riesgos**:
- Deploy a un proyecto nuevo (test, staging, after disaster recovery) → queries fallan hasta crear los indexes uno por uno desde Console.
- Cambios en queries en una PR no se validan contra los indexes existentes.

**Queries probables que necesitan indexes** (revisar):
- `discounts` con `where('active','==',true) + where('validFrom','<=',now)`.
- `products` con filtros compuestos en `/shop` o admin.
- `orders` con `where('userId','==',uid) + orderBy('createdAt','desc')`.
- `chats` con `where('userId','==',uid) + orderBy('updatedAt','desc')`.

**Pendiente** (backlog, no aplico hoy):
- Listar las queries que el código ejecuta hoy (grep `where(` + `orderBy(`).
- Para cada compuesta, declarar el index en `firestore.indexes.json`.
- Deploy con `firebase deploy --only firestore:indexes`.

**🟡 MEDIA — Sin validación runtime de inputs (solo TypeScript)**
- `apps/web/src/app/api/checkout/session/route.ts` valida `items[].productId` y `qty` ad-hoc con `if (...) return 400`.
- No hay schema parser (Zod, Yup, Valibot). TypeScript valida en compile; el runtime confía.
- En `/api/checkout/session`, una request con `qty: -5` que pase TypeScript pero rompa la lógica caería al `try/catch` global con error inesperado.

**Pendiente** (backlog):
- Agregar Zod a `dependencies` (~6KB gzipped) y validar los bodies de endpoints en server. Genera errores claros para el cliente.
- Mismo patrón para Cloud Functions callable.

**🟢 BAJA — Schemas no documentados centralmente**
Los tipos viven en `apps/web/src/types/**.ts` pero no hay un doc que diga "cada doc de `orders` tiene X campos, con esta semántica". Para alguien que entra al proyecto, requiere leer 5-6 archivos.

**Pendiente** — backlog: agregar un `docs/schemas.md` (o un comentario tope en cada archivo de tipos) con el shape del doc + significado de cada campo.

**🟢 BAJA — `pendingCheckouts/{sessionId}` puede crecer**
- Si Stripe nunca dispara el webhook (clave mal configurada, evento perdido), el doc queda colgado para siempre.
- Mitigación parcial: al `async_payment_failed`, sí se borra (vi en webhook). Pero los casos donde el cliente cierra la pestaña antes de pagar no disparan nada.

**Pendiente** — backlog: Cloud Function scheduled (semanal) que borre `pendingCheckouts` con `createdAt > 7 días` y sin orden asociada.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 2 | 0 | 2 (stock atómico, indexes) |
| Media | 1 | 0 | 1 (Zod runtime validation) |
| Baja | 2 | 0 | 2 (docs de schemas, sweep pendingCheckouts) |

Ninguno se fixea en esta sesión: stock atómico requiere decisión de política, indexes requiere análisis de queries específicas, Zod requiere refactor de validación en endpoints. Todo va al backlog con planes detallados.

La estructura actual es razonable para una tienda en arranque, pero los dos hallazgos altos (stock, indexes) se vuelven críticos rápido en cuanto haya tráfico real.

## Estado
Auditado — sin fixes hoy. Backlog claro de 5 items, 2 críticos para producción seria.
