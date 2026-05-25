'use client';

import DynamicView from '@/components/views/DynamicView';
import type { PageView } from '@/types/page-view';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

const FRAME_W = 220;
const FRAME_H = 132;
const RENDER_W = 1280;
const SCALE = FRAME_W / RENDER_W;
/** La miniatura solo muestra el tope de la vista — basta renderizar los
 *  primeros módulos, evitando montar timers de sliders/countdowns de más. */
const PREVIEW_MODULES = 3;

/**
 * ViewThumbnail — miniatura "en vivo" de una vista: renderiza la vista real
 * (sus primeros módulos) a tamaño completo y la escala. No interactiva.
 */
export function ViewThumbnail({
  view,
  products,
  categories
}: {
  view: PageView;
  products: Product[];
  categories: Category[];
}) {
  const visibleModules = view.modules.filter((m) => m.visible);
  const previewView: PageView = {
    ...view,
    modules: visibleModules.slice(0, PREVIEW_MODULES)
  };

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md border border-border bg-surface-2"
      style={{ width: FRAME_W, height: FRAME_H }}
    >
      {visibleModules.length > 0 ? (
        <div
          aria-hidden
          className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
          style={{ width: RENDER_W, transform: `scale(${SCALE})` }}
        >
          <DynamicView
            view={previewView}
            products={products}
            categories={categories}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-text-soft text-[11px] font-mono">
          Sin contenido
        </div>
      )}
    </div>
  );
}
