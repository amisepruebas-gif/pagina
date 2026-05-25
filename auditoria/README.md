# Auditoría de `pagina`

Documento de trabajo. Cada archivo de esta carpeta describe **una dimensión** que un proyecto e-commerce debe pasar antes de salir a producción seria, con un plan concreto pensado para este repo (Next.js 16 + Firebase + Stripe + Vercel).

No es una lista de tareas para hacer todas a la vez — es un mapa para ir revisando categoría por categoría. Cada archivo tiene:

- **Por qué importa** — el riesgo si no se hace.
- **Qué se evalúa** — lo que un proyecto serio en esta área cubre.
- **Plan para `pagina`** — items concretos para este repo, con rutas.
- **Cómo ejecutar** — comandos y herramientas sugeridas.
- **Notas preliminares** — lo que ya se sabe del estado actual.
- **Estado** — pendiente / en progreso / hecho.

## Índice

| # | Categoría | Estado |
|---|-----------|--------|
| 01 | [Seguridad](01-seguridad.md) | Hecho (fixes aplicados, backlog menor) |
| 02 | [Performance](02-performance.md) | Hecho (ISR + images.formats; Lighthouse pendiente interactivo) |
| 03 | [SEO](03-seo.md) | Hecho (canonical + sitemap; backlog: rutas /c/[slug]) |
| 04 | [Accesibilidad](04-accesibilidad.md) | Pendiente |
| 05 | [Testing y QA](05-testing.md) | Pendiente |
| 06 | [Calidad de código y DX](06-calidad-codigo.md) | Pendiente |
| 07 | [Observabilidad](07-observabilidad.md) | Pendiente |
| 08 | [UX y flujos críticos](08-ux-flujos.md) | Pendiente |
| 09 | [Integridad de datos (Firestore)](09-data-integrity.md) | Pendiente |
| 10 | [Legal y compliance](10-legal-compliance.md) | Pendiente |
| 11 | [Backup y recuperación](11-backup-recovery.md) | Pendiente |
| 12 | [Operaciones y costos](12-operaciones-costos.md) | Pendiente |
| 13 | [Estándar e-commerce (Baymard)](13-estandar-ecommerce.md) | Pendiente |

## Cómo usarlo

Trabaja una sola categoría a la vez. Cambia `Estado` en la tabla a `En progreso` al empezar, escribe los hallazgos en la sección **Hallazgos** del archivo correspondiente, y marca `Hecho` cuando cierres la categoría con un plan de remediación o una decisión explícita ("acepto el riesgo porque…").

Cuando un hallazgo amerite acción inmediata, va al backlog como issue/PR; el archivo de auditoría solo deja la nota de que existió y cuándo se resolvió.

## Stack relevante (para contexto)

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 3.
- **Backend**: Cloud Functions Node 20, Firestore, Storage, Firebase Auth.
- **Pagos**: Stripe Checkout (con OXXO en MX) + webhook.
- **Hosting**: Vercel (auto-deploy desde `main`). Firebase para Auth/Firestore/Storage/Functions.
- **Repo**: monorepo pnpm, `apps/web` + `functions/`.
