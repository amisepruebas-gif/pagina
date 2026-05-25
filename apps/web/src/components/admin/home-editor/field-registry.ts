import type { IconName } from '@/components/ui';
import type { HomeSectionId } from '@/types/home-config';

/**
 * field-registry — esquema declarativo de qué se puede editar en cada
 * sección del Home. El panel del editor lee este registro para saber qué
 * controles dibujar; no contiene lógica, solo descripción.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'color'
  | 'select'
  | 'array'
  | 'image'
  | 'products'
  | 'categories';

/** Tipo de cada subcampo dentro de un array (ej. una tarjeta del collage). */
export type ItemFieldType = 'text' | 'textarea' | 'color' | 'icon' | 'image';

export interface ItemFieldDef {
  /** Clave dentro del objeto del item, ej. 'value'. */
  key: string;
  label: string;
  type: ItemFieldType;
  placeholder?: string;
}

export interface FieldDef {
  /** Ruta absoluta dentro de HomeConfig, ej. 'hero.badge'. */
  path: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  /** Solo para `number` y `range`. */
  min?: number;
  max?: number;
  /** Solo para `select`: opciones disponibles. */
  options?: { value: string; label: string }[];
  /** Solo para `array`: definición de cada subcampo del item. */
  itemFields?: ItemFieldDef[];
  /** Solo para `array`: sustantivo singular de cada item (ej. "Tarjeta"). */
  itemNoun?: string;
  /** Solo para `array`: permite agregar y quitar items. */
  addable?: boolean;
  /** Solo para `array` con `addable`: plantilla del item nuevo. */
  newItem?: unknown;
  /**
   * Condición de visibilidad. Si se define, el campo solo aparece en el
   * panel cuando el valor de `path` cumple `equals` o es truthy.
   */
  showIf?: {
    path: string;
    equals?: unknown;
    truthy?: boolean;
  };
}

/** Iconos ofrecidos en los selectores de icono (subconjunto curado). */
export const ICON_OPTIONS: IconName[] = [
  'truck',
  'shield',
  'refresh',
  'spark',
  'bolt',
  'check',
  'heart',
  'star',
  'tag',
  'grid',
  'user',
  'cart',
  'search',
  'eye',
  'info'
];

