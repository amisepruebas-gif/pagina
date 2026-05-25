# PROGRESO — pagina

Doc vivo. Cada turno se actualiza marcando ✅ lo entregado y agregando bloqueos nuevos.

## ✅ Cimientos (Fase A)

- [x] Monorepo pnpm con `apps/web` (Next.js 16 + React 19 + TS strict + Tailwind) y `functions` (TS gen 2)
- [x] Firebase project `pgina-48477` (Spark) provisionado
- [x] Authentication habilitado (Email/Password + Google)
- [x] Firestore (modo Production, us-central1)
- [x] Storage (us-central1)
- [x] `firestore.rules` cerradas por defecto, deployadas
- [x] `storage.rules` con scopes por path, deployadas
- [x] Smoke test `/test` valida read end-to-end

## ✅ Storefront público (Fase B)

- [x] B.1 Marco visual: fonts Inter + Poppins, Topbar, Header (sticky), Footer
- [x] B.2 Home estático: Hero, ShopByCategory, ProductSections, PromoBanners
- [x] B.3 Home + `/shop` conectados a Firestore (con normalizador tolerante)
- [x] B.4 `/producto/[slug]` con galería + bulk pricing + add-to-cart UI
- [x] B.5 `/search?q=` con búsqueda in-memory multi-término

## ✅ Auth (Fase C — parte sin checkout)

- [x] Email/password registro + login
- [x] Google sign-in
- [x] AuthContext (`onAuthStateChanged` + sub a `users/{uid}`)
- [x] `/login`, `/register`, `/mi-cuenta` (protegida)
- [x] AccountMenu en header con dropdown
- [x] Doc `users/{uid}` creado en signup (idempotente)
- [x] Errores Firebase mapeados a mensajes en español

## ✅ Mi cuenta (Fase D)

- [x] 4 tabs vía `?tab=` (perfil, pedidos, favoritos, direcciones)
- [x] Perfil editable (displayName, phone) → sincroniza Auth + Firestore
- [x] FavoriteButton (corazón) en ProductCard
- [x] Lib `favorites` (`users/{uid}/favorites/{productId}`)
- [x] DireccionesTab CRUD con setDefault (batch para clear otros)
- [x] PedidosTab live: onSnapshot a orders por userId, cards con thumb/total/status

## ✅ Carrito UI (sin checkout)

- [x] CartContext + localStorage (key `pagina_cart_v1`)
- [x] Cross-tab sync via `storage` event
- [x] CartBadge dinámico en header
- [x] `/cart` con line items, controles qty, totales, sticky summary
- [x] AddToCartForm conectado con feedback "Agregado ✓"
- [x] Botón checkout conectado a Stripe Checkout (redirige a Stripe-hosted page)

## ⛔ Personalizar IA — ELIMINADO (2026-05-20)

Feature removida por decisión del usuario: generador de llaveros `/personalizar`,
admin `/admin/personaliza`, API Gemini, libs, tipos, rules (`aiEntries`,
`aiGenerations`) y storage `ai-entries`. También se quitó "Prompts IA"
(`aiPrompts`) y la sección "IA" de Configuración.

## Admin

