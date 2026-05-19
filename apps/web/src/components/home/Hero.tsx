import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative aspect-[1024/350] w-full bg-gradient-to-r from-accent via-pink-400 to-purple-500">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center text-white max-w-3xl">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg leading-tight">
              Llaveros personalizados
            </h2>
            <p className="mt-3 text-base md:text-xl drop-shadow-md">
              Diséñalos como quieras. Envío gratis sobre $599.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-white text-accent px-8 py-3 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
        {/* Textura sutil de luz */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]"
        />
      </div>
    </section>
  );
}
