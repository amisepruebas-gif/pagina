export type Product = {
  id: string | number;
  /** Marca o vendedor */
  brand: string;
  /** Etiqueta corta para el placeholder (ej. "TENIS · M") */
  label?: string;
  /** Nombre del producto */
  name: string;
  /** URL de la imagen principal */
  image?: string;
  /** Precio actual */
  price: number;
  /** Precio anterior (tachado) — si está, se calcula el descuento */
  oldPrice?: number;
  /** Calificación promedio 0–5 */
  rating?: number;
  /** Número de reseñas */
  reviews?: number;
  /** Tag corto (ej. "Nuevo", "Top") */
  tag?: string;
  /** Color hex para el "blob" de acento del placeholder */
  accent?: string;
  /** Tallas disponibles, mostradas en quick-actions */
  sizes?: string[];
  /** Stock restante, usado en variante discount */
  stock?: number;
  /** Estado inicial del corazón */
  fav?: boolean;
};

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type Size = "sm" | "md" | "lg";
export type BadgeTone =
  | "brand" | "gradient" | "secondary" | "accent"
  | "success" | "error" | "warning" | "info" | "neutral";