- [x] AdminGate (gate UX por rol) + rules fallback a `users/{uid}.role`
- [x] Layout admin con sidebar
- [x] Dashboard con 4 stats
- [x] Productos CRUD (list, new, edit, toggle active)
- [x] Categorías CRUD (con preview de gradient/imagen)
- ⛔ ~~Personaliza (aiEntries)~~ — eliminado 2026-05-20
- ⛔ ~~Galería~~ — eliminada 2026-05-20. Las imágenes se suben desde el equipo local (ver ImageInput).
- [x] Usuarios (listar, búsqueda, filtros, cambiar rol inline, activar/desactivar, banner "tú")
- [x] Subcategorías + Etiquetas + Materiales en `/admin/taxonomias` (inline editor con tabs)
- [x] Descuentos CRUD (global / categoría / producto + vigencia + código). Aplicación al precio pendiente — viene con Stripe.
- [x] `siteContent` — Hero, banners promocionales y topbar editables (storefront cae a hardcode si está vacío)
- [x] **Vistas** — constructor de landing pages dinámicas (`/v/[slug]`). Admin `/admin/vistas` con editor de módulos (reordenar ↑↓, visible, agregar/quitar). 6 tipos: carrusel, productos, sección promocional (colores + badge + countdown regresivo), banners, categorías, video. Colección `vistas`, rules desplegadas, en sitemap.
- [x] Configuración global (`config/global`): branding, envío, contacto, social. Footer wired con social + nombre.
- ⛔ ~~`aiPrompts` — biblioteca de prompts~~ — eliminado 2026-05-20
- [x] Pedidos admin: list con filtros, detail con event timeline, status changer, paquetería. UI lista para Stripe.
- [x] Reportes: KPIs (revenue, AOV, pedidos, clientes), chart 30d con CSS bars, top productos, distribución por status
- [x] Chat admin: inbox con filtros/búsqueda/unread badges, thread vivo con bubble messages, reply textarea, abrir/cerrar
- [x] Chat widget cliente: floating button con unread badge, panel con new chat form o thread, sync vivo, auto-marca leído al abrir
- [x] Quejas + reembolsos: tipos catalogados, admin list+detail con resolver + monto de reembolso, mi-cuenta tab para crear y ver propias.

## Estándar e-commerce (ver GAP-ANALYSIS.md + PLAN-IMPLEMENTACION.md)

- [x] **Fase 1 — Conversión** (2026-05-20): guest checkout (compra sin login + delayed account creation), envío estimado visible en PDP/carrito + cobrado en Stripe, mini-carrito drawer, cupón de descuento en carrito (global/product/category, re-validado server-side).
- [x] **Fase 2 — Descubrimiento** (2026-05-20): nav de categorías clickeables en header (desktop), filtro de precio + ordenamiento en /shop (URL-persistente), "Cargar más" + conteo, autocomplete de búsqueda (productos+categorías, navegable por teclado, tolerancia a typos), breadcrumbs unificados en /shop y PDP.
- [x] **Fase 3 — Confianza/SEO** (2026-05-20): Schema.org JSON-LD (Product/Offer/BreadcrumbList en PDP, Organization/WebSite+SearchAction en home), páginas de políticas (/envios /devoluciones /privacidad /terminos) + links en footer, galería con zoom hover + lightbox, tracking embebido del pedido (stepper de estados), A11y (focus-visible global, skip-link, aria-live).
- [x] **Fase 4 — Retención** (2026-05-20): reseñas/rating (colección `reviews`, PDP con formulario+listado+promedio, admin para moderar, rules + 8 tests), botón re-ordenar en historial, OXXO Pay (Stripe + webhook con pago asíncrono), specs en tabla en PDP, WhatsApp flotante, alertas de bajo stock en admin.
  - Rules de `reviews` desplegadas a `pgina-48477`.

## Storefront — mejoras pendientes

- [x] `ImageInput` sube imágenes desde el equipo local: file picker → sube a Storage `uploads/` → al sustituir borra la imagen anterior; al quitar la elimina. Usado en ProductForm, CategoryForm, SiteContentForm, PageViewEditor.
- [x] Wire taxonomías en ProductForm: tags multi-chip + subcategoría (filtrada por categoría) + material
- [x] Mobile menu funcional (off-canvas drawer con nav + cuenta, ESC + body-lock)
- [x] Filtros /shop por categoría · subcategoría (condicional) · material · sale, con URL persistente
- [x] SEO: `sitemap.xml` dinámico (productos+categorías), `robots.txt`, `generateMetadata` por producto con OG/Twitter, `metadataBase` global
- [x] Productos relacionados al fondo de `/producto/[slug]` (misma categoría → material → últimos, 8 cards)
- [x] Cart sync a Firestore para logged-in users (cross-device): merge on login (max qty wins, precio remoto), debounced write 800ms, sin live multi-tab (evita loops)
- [x] Recover password (`/forgot-password` con `sendPasswordResetEmail` + link desde /login)

