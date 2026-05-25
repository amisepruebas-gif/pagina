import Link from 'next/link';
import { bannerHref, type ViewModule } from '@/types/page-view';

/** Módulo "Banners" — banners estáticos en grid. */
export default function ViewBanners({ module }: { module: ViewModule }) {
  const banners = (module.banners ?? []).filter((b) => b.imageUrl);
  if (banners.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {module.title && (
          <h2 className="mb-4 font-display text-2xl md:text-3xl font-bold tracking-[-0.02em]">
            {module.title}
          </h2>
        )}
        <div
          className={`grid gap-4 md:gap-6 ${
            banners.length === 1
              ? 'grid-cols-1'
              : banners.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {banners.map((b, i) => {
            const href = bannerHref(b);
            const inner = (
              <div
                className="aspect-[3/2] rounded-xl overflow-hidden bg-surface-2 bg-cover bg-center border border-border"
                style={{ backgroundImage: `url(${b.imageUrl})` }}
              />
            );
            return href ? (
              <Link
                key={i}
                href={href}
                className="block transition duration-base ease-out hover:-translate-y-1 hover:shadow-lg rounded-xl"
              >
                {inner}
              </Link>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
