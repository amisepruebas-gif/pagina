import type { ViewModule } from '@/types/page-view';

/** Convierte una URL de YouTube o Vimeo a su URL de embed. */
function toEmbedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** Módulo "Video" — embed de YouTube o Vimeo. */
export default function ViewVideo({ module }: { module: ViewModule }) {
  if (!module.videoUrl) return null;
  const embed = toEmbedUrl(module.videoUrl);
  if (!embed) return null;

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {module.title && (
          <h2 className="mb-4 font-display text-2xl md:text-3xl font-bold tracking-[-0.02em]">
            {module.title}
          </h2>
        )}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
          <iframe
            src={embed}
            title={module.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