## Infra pendiente

### Estado del deploy (2026-05-20)
- ✅ **Firestore rules** desplegadas a `pgina-48477`
- ✅ **Functions desplegadas**: `ping`, `setUserRole`, `syncRoleClaim`, `scheduledFirestoreExport`. Cleanup policy de Artifact Registry configurada (borra imágenes >1 día).
- ⏸️ **Functions de email** (`onOrderCreated`/`onOrderStatusChanged`) — movidas a `functions/src/email-functions.ts`, NO importadas en `index.ts` (línea de export comentada). No se despliegan hasta configurar Resend. Para activar: ver cabecera de `email-functions.ts`.
- ✅ **Storage rules** desplegadas — usan el custom claim `role`.
- ✅ **Bootstrap admin** completado — uid `6bVIod109scpVloSB5dmKim48sZ2` tiene claim `role:admin` (confirmado en logs de `syncRoleClaim`).
- Fix aplicado: `firebase.json` predeploy ahora usa `pnpm -C functions run build` (el `--filter` fallaba en el contexto del CLI).

**Pendiente del usuario (opcional, no bloquea):**
1. **Logout + login** en la app — para que el token del navegador recoja el claim recién sincronizado (si no, no podrás subir imágenes hasta refrescar la sesión).
2. **Bucket de backups**: ver "Setup backups". Sin el bucket, `scheduledFirestoreExport` corre cada 24h y falla en logs — sin daño, solo ruido.
3. **Email**: configurar secrets Resend + descomentar export en `index.ts` (ver "Setup Resend").

- [x] **Stripe** (checkout completo) — Checkout Session hosted, webhook firma orders, success page con sub vivo, login con `?next=` para retomar carrito
  - **Pendiente del usuario**: configurar `STRIPE_*` + `FIREBASE_*` (admin SDK) en `.env.local` y crear webhook endpoint en Stripe Dashboard (o `stripe listen` local). Ver guía abajo.
- [x] **Cloud Functions deploy** — código listo (`ping`, `setUserRole`, `syncRoleClaim`, `onOrderCreated`, `onOrderStatusChanged`, `scheduledFirestoreExport`). Falta `firebase deploy --only functions` del usuario (ver guía abajo).
- [x] **Custom claims** para roles — CF callable `setUserRole` + trigger `syncRoleClaim` (auto-sync cuando se edita `users/{uid}.role` directo en consola). Storage rules ya usan claim. Firestore rules ya tienen prioridad de claim sobre doc.
- [ ] **App Check** (reCAPTCHA Enterprise)
- [x] Email transaccional (Resend vía CF): `onOrderCreated` envía confirmación con tabla de items, `onOrderStatusChanged` notifica `shipped` (con tracking) y `delivered`. Código en `functions/src/email-functions.ts` — DESACTIVADO (export comentado en `index.ts`). Pendiente del usuario: API key Resend + dominio verificado + descomentar export (ver guía).
- [x] Backup automático Firestore — `scheduledFirestoreExport` CF (export diario a bucket GCS). PITR es un toggle aparte en consola. Pendiente del usuario: crear bucket + IAM (ver guía).
- [ ] Cloud Logging dashboards
- [ ] Budget alerts en Cloud Billing
- [ ] Sync de `displayName` Auth ↔ Firestore (ya está)
- [ ] Indexes compuestos en `firestore.indexes.json` cuando crezca el catálogo

## Repo / DevX

