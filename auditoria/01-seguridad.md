# 01 — Seguridad

## Por qué importa
Una tienda maneja datos personales, direcciones, importes monetarios y credenciales. Un agujero aquí no se traduce solo en datos filtrados — también en fraude, contracargos y demandas.

## Qué se evalúa típicamente
- Reglas de Firestore y Storage.
- Validación de inputs en endpoints (`/api/**`) y en Cloud Functions.
- Manejo de secretos.
- Autenticación + autorización (roles/claims).
- CSRF, XSS, clickjacking, headers HTTP.
- Subida de archivos.
- Rate limiting.
- Webhooks: verificación de firma + idempotencia.
- Dependencias con CVEs.
- OWASP Top 10.

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

**Reglas Firestore (`firestore.rules`)**
- Deny por defecto al final (`match /{document=**}` → `if false`). Excelente.
- Helpers `isAdmin()` / `isStaff()` / `isOwner()` claros, con fallback claim → doc.
- `users/{uid}` update: el cliente **no puede** cambiar su propio `role` ni `active` (líneas 61-66). Esto bloquea auto-promoción a admin. Crítico, bien resuelto.
- `orders/{id}`:
  - `create: if false` — solo el webhook (Admin SDK) crea órdenes.
  - `update` solo staff y blinda `total`, `subtotal`, `discountTotal`, `userId`, `orderNumber` contra modificación (líneas 86-91). Excelente.
  - `delete: if false`. Bien.
- `reviews`: ID forzado a `{productId}_{uid}` → una reseña por usuario/producto. `validReview()` con rating 1-5 y text ≤ 2000 chars. El usuario no puede tocar `hidden` (campo de moderación).
- `complaints` create: `userId == request.auth.uid` — el cliente no puede abrir queja con `userId` ajeno.
- `counters/`: solo lectura staff, escritura imposible (solo Admin SDK).

**Reglas Storage (`storage.rules`)**
- `validImage()` valida `size < 5 MB` y `contentType` empieza con `image/`. Bien.
- `users/{uid}` solo el dueño escribe.
- Deny por defecto al final.

**Custom claims (`functions/src/index.ts`)**
- `setUserRole` solo invocable por admin verificado (claim + fallback doc). Buen patrón.
- `syncRoleClaim` trigger sobre `users/{uid}` mantiene el claim alineado con el doc. Permite bootstrapping del primer admin editando el doc en consola.
- Validación de `role` contra lista cerrada (`admin | staff | customer`).

**Webhook Stripe (`/api/stripe/webhook`)**
- Verifica firma con `stripe.webhooks.constructEvent(raw, sig, secret)`. **Crítico, bien hecho.**
- Idempotencia: chequea `orders/{sessionId}` antes de crear (línea 181-185).
- Maneja OXXO async (`async_payment_succeeded` / `_failed`) sin duplicar.
- Limpia `pendingCheckouts/{sessionId}` después de crear orden.

**Endpoint checkout session (`/api/checkout/session`)**
- Revalida precios desde Firestore (cliente no decide precio).
- Revalida cupones server-side y aborta si no aplica.
- Items en `pendingCheckouts/{sessionId}` (no en `metadata` que tiene límite de 500 chars).
- Try/catch global con respuesta JSON garantizada (fix `9de3596` de hoy).

**Endpoint order-summary (`/api/checkout/order-summary`)**
- Solo expone campos públicos (orderNumber, total, currency, email).
- Funciona para invitados — Admin SDK bypasea las rules, controla acceso por opacidad del `session_id` (lo tiene solo el comprador).

**Otros**
- `firebase-admin` solo se importa en server (`api/**/route.ts` y `lib/firebase-admin.ts`). No filtra al bundle del cliente.
- `dangerouslySetInnerHTML` solo usado en `components/JsonLd.tsx` con `JSON.stringify` — controlado y necesario para structured data.
- `.env*` no commiteado salvo:
  - `.env.example` (vacío).
  - `apps/web/.env.local.example` (vacío).
  - `apps/web/.env.production` (solo `NEXT_PUBLIC_APP_URL`, valor público).
- `pnpm audit --prod`: 0 high / 0 critical / 3 moderate (transitivas).

### Hallazgos con acción

**🔴 ALTA — `next.config.mjs` no define headers de seguridad**
Solo configura `images.remotePatterns`. Falta clickjacking, MIME sniffing, referrer policy, permissions policy y CSP. Vercel agrega HSTS por default; los demás faltan.
**Fix aplicado** en este commit: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
**Pendiente**: CSP (requiere lista de orígenes para Stripe, Firebase, GA si entra; lo dejamos para iteración aparte porque mal hecha rompe la app).

