# 08 — UX y flujos críticos

## Por qué importa
Un sitio puede tener todo "técnicamente bien" y aún así convertir mal porque el flujo de compra molesta. Los detalles de UX en e-commerce son los que separan 1.5% de conversión de 3.5%.

## Qué se evalúa típicamente
- **Discovery**: categorías visibles, búsqueda eficaz, sugerencias.
- **Lista de productos**: filtros que se mantienen en URL, sort, infinite scroll vs paginación, skeleton loading.
- **PDP (product detail page)**: imágenes amplias con zoom, variantes claras, stock, envío estimado, reviews, cross-sell.
- **Carrito**: editar cantidad sin recargar, ver total + envío + descuento desglosados, mover a favoritos.
- **Checkout**: pasos cortos, validación inline, opciones de pago visibles, sin sorpresas en el total.
- **Post-compra**: confirmación clara, email transaccional, tracking, política de devolución a un clic.
- **Cuenta**: pedidos, direcciones, favoritos, datos personales, eliminar cuenta (LFPDPPP).
- **Error states**: 404 útil, 500 amable, formulario con errores específicos, "sin stock".
- **Empty states**: carrito vacío con CTA al catálogo, favoritos vacíos, búsqueda sin resultados.
- **Mobile**: pulgar-accesible, sticky CTA, formularios optimizados, modales sin scroll lock roto.

## Plan para `pagina`

- [ ] **Smoke test manual de los flujos**:
  - Anónimo: home → categoría → producto → agregar al carrito → checkout (cancelar) → vuelve a carrito intacto.
  - Registro nuevo: registro → email verification (¿hay?) → login → comprar.
  - Login existente: login → carrito persistido → checkout → success → ver en `/mi-cuenta`.
  - Recuperar contraseña: forgot-password → email → reset.
  - Search: con resultados, sin resultados, con typo.
  - Filtros en `/shop`: aplicar 2-3 → persistir en URL → compartir URL → mismo resultado.
  - Favoritos: agregar anónimo (¿localStorage?) → login → ¿se migran al perfil?
- [ ] Revisar **carrito**:
  - ¿Permite editar cantidad inline?
  - ¿Muestra subtotal + envío + descuento + total con desglose claro?
  - ¿Quitar item tiene "deshacer" o solo borrado duro?
  - ¿Persiste en `localStorage` (anónimo) y en Firestore (logueado)? Memory dice `cartList` localStorage; verificar merge al login.
- [ ] Revisar **checkout**:
  - Stripe Checkout abre directo (sin paso intermedio). Bien.
  - Cancel URL vuelve a `/cart?cancelled=1`. Verificar que muestre un mensaje, no solo recargue.
  - Success URL: `/checkout/success?session_id=…`. Verificar que muestre items, total, número de orden y email enviado.
- [ ] Revisar **PDP** (`/producto/[slug]`):
  - Galería de imágenes con thumbs + lightbox.
  - Variantes (color/talla) si existen.
  - "Stock bajo" si aplica.
  - CTA fijo en móvil al hacer scroll.
  - Tabs: Descripción, Detalles, Envíos, Reseñas.
  - Productos relacionados.
- [ ] Revisar **mobile** en cada pantalla con DevTools (iPhone SE, Pixel 7, iPhone 14 Pro). Verificar targets, scroll, sticky CTA.
- [ ] Revisar **empty states**: `/cart` vacío, `/mi-cuenta` sin pedidos, búsqueda 0 results, `/admin/productos` sin productos.
- [ ] Revisar **error toasts** consistentes: usar mismo componente, no `alert()` ni text raw.
- [ ] Email transaccional post-compra (vía Stripe receipt — Stripe lo manda automático si `customer_email` está) — confirmar que llega y se ve decente.

## Cómo ejecutar
- Manual desde móvil real y desde Chrome DevTools.
- Maze.co o Useberry para tests con usuarios (5-7 sesiones bastan para encontrar lo top).
- Hotjar / Microsoft Clarity (gratis) para session recordings.
- Compararse con la heuristic checklist de Baymard (ver `13-estandar-ecommerce.md`).

## Notas preliminares
- El flujo de checkout está delegado a Stripe (Hosted) — eso quita carga UX al equipo y resuelve métodos de pago (card + OXXO en MX).
- Cancel URL ya vuelve al carrito (correcto). Success URL existe.
- Memory dice que en otro proyecto (mgomu) hay un sistema de vinculación PDV-online con código de 6 caracteres. Si aplica aquí, integrarlo.
- Carrito local: memory menciona `cartList` y `wishlist` en localStorage. Confirmar merge al login en `apps/web/src/lib/cart-storage.ts` o `carts-remote.ts`.

## Estado
Pendiente
