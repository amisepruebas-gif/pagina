# 12 — Operaciones y costos

## Por qué importa
Un proyecto que funciona "casi gratis" hoy puede costar miles al mes si una Cloud Function entra en loop, un bot saturó Firestore, o cada visita carga 50 MB de imágenes desde Storage.

## Qué se evalúa típicamente
- Vercel: builds, bandwidth, function invocations.
- Firebase: Firestore reads/writes, Storage egress, Functions invocations.
- Stripe: comisiones por transacción.
- Dominio, email transaccional, observabilidad.
- Alertas de budget.
- Plan adecuado.

---

## Cambios al plan original

Este reporte se queda más en **revisión documental** (no hay fixes técnicos que aplicar sin acceso a las consolas de Vercel/Firebase). Documento estado conocido y acciones que el usuario debe hacer en consolas, no en código.

---

## Hallazgos (auditoría 2026-05-24)

### Estado conocido

**Vercel**
- Plan: Pro ($20 USD/mes según conversación previa).
- Proyecto: `gomu/pagina`, alias estable `pagina-gomu.vercel.app`.
- Auto-deploy: desde `main` (commit `f7fb787` y siguientes lo confirman).
- Env vars necesarias para checkout: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CURRENCY`, `FIREBASE_*` admin SDK. Hoy `STRIPE_SECRET_KEY` no está → checkout devuelve 503 limpio (fix `9de3596`).

**Firebase**
- Proyecto: `pgina-48477`.
- Plan: probablemente Blaze — las scheduled Cloud Functions (`scheduledFirestoreExport`, `sweepOrphanImages`) requieren Blaze. Verificar en consola.
- Reglas Firestore y Storage versionadas en repo (`firestore.rules`, `storage.rules`).

**Stripe**
- Modo: presumiblemente test (no probado). Comisión típica MX: 3.6% + 3 MXN por tarjeta, ~3.5% OXXO. Documentar al fijar precios.

**Costos hoy** (estimación, sin tráfico real):
- Vercel: $20/mes fijo.
- Firebase: cuotas Spark cubren el desarrollo. Blaze: pay-as-you-go, $0-5/mes hasta arrancar.
- Stripe: $0 hasta primera venta.
- GitHub: free.

### Hallazgos con acción

**🟡 MEDIA — Sin alertas de budget configuradas**
Tanto Vercel como GCP permiten alertas por presupuesto. Sin ellas, un loop en una Cloud Function o un bot atacando `/api/checkout/session` 1000 veces/min puede generar factura sorpresa.

**Pendiente** — operaciones (no código):
- Vercel: Settings → Billing → Spend Management → set hard cap si están en plan Pro (función disponible).
- GCP: Console → Billing → Budgets & alerts → crear budget con triggers al 50%, 80%, 100% del gasto mensual previsto.

**🟡 MEDIA — Build cache no aprovechado plenamente (observación)**
En el deploy log que vimos en sesión previa: `Previous build caches not available`. La primera vez es esperable, pero a partir del segundo deploy debería decir "restored from cache". Vigilar en futuros deploys.

**Pendiente** — observar el siguiente deploy y verificar.

**🟡 MEDIA — Firestore reads por visita pueden crecer fast**
Después del fix de ISR en 02-performance, una visita repetida al Home en <1 min NO toca Firestore (servido desde edge). Pero la primera visita después de cada minuto sí. Con tráfico orgánico, esto se contiene.

**Pendiente** — observación: una vez con tráfico real, revisar en Firebase Console → Usage si los reads/día se acercan a los límites.

**🟢 BAJA — Sin email transaccional propio**
Stripe envía el recibo de compra (suficiente para arranque). Si se necesita "tu pedido fue enviado", "tu cuenta fue creada", etc., evaluar:
- **Resend** (3 k emails/mes gratis): simple, SDK Node listo.
- **SendGrid** (100/día gratis).
- **AWS SES** (más barato a escala, más config).

`functions/src/email-functions.ts` existe pero está desactivado según comentario en `functions/src/index.ts:13`.

**Pendiente** — backlog: activar `email-functions` cuando haya producto/eventos lo suficientemente importantes para mandar email transaccional.

**🟢 BAJA — Dominio**
Hoy se accede vía `pagina-gomu.vercel.app`. Cuando se compre dominio propio:
- Comprar con 5+ años de renovación auto.
- Conectar en Vercel (Settings → Domains).
- Actualizar `NEXT_PUBLIC_APP_URL` en env vars.
- Agregar el dominio a Firebase Auth "Authorized domains".
- Actualizar Stripe Checkout redirect URLs.

**🟢 BAJA — Vercel image optimization tiene cost**
Vercel cobra por imagen optimizada al primer uso. Para 1k imágenes/mes son ~$0.01 cada una. Con 5k productos × varios tamaños, puede sumar. Vigilar.

**Pendiente** — observación. Si crece, mover image optimization a Firebase Extensions (Resize Images) o Cloudinary.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 0 | — | — |
| Media | 3 | 0 | 3 (alertas budget, build cache, reads watch) |
| Baja | 3 | 0 | 3 (email, dominio, image cost) |

Esta categoría es más operacional que técnica. Acción concreta más valiosa: **activar alertas de budget en Vercel y GCP** — toma 15 minutos en consolas, evita una factura sorpresa que dolería.

## Estado
Auditado — sin fixes en código (no aplica). Backlog de 6 items, ninguno crítico hoy, todos a actuar en consolas web (Vercel, GCP, Firebase) — no en repo.
