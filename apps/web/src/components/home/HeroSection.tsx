import Link from 'next/link';
import { Badge, Button, ProductImage } from '@/components/ui';
import type { HeroConfig } from '@/types/home-config';
import { HeroBackgroundSlider } from './HeroBackgroundSlider';

/** Posición y proporción de cada una de las 3 tarjetas del collage. */
const CARD_SLOTS = [
  {
    position: 'top-[10%] left-0 w-[55%] aspect-[3/4] rotate-[-5deg]',
    aspect: '3/4'
  },
  {
    position:
      'top-0 right-0 w-[55%] aspect-[3/4] rotate-[4deg] translate-y-[8%]',
    aspect: '3/4'
  },
  {
    position: 'bottom-0 left-[20%] w-[55%] aspect-square rotate-[-3deg]',
    aspect: '1/1'
  }
] as const;

/**
 * HeroSection — bloque de impacto en el tope de la home.
 */
export function HeroSection({ config }: { config: HeroConfig }) {
  const bgImages = config.backgroundImages
    .map((b) => b.url)
    .filter((url): url is string => Boolean(url));
  const hasBg = bgImages.length > 0;
  const light = config.textTone === 'light';

  return (
    <section
      className={`relative overflow-hidden border-b border-border${
        hasBg
          ? ''
          : ' bg-[linear-gradient(120deg,var(--brand-50)_0%,#FFF9E6_55%,#FFE7EF_100%)]'
      }`}
    >
      {hasBg ? (
        <>
          <HeroBackgroundSlider images={bgImages} />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundColor: config.overlayColor,
              opacity:
                Math.min(100, Math.max(0, config.overlayOpacity)) / 100
            }}
          />
        </>
      ) : (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-24 size-[520px] rounded-full opacity-55 blur-[60px]"
            style={{ background: 'var(--grad-from)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-16 size-[380px] rounded-full opacity-40 blur-[60px]"
            style={{ background: 'var(--secondary)' }}
          />
        </>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:py-20 lg:py-24 relative z-10">
        <div className="grid gap-10 lg:gap-14 items-center lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Badge tone="gradient" leadingIcon="bolt">
              {config.badge}
            </Badge>

            <h1
              className={`mt-4 sm:mt-5 font-display font-bold leading-[0.92] tracking-[-0.04em]
                         text-[clamp(40px,12vw,56px)] sm:text-6xl lg:text-[clamp(48px,8vw,104px)]${
                           light ? ' text-white' : ''
                         }`}
            >
              {config.titlePre}
              <span className="bg-brand-grad bg-clip-text text-transparent">
                {config.titleAccent}
              </span>
              {config.titlePost}
            </h1>

            <p
              className={`mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed ${
                light ? 'text-white/85' : 'text-text-muted'
              }`}
            >
              {config.paragraph}
            </p>

            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link href={config.primaryCta.href} className="w-full sm:w-auto">
                <Button size="lg" trailingIcon="arr-right" fullWidth className="sm:!w-auto">
                  {config.primaryCta.label}
                </Button>
              </Link>
              <Link href={config.secondaryCta.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  leadingIcon="bolt"
                  fullWidth
                  className="sm:!w-auto"
                >
                  {config.secondaryCta.label}
                </Button>
              </Link>
            </div>

            <dl className="mt-10 sm:mt-14 flex flex-wrap gap-6 sm:gap-10">
              {config.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd
                    className={`font-display font-bold text-2xl sm:text-[32px] tracking-tight leading-none${
                      light ? ' text-white' : ''
                    }`}
                  >
                    {stat.value}
                  </dd>
                  <dd
                    className={`mt-1 font-mono text-[11px] sm:text-[12px] tracking-widest uppercase ${
                      light ? 'text-white/65' : 'text-text-soft'
                    }`}
                  >
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="relative aspect-[4/5] min-h-[260px] sm:min-h-[340px] lg:min-h-[460px]
                       hidden xs:block max-w-md mx-auto lg:mx-0 w-full"
          >
            {CARD_SLOTS.map((slot, i) => {
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

            <div
              className="absolute top-[5%] -right-[8%] size-24 rounded-full text-[#1A1A14] shadow-lg
                         bg-gradient-to-br from-secondary to-accent border-4 border-surface
                         flex flex-col items-center justify-center font-display font-extrabold
                         animate-wiggle origin-center text-center"
            >
              <span className="text-[11px] tracking-widest uppercase">
                {config.discountTop}
              </span>
              <span className="text-[28px] leading-none tracking-tight">
                {config.discountValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
