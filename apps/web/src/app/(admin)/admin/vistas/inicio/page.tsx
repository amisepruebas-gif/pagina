import { HomeEditorClient } from '@/components/admin/home-editor/HomeEditorClient';
import { getHomeConfig } from '@/lib/home-config';
import { getProducts } from '@/lib/products';
import { getCategories } from '@/lib/categories';

export const revalidate = 0;

export const metadata = { title: 'Editor de inicio · admin' };

/**
 * Editor visual del Home. Carga la configuración guardada y el catálogo
 * completo (productos y categorías) para que el preview pueda mostrar
 * cualquier selección que haga el usuario.
 */
export default async function HomeEditorPage() {
  const [config, products, categories] = await Promise.all([
    getHomeConfig(),
    getProducts(),
    getCategories()
  ]);

  return (
    <HomeEditorClient
      initialConfig={config}
      data={{ products, categories }}
    />
  );
}
