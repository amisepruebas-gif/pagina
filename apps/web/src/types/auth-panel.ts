/**
 * AuthPanelConfig — contenido editable del panel lateral en /login,
 * /register y /forgot-password. Mismo patrón que PromoBanner / FlashSale /
 * Newsletter: imagen de fondo opcional + capa de color (gradiente o sólido) +
 * dos blobs decorativos con color y opacidad ajustables.
 *
 * Se persiste como documento único `config/authPanel` en Firestore (read
 * público, write solo admin según las rules existentes para `config/{id}`).
 */

export type PanelCoverType = 'gradient' | 'solid';

export interface AuthPanelConfig {
  /**
   * Imagen de fondo. String vacío = sin imagen (en vez de undefined,
   * porque Firestore rechaza undefined en setDoc).
   */
  bgImageUrl: string;
  /** Opacidad de la imagen, 0–100 (solo aplica si hay imagen). */
  bgImageOpacity: number;
  /**
   * Capa de color que va ENCIMA de la imagen. Si no hay imagen, ES el fondo.
   * Mismo patrón que el resto del sistema.
   */
  coverType: PanelCoverType;
  coverFrom: string;
  coverTo: string;
  /** Opacidad de la capa, 0–100. */
  coverOpacity: number;
  /** Mancha decorativa superior derecha. */
  blob1Color: string;
  blob1Opacity: number;
  /** Mancha decorativa inferior izquierda. */
  blob2Color: string;
  blob2Opacity: number;
}

/**
 * Valores por defecto — replican el aspecto actual del panel (gradient
 * `linear-gradient(135deg,var(--brand-500),var(--brand-700),var(--accent-2))`
 * con blobs `var(--accent)` opacity 50% y `var(--secondary)` opacity 45%).
 *
 * Las CSS vars del tema no están disponibles en este archivo, así que los
 * defaults usan hex equivalentes razonables. El usuario puede ajustarlos
 * desde el editor.
 */
export const DEFAULT_AUTH_PANEL_CONFIG: AuthPanelConfig = {
  bgImageUrl: '',
  bgImageOpacity: 100,
  coverType: 'gradient',
  coverFrom: '#FF5C8A',
  coverTo: '#7C3AED',
  coverOpacity: 100,
  blob1Color: '#FFD23F',
  blob1Opacity: 50,
  blob2Color: '#00D97A',
  blob2Opacity: 45
};
