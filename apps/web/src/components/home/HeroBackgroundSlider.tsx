'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * HeroBackgroundSlider — carrusel de imágenes de fondo del Hero.
 * Si hay más de una imagen, rotan automáticamente con un fundido.
 */
export function HeroBackgroundSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (images.length < 2) return;
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      5000
    );
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
