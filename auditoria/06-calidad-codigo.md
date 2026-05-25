# 06 — Calidad de código y DX

## Por qué importa
Código difícil de leer es código difícil de mantener seguro y rápido. Un proyecto solo se sostiene si entrar a tocarlo seis meses después toma minutos, no horas.

## Qué se evalúa típicamente
- Lint y type-check sin warnings tolerados.
- Convenciones consistentes (naming, estructura de carpetas, exports, paths).
- Duplicación detectable con `jscpd` o similar.
- Acoplamiento: módulos que importan de muchos lados, exports excesivos.
- Tamaño de archivos / funciones (señal de single-responsibility roto).
- Comentarios donde el código no se explica solo (no comentarios obvios).
- Documentación viva: `README.md`, ADRs, docs de onboarding.
- Pre-commit hooks (lint, format, type).
- Conventional commits para changelogs automáticos.
- Pull requests con plantilla y checklist.
- Renovate/Dependabot para deps al día.

## Plan para `pagina`

- [ ] `pnpm lint` — anotar todos los warnings/errors. Decidir cuáles son falsos positivos y cuáles refactorizar. Apuntar a 0 warnings.
- [ ] `pnpm typecheck` — debe estar limpio (ya lo está hoy).
- [ ] Revisar `.eslintrc` / `eslint.config.mjs`: que tenga `no-unused-vars` con `argsIgnorePattern: '^_'`, `no-explicit-any` (warn o error), `react-hooks/exhaustive-deps` activo.
- [ ] Convención de carpetas en `apps/web/src/`:
  - `app/` → rutas Next (correcto).
  - `components/` → UI con sub-carpetas por feature (`home/`, `cart/`, `shop/`, `admin/`, `ui/`).
  - `lib/` → módulos sin React (no client/server hooks). Validar que sea así (hoy hay `client/` y `admin/` adentro — convención mixta, decidir).
  - `types/` → solo tipos.
- [ ] Inspección rápida: archivos > 400 líneas (señal de partir). Listar y decidir.
- [ ] Duplicación: `pnpm dlx jscpd apps/web/src --min-lines 20 --threshold 1` — listar duplicados, refactorizar los reales.
- [ ] Comentarios: revisar que no haya bloques explicando el qué (vs el por qué). Memory del proyecto ya pide esto.
- [ ] `README.md` del repo: ¿describe cómo correr el proyecto local con emuladores? Hoy lo vi, revisar contenido.
- [ ] Convención de commits: ya se usan prefijos `feat:`, `fix:` (correcto). Agregar `commitlint` opcional.
- [ ] PR template `.github/pull_request_template.md`: secciones "Cambios", "Cómo probar", "Riesgos", "Screenshots".
- [ ] Renovate o Dependabot: PR automático para bumps. Hoy las deps están al día (Next 16, React 19, Firebase 11), pero esto cambia rápido.
- [ ] Husky pre-commit ya corre typecheck; considerar agregar `lint-staged` para correr eslint solo en archivos staged.

## Cómo ejecutar
- `pnpm lint` y `pnpm typecheck` están en el root `package.json`.
- `pnpm dlx jscpd apps/web/src` para duplicación.
- `pnpm dlx depcheck` para deps no usadas.
- `pnpm dlx knip` para código muerto (exports no usados, archivos huérfanos).
- `pnpm dlx madge --circular apps/web/src` para detectar dependencias circulares.

## Notas preliminares
- Typecheck pasa local y en pre-commit (vi el husky ejecutándolo en `git commit`).
- Pre-commit hook está activo (`apps/web prepare$ husky` en logs de Vercel también).
- Hay archivos grandes en components (CartPageInner, FlashSale) — todavía manejables, vigilar.
- Memory del proyecto pide: no agregar comentarios obvios, no agregar abstracciones prematuras. Coincide con `CLAUDE.md` por defecto.
- Detección: el .gitignore tenía `lib/` borrando `apps/web/src/lib/` del repo durante meses (fix `2a900e7`). Hay que pensar en agregar lint o doc que detecte estos casos.

## Estado
Pendiente