export const FIELD_REGISTRY: Record<HomeSectionId, FieldDef[]> = {
  hero: [
    { path: 'hero.badge', label: 'Insignia', type: 'text' },
    { path: 'hero.titlePre', label: 'Título — inicio', type: 'text' },
    {
      path: 'hero.titleAccent',
      label: 'Título — palabra destacada',
      type: 'text'
    },
    { path: 'hero.titlePost', label: 'Título — final', type: 'text' },
    { path: 'hero.paragraph', label: 'Párrafo', type: 'textarea' },
    {
      path: 'hero.primaryCta.label',
      label: 'Botón principal — texto',
      type: 'text'
    },
    {
      path: 'hero.primaryCta.href',
      label: 'Botón principal — enlace',
      type: 'text',
      placeholder: '/shop'
    },
    {
      path: 'hero.secondaryCta.label',
      label: 'Botón secundario — texto',
      type: 'text'
    },
    {
      path: 'hero.secondaryCta.href',
      label: 'Botón secundario — enlace',
      type: 'text',
      placeholder: '/shop?sale=true'
    },
    {
      path: 'hero.stats',
      label: 'Estadísticas',
      type: 'array',
      itemNoun: 'Dato',
      itemFields: [
        { key: 'value', label: 'Valor', type: 'text' },
        { key: 'label', label: 'Etiqueta', type: 'text' }
      ]
    },
    {
      path: 'hero.cards',
      label: 'Tarjetas del collage',
      type: 'array',
      itemNoun: 'Tarjeta',
      itemFields: [
        { key: 'imageUrl', label: 'Imagen', type: 'image' },
        {
          key: 'href',
          label: 'Enlace al hacer clic',
          type: 'text',
          placeholder: '/shop'
        },
        {
          key: 'label',
          label: 'Etiqueta (si no hay imagen)',
          type: 'text'
        },
        {
          key: 'accent',
          label: 'Color (si no hay imagen)',
          type: 'color'
        }
      ]
    },
    {
      path: 'hero.discountTop',
      label: 'Insignia circular — línea superior',
      type: 'text'
    },
    {
      path: 'hero.discountValue',
      label: 'Insignia circular — valor',
      type: 'text'
    },
    {
      path: 'hero.backgroundImages',
      label: 'Imágenes de fondo (slider)',
      type: 'array',
      itemNoun: 'Imagen',
      addable: true,
      newItem: { url: '' },
      itemFields: [{ key: 'url', label: 'Imagen', type: 'image' }]
    },
    {
      path: 'hero.overlayColor',
      label: 'Capa de color sobre el fondo',
      type: 'color'
    },
    {
      path: 'hero.overlayOpacity',
      label: 'Opacidad de la capa (%)',
      type: 'range',
      min: 0,
      max: 100
    },
    {
      path: 'hero.textTone',
      label: 'Tono del texto',
      type: 'select',
      options: [
        { value: 'dark', label: 'Oscuro (para fondos claros)' },
        { value: 'light', label: 'Claro (para fondos oscuros)' }
      ]
    }
  ],
  trustBar: [
    {
      path: 'trustBar.items',
      label: 'Beneficios',
      type: 'array',
      itemNoun: 'Beneficio',
      itemFields: [
        { key: 'icon', label: 'Icono', type: 'icon' },
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'sub', label: 'Descripción', type: 'text' }
      ]
    }
  ],
  categoryGrid: [
    { path: 'categoryGrid.eyebrow', label: 'Antetítulo', type: 'text' },
    { path: 'categoryGrid.titlePre', label: 'Título — inicio', type: 'text' },
    {
      path: 'categoryGrid.titleAccent',
      label: 'Título — palabra destacada',
      type: 'text'
    },
    { path: 'categoryGrid.cta.label', label: 'Botón — texto', type: 'text' },
    {
      path: 'categoryGrid.cta.href',
      label: 'Botón — enlace',
      type: 'text',
      placeholder: '/shop'
    },
    {
      path: 'categoryGrid.categoryIds',
      label: 'Categorías a mostrar (vacío = todas)',
      type: 'categories'
    }
  ],
  featured: [
    { path: 'featured.eyebrow', label: 'Antetítulo', type: 'text' },
    { path: 'featured.titlePre', label: 'Título — inicio', type: 'text' },
    {
      path: 'featured.titleAccent',
      label: 'Título — palabra destacada',
      type: 'text'
    },
    { path: 'featured.paragraph', label: 'Párrafo', type: 'textarea' },
    {
      path: 'featured.productIds',
      label: 'Productos de la sección',
      type: 'products'
    }
  ],
  promoBanner: [
    { path: 'promoBanner.badge', label: 'Insignia', type: 'text' },
    { path: 'promoBanner.title', label: 'Título', type: 'textarea' },
    { path: 'promoBanner.paragraph', label: 'Párrafo', type: 'textarea' },
    {
      path: 'promoBanner.primaryCta.label',
      label: 'Botón principal — texto',
      type: 'text'
    },
    {
      path: 'promoBanner.primaryCta.href',
      label: 'Botón principal — enlace',
      type: 'text'
    },
    {
      path: 'promoBanner.secondaryCta.label',
      label: 'Botón secundario — texto',
      type: 'text'
    },
    {
      path: 'promoBanner.secondaryCta.href',
      label: 'Botón secundario — enlace',
      type: 'text'
    },
    {
      path: 'promoBanner.bgImageUrl',
      label: 'Imagen de fondo (opcional)',
      type: 'image'
    },
    {
      path: 'promoBanner.bgImageOpacity',
      label: 'Imagen — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100,
      showIf: { path: 'promoBanner.bgImageUrl', truthy: true }
    },
    {
      path: 'promoBanner.coverType',
      label: 'Capa — tipo',
      type: 'select',
      options: [
        { value: 'gradient', label: 'Gradiente (2 colores)' },
        { value: 'solid', label: 'Color sólido' }
      ]
    },
    {
      path: 'promoBanner.coverFrom',
      label: 'Capa — color inicial / sólido',
      type: 'color'
    },
    {
      path: 'promoBanner.coverTo',
      label: 'Capa — color final',
      type: 'color',
      showIf: { path: 'promoBanner.coverType', equals: 'gradient' }
    },
    {
      path: 'promoBanner.coverOpacity',
      label: 'Capa — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100
    },
    {
      path: 'promoBanner.blob1Color',
      label: 'Mancha decorativa — superior derecha',
      type: 'color'
    },
    {
      path: 'promoBanner.blob2Color',
      label: 'Mancha decorativa — inferior',
      type: 'color'
    },
    {
      path: 'promoBanner.cards',
      label: 'Tarjetas del banner',
      type: 'array',
      itemNoun: 'Tarjeta',
      itemFields: [
        { key: 'imageUrl', label: 'Imagen', type: 'image' },
        {
          key: 'href',
          label: 'Enlace al hacer clic',
          type: 'text',
          placeholder: '/shop'
        },
        {
          key: 'label',
          label: 'Etiqueta (si no hay imagen)',
          type: 'text'
        },
        {
          key: 'accent',
          label: 'Color (si no hay imagen)',
          type: 'color'
        }
      ]
    }
  ],
  newArrivals: [
    { path: 'newArrivals.eyebrow', label: 'Antetítulo', type: 'text' },
    { path: 'newArrivals.titlePre', label: 'Título — inicio', type: 'text' },
    {
      path: 'newArrivals.titleAccent',
      label: 'Título — palabra destacada',
      type: 'text'
    },
    {
      path: 'newArrivals.productIds',
      label: 'Productos de la sección',
      type: 'products'
    }
  ],
  flashSale: [
    { path: 'flashSale.badge', label: 'Insignia', type: 'text' },
    { path: 'flashSale.title', label: 'Título', type: 'text' },
    {
      path: 'flashSale.countdownHours',
      label: 'Contador — horas',
      type: 'number',
      min: 0,
      max: 99
    },
    {
      path: 'flashSale.countdownMinutes',
      label: 'Contador — minutos',
      type: 'number',
      min: 0,
      max: 59
    },
    {
      path: 'flashSale.countdownSeconds',
      label: 'Contador — segundos',
      type: 'number',
      min: 0,
      max: 59
    },
    {
      path: 'flashSale.bgImageUrl',
      label: 'Imagen de fondo (opcional)',
      type: 'image'
    },
    {
      path: 'flashSale.bgImageOpacity',
      label: 'Imagen — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100,
      showIf: { path: 'flashSale.bgImageUrl', truthy: true }
    },
    {
      path: 'flashSale.coverType',
      label: 'Capa — tipo',
      type: 'select',
      options: [
        { value: 'gradient', label: 'Gradiente (2 colores)' },
        { value: 'solid', label: 'Color sólido' }
      ]
    },
    {
      path: 'flashSale.coverFrom',
      label: 'Capa — color inicial / sólido',
      type: 'color'
    },
    {
      path: 'flashSale.coverTo',
      label: 'Capa — color final',
      type: 'color',
      showIf: { path: 'flashSale.coverType', equals: 'gradient' }
    },
    {
      path: 'flashSale.coverOpacity',
      label: 'Capa — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100
    },
    {
      path: 'flashSale.blob1Color',
      label: 'Mancha decorativa — superior izquierda',
      type: 'color'
    },
    {
      path: 'flashSale.titleShadow',
      label: 'Sombra del título — activar',
      type: 'select',
      options: [
        { value: 'off', label: 'Desactivada' },
        { value: 'on', label: 'Activada' }
      ]
    },
    {
      path: 'flashSale.titleShadowColor',
      label: 'Sombra del título — color',
      type: 'color',
      showIf: { path: 'flashSale.titleShadow', equals: 'on' }
    },
    {
      path: 'flashSale.titleShadowBlur',
      label: 'Sombra del título — difuminado (px)',
      type: 'range',
      min: 0,
      max: 40,
      showIf: { path: 'flashSale.titleShadow', equals: 'on' }
    },
    {
      path: 'flashSale.titleShadowOpacity',
      label: 'Sombra del título — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100,
      showIf: { path: 'flashSale.titleShadow', equals: 'on' }
    },
    {
      path: 'flashSale.countdownShadow',
      label: 'Sombra del contador — activar',
      type: 'select',
      options: [
        { value: 'off', label: 'Desactivada' },
        { value: 'on', label: 'Activada' }
      ]
    },
    {
      path: 'flashSale.countdownShadowColor',
      label: 'Sombra del contador — color',
      type: 'color',
      showIf: { path: 'flashSale.countdownShadow', equals: 'on' }
    },
    {
      path: 'flashSale.countdownShadowBlur',
      label: 'Sombra del contador — difuminado (px)',
      type: 'range',
      min: 0,
      max: 40,
      showIf: { path: 'flashSale.countdownShadow', equals: 'on' }
    },
    {
      path: 'flashSale.countdownShadowOpacity',
      label: 'Sombra del contador — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100,
      showIf: { path: 'flashSale.countdownShadow', equals: 'on' }
    },
    {
      path: 'flashSale.productIds',
      label: 'Productos en oferta',
      type: 'products'
    }
  ],
  bestSellers: [
    { path: 'bestSellers.eyebrow', label: 'Antetítulo', type: 'text' },
    { path: 'bestSellers.titlePre', label: 'Título — inicio', type: 'text' },
    {
      path: 'bestSellers.titleAccent',
      label: 'Título — palabra destacada',
      type: 'text'
    },
    { path: 'bestSellers.cta.label', label: 'Botón — texto', type: 'text' },
    {
      path: 'bestSellers.cta.href',
      label: 'Botón — enlace',
      type: 'text',
      placeholder: '/shop'
    },
    {
      path: 'bestSellers.productIds',
      label: 'Productos de la sección',
      type: 'products'
    }
  ],
  newsletter: [
    { path: 'newsletter.title', label: 'Título', type: 'text' },
    { path: 'newsletter.paragraph', label: 'Párrafo', type: 'textarea' },
    {
      path: 'newsletter.placeholder',
      label: 'Texto del campo de email',
      type: 'text'
    },
    { path: 'newsletter.ctaLabel', label: 'Botón — texto', type: 'text' },
    { path: 'newsletter.note', label: 'Nota inferior', type: 'text' },
    {
      path: 'newsletter.bgImageUrl',
      label: 'Imagen de fondo (opcional)',
      type: 'image'
    },
    {
      path: 'newsletter.bgImageOpacity',
      label: 'Imagen — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100,
      showIf: { path: 'newsletter.bgImageUrl', truthy: true }
    },
    {
      path: 'newsletter.coverType',
      label: 'Capa — tipo',
      type: 'select',
      options: [
        { value: 'gradient', label: 'Gradiente (2 colores)' },
        { value: 'solid', label: 'Color sólido' }
      ]
    },
    {
      path: 'newsletter.coverFrom',
      label: 'Capa — color inicial / sólido',
      type: 'color'
    },
    {
      path: 'newsletter.coverTo',
      label: 'Capa — color final',
      type: 'color',
      showIf: { path: 'newsletter.coverType', equals: 'gradient' }
    },
    {
      path: 'newsletter.coverOpacity',
      label: 'Capa — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100
    },
    {
      path: 'newsletter.blob1Color',
      label: 'Mancha decorativa — izquierda',
      type: 'color'
    },
    {
      path: 'newsletter.blob1Opacity',
      label: 'Mancha izquierda — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100
    },
    {
      path: 'newsletter.blob2Color',
      label: 'Mancha decorativa — derecha',
      type: 'color'
    },
    {
      path: 'newsletter.blob2Opacity',
      label: 'Mancha derecha — opacidad (%)',
      type: 'range',
      min: 0,
      max: 100
    }
  ]
};
