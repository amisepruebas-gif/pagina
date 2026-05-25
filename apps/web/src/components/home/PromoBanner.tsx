import Image from 'next/image';
import Link from 'next/link';
import { Badge, Button, ProductImage } from '@/components/ui';
import type { PromoBannerConfig } from '@/types/home-config';

/** Posición y proporción de cada una de las 2 tarjetas del banner. */
const PROMO_CARD_SLOTS = [
  {
    position: '-top-1/4 right-0 w-[70%] aspect-square rotate-[-5deg]',
    aspect: '1/1'
  },
  {
    position: '-bottom-1/4 left-0 w-[60%] aspect-square rotate-[7deg]',
    aspect: '1/1'
  }
] as const;

/** PromoBanner — banner ancho con capa de color (gradiente o sólido) y CTA. */
export function PromoBanner({ config }: { config: PromoBannerConfig }) {
  const hasBg = !!config.bgImageUrl;
  const coverBg =
    config.coverType === 'gradient'
      ? `linear-gradient(120deg, ${config.coverFrom}, ${config.coverTo})`
      : config.coverFrom;
  const coverAlpha =
    Math.min(100, Math.max(0, config.coverOpacity)) / 100;
  const imageAlpha =
    Math.min(100, Math.max(0, config.bgImageOpacity)) / 100;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-white shadow-lg p-7 sm:p-10 lg:p-16"
          style={hasBg ? { backgroundColor: '#FFFFFF' } : undefined}
        >
          {hasBg && (
            <Image
              src={config.bgImageUrl!}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ opacity: imageAlpha }}
            />
          )}

          {/* Capa de color: encima de la imagen, o como fondo cuando no hay imagen. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: coverBg, opacity: coverAlpha }}
          />

          {/* Manchas decorativas — visibles con y sin imagen, encima de la capa. */}
          <span
            aria-hidden
            className="absolute -top-20 -right-16 size-80 rounded-full blur-[40px] opacity-40"
            style={{ background: config.blob1Color }}
          />
          <span
            aria-hidden
            className="absolute -bottom-16 left-[30%] size-60 rounded-full blur-[40px] opacity-40"
            style={{ background: config.blob2Color }}
          />

          {/* Patrón de puntos solo cuando no hay imagen, para no ensuciarla. */}
          {!hasBg && (
            <span
              aria-hidden
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />
          )}

          <div className="relative z-10 grid gap-6 sm:gap-8 items-center lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Badge tone="accent" leadingIcon="bolt">
                {config.badge}
              </Badge>
              <h2
                className="mt-4 sm:mt-5 font-display font-bold leading-[0.95] tracking-[-0.035em]
                           text-3xl sm:text-5xl lg:text-[clamp(36px,6vw,72px)] text-white"
              >
                {config.title}
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg opacity-90 max-w-md">
                {config.paragraph}
              </p>
              <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-3">
                <Link href={config.primaryCta.href} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    trailingIcon="arr-right"
                    fullWidth
                    className="sm:!w-auto"
                  >
                    {config.primaryCta.label}
                  </Button>
                </Link>
                <Link href={config.secondaryCta.href} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="ghost"
                    fullWidth
                    className="!text-white hover:!bg-white/10 sm:!w-auto"
                  >
                    {config.secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              {PROMO_CARD_SLOTS.map((slot, i) => {
                const card = config.cards[i];
                if (!card) return null;
                const cls = `absolute ${slot.position} block rounded-xl overflow-hidden shadow-lg`;
                const image = (
                  <ProductImage
                    src={card.imageUrl || undefined}
                    label={card.label}
                    accent={card.accent}
                    aspect={slot.aspect}
                    rounded=""
                  />
                );
                return card.href ? (
                  <Link key={i} href={card.href} className={cls}>
                    {image}
                  </Link>
                ) : (
                  <div key={i} className={cls}>
                    {image}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
