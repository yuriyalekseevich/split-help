'use client';

// Image hosts are stored in Supabase, so these stay plain images.

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GallerySlide } from '@/lib/services/gallery-images.schema';

const AUTO_MS = 6000;

const controlClass =
  'inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition duration-200 ease-out hover:bg-white hover:text-night motion-safe:hover:scale-105 motion-safe:active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/**
 * Same slide behavior as the home carousel, fitted to the detail-page photo frame.
 * One photo hides the controls. The caller keeps the existing cover when `slides` is empty.
 */
export function ImageCarousel({ slides, className = '' }: { slides: GallerySlide[]; className?: string }) {
  const t = useTranslations('gallery');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = slides[index] ?? slides[0];

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
    setIndex((next + count) % count);
  }

  const showChrome = count > 1 || Boolean(current.caption);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('photos')}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.id}
            src={slide.imageUrl}
            alt={active && !slide.caption ? slide.alt : ''}
            aria-hidden={active ? undefined : true}
            className={`absolute inset-0 size-full object-cover object-center transition duration-700 ease-out motion-reduce:transition-none ${
              active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            loading={slideIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        );
      })}
      {showChrome ? (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-night/75 via-night/40 to-transparent px-4 pt-14 pb-4">
          {current.caption ? (
            <p
              key={current.id}
              className="slide-copy mx-auto line-clamp-3 max-w-2xl text-center text-sm font-medium leading-5 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] sm:text-base"
            >
              {current.caption}
            </p>
          ) : null}
          {count > 1 ? (
            <div className={`flex items-center justify-center gap-3 ${current.caption ? 'mt-3' : ''}`}>
              <button type="button" className={controlClass} aria-label={t('previous')} onClick={() => show(index - 1)}>
                <span aria-hidden="true">←</span>
              </button>
              <div className="flex max-w-[70%] flex-wrap items-center justify-center gap-2">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={t('dot', { number: slideIndex + 1 })}
                    aria-current={slideIndex === index ? 'true' : undefined}
                    className={`h-2 rounded-full transition duration-200 ${
                      slideIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    onClick={() => show(slideIndex)}
                  />
                ))}
              </div>
              <button type="button" className={controlClass} aria-label={t('next')} onClick={() => show(index + 1)}>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
