# 13 — Estándar e-commerce (Baymard)

## Por qué importa
Baymard Institute lleva ~15 años haciendo investigación con usuarios reales en tiendas reales. Sus guidelines son el estándar de facto en e-commerce. La diferencia entre "se ve bonito" y "convierte" suele ser cumplir un puñado de patrones que ellos validaron a base de prueba con cientos de usuarios.

## Qué se evalúa típicamente
La taxonomía Baymard tiene ~700 guidelines en categorías:
- Homepage & Category Navigation.
- Product Lists & Filtering.
- Product Page.
- Search.
- Cart & Checkout.
- Mobile UX.
- Account & Self-Service.
- Customer Service.

## Plan para `pagina`

Memory del proyecto apunta a `pagina/ESTANDAR-ECOMMERCE.md` como guía interna. Hoy NO existe ese archivo en el repo (verificado con glob). Acciones:

- [ ] **Crear `pagina/ESTANDAR-ECOMMERCE.md`** con un extracto de las guidelines más relevantes para una tienda chica/mediana en MX (no hace falta cubrir las 700; ~80 son suficientes para 80% del impacto). Sugerido:
  - Home: hero claro, beneficios visibles, categorías destacadas, social proof.
  - Listado: filtros persistentes en URL, sort visible, breadcrumbs, paginación o infinite scroll con "ver más" explícito (no auto-scroll infinito), conteo de resultados.
  - PDP: 3+ imágenes grandes con zoom, variantes claras, stock, envío estimado, política de devolución a la mano, descripción + especificaciones + reviews separadas en pestañas, CTA siempre visible.
  - Search: autocomplete con productos, búsqueda tolerante a typos, "no results" con sugerencias.
  - Cart: editar inline, total transparente, costos de envío antes del checkout, "guardar para después".
  - Checkout: 1-page o pasos cortos, validación inline, login NO obligatorio, métodos de pago visibles, sin cargos sorpresa.
  - Mobile: sticky CTA, formularios optimizados (`inputmode`, `autocomplete`), modales que respeten el body scroll.
- [ ] **Mapeo a `pagina`**: por cada guideline, anotar estado actual (✓ cumple / ✗ falta / N/A). Esto se hace con una pasada manual por la web ya desplegada.
- [ ] **Imprenta / web-to-print**: memory menciona que el estándar interno incluye un flujo para imprenta (productos personalizables). Verificar si aplica a `pagina` o si es solo de otro proyecto (`personaliza_ai` lo hace). Si aplica, agregar sección específica.
- [ ] **Priorizar**: los gaps con mayor impacto en conversión van al backlog inmediato. Lo cosmético, después.

## Cómo ejecutar
- Recursos gratuitos de Baymard: artículos públicos en [baymard.com/blog](https://baymard.com/blog) (sin suscripción).
- "67 Cart Abandonment Stats" — síntesis de motivos por los que la gente abandona y cómo prevenirlos.
- Heurística rápida: hacer una compra completa como cliente nuevo y anotar cada vez que algo se sintió raro o lento.
- Comparar con 2-3 tiendas líderes en la categoría que tenga `pagina` (ej. si vende llaveros personalizados, ver Vistaprint, Custom Ink en el flujo).

## Notas preliminares
- `ESTANDAR-ECOMMERCE.md` referenciado en memory NO existe aún en este repo (memoria habla de un proyecto hermano).
- `personaliza_ai` (otro proyecto) ya tiene flujo de personalización con dual-image (herraje + muestra) — eso es web-to-print.
- Este auditoría documento es un placeholder hasta que se llene `ESTANDAR-ECOMMERCE.md` y se haga el mapeo guideline-a-implementación.

## Estado
Pendiente