**🟡 MEDIA — Email del usuario logueado en `console.log`**
`apps/web/src/lib/auth.ts:78` loguea el email completo al solicitar reset de password. Logs de Vercel son privados, pero PII en logs es mal hábito (puede leakearse en bug reports, exports, etc.).
**Fix aplicado** en este commit: quitar el email del log, dejar solo "[AUTH] reset email sent".

**🟡 MEDIA — Sin rate-limit en endpoints públicos**
`/api/checkout/session` y `/api/checkout/order-summary` no tienen límite por IP/sesión. Un bot puede:
- Crear sesiones Stripe ilimitadas → ruido en dashboard, posible cargo si la cuenta pasa de free tier.
- Sondear `order-summary?session_id=…` (riesgo bajo: el id es opaco, ~64 chars random).
Login/register/forgot-password sí los protege Firebase Auth con su rate-limit propio (no es trivial bypassearlo).
**Pendiente** (no aplicado hoy): middleware con rate-limit en memoria (per-instancia) o Upstash Ratelimit (per-edge). Sugerencia: 10 req/min por IP en `/api/checkout/session`. Va al backlog.

**🟡 MEDIA — Dependencias con CVE moderate (transitivas)**
- `postcss <8.5.10` (CVE: XSS via `</style>` unescaped). Es transitive de Next 16. Build-time, riesgo bajo en runtime.
- `uuid <11.1.1` × 3 paths (CVE-2026-41907, buffer bounds). Transitive de `firebase-admin` → `gaxios`. Solo afecta `uuid.v3/v5/v6` con buffer custom — nuestro código no lo invoca.
**Fix aplicado**: `pnpm.overrides` para `postcss` (minor bump seguro). Para `uuid` no fuerzo a v11 porque es major bump dentro de google-auth-library — riesgo de romper firebase-admin. Esperar al próximo bump de firebase-admin.

**🟢 BAJA — `userEmail` del cliente no se valida contra `userId`**
En `/api/checkout/session`, el cliente manda `userEmail`. El servidor lo confía. Un usuario logueado podría mandar el email de otro y Stripe enviará el recibo allí. Riesgo bajo (no exfiltra nada, solo confunde recibos). Mitigación natural: el flujo siempre toma `user.email` del auth state, así que solo un atacante con DevTools manualmente puede manipularlo.
**Pendiente**: en backlog. Cuando `userId` esté presente, leer el email canónico via `getAuth().getUser(userId)` y usar ese.

**🟢 BAJA — `chats/{id}` update no blinda `userId`**
`allow update: if isStaff() || (isAuth() && resource.data.userId == request.auth.uid)` — verifica que el doc actual sea suyo, pero no que el doc nuevo siga siéndolo. El dueño podría reasignar el chat a otro `userId` (regalándoselo). No abre cross-tenant de lectura. Mismo patrón que ya tienes blindado en `orders` y `reviews`.
**Pendiente**: agregar `request.resource.data.userId == resource.data.userId` al `update`. Pequeño cambio. Backlog.

**🟢 BAJA — `apps/web/.env.production` apunta a Firebase Hosting**
`NEXT_PUBLIC_APP_URL=https://pgina-48477.web.app` — pero el deploy real es Vercel (`pagina-gomu.vercel.app`). Vercel inyecta su env var si está configurada; si no, el `.env.production` gana y rompe `success_url`/`cancel_url` de Stripe. Verificar.
No es security, pero lo dejo anotado.

**🟢 BAJA — App Check no activado en cliente**
Hay site key reservada (`NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` en `.env.local.example`) pero no audité el init. App Check filtra clientes no oficiales (bots) en Firestore + Functions. Alto valor para una tienda en producción seria. Backlog.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 1 | 1 | 0 |
| Media | 3 | 2 | 1 (rate-limit) |
| Baja | 3 | 0 | 3 |

Estructura general muy sana — reglas Firestore son de las mejores que he visto en proyectos pequeños (denial-by-default, blindaje de campos sensibles, claims + fallback). Webhook Stripe impecable: firma + idempotencia + items server-side. Lo que falta es la capa perimetral (headers, rate-limit, CSP, App Check) que es backlog clásico para una v1.

## Estado
Hecho — fixes de hoy aplicados (`next.config.mjs` headers + `auth.ts` PII + `postcss` override). Resto en backlog dentro de este mismo archivo.
