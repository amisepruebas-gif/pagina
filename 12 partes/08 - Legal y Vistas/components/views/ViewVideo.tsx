import type { VideoProvider } from "@/lib/sample-view";

export interface ViewVideoProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Para "youtube"/"vimeo" pasa solo el ID; para "file" pasa la URL completa. */
  videoUrl: string;
  provider: VideoProvider;
}

const buildSrc = (provider: VideoProvider, url: string) => {
  if (provider === "youtube") return `https://www.youtube-nocookie.com/embed/${url}?rel=0`;
  if (provider === "vimeo")   return `https://player.vimeo.com/video/${url}?title=0&byline=0`;
  return url;
};

/** ViewVideo — bloque con video embebido 16:9 responsive. */
export function ViewVideo({ eyebrow, title, subtitle, videoUrl, provider }: ViewVideoProps) {
  const src = buildSrc(provider, videoUrl);
  return (
    <section className="py-12">
      {(eyebrow || title) && (
        <div className="mb-6 max-w-2xl">
          {eyebrow && (
            <span className="font-mono text-[12px] tracking-widest uppercase text-text-soft
                             inline-flex items-center gap-2 before:content-[''] before:w-7 before:h-px before:bg-current before:opacity-60">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className={`${eyebrow ? "mt-3" : ""} font-display font-bold leading-[1.05] tracking-[-0.03em]
                            text-3xl sm:text-4xl lg:text-[clamp(28px,4vw,44px)]`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2.5 text-text-muted text-base leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-2 shadow-md">
        {provider === "file" ? (
          <video src={src} controls className="block w-full h-full" />
        ) : (
          <iframe
            src={src} title={title ?? "Video"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </section>
  );
}
