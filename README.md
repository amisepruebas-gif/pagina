# pagina

E-commerce demo construido sobre Firebase + Next.js, hospedado en Vercel.

> Demo activo en producción: https://pagina-gomu.vercel.app

## Stack

- **Monorepo pnpm** — `apps/web` (Next.js 16, App Router) + `functions` (Cloud Functions gen 2, TS) + `tests` (vitest, reglas Firestore)
- **Frontend hosting**: Vercel (build con `pnpm -C apps/web build`)
- **Backend Firebase**: Firestore, Auth, Storage, Cloud Functions
- **Pagos**: Stripe (cliente + server)
- **Región Firebase**: `us-central1`
- **Node**: 20+ (probado en 22)

## Estructura

```
pagina/
├─ apps/
│  └─ web/
│     ├─ src/
│     │  ├─ app/
│     │  │  ├─ (public)/     # Home, tienda, producto, carrito, cuenta, legal, /v/<vista>
│     │  │  ├─ (admin)/      # Panel admin completo (ver más abajo)
│     │  │  └─ api/          # Routes API (webhooks, etc.)
│     │  ├─ components/      # UI (storefront, admin, auth, cart, chat, product…)
│     │  ├─ lib/             # Dominios: products, categories, cart, auth, discounts, stripe…
│     │  ├─ context/         # AuthContext, CartContext
│     │  └─ types/           # Tipos de dominio
│     └─ scripts/            # Tooling one-shot (dedupe slugs, inspect, apply-cleanup)
├─ functions/                # backup, email-functions, sweep-images
├─ tests/                    # vitest — firestore-rules.test.ts
├─ firebase.json             # Config emuladores + deploys (functions/firestore/storage)
├─ vercel.json               # Hosting frontend
├─ firestore.rules           # Auth/staff/admin gating por colección
├─ storage.rules
├─ auditoria/                # 12 docs por área (seguridad, perf, SEO, a11y, …)
└─ PLAN-*.md                 # Histórico de planes (rediseño, fixes, implementación)
```

## Vistas públicas (`apps/web/src/app/(public)/`)

| Ruta | Descripción |
|---|---|
| `/` | Home con secciones editables desde admin (banner, flash sale, destacados, recién llegados, etc.) |
| `/shop` | Catálogo con filtros (categoría, subcategoría, material, etiquetas, precio) |
| `/producto/[slug]` | Ficha de producto (galería, descripción, precios por volumen, reseñas, relacionados) |
| `/search` | Buscador full-text in-memory |
| `/cart` | Carrito (localStorage para invitados, Firestore para logueados) |
| `/checkout` | Intent de Stripe |
| `/mi-cuenta` | Tabs: perfil, pedidos, favoritos, direcciones, quejas (+ banner de verificación de correo) |
| `/login`, `/register`, `/forgot-password` | Auth (email/password + Google) |
| `/v/[slug]` | Vistas custom editables desde admin |
| `/terminos`, `/privacidad`, `/envios`, `/devoluciones` | Legales |

Todas las vistas públicas llevan una banda amarilla sticky de "página demostrativa" con botón **Saber más** (modal) y X para cerrar (decisión persistida en `localStorage`).

## Panel admin (`apps/web/src/app/(admin)/admin/`)

14 secciones: `productos`, `categorias`, `taxonomias` (materiales/etiquetas/subcategorías), `vistas`, `contenido` (topbar, footer, banners…), `descuentos`, `pedidos`, `quejas`, `tipos-queja`, `resenas`, `chats`, `usuarios`, `reportes`, `configuracion`.

Gating: cualquier ruta `/admin/*` requiere `role` ∈ {`admin`, `staff`} en `users/{uid}` o claim de token. Las rules Firestore replican el chequeo server-side.

## Auth

- **Métodos**: email/password + Google (`signInWithPopup`).
- **Verificación de correo**: al registrarse con email/password se dispara `sendEmailVerification`. Banner ámbar en `/mi-cuenta` mientras `emailVerified === false`, con botones "Reenviar correo" y "Ya verifiqué".
- **Roles**: `customer` por defecto al registrarse. `staff` y `admin` se asignan editando `users/{uid}.role` desde admin o vía Cloud Function `setUserRole` (cuando se conecte).

## Modelo de datos (Firestore)

Colecciones principales: `products`, `categories`, `subcategories`, `materials`, `tags`, `discounts`, `siteContent`, `vistas`, `config`, `users`, `users/{uid}/addresses`, `users/{uid}/favorites`, `carts/{uid}`, `orders/{id}`, `orders/{id}/events`, `chats/{id}`, `chats/{id}/messages`, `complaints`, `complaintTypes`, `reviews`, `counters`.

Reglas: lectura pública del catálogo y contenido, escritura restringida a admin. Usuarios solo pueden tocar su propio doc (sin auto-promoción a admin). Ver `firestore.rules` para detalle.

### Unicidad de productos

