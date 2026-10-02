import type { Metadata } from 'next';
import { defineRouting } from 'next-intl/routing';
import { site } from '@/content/site';

export const locales = ['en', 'ru', 'hr', 'uk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
  // hreflang is set in page metadata from site.domain.
  // The proxy header would point x-default at `/`, which only redirects.
  alternateLinks: false,
});

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  hr: 'hr_HR',
  uk: 'uk_UA',
};

function absoluteUrl(locale: Locale, path: string) {
  const suffix = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${site.domain}/${locale}${suffix}`;
}

/** hreflang map for one path. `path` is unprefixed, for example `/service/muzh-na-chas`. */
export function alternatesFor(locale: Locale, path = '') {
  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[code] = absoluteUrl(code, path);
  }
  languages['x-default'] = absoluteUrl(defaultLocale, path);

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  };
}

export function pageMetadata({
  locale,
  title,
  description,
  path = '',
  absoluteTitle = false,
  image = '/placeholder-service.svg',
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  absoluteTitle?: boolean;
  image?: string;
}): Metadata {
  const alternates = alternatesFor(locale, path);
  const resolvedTitle = absoluteTitle ? { absolute: title } : title;

  return {
    title: resolvedTitle,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: site.brandName,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) => openGraphLocales[code]),
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
