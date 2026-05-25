'use client';

import Link from 'next/link';

export type AccountTab = 'perfil' | 'pedidos' | 'favoritos' | 'direcciones' | 'quejas';

const tabs: { id: AccountTab; label: string }[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'quejas', label: 'Quejas' }
];

export default function AccountTabs({ current }: { current: AccountTab }) {
  return (
    <nav aria-label="Mi cuenta" className="border-b border-border">
      <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const active = current === t.id;
          return (
            <Link
              key={t.id}
              href={`/mi-cuenta?tab=${t.id}`}
              className={`shrink-0 px-4 py-3 text-sm font-display font-semibold border-b-2 transition-colors ${
                active
                  ? 'border-brand-500 text-brand-700'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
