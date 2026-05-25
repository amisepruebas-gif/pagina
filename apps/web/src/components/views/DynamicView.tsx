import type { PageView } from '@/types/page-view';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import ViewSlider from './ViewSlider';
import ViewProducts from './ViewProducts';
import ViewPromo from './ViewPromo';
import ViewBanners from './ViewBanners';
import ViewCategories from './ViewCategories';
import ViewVideo from './ViewVideo';

/**
 * Renderiza una "Vista" — itera sus módulos visibles y delega cada uno
 * a su componente según el tipo.
 */
export default function DynamicView({
  view,
  products,
  categories
}: {
  view: PageView;
  products: Product[];
  categories: Category[];
}) {
  const visible = view.modules.filter((m) => m.visible);

  if (visible.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-text-soft text-sm">
        Esta vista todavía no tiene contenido.
      </div>
    );
  }

  return (
    <div>
      {visible.map((m) => {
        switch (m.type) {
          case 'slider':
            return <ViewSlider key={m.id} module={m} />;
          case 'banners':
            return <ViewBanners key={m.id} module={m} />;
          case 'products':
            return <ViewProducts key={m.id} module={m} products={products} />;
          case 'promo':
            return <ViewPromo key={m.id} module={m} products={products} />;
          case 'categories':
            return (
              <ViewCategories key={m.id} module={m} categories={categories} />
            );
          case 'video':
            return <ViewVideo key={m.id} module={m} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
