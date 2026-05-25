import { CartPageClient } from "@/components/cart";
import { SAMPLE_CART_ITEMS } from "@/lib/sample-cart";
import { SHOP_PRODUCTS } from "@/lib/shop-data";

/**
 * /cart — Página del carrito.
 *
 * En producción el carrito vive en una cookie / DB; reemplaza
 * `SAMPLE_CART_ITEMS` por la fuente real (`cookies().get('cart')` o fetch).
 */
export default function CartPage() {
  return (
    <CartPageClient
      initialItems={SAMPLE_CART_ITEMS}
      recommended={SHOP_PRODUCTS.slice(0, 3)}
    />
  );
}

export const metadata = {
  title: "Tu carrito — página/",
};
