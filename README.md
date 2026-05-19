# pagina

Proyecto Firebase-native construido desde cero.

## Stack

- **Monorepo pnpm** — `apps/web` (Next.js 16) + `functions` (Cloud Functions gen 2, TS)
- **Firebase**: Auth, Firestore, Storage, Functions, Hosting (`frameworksBackend`), App Check, Cloud Scheduler
- **Región**: `us-central1`
- **Node**: 20

## Estructura

```
pagina/
├─ apps/
│  └─ web/                # Next.js 16
├─ functions/             # Cloud Functions gen 2 (TS)
├─ firebase.json          # config emuladores + deploys
├─ .firebaserc            # IDs de proyecto (REEMPLAZAR)
├─ firestore.rules        # rules cerradas por defecto
├─ firestore.indexes.json # vacío — se llena cuando aparezcan queries compuestas
├─ storage.rules
└─ tsconfig.base.json
```

## Setup inicial (acción del usuario)

```powershell
# 1. Instalar pnpm globalmente si no lo tienes
npm install -g pnpm

# 2. Instalar dependencias del workspace
cd pagina
pnpm install

# 3. Loguear Firebase CLI
pnpm exec firebase login

# 4. Crear proyecto en Firebase Console (console.firebase.google.com):
#    - pagina-dev     (Spark)
#    Staging/prod se agregan más adelante (Fase I) cuando se requieran.

# 5. Vincular project al repo
pnpm exec firebase use --add
# Selecciona el project ID, alias = default

# 6. Habilitar en la consola del proyecto:
#    - Authentication → Email/Password + Google
#    - Firestore → modo Production (rules cerradas), región us-central1
#    - Storage → región us-central1

# 7. Crear web app en consola → copiar config a apps/web/.env.local
cp .env.example apps/web/.env.local
# editar y llenar los NEXT_PUBLIC_FIREBASE_* con los valores reales
```

## Desarrollo local (frontend en localhost, DB en Firebase real)

```powershell
# 1. En apps/web/.env.local
NEXT_PUBLIC_USE_EMULATORS=false

# 2. Deployar rules al proyecto real (gratis en Spark)
pnpm exec firebase deploy --only firestore:rules,storage

# 3. Levantar dev server
pnpm dev
# → http://localhost:3000   (talks to real Firestore)
```

## Desarrollo 100% local (sin proyecto Firebase)

```powershell
# 1. En apps/web/.env.local
NEXT_PUBLIC_USE_EMULATORS=true

# 2. Levantar emuladores
pnpm emulators
# UI → http://localhost:4000

# 3. En otra terminal, dev del frontend
pnpm dev
# → http://localhost:3000
```

## Deploy

```powershell
pnpm deploy
# Variantes:
pnpm deploy:rules      # solo Firestore rules + Storage rules
pnpm deploy:functions  # solo Cloud Functions (requiere Blaze)
```

## Scripts útiles

- `pnpm dev` — Next.js en `apps/web`
- `pnpm build` — build de todos los paquetes
- `pnpm typecheck` — `tsc --noEmit` recursivo
- `pnpm emulators` — suite completa de emuladores

## Estado actual

**Fase A** — Cimientos del monorepo. Solo scaffold; la funcionalidad llega en fases B–K.
