import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { placeholderCategories } from '@/data/placeholder';

export default function ShopByCategory() {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Compra por categoría"
          subtitle="Encuentra los mejores llaveros para todas las ocasiones."
        />

        <div className="mt-10 flex gap-6 md:gap-10 overflow-x-auto pb-4 px-2 scroll-smooth snap-x [&::-webkit-scrollbar]:hidden">
          {placeholderCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center shrink-0 group snap-start"
            >
              <div
                className={`w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${cat.gradient} shadow-md transition-transform group-hover:scale-105`}
              />
              <span className="mt-3 text-xs md:text-sm font-medium text-gray-900 text-center max-w-[120px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
