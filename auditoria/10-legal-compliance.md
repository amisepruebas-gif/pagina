# 10 — Legal y compliance

## Por qué importa
En México: LFPDPPP (datos personales), CFF (facturación), PROFECO (consumidor). Internacional: GDPR (si llegan visitantes de UE) y CCPA (visitantes de California). Una multa de PROFECO o un reporte a INAI duele más que cualquier bug.

## Qué se evalúa típicamente
- **Aviso de privacidad** completo: datos recolectados, finalidad, transferencias, derechos ARCO, contacto del responsable.
- **Términos y condiciones**: precios, envíos, cambios, devoluciones, garantía, jurisdicción.
- **Política de cookies** + banner de consentimiento si se usa tracking (GA, Meta Pixel, etc.).
- **Derechos ARCO**: el usuario debe poder Acceder, Rectificar, Cancelar y Oponerse al uso de sus datos. En la práctica: ver perfil, editar, eliminar cuenta.
- **Eliminación de cuenta**: hard delete o anonimización (LFPDPPP exige).
- **Retención de datos**: cuánto se guarda y cuándo se borra (pedidos suelen ser 5 años por SAT/contabilidad).
- **PCI-DSS**: si se procesa tarjeta. Con Stripe Checkout / Stripe Hosted, el merchant es SAQ A (mínimo) — Stripe maneja el PAN.
- **Edad mínima**: si el catálogo incluye productos restringidos.
- **Facturación**: opción de pedir factura con RFC + uso CFDI. Integración con PAC opcional.
- **Aviso de modificación de términos**: notificación al usuario cuando cambian.

## Plan para `pagina`

- [ ] Revisar `apps/web/src/app/(public)/privacidad/page.tsx`:
  - Datos que se recolectan (nombre, email, teléfono, dirección, IP, cookies, comportamiento de navegación).
  - Finalidad (envío de pedidos, marketing si aplica, mejora del servicio).
  - Transferencias (Stripe, Firebase/Google Cloud, Vercel, Cloud Functions, proveedor de email).
  - Derechos ARCO y cómo ejercerlos (email de contacto, formulario).
  - Datos del responsable (razón social, domicilio, contacto).
- [ ] Revisar `apps/web/src/app/(public)/terminos/page.tsx`:
  - Modalidad de venta (online), formación del contrato.
  - Precios incluyen IVA (si aplica), moneda MXN.
  - Costos de envío, plazos.
  - Política de devoluciones — debe ser consistente con `/devoluciones`.
  - Garantías, defectos, devolución de dinero.
  - Jurisdicción (Tribunales de la CDMX o el domicilio del proveedor).
- [ ] Revisar `apps/web/src/app/(public)/devoluciones/page.tsx` y `/envios`: claros, sin contradicciones con T&C.
- [ ] **Eliminación de cuenta**: agregar en `/mi-cuenta` un botón "Eliminar mi cuenta". Implementación: Cloud Function callable que (1) anonimiza pedidos (`userId` → `deleted_<hash>`), (2) borra auth user, (3) borra cart/wishlist/profile. **Pendiente verificar si existe.**
- [ ] **Cookies / consentimiento**: si se agrega GA4 o Meta Pixel (ver `07-observabilidad.md`), agregar banner de consentimiento mínimo (aceptar / rechazar). Si solo se usa Vercel Analytics (sin cookies cross-site), banner opcional.
- [ ] **Edad mínima** y categorías sensibles: ¿hay productos para adultos? Si sí, gate de edad. Si no, ignorar.
- [ ] **Facturación**: ¿se permite pedir factura? Hoy probablemente no. Plan: en `/checkout/success` agregar opción "Solicitar factura" que abra un formulario con RFC + uso CFDI + email fiscal. Manualmente generar al inicio; integrar PAC después.
- [ ] **PCI-DSS**: con Stripe Checkout estamos en SAQ A (el cliente más simple). Documentar en `auditoria/10-legal-compliance.md` que es la modalidad usada. Nunca aceptar tarjetas en formularios propios — siempre redirect a Stripe.
- [ ] **Versionado de política**: agregar fecha de "Última actualización" en privacidad y T&C; notificar a usuarios al cambiar (banner o email).
- [ ] **Logs con PII**: revisar que `console.log` no esté soltando emails, direcciones o cualquier dato sensible en producción.

## Cómo ejecutar
- Plantilla del IFAI / INAI para aviso de privacidad integral.
- PROFECO: leer la NOM-024-SCFI-2018 (comercio electrónico).
- Stripe: confirmar SAQ A en el dashboard.
- Revisar manualmente cada texto legal.

## Notas preliminares
- Ya existen rutas `/privacidad`, `/terminos`, `/devoluciones`, `/envios` (vi en build output). Falta auditar el contenido real.
- Stripe Checkout: el merchant es SAQ A — bien.
- No vi gestión explícita de "eliminar cuenta" en `/mi-cuenta` (no leí el archivo). Verificar.
- Memory no menciona facturación CFDI.

## Estado
Pendiente
