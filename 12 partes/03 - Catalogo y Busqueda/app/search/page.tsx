import { ShopClient } from "@/components/shop";

interface SearchPageProps {
  searchParams: { q?: string };
}

/**
 * /search — página de resultados de búsqueda.
 *
 * Lee `?q=` y lo pasa al `ShopClient` en modo `"search"`.
 */
export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? "").trim();
  return <ShopClient mode="search" query={query} />;
}