- `slug` y `sku` se validan únicos al guardar desde el admin (`apps/web/src/lib/admin/products-admin.ts`). El form muestra el producto en conflicto y sugiere un valor libre (`base-2`, `base-3`…). Para fixes a posteriori existe el script `scripts/dedupe-product-slugs.mjs`.

## Pipeline de imágenes (admin)

Toda imagen subida desde el admin pasa por `compressImage` (`apps/web/src/lib/admin/compress-image.ts`):

- **< 1 MB** → se sube tal cual.
- **≥ 1 MB** → se fuerza a `image/webp` con peso final < 800 KB. Primero baja calidad iterativamente (0.92 → 0.5), y solo si ningún nivel alcanza la meta reduce dimensiones (factor 0.85) y vuelve a probar.

Único punto de subida: `uploadImage()` en `apps/web/src/lib/admin/uploads.ts`. **No introducir uploaders alternativos**. Si la compresión falla, sube el original — el upload nunca aborta por compresión.

## Setup inicial

```powershell
# 1. Dependencias
npm install -g pnpm
pnpm install

# 2. Firebase CLI
pnpm exec firebase login
pnpm exec firebase use --add   # selecciona el project ID y alias=default

# 3. Habilitar en Firebase Console:
#    - Authentication → Email/Password + Google
#    - Firestore → modo Production, región us-central1
#    - Storage → región us-central1

# 4. Config del cliente
cp .env.example apps/web/.env.local
# Llena los NEXT_PUBLIC_FIREBASE_* desde la web app creada en consola.

# 5. (Una vez) Deploy de rules
pnpm exec firebase deploy --only firestore:rules,storage
```

## Variables de entorno

`apps/web/.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Cliente apunta a emuladores en localhost (true) o a Firestore real (false)
NEXT_PUBLIC_USE_EMULATORS=false

# App Check con reCAPTCHA Enterprise (opcional)
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=

# Stripe (opcional según fase)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

En Vercel hay que duplicar las mismas variables en *Project Settings → Environment Variables*.

## Desarrollo local

**Modo "frontend local + Firestore real"** (el más común):

```powershell
# apps/web/.env.local → NEXT_PUBLIC_USE_EMULATORS=false
pnpm dev   # http://localhost:3030
```

**Modo 100% local con emuladores**:

```powershell
# apps/web/.env.local → NEXT_PUBLIC_USE_EMULATORS=true
pnpm emulators    # UI en http://localhost:4000
pnpm dev          # En otra terminal, http://localhost:3030
```

## Scripts

| Comando | Acción |
|---|---|
| `pnpm dev` | Next.js dev server (puerto 3030) |
| `pnpm build` | Build de todos los paquetes |
| `pnpm typecheck` | `tsc --noEmit` recursivo |
| `pnpm lint` | Lint recursivo |
| `pnpm emulators` | Suite completa de emuladores (auth, firestore, storage, functions, hosting) |
| `pnpm test:rules` | Suite de tests de reglas Firestore (vitest) |
| `pnpm deploy` | Deploy completo a Firebase |
| `pnpm deploy:rules` | Solo rules de Firestore + Storage (gratis en Spark) |
| `pnpm deploy:functions` | Solo Cloud Functions (requiere Blaze) |

El frontend se deploya **automáticamente** en Vercel al hacer push a `main` (build configurado en `vercel.json`). Para promover a producción no se requiere CLI — Vercel detecta el commit.

## Scripts one-shot (`apps/web/scripts/`)

Herramientas usadas para migraciones puntuales. Necesitan service account JSON (`.firebase/service-account.json`, gitignored).

- `dedupe-product-slugs.mjs` — Detecta duplicados de `slug`/`sku` en `products`, genera plan, opcionalmente aplica (`--apply`).
- `inspect-mb2.mjs`, `apply-cleanup.mjs` — One-shots ya ejecutados (limpiaron los 4 clones de "M-b-2" + renombraron 11 pares acrílico/MDF). Se conservan como histórico.

## Cloud Functions (`functions/src/`)

- `backup.ts` — Snapshot periódico (Scheduler).
- `email-functions.ts` / `emails.ts` — Envío transaccional (orders, complaints).
- `sweep-images.ts` — GC de imágenes huérfanas en Storage.

Despliegue requiere plan Blaze. `pnpm deploy:functions`.

## Documentación adicional

- `ESTANDAR-ECOMMERCE.md` — Estándar interno e-commerce (extenso, 27 KB).
- `auditoria/` — 12 docs temáticos: seguridad, performance, SEO, accesibilidad, testing, calidad de código, observabilidad, UX, integridad de datos, legal, backup/recovery, operaciones/costos.
- `PLAN-*.md`, `GAP-ANALYSIS.md`, `MAPEO-ADMIN.md`, `PROGRESO.md` — **Histórico** de fases previas. Pueden estar desactualizados respecto al código actual.

## Estado actual

Producto funcional en producción con todas las áreas core (catálogo, carrito, auth, admin, vistas custom, contenido editable). Stripe presente en código pero pendiente de habilitación final. Email verification activa (remitente Firebase default; migración a SMTP propio pendiente cuando exista dominio).
