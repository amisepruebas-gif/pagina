# Estándar de e-commerce — Lógica, flujo y mejores prácticas

> Documento de referencia compilado a partir de la investigación de **Baymard Institute** (la fuente más respetada del sector, con +200,000 horas de research UX en e-commerce), complementado con Nielsen Norman Group, Schema.org y W3C/WCAG. Incluye sección especializada para servicios de imprenta / web-to-print.

---

## Tabla de contenidos

1. [Fuentes autoritativas](#fuentes-autoritativas)
2. [El embudo estándar de e-commerce](#el-embudo-estándar-de-e-commerce)
3. [Homepage y navegación](#homepage-y-navegación)
4. [Búsqueda en el sitio](#búsqueda-en-el-sitio)
5. [Listado de productos (PLP)](#listado-de-productos-plp)
6. [Página de producto (PDP)](#página-de-producto-pdp)
7. [Carrito](#carrito)
8. [Checkout](#checkout)
9. [Cuenta y post-compra (self-service)](#cuenta-y-post-compra-self-service)
10. [Mobile e-commerce](#mobile-e-commerce)
11. [Lado vendedor — Panel de administración](#lado-vendedor--panel-de-administración)
12. [Adaptación específica para imprenta / web-to-print](#adaptación-específica-para-imprenta--web-to-print)
13. [Estadísticas clave que debes conocer](#estadísticas-clave-que-debes-conocer)
14. [Estándares técnicos complementarios](#estándares-técnicos-complementarios)
15. [Recursos y dónde descargar](#recursos-y-dónde-descargar)

---

## Fuentes autoritativas

| Fuente | Qué cubre | Costo |
|---|---|---|
| **Baymard Institute** (`baymard.com`) | UX e-commerce — 650+ guidelines basadas en testing con usuarios reales y benchmarking de 326 sitios líderes | Artículos: gratis · Premium: pago |
| **Nielsen Norman Group** (`nngroup.com`) | UX research general, reportes específicos por tema | Artículos: gratis · Reportes: $50-150 USD |
| **Schema.org** (`schema.org`) | Vocabulario estructurado para `Product`, `Offer`, `Review`, etc. (SEO + rich snippets) | Gratis · Estándar abierto |
| **W3C — WCAG 2.2** (`w3.org/WAI/`) | Accesibilidad web — referencia legal en muchas jurisdicciones | Gratis · Estándar abierto |
| **Web.dev / Core Web Vitals** (Google) | Performance: LCP, INP, CLS — afecta ranking SEO | Gratis |

**Cómo lo usa la industria**: Amazon, Walmart, Nike, Sephora, Shopify y agencias de UX serias citan Baymard como referencia primaria. Es el equivalente al "ISO no oficial" del UX de e-commerce.

---

## El embudo estándar de e-commerce

Todo e-commerce sigue, en esencia, este flujo. Cada paso es un sub-sistema con sus propias reglas.

```
Descubrimiento → Navegación/Búsqueda → PLP → PDP → Carrito → Checkout → Confirmación → Post-compra
     ↓                                                                                     ↓
   (SEO, ads,                                                                        (tracking, reviews,
   social, email)                                                                     soporte, re-compra)
```

**Métrica brutal de referencia**: La tasa promedio global de abandono de carrito es **70.19%** (Baymard, datos 2014-2025). De cada 10 personas que agregan al carrito, solo ~3 completan la compra. Optimizar el embudo puede recuperar hasta **35.26%** de esas pérdidas (Baymard).

---

## Homepage y navegación

> **Hallazgo Baymard**: 67% de los sitios líderes tienen performance "mediocre" o "pobre" en navegación. Es el área con más oportunidad de mejora.

### Reglas core

- **Mega-menu para catálogos grandes**, dropdown simple para pequeños. Como regla, si tienes más de ~30 productos en varias categorías → mega-menu.
- **Los encabezados de categoría deben ser clickeables** (95% de los sitios fallan en señalizar el "scope actual" del usuario). Si no son clickeables, el usuario asume que sí lo son y se frustra.
- **No anidar todo el catálogo dentro de un solo ítem "Shop" / "Productos"** — 37% de los sitios lo hacen y causa problemas severos.
- **Hover delay** en el mega-menu (61% no lo implementa): si el usuario pasa el cursor por accidente, no debe abrirse el menú entero.
- **Carruseles de homepage**: 46% tienen problemas. Si los usas, sigue las 10 reglas de Baymard — pausa al hover, indicadores claros, no más de 5 slides, no autoplay agresivo.
- **Subcategorías como contenido primario en páginas intermedias** — 76% de sitios meten promociones encima en vez de subcategorías; mata la findability.
- **Imágenes inspiracionales deben ser clickeables hacia los productos mostrados** (70% no lo hace).
- **Footer**: políticas de envío, devoluciones, contacto, redes sociales, métodos de pago. 11% de usuarios abandonan si no encuentran la política de devoluciones.

### Elementos mínimos del header

- Logo (link a home)
- Navegación principal (categorías)
- Barra de búsqueda visible (no oculta tras ícono en desktop)
- Cuenta / Login
- Carrito con contador
- En sitios MX: botón de WhatsApp Business

---

## Búsqueda en el sitio

> Baymard liberó 25 artículos gratis sobre Search UX en `baymard.com/research/eCommerce-search`.

### Lo no negociable

- **Autocomplete** con sugerencias mientras el usuario teclea, incluyendo:
  - Productos individuales (con thumbnail + precio)
  - Categorías relevantes
  - Búsquedas populares
- **Tolerar errores ortográficos** (huge — los usuarios escriben mal constantemente).
- **No mostrar "0 resultados" sin opciones** — siempre sugerir búsquedas relacionadas, categorías, o productos populares.
- **Soportar los 8 tipos de query** que Baymard identificó: exact, product type, symptom, non-product, feature, thematic, compatibility, slang/abbreviated.
- **Filtros facetados** en resultados (precio, categoría, marca, atributos específicos del producto).
- **Búsqueda en el header siempre visible** en desktop; nunca oculta detrás de un ícono.

### Errores comunes

- Buscador que solo hace match exacto de texto (sin sinónimos ni tolerancia a typos).
- No mostrar el query del usuario en la página de resultados.
- Esconder el filtrado bajo "Avanzado".
- No mostrar el conteo de resultados.

---

## Listado de productos (PLP)

### Anatomía estándar

- **Grid de productos**: thumbnail, nombre, precio (con descuento si aplica), rating, indicador de stock/envío rápido.
- **Filtros facetados** en sidebar (desktop) o en panel deslizable (mobile):
  - Categoría / subcategoría
  - Precio (slider o rangos)
  - Atributos específicos (talla, color, material, etc.)
  - Disponibilidad
  - Calificación
- **Ordenamiento**: relevancia (default), precio asc/desc, novedad, mejor valorados, más vendidos.
- **Paginación o infinite scroll**: Baymard recomienda **"Load More" + paginación** sobre infinite scroll puro (los usuarios pierden referencia y no llegan al footer).
- **Breadcrumbs** clicables.
- **Quick-view** opcional (modal con info esencial sin salir del PLP).

### Por mobile

- Filtros deben ser fácilmente accesibles (botón flotante o sticky).
- Mostrar conteo de resultados después de aplicar filtros.
- Permitir limpiar filtros con un solo tap.

---

## Página de producto (PDP)

> **Hallazgo Baymard**: solo **18% de las PDP** tienen rating "bueno" o "aceptable". 51% son "mediocres" o peor. Es donde más se decide la compra.

### Elementos esenciales (en orden de prioridad visual)

1. **Galería de imágenes** — el factor #1 de decisión. 67% de compradores citan calidad de imagen como su criterio principal.
   - Mínimo 5-7 imágenes por producto.
   - Tipos: producto en blanco, detalles/close-up, en uso/lifestyle, escala, variantes, packaging, infografía.
   - Zoom (hover en desktop, pinch en mobile).
   - Video de producto cuando aplique: compradores que ven video tienen **144% más probabilidad** de agregar al carrito.
2. **Título del producto** (`<h1>`, descriptivo, con keywords relevantes).
3. **Rating + número de reseñas** (link ancla al fondo).
4. **Precio claro** — sin sorpresas. Si hay descuento, mostrar precio original tachado.
5. **Selector de variantes** (talla, color, material) — usar **botones, no dropdowns** para variantes visuales.
6. **Indicador de stock** ("En stock", "Solo 3 disponibles", "Agotado").
7. **Botón Add-to-cart** prominente, color de contraste, arriba del fold.
8. **Costo y tiempo de envío estimado** visible en la PDP — 64% de usuarios busca el envío en la PDP, 24% abandona si no lo encuentra.
9. **Descripción corta** con bullets de features/beneficios.
10. **Especificaciones técnicas** en tabla (no en bloque de texto).
11. **Política de devoluciones** y garantía resumida (18% abandona por política poco clara).
12. **Reseñas detalladas** con filtros (por rating, por fecha, con fotos).
13. **Cross-sell / "También te puede interesar"** al final, nunca al inicio.

### Layout

Baymard probó 4 layouts y recomienda:
- **"One Long Page"** o **"Sticky TOC"** (tabla de contenidos pegada) sobre "Horizontal Tabs" o "Collapsed Sections".
- Las secciones colapsadas ocultas hacen que 23% de usuarios pierdan información crítica.

### Trust signals en PDP

- Badges de pago seguro (visibles pero no exagerados).
- SSL visible en URL.
- Reseñas con foto de cliente real (UGC).
- Política de envío y devolución como links accesibles.

---

## Carrito

### Anatomía del carrito

- **Productos listados** con: thumbnail, nombre, variante (talla/color), cantidad editable, precio unitario, subtotal, botón eliminar.
- **Resumen de orden** sticky: subtotal, envío estimado, impuestos, total.
- **Estimador de envío** ANTES de checkout — código postal/CP para calcular costo.
- **Cupón / código de descuento** — pero ojo: ver caja de cupón hace que algunos usuarios abandonen para buscar uno. Implementación común: link "¿Tienes un código?" que expande la caja.
- **CTA principal**: "Proceder al pago" / "Checkout".
- **CTA secundario**: "Seguir comprando".
- **Trust badges** y métodos de pago aceptados visibles.

### Mini-carrito (dropdown desde header)

- Cuando se agrega un producto, mostrar confirmación clara — el patrón **side-drawer** o **dropdown del ícono** funciona mejor que un modal de página completa.
- Permitir ir al carrito completo o continuar comprando.

### Carrito persistente

- Debe sobrevivir cierres de sesión y navegación. Usar localStorage + sync con backend si el usuario está logueado.
- **Email de recuperación de carrito abandonado** — secuencia de 3 emails genera 69% más recuperación que un solo email.

---

## Checkout

> **El área más crítica.** Baymard tiene un reporte PDF gratuito de ~80 páginas dedicado solo a esto: el **Checkout Optimization Report** (co-publicado con Amazon Pay).

### Principios fundamentales

1. **Permite guest checkout** — 26% de usuarios abandona si se les obliga a crear cuenta. Implementa **"Delayed Account Creation"**: déjalos comprar como invitado y al final ofrece crear cuenta con un click.
2. **Minimiza campos** — el checkout promedio tiene **14.88 campos**, lo óptimo es **7-8**. Combina nombre completo en un solo campo, autocompleta ciudad/estado desde CP.
3. **Muestra el costo total temprano** — incluye envío, impuestos. **48% de abandonos son por costos inesperados.**
4. **Indicador de progreso** si es checkout multi-paso (Información → Envío → Pago → Revisión).
5. **Inline validation** — errores en tiempo real, no después de "Enviar".
6. **No multi-columna** — los formularios deben ser una sola columna.
7. **Botón "Place Order"** debe ser inconfundible, color distinto, en el paso final.

### Tipos de checkout

- **Multi-step**: clásico, mejor para flujos largos o B2B.
- **One-step (todo en una página)**: funciona si tienes pocos campos.
- **Accordion**: secciones expandibles que se completan en orden — buen balance.

### Campos de pago

- **Inputs visualmente encapsulados** para tarjeta (caja con borde, ícono de seguridad).
- **Auto-detección del tipo de tarjeta** (Visa/MC/Amex) por el primer dígito.
- **Formateo automático** del número con espacios (4321 1234 5678 9012).
- **CVV con tooltip** explicando dónde está.
- **17% de usuarios abandona por desconfianza en seguridad** — usar trust seals (Norton, McAfee, SSL visible).

### Para México específicamente

- **Mercado Pago, Stripe, Conekta, OpenPay** como pasarelas.
- **OXXO Pay** como método de pago en efectivo (alta adopción).
- **MSI (Meses Sin Intereses)** — muy esperado por el consumidor mexicano.
- **CFDI / Factura electrónica** — checkbox "Requiero factura" que pida RFC, razón social, uso de CFDI, régimen fiscal.
- **Dirección con autocomplete** integrando SEPOMEX o Google Places.

### Página de confirmación

- Resumen completo de la orden.
- Número de orden destacado.
- Tiempo estimado de entrega.
- Email de confirmación inmediato (transaccional).
- CTAs: ver orden, crear cuenta (si era guest), seguir comprando.

---

## Cuenta y post-compra (self-service)

### Mi cuenta

- **Dashboard** con: órdenes recientes, dirección guardada, métodos de pago, wishlist.
- **Historial de órdenes** con estado claro y tracking embebido (no link externo).
- **Re-ordenar** — botón en cada orden pasada que pre-llena el carrito.
- **Editar perfil** simple.
- **Logout visible** (no escondido).

### Tracking de orden

- **Integrar el tracking dentro del sitio** — 56% de sitios solo dan un link externo, lo cual es un error.
- Estados claros: Pendiente → Pagada → En preparación → Enviada → En tránsito → Entregada.
- Email/SMS automático en cada cambio de estado.

### Devoluciones

- **54% de sitios tienen UX problemática de devoluciones** — y es crítico para retención.
- Política clara, accesible desde el footer y la PDP.
- Proceso self-service: solicitar devolución desde "Mi cuenta", generar guía de envío.

---

## Mobile e-commerce

> **Realidad**: ~70% del tráfico es mobile, pero la tasa de abandono de carrito en mobile es **85.65%** vs 70% en desktop. La diferencia se debe casi siempre a UX mobile pobre.

### Reglas mobile

- **Botones grandes** (mínimo 44×44 px, recomendado 48×48).
- **Sin hover** — todo debe funcionar con tap.
- **Inputs adecuados**: `type="email"`, `type="tel"`, `type="number"` para que aparezca el teclado correcto.
- **Sticky CTA**: "Add to Cart" debe estar accesible al hacer scroll en la PDP.
- **Menú "View All"** en cada nivel del menú (Baymard: solo 24% lo hace bien).
- **Filtros en panel deslizable** con botón "Aplicar" y "Limpiar".
- **Checkout en una sola columna**, sin distracciones (esconder nav y footer en el checkout).
- **Apple Pay / Google Pay / Shop Pay** — convierten 50% mejor que checkout tradicional.

### Performance (Core Web Vitals)

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1
- 53% de usuarios mobile abandonan si carga toma >3s. 1 segundo de delay = 7% menos conversión.

---

## Lado vendedor — Panel de administración

### Módulos mínimos

1. **Productos**
   - CRUD con variantes (talla, color, material)
   - Imágenes (drag & drop, reorder)
   - Campos SEO: slug, meta title, meta description, alt text
   - Inventario por variante
   - Estado: borrador, publicado, archivado
   - Etiquetas/categorías

2. **Inventario**
   - Stock por SKU
   - Alertas de bajo stock
   - Historial de movimientos
   - Inventario en múltiples ubicaciones (si aplica)

3. **Órdenes**
   - Listado con filtros (estado, fecha, cliente, monto)
   - Detalle de orden con timeline de eventos
   - Acciones: marcar como enviada, agregar tracking, cancelar, reembolsar
   - Imprimir factura/guía

4. **Clientes**
   - Perfil con historial de compras, LTV, dirección
   - Segmentación (VIP, nuevos, inactivos)

5. **Marketing**
   - Cupones / códigos de descuento
   - Reglas: % off, monto fijo, envío gratis, BOGO
   - Limitar uso (1 vez, X veces totales, expiración)

6. **Reportes**
   - Ventas (día/semana/mes/año)
   - Productos más vendidos
   - Tasa de conversión por canal
   - Carritos abandonados
   - AOV (Average Order Value)

7. **Configuración**
   - Envíos (zonas, tarifas, integración con paqueterías)
   - Impuestos (IVA en MX)
   - Métodos de pago
   - Emails transaccionales (templates)
   - Información de la tienda (nombre, logo, contacto)

8. **Comunicación**
   - Inbox / chat (si tienes equipo de soporte)
   - Templates de email
   - Integración con WhatsApp Business API

### Máquina de estados de una orden

```
pending → paid → preparing → shipped → delivered
                     ↓                       ↓
                 cancelled                returned → refunded
```

---

## Adaptación específica para imprenta / web-to-print

> Una imprenta NO es un e-commerce de catálogo cerrado. Es un **configurador + cotizador + cargador de archivos + flujo de aprobación**. Cambia bastante el modelo.

### Diferencias clave vs e-commerce tradicional

| Aspecto | E-commerce tradicional | Imprenta / web-to-print |
|---|---|---|
| Producto | Inventario fijo | Configuración variable |
| Precio | Estático por SKU | Calculado en tiempo real según config |
| Archivo del cliente | No requerido | **Obligatorio** (artwork) |
| Validación pre-producción | No aplica | **Preflight crítico** |
| Aprobación | Click "Comprar" | **Prueba digital → cliente aprueba → producción** |
| Cancelación | Hasta antes de envío | Hasta antes de aprobación |

### Componentes específicos

#### 1. Configurador de producto

Por cada producto (tarjetas, flyers, lonas, etc.), permite seleccionar:
- Tamaño (predefinido + opción "personalizado")
- Material/papel (couché, opalina, vinil, lona, etc.)
- Gramaje
- Tinta: 1/0 (un lado B/N), 4/4 (color ambos lados), etc.
- Acabados: mate, brillo, UV, suaje, troquel, hot stamping
- Cantidad (con descuentos por volumen — tabla escalonada)
- Tiempo de entrega (estándar / express)

**Patrón UX**: configurador como wizard o como panel lateral con todas las opciones visibles. El precio debe actualizarse **en tiempo real** (Vistaprint, Moo, 4over hacen esto bien).

#### 2. Cotizador en tiempo real

- Mostrar precio actualizado al cambiar cualquier opción.
- Mostrar "precio unitario" y "precio total".
- Tabla visible de descuentos por cantidad: "100 pzs → $5 c/u | 500 pzs → $3.50 c/u | 1000 pzs → $2.80 c/u".

#### 3. Subida de archivo + preflight automático

Cuando el cliente sube su arte, validar automáticamente:
- **Formato**: PDF, AI, EPS preferido (rechazar JPG/PNG para producción).
- **Resolución mínima**: 300 DPI en tamaño real.
- **Espacio de color**: CMYK (rechazar o convertir desde RGB con advertencia).
- **Sangrado (bleed)**: mínimo 3mm por lado (configurable por producto).
- **Fuentes embebidas / convertidas a curvas**.
- **Tamaño de archivo**: máximo configurable (50MB típico).

Si falla, mostrar **reporte específico y accionable**: "Tu archivo está en RGB. Lo convertimos automáticamente a CMYK, pero los colores pueden variar ligeramente. ¿Continuar?"

Engines de referencia: **callas pdfToolbox**, **Enfocus PitStop**, o reglas propias con Ghostscript + ImageMagick.

#### 4. Flujo de aprobación de prueba

Estados de orden específicos para imprenta:

```
recibido → pago confirmado → revisión de arte → prueba enviada → 
    ↓
    cliente aprueba → en producción → impreso → empacado → enviado → entregado
    ↓
    cliente solicita cambios → revisión → nueva prueba (loop)
```

- **Prueba digital** (PDF de baja resolución con marcas de corte) enviada por email + dashboard.
- Botones claros: "Aprobar para producción" / "Solicitar cambios".
- Una vez aprobado, **no se puede cancelar sin penalización**.

#### 5. Re-orden de trabajos previos

- En el historial, botón "Reordenar" en cada trabajo pasado.
- Usa el mismo archivo, misma configuración.
- Permite cambiar cantidad fácilmente.
- **Crítico para clientes recurrentes** (empresas que piden tarjetas/papelería cada mes).

#### 6. Cotización personalizada (jobs fuera de catálogo)

- Formulario: tipo de trabajo, especificaciones, archivos de referencia, fecha requerida.
- No es compra inmediata — genera un ticket/cotización que el vendedor responde.

#### 7. Editor online (opcional, alto valor)

- Cliente puede diseñar directamente en el navegador (tarjetas, invitaciones, etiquetas).
- Plantillas pre-diseñadas + uploads de logos.
- Tecnologías: Fabric.js, Konva.js, Paper.js, o soluciones SaaS como DesignNbuy, PrintXpand, Customer's Canvas.

### Referencias del sector imprenta

Empresas que tienen este flujo bien resuelto, vale la pena estudiar sus UX:

- **Vistaprint** (vistaprint.com) — el referente global, B2C masivo
- **Moo** (moo.com) — premium, UX impecable
- **4over** / **4over4.com** — B2B/trade printing
- **GotPrint** — competidor directo de Vistaprint
- **Printful** / **Printify** — print-on-demand integrado con e-commerce
- **MX**: Imprenta Online (imprentaonline.mx), Pixart Printing (LatAm)

---

## Estadísticas clave que debes conocer

| Métrica | Valor | Fuente |
|---|---|---|
| Abandono promedio de carrito | 70.19% | Baymard, 2024-2025 |
| Abandono en mobile | 85.65% | Baymard |
| Sitios con PDP "buena" | 18% | Baymard |
| Sitios con navegación "mediocre o peor" | 67% | Baymard |
| Abandono por costos extra inesperados | 48% | Baymard |
| Abandono por creación forzada de cuenta | 26% | Baymard |
| Abandono por desconfianza en seguridad | 25% | Baymard |
| Abandono por entrega lenta | 23% | Baymard |
| Abandono por costo total no calculable | 21% | Baymard |
| Abandono por política de devolución insatisfactoria | 18% | Baymard |
| Abandono por errores técnicos | 17% | Baymard |
| Abandono por checkout largo/complicado | 17-22% | Baymard |
| Recuperación posible optimizando checkout | 35.26% | Baymard |
| Pérdida en mobile por carga >3s | 53% | Deloitte / mobile UX studies |
| Conversión perdida por 1s extra de carga | 7% | Akamai / web.dev |
| Promedio de campos en checkout | 14.88 | Baymard |
| Campos óptimos en checkout | 7-8 | Baymard |
| Aumento de conversión con video en PDP | +144% (add-to-cart) | Multiple studies |
| Importancia de calidad de imagen en decisión | 67% lo cita como #1 | Multiple studies |

---

## Estándares técnicos complementarios

### Schema.org — Datos estructurados

Implementar JSON-LD para que Google muestre rich snippets:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Tarjetas de presentación premium",
  "image": ["https://..."],
  "description": "...",
  "sku": "TB-001",
  "brand": { "@type": "Brand", "name": "TuImprenta" },
  "offers": {
    "@type": "Offer",
    "url": "https://...",
    "priceCurrency": "MXN",
    "price": "350.00",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

Schemas mínimos a implementar:
- `Product` + `Offer` + `AggregateRating` en cada PDP
- `BreadcrumbList` en cualquier página interna
- `Organization` en home
- `WebSite` con `SearchAction` (search box en Google)
- `FAQPage` si tienes FAQs

Validar en: `https://search.google.com/test/rich-results`

### WCAG 2.2 — Accesibilidad (nivel AA mínimo)

- **Contraste**: 4.5:1 para texto normal, 3:1 para texto grande.
- **Navegable con teclado**: todos los flujos funcionan sin mouse.
- **Alt text en todas las imágenes** de producto (incluido SEO).
- **Labels en todos los inputs** del checkout.
- **Estados de focus visibles**.
- **No usar solo color** para indicar errores (también ícono + texto).
- **Tamaño de tap targets**: mínimo 24×24 px (mejor 44×44).

En México empieza a ser legalmente exigible para empresas con presencia digital significativa.

### Web Vitals (Performance)

- **LCP** ≤ 2.5s
- **INP** ≤ 200ms
- **CLS** ≤ 0.1

Medir con: PageSpeed Insights, Lighthouse, Chrome User Experience Report.

### Seguridad

- **HTTPS obligatorio** (Let's Encrypt es gratis).
- **PCI DSS**: si usas Stripe/Mercado Pago/Conekta, ellos manejan el cumplimiento. Si tocas datos de tarjeta directamente, es un problema serio.
- **CSP (Content Security Policy)** headers.
- **Rate limiting** en login, checkout, registros para evitar bots.

---

## Recursos y dónde descargar

### Lo más cercano a "el PDF maestro"

- **Baymard Checkout Optimization Report** (PDF, ~80 páginas, gratis): buscar en Google "Baymard Checkout Optimization Report PDF". Mirror en Scribd: `scribd.com/document/793114501/Baymard-Checkout-Optimization-Report-US`

### Artículos gratuitos de Baymard por tema

- **Hub principal**: `https://baymard.com/blog`
- **Homepage & Navegación**: `https://baymard.com/blog/collections/homepage-and-category`
- **Búsqueda**: `https://baymard.com/research/eCommerce-search` (25 artículos gratis)
- **PDP**: `https://baymard.com/research/product-page`
- **Carrito & Checkout**: `https://baymard.com/research/checkout-usability`
- **Benchmark público (ejemplos reales)**: `https://baymard.com/ux-benchmark`
- **Page Design tool (capturas comentadas)**: `https://baymard.com/ce`

**Tip de descarga masiva**: usa la extensión **SingleFile** de Chrome para guardar artículos como HTML offline, o Ctrl+P → "Guardar como PDF".

### Otras fuentes

- **Nielsen Norman Group**: `https://www.nngroup.com/articles/` (filtrar por "E-commerce")
- **Smashing Magazine — categoría e-commerce**: `https://www.smashingmagazine.com/category/e-commerce/`
- **Shopify Enterprise blog**: bueno para casos de estudio reales
- **Google web.dev — Commerce**: `https://web.dev/articles?category=commerce`
- **Schema.org docs**: `https://schema.org/Product`
- **WCAG 2.2 Quick Reference**: `https://www.w3.org/WAI/WCAG22/quickref/`

### Para web-to-print específicamente

- **DesignNbuy** (`designnbuy.com/blog`) — patterns de UX para imprenta
- **PrintXpand** (`printxpand.com`) — preflight y configurador
- **printQ** (`web-to-printq.com`) — workflows B2B/B2C
- Estudiar PDPs de **Vistaprint** y **Moo** directamente

---

## Checklist mínimo para lanzar

Antes de lanzar un e-commerce, verifica:

- [ ] Homepage carga en < 2.5s (LCP)
- [ ] Navegación clara con categorías clickeables
- [ ] Búsqueda con autocomplete
- [ ] PDP con mínimo 5 imágenes, zoom, variantes, stock, envío estimado
- [ ] Botón "Add to cart" prominente arriba del fold
- [ ] Mini-carrito (drawer o dropdown) al agregar
- [ ] Carrito persistente entre sesiones
- [ ] Checkout permite guest (sin obligar cuenta)
- [ ] Checkout en máximo 8 campos
- [ ] Costos totales visibles antes del paso de pago
- [ ] Indicador de progreso en checkout multi-paso
- [ ] Inline validation en formularios
- [ ] Email transaccional de confirmación inmediato
- [ ] HTTPS en todo el sitio
- [ ] Mobile probado en dispositivo real (no solo DevTools)
- [ ] Política de devoluciones, envío, privacidad accesibles desde footer
- [ ] Schema.org `Product` + `Offer` implementado
- [ ] Cumple WCAG 2.2 nivel AA (mínimo)
- [ ] Métodos de pago locales (en MX: tarjeta, OXXO, MSI)
- [ ] WhatsApp Business o chat visible
- [ ] Analytics + tracking de eventos del embudo (GA4, Meta Pixel)

### Para imprenta, además:

- [ ] Configurador con precio en tiempo real
- [ ] Upload de archivo con preflight automático
- [ ] Reporte de errores accionable si el archivo no pasa
- [ ] Flujo de aprobación de prueba digital
- [ ] Estados de orden específicos del workflow de imprenta
- [ ] Botón de re-ordenar en historial
- [ ] Formulario de cotización para trabajos fuera de catálogo

---

*Documento compilado a partir de la investigación pública de Baymard Institute, Nielsen Norman Group, W3C/WAI, Schema.org y casos de estudio del sector web-to-print. Para profundizar en cualquier sección, los enlaces a fuentes originales están en "Recursos y dónde descargar".*
