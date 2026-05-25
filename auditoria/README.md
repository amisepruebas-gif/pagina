# Auditoría de `pagina`

Documento de trabajo. Cada archivo de esta carpeta describe **una dimensión** que un proyecto e-commerce debe pasar antes de salir a producción seria, con un plan concreto pensado para este repo (Next.js 16 + Firebase + Stripe + Vercel).

No es una lista de tareas para hacer todas a la vez — es un mapa para ir revisando categoría por categoría. Cada archivo tiene:

- **Por qué importa** — el riesgo si no se hace.
- **Qué se evalúa** — lo que un proyecto serio en esta área cubre.
- **Plan para `pagina`** — items concretos para este repo, con rutas.
- **Cambios al plan original** — si auditar reveló que la asunción inicial era errada.
- **Hallazgos** — lo encontrado, con severidad.
- **Estado**.

## Índice

| # | Categoría | Estado |
|---|-----------|--------|
| 01 | [Seguridad](01-seguridad.md) | Hecho — fixes aplicados; CVE postcss bloqueado upstream |
| 02 | [Performance](02-performance.md) | Hecho — ISR + images.formats; Lighthouse pendiente |
| 03 | [SEO](03-seo.md) | Hecho — canonical + sitemap; rutas /c/[slug] en backlog |
| 04 | [Accesibilidad](04-accesibilidad.md) | **Bloqueado** — requiere browser real (axe DevTools, VoiceOver/NVDA) |
| 05 | [Testing y QA](05-testing.md) | **Bloqueado** — requiere setup de Vitest/Playwright desde cero |
| 06 | [Calidad de código y DX](06-calidad-codigo.md) | Hecho — lint roto documentado; código muerto en backlog |
| 07 | [Observabilidad](07-observabilidad.md) | **Bloqueado** — requiere instalar Sentry + decidir analytics |
| 08 | [UX y flujos críticos](08-ux-flujos.md) | **Bloqueado** — requiere navegación manual del sitio |
| 09 | [Integridad de datos (Firestore)](09-data-integrity.md) | Auditado — 2 hallazgos altos pendientes (stock atómico, indexes) |
| 10 | [Legal y compliance](10-legal-compliance.md) | Auditado — requiere asesoría legal externa para redacción real |
| 11 | [Backup y recuperación](11-backup-recovery.md) | Auditado — Firestore export OK, faltan Storage y Auth backup |
| 12 | [Operaciones y costos](12-operaciones-costos.md) | Auditado — acciones en consolas web (no código) |
| 13 | [Estándar e-commerce (Baymard)](13-estandar-ecommerce.md) | **Bloqueado** — gap analysis manual del sitio |

**Bloqueado** significa que la categoría requiere algo que no se puede hacer desde el código: browser real, instalación de herramientas externas, navegación manual, asesoría humana. Cuando llegue el momento de atacarlas, hay que abrir una sesión específica para cada una.

## Orden seguido

El recorrido fue: 01 → 02 → 03 → 06 → 09 → 10 → 11 → 12. Se saltó el orden numérico cuando ayudaba a la eficiencia (06 antes de 04 porque es auditable estática). Las categorías 04, 05, 07, 08 y 13 quedaron explícitamente bloqueadas por sus requisitos externos.

## Resumen ejecutivo (post auditoría inicial)

**Fixes aplicados en código** (8 commits desde `f7fb787`):
- Cabeceras de seguridad HTTP en next.config.
- PII removido de log en `auth.ts`.
- ISR habilitado en 5 rutas públicas (Home, PDP, /shop, /v/[slug], /envios).
- `images.formats` declarado explícito.
- Canonical en `/shop`.
- Sitemap limpio (sin /login, /register).
- Script de lint con placeholder (Next 16 sacó `next lint`).

**Backlog crítico** (en orden de impacto):
1. **Stock atómico** en webhook (`09`) — race condition real al haber demanda.
2. **`firestore.indexes.json`** vacío (`09`) — deploy a otro proyecto falla.
3. **Backup de Storage y Auth users** (`11`) — Firestore tiene export, pero las imágenes y usuarios no.
4. **Eliminar mi cuenta** (`10`) — requisito LFPDPPP.
5. **Rate-limit en `/api/checkout/**`** (`01`) — protege contra abuso.
6. **Migración real de ESLint a flat config** (`06`) — sin lint hoy.
7. **Páginas legales completas** (`10`) — requiere abogado MX.

**Lo que sí está bien y vale la pena destacar**:
- Reglas Firestore con deny-by-default y blindaje de campos sensibles (`orders.total`, `users.role`).
- Webhook Stripe idempotente con firma verificada.
- Backup de Firestore ya implementado (scheduled CF).
- `sweepOrphanImages` ya limpia Storage cada noche.
- Tipos consistentes, typecheck limpio, structure clara.

## Cómo usarlo

Trabaja una sola categoría a la vez. Cuando un hallazgo amerite acción inmediata, va al backlog como issue/PR; el archivo de auditoría solo deja la nota.

## Stack relevante

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 3.
- **Backend**: Cloud Functions Node 20, Firestore, Storage, Firebase Auth.
- **Pagos**: Stripe Checkout (con OXXO en MX) + webhook.
- **Hosting**: Vercel (auto-deploy desde `main`). Firebase para Auth/Firestore/Storage/Functions.
- **Repo**: monorepo pnpm, `apps/web` + `functions/`.
