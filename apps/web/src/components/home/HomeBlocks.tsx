import { Fragment, type ReactNode } from 'react';
import {
  HeroSection,
  TrustBar,
  CategoryGrid,
  FeaturedProducts,
  PromoBanner,
  NewArrivals,
  FlashSale,
  BestSellers,
  Newsletter
} from '@/components/home';
import ViewProducts from '@/components/views/ViewProducts';
import ViewPromo from '@/components/views/ViewPromo';
import ViewBanners from '@/components/views/ViewBanners';
import ViewVideo from '@/components/views/ViewVideo';
import {
  HOME_SECTION_LABELS,
  isNativeBlock,
  type HomeConfig
} from '@/types/home-config';
import { MODULE_LABELS, type ViewModule } from '@/types/page-view';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

export interface HomeBlocksData {
  /** Productos disponibles — las secciones filtran los suyos por id. */
  products: Product[];
  categories: Category[];
}

/** Permite envolver cada bloque (lo usa el editor para hacerlo seleccionable). */
export type BlockWrap = (
  ref: string,
  label: string,
  node: ReactNode
) => ReactNode;

/** Filtra productos por una lista de ids, conservando ese orden. */
function pickProducts(pool: Product[], ids: string[]): Product[] {
  return ids
    .map((id) => pool.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

/** Categorías a mostrar: las elegidas (en orden) o todas si no hay filtro. */
function pickCategories(all: Category[], ids: string[]): Category[] {
  if (ids.length === 0) return all;
  return ids
    .map((id) => all.find((c) => c.id === id))
    .filter((c): c is Category => Boolean(c));
}

function renderNativeBlock(
  ref: string,
  config: HomeConfig,
  data: HomeBlocksData
): ReactNode {
  switch (ref) {
    case 'trustBar':
      return <TrustBar config={config.trustBar} />;
    case 'categoryGrid':
      return (
        <CategoryGrid
          config={config.categoryGrid}
          categories={pickCategories(
            data.categories,
            config.categoryGrid.categoryIds
          )}
        />
      );
    case 'featured':
      return (
        <FeaturedProducts
          config={config.featured}
          products={pickProducts(data.products, config.featured.productIds)}
        />
      );
    case 'promoBanner':
      return <PromoBanner config={config.promoBanner} />;
    case 'newArrivals':
      return (
        <NewArrivals
          config={config.newArrivals}
          products={pickProducts(data.products, config.newArrivals.productIds)}
        />
      );
    case 'flashSale':
      return (
        <FlashSale
          config={config.flashSale}
          products={pickProducts(data.products, config.flashSale.productIds)}
        />
      );
    case 'bestSellers':
      return (
        <BestSellers
          config={config.bestSellers}
          products={pickProducts(data.products, config.bestSellers.productIds)}
        />
      );
    case 'newsletter':
      return <Newsletter config={config.newsletter} />;
    default:
      return null;
  }
}

function renderModuleBlock(m: ViewModule, pool: Product[]): ReactNode {
  switch (m.type) {
    case 'products':
      return <ViewProducts module={m} products={pool} />;
    case 'promo':
      return <ViewPromo module={m} products={pool} />;
    case 'banners':
      return <ViewBanners module={m} />;
    case 'video':
      return <ViewVideo module={m} />;
    default:
      // 'slider' y 'categories' no se agregan al Home.
      return null;
  }
}

/**
 * HomeBlocks — render del Home. El Hero va siempre arriba; el resto se
 * recorre desde `config.layout` (orden + visibilidad), mezclando secciones
 * nativas y módulos agregados. `wrap` permite al editor hacer cada bloque
 * seleccionable; en el sitio público no se pasa.
 */
export function HomeBlocks({
  config,
  data,
  wrap
}: {
  config: HomeConfig;
  data: HomeBlocksData;
  wrap?: BlockWrap;
}) {
  const applyWrap: BlockWrap = wrap ?? ((_ref, _label, node) => node);

  return (
    <>
      {applyWrap(
        'hero',
        HOME_SECTION_LABELS.hero,
        <HeroSection config={config.hero} />
      )}

      {config.layout.map((entry) => {
        if (!entry.visible) return null;

        if (isNativeBlock(entry.ref)) {
          const node = renderNativeBlock(entry.ref, config, data);
          if (!node) return null;
          return (
            <Fragment key={entry.ref}>
              {applyWrap(entry.ref, HOME_SECTION_LABELS[entry.ref], node)}
            </Fragment>
          );
        }

        const m = config.modules.find((mod) => mod.id === entry.ref);
        if (!m) return null;
        const node = renderModuleBlock(m, data.products);
        if (!node) return null;
        return (
          <Fragment key={entry.ref}>
            {applyWrap(entry.ref, MODULE_LABELS[m.type], node)}
          </Fragment>
        );
      })}
    </>
  );
}
