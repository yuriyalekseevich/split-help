import { site } from '@/content/site';
import { alternatesFor, defaultLocale, isLocale } from '@/lib/i18n';
import type { InfoFaq } from '@/lib/info-content';

export type ArticleJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
  publisher: { '@type': 'Organization'; name: string; url: string };
};

export type FaqPageJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }[];
};

const PLACEHOLDER_IMAGE = `${site.domain}/placeholder-service.svg`;

export function infoArticleJsonLd(input: {
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  locale: string;
  contentLocale?: string;
  slug: string;
}): ArticleJsonLd {
  const canonicalLocale =
    input.contentLocale && isLocale(input.contentLocale)
      ? input.contentLocale
      : isLocale(input.locale)
        ? input.locale
        : defaultLocale;
  const published = new Date(input.createdAt).toISOString();
  const image = input.image?.trim() || PLACEHOLDER_IMAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image,
    datePublished: published,
    dateModified: published,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': alternatesFor(canonicalLocale, `/info/${input.slug}`).canonical,
    },
    publisher: {
      '@type': 'Organization',
      name: site.brandName,
      url: site.domain,
    },
  };
}

/** `null` when there are no pairs, so the page can skip an empty FAQPage. */
export function infoFaqJsonLd(faqs: readonly InfoFaq[]): FaqPageJsonLd | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** JSON for a script tag. `<` is escaped so article text cannot close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