- [x] `git init` + commit checkpoint inicial
- [ ] Next commit checkpoint cuando termine batch grande
- [x] CI básico (GitHub Actions: typecheck + lint + build en push/PR a main, .github/workflows/ci.yml)
- [x] Pre-commit hook (husky 9 — typecheck antes de commit, .husky/pre-commit)
- [ ] Tests E2E (Playwright) para flujos críticos
- [x] Tests unitarios para reglas (`@firebase/rules-unit-testing` + vitest, workspace `tests/`): 32 tests sobre products/gallery/users/favorites/carts/orders/complaints/counters + deny default. Correr: `pnpm test:rules`

## Bloqueos del usuario

- Para deploy a producción → upgrade a Blaze + dominio + reCAPTCHA
- Para Stripe (checkout real) → ver "Setup Stripe" abajo

## 💳 Setup Stripe — pasos del usuario

**1. Crear cuenta y obtener llaves (modo test):**
- https://dashboard.stripe.com/register → activar cuenta (México OK)
- Sidebar → Developers → API keys → copiar `Publishable key` (pk_test_…) y `Secret key` (sk_test_…)

**2. Service account Firebase para Admin SDK:**
- Firebase Console → Project settings → Service accounts → "Generate new private key"
- Descarga el JSON. De ahí saca 3 campos al `.env.local`:
  - `FIREBASE_PROJECT_ID` ← `project_id`
  - `FIREBASE_CLIENT_EMAIL` ← `client_email`
  - `FIREBASE_PRIVATE_KEY` ← `private_key` (pega tal cual con los `\n` literales)

**3. Pega en `apps/web/.env.local`:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # se llena en el paso 4
STRIPE_CURRENCY=mxn
NEXT_PUBLIC_APP_URL=http://localhost:3030

FIREBASE_PROJECT_ID=pgina-48477
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@pgina-48477.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**4. Webhook para test local:**
- Instala el Stripe CLI: `winget install Stripe.StripeCLI` (Windows) o https://stripe.com/docs/stripe-cli
- En otra terminal: `stripe login` (abre browser)
- Después: `stripe listen --forward-to localhost:3030/api/stripe/webhook`
- El CLI imprime un `whsec_…` — copiar a `STRIPE_WEBHOOK_SECRET` y reiniciar `pnpm dev`

**5. Webhook en producción (cuando deploys):**
- Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://TU-DOMINIO/api/stripe/webhook`
- Eventos: `checkout.session.completed`
- Pegar el "Signing secret" a `STRIPE_WEBHOOK_SECRET` en Vercel env vars

**6. Probar el flujo:**
- Agrega productos al carrito → "Continuar al pago"
- Tarjeta de test: `4242 4242 4242 4242`, fecha futura, CVC cualquiera, ZIP cualquiera
- Después del pago, Stripe redirige a `/checkout/success` y el webhook crea `orders/{sessionId}`
- Ver pedido en `/mi-cuenta?tab=pedidos` y en `/admin/pedidos`

**Lo que NO está aún (out of scope MVP):**
- Aplicar descuentos al precio (Stripe coupons / promotion codes)
- Mercado Pago como segundo PSP
- Cargo de envío real (ahora Stripe lo registra como 0; lo configura cliente final si toggle Stripe shipping rates)
- Re-deshacer stock al cancelar (si manejaras stock, sería un job aparte)

## ⚠️ Patrón importante (lección de galería)

Colecciones con rule `read: if isStaff()` o `read: if isAdmin()` **no pueden leerse desde server components** (el SDK server no está autenticado). Hay que renderizar en cliente:
- Página = thin wrapper con metadata
- Listado = client component con `onSnapshot` / `getDocs` ejecutado en navegador

Aplicar a colecciones staff-only: `users`, `orders`, `chats`, `complaints`, `counters`.

## ✅ Storage rules + Custom claims (Blaze)

Storage rules ahora usan `request.auth.token.role` (custom claim), no `firestore.get`. Los claims se setean vía CF `setUserRole` y se sincronizan automáticamente vía trigger `syncRoleClaim` cuando alguien edita `users/{uid}.role` en consola (útil para bootstrap del primer admin).

