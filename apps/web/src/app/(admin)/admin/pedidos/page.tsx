import OrdersClient from '@/components/admin/OrdersClient';

export const metadata = {
  title: 'Pedidos · admin'
};

// Thin wrapper: rules de orders requieren isStaff() para read, así que
// el listado vive en cliente con la sesión autenticada.
export default function AdminOrdersPage() {
  return <OrdersClient />;
}
