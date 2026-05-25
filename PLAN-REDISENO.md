# Plan de integración del rediseño UI

Integración del rediseño visual generado con **Claude Design** (12 partes) al
proyecto real `pagina`. Fuente: carpeta `12 partes/` (código `.tsx` integrable,
organizado en `components/`, `app/`, `lib/` por cada parte).

Cada fase consiste en **casar el diseño nuevo con la lógica real** del proyecto
(Firestore, Stripe, contextos de auth/carrito, etc.). No es copiar y pegar:
las páginas del diseño traen datos mock que hay que reconectar.

> **Degradación visual temporal:** durante la migración, las páginas aún no
> migradas usan clases viejas (`bg-accent` rosa, `accent-50..900`) que ya no
> existen en el nuevo `tailwind.config`. El proyecto **compila igual**
> (typecheck/build pasan), pero esas páginas se ven con colores rotos hasta
> que les toque su fase. Es normal en un rediseño total y se resuelve al avanzar.

---

## Fase 0 — Sistema de diseño ✅ COMPLETADA

- `tailwind.config.ts` y `globals.css` reemplazados con el sistema nuevo:
  colores `brand`/`secondary`/`surface`/etc., gradientes, sombras, radios,
  `fontSize` semánticos, breakpoint `xs`, variante `coarse:`, dark mode.
- Fuentes: Space Grotesk + Sora + JetBrains Mono (antes Inter/Poppins) en `layout.tsx`.
- 19 componentes UI copiados a `src/components/ui/` (Button, Input, ProductCard,
  Header, Footer, Icon…) + `lib/cn.ts` y `lib/ui-types.ts`.
- Dependencias `clsx` + `tailwind-merge` instaladas.
- Fix: `JSX.Element` → import explícito desde `react` (React 19).
- Typecheck: verde.

---

## Fases pendientes

| Fase | Alcance | Estado |
|------|---------|--------|
| 1 | **Home** — 9 secciones + shell completo | ✅ Completada |
| 2 | **Catálogo + búsqueda** — grid, filtros, ordenamiento, resultados | ✅ Completada |
| 3 | **Página de producto (PDP)** — galería, variantes, reseñas, relacionados | ✅ Completada |
| 4 | **Carrito + checkout** — carrito, resumen, flujo Stripe | ✅ Completada |
| 5 | **Auth** — login, registro, recuperar contraseña | ✅ Completada |
| 6 | **Mi cuenta** — perfil, pedidos, direcciones, favoritos | ✅ Completada |
| 7 | **Legales + vistas dinámicas** — páginas legales, builder de vistas | ✅ Completada |
| 8 | **Admin** — integración 100% del diseño de Claude Design (ver `PLAN-ADMIN.md`) | ✅ Completada |
| 9 | **Limpieza final** — huérfanos borrados, build completo verde | ✅ Completada |

---

## Fuente del diseño

- Carpeta: `12 partes/` (12 subcarpetas `01`–`12`).
- Cada subcarpeta: `components/` (.tsx), `app/` (páginas), `lib/` (datos/tipos),
  y la `01` además trae `styles/globals.css`.
- Total: ~192 `.tsx` + ~24 `.ts`.
- Mapeo parte → fase:
  - `01 Sistema de Diseno` → Fase 0
  - `02 Home` → Fase 1
  - `03 Catalogo y Busqueda` → Fase 2
  - `04 Producto` → Fase 3
  - `05 Carrito` → Fase 4
  - `06 Login` → Fase 5
  - `07 Mi Cuenta` → Fase 6
  - `08 Legal y Vistas` → Fase 7
  - `09`–`12 Admin` → Fase 8
