# 12 — Operaciones y costos

## Por qué importa
Un proyecto que funciona "casi gratis" hoy puede costar miles al mes si una Cloud Function entra en loop, un bot saturó Firestore, o cada visita carga 50 MB de imágenes desde Storage. Saber qué se cobra y dónde duele permite reaccionar antes del susto.

## Qué se evalúa típicamente
- **Vercel**: builds, bandwidth, function invocations, edge/serverless time, image optimization.
- **Firebase**:
  - Firestore: reads/writes/deletes, document size, storage.
  - Storage: storage, network egress, operations.
  - Functions: invocations, GB-seconds, network egress.
  - Auth: usuarios activos.
  - Hosting (no usado aquí).
- **Stripe**: comisiones por transacción (en MX típicamente 3.6% + 3 MXN por card, distinto para OXXO).
- **Dominio**: renovación anual.
- **Email transaccional** si se usa (SendGrid, Resend, etc.).
- **Observabilidad** si se contrata (Sentry, Datadog).
- **Alertas de budget** activas para no dormirse con la cuenta abierta.
- **Plan adecuado**: Spark vs Blaze (Firebase), Hobby vs Pro (Vercel).

## Plan para `pagina`

- [ ] **Vercel**:
  - Hoy usuario está en plan Pro ($20/mes) — confirmar que es necesario o si Hobby aguanta (no comercial / sin custom domain con SSL gratis).
  - Activar billing alerts: notificar al 50%, 80%, 100% del presupuesto mensual.
  - Vigilar Function Invocations en `/api/checkout/session` y webhook — si los bots empiezan a martillar, agregar rate-limit (ver `01-seguridad.md`).
- [ ] **Firebase Spark vs Blaze**:
  - Spark: gratis pero limitado (50k reads/día, 20k writes, 1 GB storage). Para un piloto sirve.
  - Blaze: pay-as-you-go, requerido para scheduled functions, dominios custom en Hosting, mayor cuota. Cualquier funcionalidad seria pide Blaze.
  - Configurar budget alert en GCP Console.
- [ ] **Firestore reads**:
  - El Home hace varias lecturas: `getHomeConfig` + `getSiteContents` + productos. Por cada visita anónima son ~5-10 reads. Con 10k visitas/mes son 100k reads/mes (apenas dentro de Spark con 50k/día).
  - Optimización: cachear el config del Home con `revalidate` (ISR) — una lectura cada 60 s en vez de cada request.
  - Carrito de usuario: `carts/{uid}` — lectura por cada vez que carga el carrito. Mantener compacto.
- [ ] **Storage egress**: imágenes pesadas servidas directo desde Storage cuestan bandwidth. Pasar por `next/image` con CDN de Vercel reduce egress de Storage. Confirmar que las URL en productos van por `/_next/image?url=…`.
- [ ] **Cloud Functions costo**:
  - `sweepOrphanImages` (scheduled) — ejecuta una vez al día, costo despreciable.
  - Webhook de Stripe — invocación por evento, en arranque despreciable.
  - Si se agregan más Functions, vigilar GB-seconds.
- [ ] **Stripe fees**: en MX, card 3.6% + 3 MXN; OXXO ~3.5%. Documentar para que se considere al fijar precios.
- [ ] **Dominio**: si se compra `gomu.com.mx` u otro, renovar 5 años para no perderlo. Configurar registro en Vercel + DNS records.
- [ ] **Email transaccional**: hoy Stripe envía el recibo (suficiente para arranque). Si se necesita "tu pedido fue enviado", "tu cuenta fue creada", etc., evaluar Resend o SendGrid (planes gratis hasta ~3k emails/mes).
- [ ] **Auto-deploy en Vercel**: confirmado. PR preview → preview URL automática. Producción solo desde `main` (configuración por defecto). Verificar.

## Cómo ejecutar
- Vercel: Dashboard → Project → Settings → Billing.
- GCP: `Console → Billing → Budgets & alerts`.
- Firebase: `Console → Usage and billing`.
- Estimación de Firestore: [pricing calculator](https://firebase.google.com/pricing).
- Stripe: Dashboard → Reports → Fees.

## Notas preliminares
- Vercel Pro confirmado (usuario ya paga $20/mes).
- El proyecto pgina-48477 en Firebase — confirmar si está en Blaze (necesario si hay scheduled functions o Cloud Functions de pago).
- Bandwidth de imágenes hoy es bajo (catálogo pequeño). Crecerá con más productos.
- Memory dice "no probar Stripe" — no medir fees reales hasta primera venta de prueba.

## Estado
Pendiente
