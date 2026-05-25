# Gap Analysis — `pagina` vs Estándar de e-commerce

> Comparación del estado actual del proyecto contra `ESTANDAR-ECOMMERCE.md` (Baymard et al.).
> Modelo definido por el cliente: **e-commerce de catálogo** (productos con precio fijo). La sección de imprenta/web-to-print del estándar **no aplica** y queda fuera de alcance.
> Fecha: 2026-05-20.

---

## Resumen ejecutivo

El proyecto tiene una **base sólida**: catálogo, carrito persistente, checkout con Stripe, panel admin completo, SEO básico. Lo que falta son piezas de **conversión** (cosas que, según Baymard, causan abandono medible) y de **descubrimiento** (navegación y búsqueda).

**Puntuación aproximada por área:**

| Área | Estado | Comentario |
|---|---|---|
| Catálogo / PLP | 🟡 60% | Faltan precio-filtro, orden, paginación, breadcrumbs |
| Página de producto (PDP) | 🟡 55% | Faltan zoom, envío estimado, reseñas, specs |
| Carrito | 🟡 65% | Falta mini-carrito y cupón |
| Checkout | 🟠 45% | **Falta guest checkout** (abandono #2 de Baymard) |
| Navegación / Header | 🟠 40% | Sin nav de categorías en desktop |
| Búsqueda | 🟡 50% | Sin autocomplete ni tolerancia a typos |
| Cuenta / Post-compra | 🟡 70% | Falta tracking embebido y re-ordenar |
| Técnico (SEO/A11y) | 🟡 60% | Falta Schema.org JSON-LD; A11y parcial |
| Panel admin | 🟢 90% | Muy completo; falta alertas de stock |

---

## Tabla maestra de gaps

Prioridad = impacto en conversión según estadísticas Baymard.
Esfuerzo: **S** = <½ día · **M** = ½–1 día · **L** = 2–4 días.

| # | Gap | Prioridad | Esfuerzo | Dato Baymard |
|---|---|---|---|---|
| 1 | **Guest checkout** (hoy exige login) | 🔴 Alta | M | 26% abandona por cuenta forzada |
| 2 | **Envío estimado visible** en PDP y carrito | 🔴 Alta | M | 24% abandona en PDP sin envío; 48% por costos sorpresa |
| 3 | **Nav de categorías en header** (desktop) | 🔴 Alta | M | 67% de sitios falla en navegación |
| 4 | **Mini-carrito drawer** al agregar producto | 🟠 Media | M | Patrón estándar; reduce fricción |
| 5 | **Schema.org JSON-LD** (`Product`/`Offer`/`Breadcrumb`) | 🟠 Media | S | SEO — rich snippets en Google |
| 6 | **Autocomplete en búsqueda** + tolerancia a typos | 🟠 Media | M | Búsqueda es punto de alta intención |
| 7 | **Filtro de precio + ordenamiento** en /shop | 🟠 Media | M | Anatomía estándar de PLP |
| 8 | **Paginación / "Load More"** en /shop | 🟠 Media | S | Hoy corta en 60 productos sin control |
| 9 | **Cupón / código de descuento** en carrito | 🟠 Media | M | Descuentos ya existen en admin, falta aplicarlos |
| 10 | **Tracking embebido** del pedido (timeline al cliente) | 🟠 Media | S | 56% de sitios solo da link externo (error) |
| 11 | **Galería con zoom** en PDP | 🟠 Media | S | Imagen = factor #1 de decisión (67%) |
| 12 | **Páginas de políticas** (envío, devoluciones, privacidad) + footer | 🟠 Media | M | 11% abandona sin política de devoluciones |
| 13 | **Reseñas / rating** de producto | 🟡 Media-baja | L | UGC; trust signal |
| 14 | **Breadcrumbs** en PLP y PDP | 🟡 Media-baja | S | PDP ya tiene; falta en /shop |
| 15 | **Botón "Re-ordenar"** en historial | 🟡 Media-baja | S | Conveniencia recurrente |
| 16 | **OXXO Pay** como método de pago | 🟡 Media-baja | M | Alta adopción en MX (Stripe lo soporta) |
| 17 | **Specs técnicas en tabla** en PDP | 🟢 Baja | S | Mejora escaneabilidad |
| 18 | **WhatsApp flotante** | 🟢 Baja | S | Esperado en MX |
| 19 | **A11y: focus visible, live regions, skip-link** | 🟠 Media | M | WCAG 2.2 AA |
| 20 | **Alertas de bajo stock** en admin | 🟢 Baja | S | Módulo de inventario |
| 21 | **MSI (Meses Sin Intereses)** | 🟢 Baja | M | Requiere config de banco/Stripe; evaluar después |

---

## Detalle por sección

### Checkout — el gap más caro
- **Guest checkout (#1)**: hoy `CartPageInner.tsx` redirige a `/login?next=/cart` si no hay sesión. El backend **ya soporta invitados** — el webhook de Stripe maneja `guestEmail` y crea la orden sin `userId`. El cambio es mayormente de frontend: permitir lanzar checkout sin login, y ofrecer crear cuenta *después* (delayed account creation). Esfuerzo M.
- Stripe Checkout ya recolecta email, dirección y teléfono → cumple "minimizar campos" sin trabajo extra.

### PDP
- **Envío estimado (#2)**: el admin ya tiene config de envío. Falta exponer "Envío: $X · llega en N días" en la PDP y el carrito en vez de "se calcula en checkout".
- **Zoom (#11)**: `ProductGallery.tsx` es estática. Agregar zoom hover (desktop) / pinch (mobile).
- **Reseñas (#13)**: no existe nada. Es una feature completa (modelo `reviews`, rules, UI de escribir/leer, rating agregado). Esfuerzo L.
- **Variantes dinámicas**: hoy cada variante es un producto separado. Para catálogo simple es **aceptable** — convertir a variantes dinámicas es un rediseño de datos grande (XL) y **no se recomienda** salvo que el catálogo lo exija. Fuera de alcance por ahora.

### Navegación
- **Nav de categorías (#3)**: el header desktop solo tiene logo/búsqueda/cuenta/carrito. Falta una barra de categorías. Dado el tamaño del catálogo, un **dropdown simple** basta (no mega-menú). Las categorías ya existen en Firestore.

### Carrito
- **Mini-carrito (#4)**: hoy solo un "Agregado ✓" inline. Falta el drawer lateral que confirma + permite ir al carrito o seguir comprando.
- **Cupón (#9)**: los descuentos existen en `/admin/descuentos` pero nunca se aplican al precio. Falta la caja "¿Tienes un código?" + la lógica de aplicación.

### Búsqueda
- **Autocomplete (#6)**: hoy `SearchBar` solo hace submit a `/search`. Falta dropdown con productos/categorías mientras se teclea. La tolerancia a typos puede ser básica (normalización) sin llegar a Algolia.

### Técnico
- **Schema.org (#5)**: rápido y alto valor SEO. JSON-LD de `Product`+`Offer` en PDP, `BreadcrumbList`, `Organization` en home.
- **A11y (#19)**: hay 45 usos de ARIA pero falta focus-visible consistente, focus-trap en modales, skip-to-content, y live-regions para feedback dinámico.

---

## Hoja de ruta propuesta (por fases)

**Fase 1 — Conversión directa** (lo que más recupera ventas)
1. Guest checkout (#1)
2. Envío estimado en PDP + carrito (#2)
3. Mini-carrito drawer (#4)
4. Cupón en carrito (#9)

**Fase 2 — Descubrimiento**
5. Nav de categorías en header (#3)
6. Filtro de precio + ordenamiento (#7)
7. Paginación / Load More (#8)
8. Autocomplete de búsqueda (#6)
9. Breadcrumbs en /shop (#14)

**Fase 3 — Confianza y SEO**
10. Schema.org JSON-LD (#5)
11. Páginas de políticas + footer (#12)
12. Galería con zoom (#11)
13. Tracking embebido del pedido (#10)
14. A11y: focus visible + live regions (#19)

**Fase 4 — Retención y extras**
15. Reseñas / rating (#13)
16. Re-ordenar (#15)
17. OXXO Pay (#16)
18. Specs en tabla (#17), WhatsApp flotante (#18), alertas de stock (#20)

**Evaluar aparte:** MSI (#21) requiere acuerdo bancario; variantes dinámicas (rediseño XL, no recomendado para catálogo simple).

---

## Fuera de alcance (por decisión del cliente)
- Toda la sección de **imprenta / web-to-print**: configurador, cotizador en tiempo real, preflight de archivos, flujo de aprobación de prueba digital. El negocio es e-commerce de catálogo.
