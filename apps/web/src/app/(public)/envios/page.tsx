import LegalPage from '@/components/LegalPage';
import { getConfig } from '@/lib/config';

export const metadata = { title: 'Política de envíos · pagina' };
export const revalidate = 3600;

export default async function EnviosPage() {
  const { shipping } = await getConfig();
  const free = shipping.freeFromMxn ?? 0;
  const cost = shipping.defaultCostMxn ?? 0;

  return (
    <LegalPage title="Política de envíos">
      <p>
        Realizamos envíos a todo México a través de paqueterías de cobertura
        nacional{shipping.carrier ? ` (${shipping.carrier})` : ''}.
      </p>

      <h2>Costo de envío</h2>
      <ul>
        <li>
          Costo estándar:{' '}
          <strong>
            {cost > 0 ? `$${cost.toFixed(2)} MXN` : 'sin costo'}
          </strong>
          .
        </li>
        {free > 0 && (
          <li>
            Envío <strong>gratis</strong> en compras iguales o mayores a{' '}
            <strong>${free.toFixed(2)} MXN</strong>.
          </li>
        )}
      </ul>

      <h2>Tiempos de entrega</h2>
      <p>
        El pedido se prepara en un plazo de 1 a 3 días hábiles. Una vez enviado,
        el tiempo de tránsito habitual es de 2 a 7 días hábiles según el destino.
        Los tiempos pueden variar en temporadas de alta demanda.
      </p>

      <h2>Seguimiento</h2>
      <p>
        Cuando tu pedido sea enviado recibirás un correo con el número de guía.
        También puedes consultar el estado de tu pedido en cualquier momento
        desde la sección <strong>Mi cuenta → Pedidos</strong>.
      </p>

      <h2>Direcciones</h2>
      <p>
        Verifica que tu dirección de entrega sea correcta y completa. No nos
        hacemos responsables por entregas fallidas debido a datos incompletos o
        erróneos proporcionados al momento de la compra.
      </p>
    </LegalPage>
  );
}
