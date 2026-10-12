'use client';

// Image hosts are stored in Supabase, so these stay plain images.

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { buttonClass } from '@/components/ui/Button';
import type { SplitImage } from '@/lib/services/split-images.schema';

const AUTO_MS = 6000;

export function SplitCarousel({
  images,
  ctaLabel,
  fallbackTitle,
}: {
  images: SplitImage[];
  ctaLabel: string;
  fallbackTitle: string;
}) {
  const t = useTranslations('gallery');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const current = images[index] ?? images[0];

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timeout = window.setTimeout(() => {
      setIndex((value) => (value + 1) % count);
    }, AUTO_MS);
    return () => window.clearTimeout(timeout);
  }, [count, index, paused]);

  if (!current) return null;

  function show(next: number) {
    const wrapped = (next + count) % count;
    setIndex(wrapped);
  }

  const title = current.title || fallbackTitle;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('label')}
      className="bg-night"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[34rem] overflow-hidden bg-night sm:h-[38rem]">
        {images.map((image, imageIndex) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.altText}
            className={`absolute inset-0 size-full object-cover transition duration-700 ease-out motion-reduce:transition-none ${
              imageIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            loading={imageIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/55 via-night/35 to-night/70" />
        <div
          key={current.id}
          className="slide-copy absolute inset-0 flex flex-col items-center justify-center px-5 pb-16 text-center sm:px-8"
        >
          <h1 className={current.title ? 'w-full min-w-0 max-w-4xl text-4xl leading-[1.05] text-white sm:text-6xl' : 'sr-only'}>
            {title}
          </h1>
          {current.subtitle ? (
            <p className="mt-4 w-full min-w-0 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">{current.subtitle}</p>
          ) : null}
          <a href="#contact" className={buttonClass('primary', 'mt-8')}>
            {ctaLabel}
          </a>
        </div>
        {count > 1 ? (
          <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 px-4">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition duration-200 ease-out hover:bg-white hover:text-night motion-safe:hover:scale-105 motion-safe:active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={t('previous')}
              onClick={() => show(index - 1)}
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="flex items-center gap-2">
              {images.map((image, imageIndex) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={t('dot', { number: imageIndex + 1 })}
                  aria-current={imageIndex === index ? 'true' : undefined}
                  className={`h-2 rounded-full transition duration-200 ${
                    imageIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  onClick={() => show(imageIndex)}
                />
              ))}
            </div>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition duration-200 ease-out hover:bg-white hover:text-night motion-safe:hover:scale-105 motion-safe:active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label={t('next')}
              onClick={() => show(index + 1)}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