**Bootstrap del primer admin:**
1. Registra el usuario en `/register` con tu correo
2. En Firebase Console → Firestore → `users/{tu-uid}` → edita `role` a `"admin"`
3. El trigger `syncRoleClaim` (deployado) setea el claim automáticamente
4. Logout + login para que el token nuevo cargue el claim
5. Desde ahí, todos los cambios de rol se hacen desde `/admin/usuarios` (UI llama a la CF)

## 📧 Setup Resend (email transaccional)

**1. Cuenta + API key:**
- https://resend.com → signup → Onboarding
- Dashboard → API Keys → Create → copiar `re_...`

**2. Dominio:**
- Para test rápido: usar `onboarding@resend.dev` como `from` (sandbox de Resend, solo envía a tu propio email verificado en la cuenta)
- Para producción: Dashboard → Domains → Add → seguir DNS (SPF + DKIM)

**3. Configurar secrets en Firebase:**
```bash
firebase functions:secrets:set RESEND_API_KEY
# pega re_...

firebase functions:secrets:set EMAIL_FROM
# pega: pagina <onboarding@resend.dev>
# o (con dominio propio): pagina <pedidos@tu-dominio.com>
```

**4. Deploy:**
```bash
firebase deploy --only functions
```

**5. Probar:**
- Crea una orden de test (vía Stripe checkout) → debe llegar email
- Cambia status del pedido a `shipped` desde `/admin/pedidos` → notificación
- Logs: `firebase functions:log --only onOrderCreated`

## 💾 Setup backups (scheduled export)

La CF `scheduledFirestoreExport` corre cada 24h y exporta a `gs://pgina-48477-backups`. Setup una sola vez:

```bash
# 1. Crear bucket (nearline = más barato para backups)
gcloud storage buckets create gs://pgina-48477-backups \
  --location=us-central1 --default-storage-class=NEARLINE

# 2. Rol de export al service account de las CF
gcloud projects add-iam-policy-binding pgina-48477 \
  --member="serviceAccount:pgina-48477@appspot.gserviceaccount.com" \
  --role="roles/datastore.importExportAdmin"

# 3. Acceso de escritura al bucket
gcloud storage buckets add-iam-policy-binding gs://pgina-48477-backups \
  --member="serviceAccount:pgina-48477@appspot.gserviceaccount.com" \
  --role="roles/storage.admin"
```

**PITR (Point-in-time recovery)** — aparte, es un toggle: Firestore Console → Backups/Recuperación → activar. Da ventana de 7 días de recuperación granular.

**Restaurar un export:** `gcloud firestore import gs://pgina-48477-backups/<TIMESTAMP>`

## 🚀 Deploy Cloud Functions

**1. Verifica que `firebase login` está activo y el proyecto seleccionado:**
```bash
firebase projects:list
firebase use pgina-48477
```

**2. Build + deploy:**
```bash
pnpm --filter @pagina/functions build
firebase deploy --only functions
```

(o desde la raíz: `pnpm deploy:functions`, que ya está en `package.json`)

**3. Deploy de rules junto (recomendado):**
```bash
firebase deploy --only firestore:rules,storage,functions
```

**4. Verificar:**
- Firebase Console → Functions → debes ver `ping`, `setUserRole`, `syncRoleClaim`, `onOrderCreated`, `onOrderStatusChanged`
- En `/admin/usuarios` cambia el rol de un user → revisa logs con `firebase functions:log`

**Nota:** `onOrderCreated` / `onOrderStatusChanged` necesitan los secrets `RESEND_API_KEY` y `EMAIL_FROM` (ver "Setup Resend" arriba). Si no están configurados, el deploy pedirá los valores o fallará — configúralos primero.

---

**Orden recomendado para seguir** (después de Galería):
1. Usuarios (cambiar rol desde UI)
2. Descuentos (la UI de cards ya muestra precio tachado, hay que crearlos)
3. `siteContent` (Hero/Banners editables)
4. Subcategorías + Etiquetas
5. Stripe (cuando desbloquees)
