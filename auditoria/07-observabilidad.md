# 07 — Observabilidad

## Por qué importa
Sin observabilidad un bug en producción solo se descubre cuando un cliente se queja — y la mitad nunca se queja, solo abandona el carrito. Logs, métricas y alertas convierten "algo se rompió" en una notificación accionable.

## Qué se evalúa típicamente
- **Logs** estructurados con niveles (info, warn, error) y correlación (request id).
- **Errores** capturados con tracking (Sentry, Highlight, Datadog, etc.) con stack + breadcrumbs.
- **Métricas** RED por endpoint: Rate, Errors, Duration.
- **Web Vitals** reales (CrUX) recopilados con `web-vitals` + analytics.
- **Analytics** de producto: vistas de PDP, add-to-cart, checkout iniciado, conversión, abandono.
- **Alertas** sobre tasa de error 5xx, p95 de latencia, fallos de webhook, errores de pago.
- **Dashboards** con vista única del estado (uptime, errores, conversiones).
- **Auditoría** de cambios admin (quién publicó qué, quién cambió precio).
- **Health checks** y status page (cuando hay equipo grande / SLA).

## Plan para `pagina`

- [ ] Decidir stack de observabilidad. Opciones:
  - **Sentry** (gratis hasta 5k events/mes) — errores + perf, integración nativa Next.js, instalación en 10 min. Recomendado para empezar.
  - **Vercel Analytics** (incluido en Pro) — Web Vitals reales, sin esfuerzo.
  - **Vercel Logs Drains** → forward a Datadog/Logtail si crece el equipo.
- [ ] Instalar `@sentry/nextjs` con DSN en env:
  - Capturar errores cliente y server.
  - Excluir paths ruidosos (chrome extensions, bots).
  - Source maps subidos en build.
- [ ] Capturar errores específicos como `Sentry.captureException` con `tags`: `userId`, `productId`, `sessionId` en `/api/checkout/session` y `/api/stripe/webhook`.
- [ ] **Logs estructurados** en route handlers y Cloud Functions: hoy ya hay `console.log('[CHECKOUT] ...')` con prefijos (bien). Asegurar que cada log de error incluya el contexto suficiente para reproducir (sin PII).
- [ ] **Web Vitals**: activar Vercel Speed Insights (un script en `app/layout.tsx`).
- [ ] **Analytics de producto**: GA4 o Plausible o PostHog. Eventos mínimos: `view_item`, `add_to_cart`, `begin_checkout`, `purchase` (con value, items). Si se usa GA4, configurar Enhanced E-commerce.
- [ ] **Stripe webhook**: log de cada evento recibido en Firestore (`webhookEvents` con `eventId`, `type`, `processedAt`, `status`). Sirve para auditar y depurar pagos.
- [ ] **Alertas**:
  - Sentry: notificar si errores 5xx > 10/hora.
  - Vercel: notificar deploy fallido.
  - Cloud Functions: alerta de error rate vía Cloud Monitoring.
- [ ] **Auditoría de admin**: cuando un admin crea/edita producto, descuento, contenido del home, escribir log en una colección `auditLog/{uid}/{ts}` con `action`, `entity`, `before`, `after`. Hoy no existe.

## Cómo ejecutar
- Sentry: `pnpm -C apps/web add @sentry/nextjs && pnpm -C apps/web exec sentry-wizard`.
- Vercel: en el dashboard activar Speed Insights y Analytics.
- Logs en Vercel: ya disponibles en `vercel logs <url>`. Configurar Drain a tercero si hace falta.

## Notas preliminares
- Hoy: solo `console.log` y `console.error`. Llegan a Vercel logs pero no hay agregación ni alertas.
- Memory del proyecto pide siempre incluir `console.log` con prefijos (`[CHECKOUT]`, `[LOTES]`, etc.) — convención respetada.
- En PDV system (otro proyecto en el ecosistema) ya hay logging con tags. Patrón replicable.

## Estado
Pendiente
