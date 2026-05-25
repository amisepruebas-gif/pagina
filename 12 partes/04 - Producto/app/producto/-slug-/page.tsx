import { SAMPLE_PRODUCT } from "@/lib/sample-product";
import { SHOP_PRODUCTS } from "@/lib/shop-data";
import { ProductPageClient } from "@/components/product/ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
}

/**
 * /producto/[slug] — Página de detalle de producto.
 *
 * En producción, reemplaza `SAMPLE_PRODUCT` por un fetch real basado en `slug`.
 * Los relacionados se eligen del shop dataset.
 */
export default function ProductPage(_props: ProductPageProps) {
  const related = SHOP_PRODUCTS.slice(0, 4);
  return <ProductPageClient product={SAMPLE_PRODUCT} related={related} />;
}

export function generateMetadata({ params: _params }: ProductPageProps) {
  return {
    title: `${SAMPLE_PRODUCT.brand} · ${SAMPLE_PRODUCT.name}`,
    description: SAMPLE_PRODUCT.description,
  };
}
