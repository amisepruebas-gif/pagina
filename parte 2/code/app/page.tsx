import { Topbar, Header, CategoryNav, Footer } from "@/components";
import {
  HeroSection, TrustBar, CategoryGrid, FeaturedProducts,
  PromoBanner, NewArrivals, FlashSale, BestSellers, Newsletter,
} from "@/components/home";

/**
 * HomePage — composición de la página de inicio.
 *
 * Estructura: Topbar → Header → CategoryNav → main → Footer.
 * Cada sección es su propio componente cliente cuando necesita estado;
 * el resto es server-side por defecto.
 */
export default function HomePage() {
  return (
    <>
      <Topbar />
      <Header cartCount={3} />
      <CategoryNav />

      <main>
        <HeroSection />
        <TrustBar />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
        <NewArrivals />
        <FlashSale />
        <BestSellers />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
