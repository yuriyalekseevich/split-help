import type { Metadata } from 'next';
import { defineRouting } from 'next-intl/routing';
import { site } from '@/content/site';

export const locales = ['en', 'ru', 'hr', 'ua'] as const;
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

/** Locales from `codes` that this site actually publishes, in site order. */
export function localesMatching(codes: Iterable<string>): Locale[] {
  const present = new Set(codes);
  return locales.filter((code) => present.has(code));
}

/**
 * Translations that exist for one record.
 * `chosenLanguage` is the row that will render: the requested locale, or the default language.
 * A URL locale with no row of its own is left out of hreflang.
 */
export function indexableLocales(
  languageCodes: Iterable<string>,
  chosenLanguage: string | null,
): { contentLocale: Locale; publishedLocales: Locale[] } | null {
  if (!chosenLanguage || !isLocale(chosenLanguage)) return null;
  const publishedLocales = localesMatching(languageCodes);
  if (!publishedLocales.includes(chosenLanguage)) return null;
  return { contentLocale: chosenLanguage, publishedLocales };
}

/** Load-error and missing-content responses. Real pages do not use this. */
export function noIndexMetadata(): Metadata {
  return { robots: { index: false } };
}

const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  hr: 'hr_HR',
  ua: 'uk_UA',
};

/** Address prefix is `ua`. The language tag stays `uk`. */
const hreflangFor: Record<Locale, string> = {
  en: 'en',
  ru: 'ru',
  hr: 'hr',
  ua: 'uk',
};

/** `ua` is the URL prefix. The language tag is `uk`. */
export function htmlLanguage(locale: string): string {
  return isLocale(locale) ? hreflangFor[locale] : 'en';
}

function absoluteUrl(locale: Locale, path: string) {
  const suffix = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${site.domain}/${locale}${suffix}`;
}

/**
 * hreflang map for one path. `path` is unprefixed, for example `/service/muzh-na-chas`.
 * `published` limits the map to locales that have their own translation.
 * Canonical is absolute and has no query string.
 */
export function alternatesFor(locale: Locale, path = '', published: readonly Locale[] = locales) {
  const indexed = published.length > 0 ? published : [locale];
  const languages: Record<string, string> = {};
  for (const code of indexed) {
    languages[hreflangFor[code]] = absoluteUrl(code, path);
  }
  const xDefault = indexed.includes(defaultLocale) ? defaultLocale : indexed[0];
  languages['x-default'] = absoluteUrl(xDefault, path);

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
  contentLocale,
  publishedLocales,
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  absoluteTitle?: boolean;
  image?: string;
  /** Language of the rendered text. Falls back to `locale` for fully translated pages. */
  contentLocale?: string;
  /** Locales with their own translation. Omitted means every site locale. */
  publishedLocales?: readonly string[];
}): Metadata {
  const indexed = publishedLocales ? localesMatching(publishedLocales) : [...locales];
  const canonicalLocale = contentLocale && isLocale(contentLocale) ? contentLocale : locale;
  const hreflangLocales = indexed.length > 0 ? indexed : [canonicalLocale];
  const alternates = alternatesFor(canonicalLocale, path, hreflangLocales);
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
      locale: openGraphLocales[canonicalLocale],
      alternateLocale: hreflangLocales
        .filter((code) => code !== canonicalLocale)
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
