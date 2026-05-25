# 01 — Seguridad

## Por qué importa
Una tienda maneja datos personales, direcciones, importes monetarios y credenciales. Un agujero aquí no se traduce solo en datos filtrados — también en fraude, contracargos y demandas.

## Qué se evalúa típicamente
- Reglas de Firestore y Storage (lectura/escritura por colección, cross-tenant).
- Validación de inputs en endpoints (`/api/**`) y en Cloud Functions.
- Manejo de secretos: rotación, scoping, presencia en cliente vs servidor.
- Autenticación: políticas de contraseña, verificación de email, tokens.
- Autorización: claims/roles en cada ruta sensible (admin, pedidos ajenos).
- CSRF, XSS, clickjacking, headers (CSP, X-Frame-Options, HSTS).
- Subida de archivos: tipo, tamaño, contenido malicioso.
- Rate limiting en endpoints públicos (login, register, checkout, contacto).
- Webhooks: verificación de firma (Stripe), idempotencia.
- Dependencias con CVEs (`pnpm audit`).
- OWASP Top 10 (Injection, Broken Access Control, etc.).

## Plan para `pagina`

- [ ] Auditar `firestore.rules` — listar TODAS las colecciones leídas/escritas por el cliente y confirmar que cada operación tiene una regla explícita (no `allow read: if true` salvo donde la colección sea pública: `products`, `categories`, `config/home`).
- [ ] Auditar `storage.rules` — solo admins escriben productos/categorías; usuarios solo su propio avatar (si existe).
- [ ] Listar endpoints en `apps/web/src/app/api/**` y verificar que cada uno:
  - Valida método (POST/GET) correcto.
  - Valida body antes de tocar datos (ya hay `try/catch` en `checkout/session`, ver otros).
  - Verifica auth si la operación requiere usuario.
  - Revalida desde la fuente de verdad (precios, propiedad, stock).
- [ ] Revisar `stripe-server.ts` y el webhook (`/api/stripe/webhook`): firma verificada, idempotencia, manejo de eventos duplicados.
- [ ] Confirmar que `firebase-admin.ts` solo se importa en server (route handlers, Cloud Functions) — nunca desde un client component.
- [ ] Revisar Cloud Functions (`functions/src/**`): cada callable/HTTPS valida auth y datos antes de modificar Firestore.
- [ ] Auditar claims de admin: ¿cómo se asigna un usuario como admin? ¿hay un script o se hace a mano? ¿qué impide a un usuario darse el rol a sí mismo?
- [ ] Cabeceras HTTP: agregar/ajustar `next.config.ts` con `headers()` para CSP, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- [ ] Rate limit en `/api/checkout/session`, `/api/checkout/order-summary`, `/login`, `/register`, `/forgot-password`. Hoy no hay; un atacante puede crear sesiones de Stripe a discreción.
- [ ] Revisar `pnpm audit --prod` y resolver `high`/`critical`.
- [ ] Revisar variables expuestas con `NEXT_PUBLIC_*`: que solo sean keys públicas de Firebase Web (legítimas) y no haya nada que no deba estar ahí.
- [ ] Confirmar que no hay tokens, llaves o `service-account.json` commiteados (`git log --all -p | grep -iE "secret|key|token"` rápido). El `.gitignore` ya excluye `.env*`.

## Cómo ejecutar
- Reglas: leer `firestore.rules` y `storage.rules` línea por línea. Probar con el emulador: `firebase emulators:start --only firestore,storage,auth`.
- Endpoints: `Grep "export async function (POST|GET|PUT|DELETE)" apps/web/src/app/api`.
- Dependencias: `pnpm audit --prod --json | jq '.advisories'`.
- Headers: `curl -I https://pagina-gomu.vercel.app/` y validar contra securityheaders.com.
- CSP: usar [report-uri.com](https://report-uri.com/) o un endpoint propio en modo report-only antes de enforce.

## Notas preliminares
- `STRIPE_SECRET_KEY` no estaba configurado en Vercel (fix de hoy: `9de3596` — el endpoint ahora devuelve 503 limpio en vez de crashear).
- `[CHECKOUT] sesión solicitada` ya hace revalidación de precios desde Firestore. Bien.
- Cupones también se revalidan server-side (`route.ts:153–209`). Bien.
- El email del usuario se pasa desde el cliente al endpoint (`userEmail`). Server lo confía sin verificarlo contra `userId`. Bajo riesgo en MX (Stripe lo usa solo para enviar el recibo), pero anótalo.
- `auth/unauthorized-domain` se manejó agregando el alias en Firebase Console. Verificar que cualquier dominio nuevo (preview branches) entre también, o aceptar que previews no autentican.

## Estado
Pendiente
