# 04 — Accesibilidad (a11y)

## Por qué importa
Aproximadamente 1 de cada 6 personas tiene alguna discapacidad. En MX la LFPDPPP no obliga formalmente WCAG, pero los lineamientos comerciales (Apple Pay, Stripe Checkout, integraciones con BBVA, marketplaces grandes) sí cuentan accesibilidad, y la UX para todos mejora cuando un sitio es accesible.

## Qué se evalúa típicamente
- Contraste de texto vs fondo (mínimo 4.5:1 normal, 3:1 grande).
- Foco visible en todos los interactivos (no `outline: none` sin reemplazo).
- Navegación por teclado: `tab`, `shift+tab`, `enter`, `esc`, `arrows` en menús.
- Alt en imágenes; `aria-hidden` en decorativos.
- Roles ARIA donde el HTML semántico no alcanza (modales, tabs, popovers).
- Form fields con `<label>` asociado, mensajes de error vinculados con `aria-describedby`.
- Estructura de headings jerárquica (no saltar de h1 a h4).
- Anuncios de cambios dinámicos con `aria-live` (carrito, toasts).
- Skip-to-content link al inicio.
- Soporte de `prefers-reduced-motion`.
- Tamaño mínimo de targets clickables (44×44 px en mobile).
- Cumplimiento de WCAG 2.1 AA como objetivo.

## Plan para `pagina`

- [ ] Pasar axe DevTools (extensión de Chrome) por: `/`, `/shop`, `/producto/[slug]`, `/cart`, `/login`, `/admin`. Anotar `serious` y `critical`.
- [ ] Revisar contraste del color pink `#FF69B4` sobre blanco y sobre `bg-surface-2`. AA texto normal pide 4.5:1.
- [ ] Confirmar que todos los `<button>` y `<a>` tienen texto accesible (texto visible o `aria-label`). En particular las `IconButton` ya usan `label` — verificar uso consistente.
- [ ] Auditar el `ProductPickerModal` (modal nuevo):
  - `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apuntando al título.
  - Focus trap mientras está abierto.
  - Devolver focus al botón disparador al cerrar.
  - `Esc` cierra.
- [ ] Revisar carruseles (FlashSale, BestSellers, NewArrivals, FeaturedProducts):
  - Botones prev/next deben anunciarse correctamente.
  - El scroll horizontal debe ser navegable con teclado (flechas o tab a través de las cards).
  - `aria-roledescription="carousel"` si aplica.
- [ ] `<form>` de newsletter, login, register, forgot-password: cada input con label visible o `aria-label`, errores con `aria-describedby` y `role="alert"`.
- [ ] Verificar tamaño de targets en móvil (carrito, favoritos, badges en cards) — mínimo 44×44.
- [ ] `prefers-reduced-motion`: respetar en transiciones de scroll, hover effects pesados, animaciones de los carruseles.
- [ ] Skip link al inicio del layout: "Saltar al contenido principal".
- [ ] Topbar y header: cuando el menú móvil abre, el body debe tener `aria-hidden="true"` y focus dentro del menú.

## Cómo ejecutar
- axe DevTools (free Chrome extension) sobre cada ruta clave.
- `pnpm dlx @axe-core/cli https://pagina-gomu.vercel.app/` para CI.
- Manual: navegar todo el flujo de compra solo con teclado.
- VoiceOver (Mac) o NVDA (Windows) — leer una ficha de producto completa.
- Lighthouse Accessibility score (≥ 95 como objetivo).

## Notas preliminares
- Los `IconButton` ya reciben `label` (lo vi en FlashSale y FeaturedProducts) — bien.
- Hay `aria-hidden` en los blobs decorativos del Newsletter — bien.
- El ProductPickerModal está usando `createPortal` a `document.body` — bien para z-index, pero hay que confirmar focus trap.
- Tailwind por defecto deja `:focus-visible` en interactivos — verificar que no se esté removiendo.

## Estado
Pendiente
