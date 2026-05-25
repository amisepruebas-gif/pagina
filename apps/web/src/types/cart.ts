export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  qty: number;
  originalPrice: number | null;   // snapshot al momento de agregar
  stockAtAdd: number | null;       // para validación liviana después
}
