'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button, Icon, Input } from '@/components/ui';
import type { NewsletterConfig } from '@/types/home-config';

/** Newsletter — captura de email centrada con estado de éxito. */
export function Newsletter({ config }: { config: NewsletterConfig }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const hasBg = !!config.bgImageUrl;
  const coverBg =
    config.coverType === 'gradient'
      ? `linear-gradient(120deg, ${config.coverFrom}, ${config.coverTo})`
      : config.coverFrom;
  const coverAlpha = Math.min(100, Math.max(0, config.coverOpacity)) / 100;
  const imageAlpha =
    Math.min(100, Math.max(0, config.bgImageOpacity)) / 100;
  const blob1Alpha = Math.min(100, Math.max(0, config.blob1Opacity)) / 100;
  const blob2Alpha = Math.min(100, Math.max(0, config.blob2Opacity)) / 100;

  return (
    <section
      className="py-14 sm:py-24 relative overflow-hidden"
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

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: coverBg, opacity: coverAlpha }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute top-[20%] -left-32 size-[500px] rounded-full blur-[60px]"
        style={{ background: config.blob1Color, opacity: blob1Alpha }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[10%] -right-28 size-[420px] rounded-full blur-[60px]"
        style={{ background: config.blob2Color, opacity: blob2Alpha }}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className="max-w-2xl mx-auto text-center bg-surface rounded-2xl
                     p-8 sm:p-12 lg:p-16 border border-border shadow-md"
        >
          <span className="inline-flex items-center justify-center size-12 sm:size-14 rounded-full text-white shadow-brand bg-brand-grad">
            <Icon name="spark" size={24} strokeWidth={2} />
          </span>

          <h2 className="mt-5 sm:mt-6 font-display font-bold leading-tight tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[clamp(28px,4.5vw,44px)]">
            {config.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-text-muted max-w-md mx-auto">
            {config.paragraph}
          </p>

          {done ? (
            <div className="mt-6 sm:mt-7 inline-flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-4 rounded-pill bg-brand-50 text-brand-700 font-display font-semibold text-sm sm:text-base">
              <Icon name="check" size={18} strokeWidth={2.4} /> ¡Listo! Revisa tu
              correo.
            </div>
          ) : (
            <form
              className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setDone(true);
              }}
            >
              <div className="flex-1 min-w-0">
                <Input
                  type="email"
                  placeholder={config.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leadingIcon="user"
                  required
                />
              </div>
              <Button type="submit" size="lg" trailingIcon="arr-right" fullWidth className="sm:!w-auto">
                {config.ctaLabel}
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-text-soft">{config.note}</p>
        </div>
      </div>
    </section>
  );
}
