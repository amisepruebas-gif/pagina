import Link from 'next/link';

const banners = [
  {
    id: 'personalizar',
    title: 'Diseño personalizado',
    subtitle: 'Crea tu propio llavero con IA',
    href: '/personalizar',
    gradient: 'from-pink-500 via-pink-400 to-purple-500'
  },
  {
    id: 'sale',
    title: 'Hasta 50% off',
    subtitle: 'En llaveros seleccionados',
    href: '/shop?sale=true',
    gradient: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'shipping',
    title: 'Envío gratis',
    subtitle: 'En compras desde $599',
    href: '/shop',
    gradient: 'from-amber-500 to-yellow-400'
  }
];

export default function PromoBanners() {
  return (
    <section className="py-10 px-4 bg-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className={`group relative aspect-[3/2] rounded-2xl overflow-hidden bg-gradient-to-br ${b.gradient} p-6 flex flex-col justify-end text-white shadow-md hover:shadow-xl transition-shadow`}
          >
            <h3 className="font-display text-xl md:text-2xl font-bold drop-shadow">
              {b.title}
            </h3>
            <p className="mt-1 text-sm opacity-95 drop-shadow">{b.subtitle}</p>
            <span className="mt-3 text-xs font-semibold uppercase tracking-wide underline-offset-4 group-hover:underline">
              Ver más →
            </span>
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
