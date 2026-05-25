/**
 * Convierte un texto en slug url-friendly: minúsculas, sin acentos, kebab.
 * "Llavero Tipo Á" → "llavero-tipo-a"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
