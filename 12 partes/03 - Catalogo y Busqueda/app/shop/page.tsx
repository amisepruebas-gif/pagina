import { ShopClient } from "@/components/shop";

interface ShopPageProps {
  searchParams: { category?: string };
}

/**
 * /shop — página de catálogo.
 *
 * Lee `?category=` para preseleccionar el filtro de categoría.
 * Todo el estado vive en el cliente (ShopClient). Si más adelante necesitas
 * SSR, mueve el filtrado al servidor y pasa el dataset filtrado como prop.
 */
export default function ShopPage({ searchParams }: ShopPageProps) {
  return <ShopClient mode="catalog" initialCategory={searchParams.category ?? null} />;
}
