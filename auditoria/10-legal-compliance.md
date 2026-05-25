# 10 — Legal y compliance

## Por qué importa
En México: LFPDPPP (datos personales), CFF (facturación), PROFECO (consumidor). Internacional: GDPR / CCPA si entra tráfico de fuera. Una multa de PROFECO o un reporte a INAI duele más que cualquier bug.

## Qué se evalúa típicamente
- Aviso de privacidad completo.
- Términos y condiciones.
- Política de cookies + consentimiento si aplica.
- Derechos ARCO ejecutables.
- Eliminación de cuenta.
- Retención de datos.
- PCI-DSS (modalidad).
- Facturación (CFDI en MX).

---

## Hallazgos (auditoría 2026-05-24)

### Lo que está bien

**Páginas legales presentes y enlazadas**: `/privacidad`, `/terminos`, `/devoluciones`, `/envios` — todas con `metadata.title` propia y estructura HTML semántica.

**Devoluciones (`/devoluciones`)** — la mejor de las cuatro:
- Plazo claro (30 días naturales).
- Condiciones específicas (empaque, accesorios, comprobante).
- Excepción explícita para personalizados (clave: MX-imprenta no aplica devolución salvo defecto).
- Flujo definido para iniciar (Mi cuenta → Quejas).
- Tiempos de reembolso documentados (5-10 días hábiles).

**PCI-DSS**: con Stripe Checkout Hosted, somos SAQ A (el nivel más simple — Stripe maneja el PAN, nosotros solo redireccionamos). Documentado implícitamente en el flujo del código.

**Sin imports de GA4 / Meta Pixel detectados** → hoy no se necesita banner de cookies. Cuando se agregue analytics con cookies, sí.

### Hallazgos con acción

**🔴 ALTA — No hay opción "Eliminar mi cuenta"**
`Grep "eliminar.*cuenta|borrar.*cuenta|delete.*account"` → 0 matches. La LFPDPPP exige que el usuario pueda ejercer **derecho de Cancelación** (la "C" de ARCO). Hoy solo está la promesa textual en `/privacidad` de que se atiende por contacto — válido pero engorroso.

**Pendiente** — backlog:
- Cloud Function callable `deleteMyAccount`:
  1. Anonimiza órdenes pasadas (`userId` → `deleted_<hash>`, `customer.email` → `deleted@anon`, conservar el doc por contabilidad SAT 5 años).
  2. Borra `users/{uid}` + subcolecciones `addresses`, `favorites`.
  3. Borra `carts/{uid}`.
  4. `getAuth().deleteUser(uid)`.
- UI en `/mi-cuenta`: botón rojo con confirm modal de doble paso.

**🟡 MEDIA — Aviso de privacidad incompleto para LFPDPPP**
`apps/web/src/app/(public)/privacidad/page.tsx` cubre lo básico pero falta:
1. **Identidad y domicilio del responsable** (razón social, RFC, domicilio fiscal). La LFPDPPP lo exige en el primer párrafo.
2. **Transferencias internacionales explícitas**: Stripe (USA), Google Cloud (USA), Vercel (USA). LFPDPPP exige consentimiento expreso (banner o checkbox al registrar) — al menos mencionarlo.
3. **Email específico para ejercer ARCO** (no "medios disponibles en el sitio").
4. **Cookies y tecnologías similares** (aunque hoy no usemos analytics, sí usamos cookies de sesión Firebase).
5. **Cambios al aviso**: cómo se notifican (¿banner?, ¿email?, ¿última actualización en footer?).
6. **Mención del INAI** como autoridad de protección y URL de su portal.
7. **Fecha de última actualización**.

**Pendiente** — backlog: trabajar el texto con asesoría legal o usando la plantilla de [Aviso de Privacidad Integral INAI](https://home.inai.org.mx/) como referencia.

**🟡 MEDIA — Términos sin información del operador y sin jurisdicción**
`/terminos` falta:
1. **Razón social** del operador.
2. **Domicilio fiscal**.
3. **Jurisdicción**: "Tribunales competentes de [CDMX o donde sea]". Sin esto, en caso de disputa la jurisdicción se decide por defecto y suele ser desfavorable.
4. **Política de cancelación antes del envío** explícita (PROFECO espera ver esto).
5. **Garantía** y procedimiento de reclamo (vs solo "devolución").
6. **Cláusula de terminación**: cuándo se puede negar servicio o cerrar cuenta.

**Pendiente** — backlog: igual que privacidad, redactar con asesoría legal.

**🟡 MEDIA — Sin facturación CFDI**
No hay flujo para que el cliente solicite factura post-compra. En MX, clientes empresariales esperan factura electrónica con su RFC + uso CFDI. Sin esto se pierde una porción del mercado B2B.

**Pendiente** — backlog:
- En `/checkout/success` agregar opción "Solicitar factura" que abra un form con: RFC, Razón social, Uso CFDI (G03/D01/etc.), email fiscal.
- Manual al inicio (admin recibe email y la genera en SAT). Integrar PAC (Facturama, Itroform) cuando vale la pena.

**🟢 BAJA — Sin fecha de "Última actualización" en páginas legales**
Buena práctica: cuando cambien los términos, mostrar al usuario que hubo cambio. Hoy no hay esa señal en el HTML.

**Pendiente** — backlog: agregar `Última actualización: <fecha>` al final de cada página legal.

**🟢 BAJA — `LegalPage` componente uniforme — bien**
Las 4 páginas usan el mismo `LegalPage` wrapper. Cuando se actualice el styling, se aplica a todas. Buen patrón.

---

## Resumen
| Severidad | Encontradas | Resueltas hoy | Pendientes |
|-----------|-------------|---------------|------------|
| Alta | 1 | 0 | 1 (eliminar cuenta) |
| Media | 3 | 0 | 3 (priv completo, T&C completo, CFDI) |
| Baja | 2 | 0 | 2 (fecha actualización) |

Ninguno se arregla hoy: los hallazgos legales necesitan asesoría profesional o decisiones de negocio (razón social, domicilio, jurisdicción). El de "eliminar cuenta" sí se puede atacar técnicamente pero amerita sesión dedicada.

**Crítico para producción seria**: antes de aceptar pagos reales, conviene revisar las páginas legales con un abogado mexicano. Las plantillas INAI son un punto de partida decente.

## Estado
Auditado — sin fixes hoy. Backlog de 6 items, 1 crítico para compliance LFPDPPP (eliminar cuenta).
