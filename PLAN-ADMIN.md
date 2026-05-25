# Plan — Integración 100% del Admin de Claude Design

**Pausa en el plan general** (`PLAN-REDISENO.md`). La Fase 8 quedó como
*migración mecánica de tokens* (admin coherente pero con su estructura vieja).
Este plan la **reemplaza**: integrar al 100% el admin entregado por Claude
Design (partes 09-12), reescribiendo estructura, no solo colores.

## Alcance

Diseño fuente: `12 partes/09…12` — **~71 archivos** (.tsx/.ts).
Cada página del diseño trae datos mock (`lib/admin-*.ts`); hay que **casarla
con la lógica real** del proyecto (Firestore, libs, contextos) — igual que se
hizo con el storefront en las fases 1-7.

El diseño cubre todas las secciones reales: dashboard, productos, categorías,
taxonomías, descuentos, pedidos, chats, quejas, tipos-queja, reseñas,
configuración, contenido, vistas, usuarios, reportes.

## Sub-fases

| Sub-fase | Alcance | Estado |
|----------|---------|--------|
| A8.0 | **Shell + componentes base** — AdminShell, AdminSidebar, AdminTopbar, AdminPageHeader, AdminGate + DataTable, StatCard, FormShell, FormSection, Toggle, StockBadge, InlineEditRow, `lib/admin-nav` | ✅ |
| A8.1 | **Dashboard** — `/admin` con StatCard + stock bajo + accesos rápidos, datos reales | ✅ |
| A8.2 | **Catálogo** (parte 10) — productos, categorías, taxonomías, descuentos (listas + formularios) | ✅ |
| A8.3 | **Operación** (parte 11) — pedidos, chats, quejas, tipos-queja, reseñas | ✅ |
| A8.4 | **Configuración** (parte 12) — configuración, contenido, vistas, usuarios, reportes | ✅ |
| A8.5 | **Cierre** — typecheck + build del conjunto: verde | ✅ |

## Estrategia de ejecución (con agentes)

1. **A8.0 lo hago en el hilo principal** — es el cimiento; todo lo demás
   depende del shell y los componentes base. No se puede paralelizar.
2. **Investigación con agentes en paralelo**: tras A8.0, lanzo 3 agentes
   `Explore` simultáneos — uno por sub-fase de contenido (catálogo, operación,
   configuración) — para mapear qué libs/funciones Firestore usa cada página
   admin real. Esto me da el "contrato de lógica" de cada sección.
3. **Integración A8.1-A8.4**: cada sub-fase reescribe sus páginas/componentes
   casando el diseño con la lógica mapeada. Las sub-fases son independientes
   entre sí (distintas secciones), así que se pueden delegar a agentes de
   integración en paralelo, con revisión mía de cada resultado.
4. **A8.5**: verificación typecheck + build, limpieza de archivos viejos.

## Reglas de integración (heredadas de las fases 1-7)

- Conservar **toda la lógica real**: Firestore, libs (`@/lib/*`), contextos,
  rutas API. El diseño aporta solo la capa visual/estructural.
- Rutas del diseño exportadas como `-id-`/`nueva` → usar `[id]`/`nuevo` reales.
- Reemplazar imports `@/components` → `@/components/ui` y `@/components/admin`.
- Sin `<style jsx>` con className multilínea (rompe Turbopack — visto en F1).
- Verificar `pnpm typecheck` + `pnpm build` al cerrar cada sub-fase.
