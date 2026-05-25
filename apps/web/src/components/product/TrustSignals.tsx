import { Icon, type IconName } from '@/components/ui';

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: 'shield', text: 'Pago seguro · encriptación SSL' },
  { icon: 'refresh', text: 'Devoluciones en 30 días' },
  { icon: 'check', text: 'Compra protegida' }
];

/** TrustSignals — lista corta con micro-iconos para el panel de compra. */
export function TrustSignals() {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
      {ITEMS.map((it) => (
        <li
          key={it.text}
          className="flex items-center gap-2.5 text-[13px] text-text-muted"
        >
          <span className="text-brand-700 inline-flex">
            <Icon name={it.icon} size={16} strokeWidth={2} />
          </span>
          {it.text}
        </li>
      ))}
    </ul>
  );
}
