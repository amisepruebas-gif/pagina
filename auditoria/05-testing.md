# 05 — Testing y QA

## Por qué importa
Una tienda en producción cambia todo el tiempo: precios, productos, descuentos, banners, flujos de pago. Sin tests, cada cambio es una apuesta a que nada de lo que funcionaba dejó de funcionar.

## Qué se evalúa típicamente
- Tests unitarios para lógica pura (cálculo de descuentos, formateo de precio, slugify, validaciones).
- Tests de integración para endpoints (`/api/**`) — request → response sin servidor real.
- Tests de reglas de Firestore con el emulador (allow/deny por rol).
- Tests E2E del happy path (registro → buscar → carrito → checkout) y los caminos de error.
- Tests de regresión visual (Chromatic / Playwright snapshots) para componentes UI.
- Mocking aislado de Stripe (con `stripe-mock` o fixtures).
- Cobertura ≥ 60% en módulos críticos, 100% en cálculo de totales/descuentos.
- CI bloqueante: PR no entra si tests fallan.
- Lint + typecheck en pre-commit (ya está vía husky).

## Plan para `pagina`

- [ ] Inventario de tests actuales: `Grep "test\(|describe\(" --type ts` en todo el repo. Inferir cobertura real.
- [ ] Vitest o Jest para `apps/web` y `functions`. Si ya está alguno, alinear; si no, decidir uno (Vitest por velocidad).
- [ ] **Unitarios prioritarios**:
  - `apps/web/src/lib/discounts-apply.ts` — cálculo de descuento por tipo (global/product/category) con casos límite (0%, 100%, subtotal 0, productos no aplicables).
  - `apps/web/src/lib/cart-storage.ts` — agregar/quitar/actualizar quantity, idempotencia.
  - `apps/web/src/lib/slugify.ts` — caracteres especiales, plurales, longitud máxima.
  - `apps/web/src/lib/shipping.ts` — costo según subtotal y reglas free-shipping.
- [ ] **Integración endpoints**:
  - `/api/checkout/session` — happy, sin Stripe key, con cupón inválido, carrito vacío, producto inactivo, body inválido.
  - `/api/checkout/order-summary` — sesión real vs inexistente.
  - `/api/stripe/webhook` — firma válida, firma inválida, evento duplicado, evento desconocido.
- [ ] **Firestore rules**: directorio `tests/` ya existe (vi `tests/firestore-debug.log` en `.gitignore`). Confirmar suite de reglas con `@firebase/rules-unit-testing` cubriendo:
  - Usuario X no puede leer pedidos de usuario Y.
  - Cliente no puede escribir `products`, `discounts`, `categories`.
  - Solo admin puede crear/editar `siteContent`, `config/home`.
- [ ] **E2E** (Playwright):
  - Login → agregar al carrito → ir a checkout → verificar redirect (con Stripe configurado a test).
  - Browse anónimo → buscar → filtrar → ver producto → favoritear (requiere login → flow de login).
  - Admin: crear producto → aparece en `/shop` → editar → desactivar → desaparece.
- [ ] CI en GitHub Actions: corre `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:rules` en cada PR. Bloquear merge si falla.
- [ ] Smoke test post-deploy: un Playwright que abra producción y revise que el Home carga, búsqueda responde, producto se ve.

## Cómo ejecutar
- Vitest: `pnpm dlx create-vitest` o agregar manualmente con `vitest` + `@vitejs/plugin-react`.
- Firestore rules: `pnpm --filter @pagina/tests test:rules` (ya hay script en `package.json`).
- Playwright: `pnpm dlx playwright install && pnpm dlx playwright test`.
- Coverage: `vitest run --coverage` → reportar a Codecov o GitHub PR comment.

## Notas preliminares
- `package.json` ya tiene script `test:rules` y workspace `tests/`. No verifiqué qué incluye.
- Husky ya corre typecheck pre-commit (lo confirmé al hacer push hoy). No corre tests aún.
- No vi configuración de Vitest/Jest en `apps/web/package.json` (no la leí entera).

## Estado
Pendiente
