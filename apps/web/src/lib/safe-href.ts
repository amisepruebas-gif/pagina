/**
 * Sanitiza un href editable por un admin antes de renderizarlo en un `<Link>`
 * o un `<a>`. Rechaza esquemas que pueden ejecutar JavaScript al clic
 * (`javascript:`, `data:`, `vbscript:`) y devuelve `'#'` en su lugar.
 *
 * Se aplica en el lado del render — no en el editor — para proteger también
 * documentos ya guardados en Firestore con valores potencialmente maliciosos.
 *
 * Permitido: paths relativos (`/shop`, `/v/algo`), URLs absolutas http(s),
 * `mailto:`, `tel:`.
 */
export function safeHref(href: string | undefined | null): string {
  if (!href) return '#';
  const trimmed = href.trim();
  if (!trimmed) return '#';
  // Match `javascript:`, `data:`, `vbscript:` aunque haya espacios/tabs en
  // el medio del esquema (algunos vectores conocidos).
  if (/^\s*(javascript|data|vbscript)\s*:/i.test(trimmed)) {
    console.warn('[safeHref] rechazado esquema potencialmente peligroso:', href);
    return '#';
  }
  return trimmed;
}
