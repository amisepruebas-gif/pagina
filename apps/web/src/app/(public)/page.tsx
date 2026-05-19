import Hero from '@/components/home/Hero';
import ShopByCategory from '@/components/home/ShopByCategory';
import ProductSection from '@/components/home/ProductSection';
import PromoBanners from '@/components/home/PromoBanners';
import {
  getFeaturedProducts,
  getNewProducts,
  getLatestProducts
} from '@/lib/products';

// Sin caché en dev — siempre vemos cambios recién agregados en Firestore Console.
// En B.I (hardening) se cambia a revalidate con tiempo razonable.
export const revalidate = 0;

export default async function HomePage() {
  const [destacados, recienLlegados, masVendidos] = await Promise.all([
    getFeaturedProducts(4),
    getNewProducts(4),
    getLatestProducts(4)
  ]);

  return (
    <>
      <Hero />
      <ShopByCategory />
      <ProductSection
        title="Destacados"
        subtitle="Marca isFeatured=true en Firestore para que aparezcan aquí."
        products={destacados}
        emptyHint="Aún no hay productos destacados. Marca isFeatured=true en algún doc de products."
      />
      <PromoBanners />
      <ProductSection
        title="Recién llegados"
        subtitle="Marca isNew=true para destacarlos como novedades."
        products={recienLlegados}
        background="gray"
        emptyHint="Aún no hay productos marcados como nuevos. Marca isNew=true en algún doc."
      />
      <ProductSection
        title="Más vendidos"
        subtitle="Mientras integramos analítica, mostramos los más recientes."
        products={masVendidos}
        emptyHint="Aún no hay productos en la colección products."
      />
    </>
  );
}
