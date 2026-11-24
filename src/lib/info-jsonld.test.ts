import { describe, expect, it } from 'vitest';
import { infoArticleJsonLd, infoFaqJsonLd, jsonLdScript } from '@/lib/info-jsonld';

const articleInput = {
  title: 'How to book a MUP appointment',
  description: 'Official portal and the documents to bring.',
  image: 'https://cdn.example.com/mup.jpg',
  createdAt: '2026-03-01T08:00:00Z',
  locale: 'en',
  contentLocale: 'ru',
  slug: 'mup-appointment',
};

describe('infoArticleJsonLd', () => {
  it('builds an Article with the canonical page and the publisher', () => {
    const article = infoArticleJsonLd(articleInput);

    expect(article).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to book a MUP appointment',
      description: 'Official portal and the documents to bring.',
      image: 'https://cdn.example.com/mup.jpg',
      datePublished: '2026-03-01T08:00:00.000Z',
      dateModified: '2026-03-01T08:00:00.000Z',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://www.split-help.com/ru/info/mup-appointment',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Split Help',
        url: 'https://www.split-help.com',
      },
    });
  });

  it('uses the URL locale when the content locale is missing', () => {
    const article = infoArticleJsonLd({ ...articleInput, contentLocale: undefined });
    expect(article.mainEntityOfPage['@id']).toBe('https://www.split-help.com/en/info/mup-appointment');
  });

  it('uses the placeholder image when the article has none', () => {
    expect(infoArticleJsonLd({ ...articleInput, image: null }).image).toBe(
      'https://www.split-help.com/placeholder-service.svg',
    );
    expect(infoArticleJsonLd({ ...articleInput, image: '   ' }).image).toBe(
      'https://www.split-help.com/placeholder-service.svg',
    );
  });
});

describe('infoFaqJsonLd', () => {
  it('returns nothing when there are no pairs', () => {
    expect(infoFaqJsonLd([])).toBeNull();
  });

  it('builds a FAQPage from the extracted pairs', () => {
    expect(
      infoFaqJsonLd([{ question: 'Where is MUP?', answer: 'In the center of Split.' }]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where is MUP?',
          acceptedAnswer: { '@type': 'Answer', text: 'In the center of Split.' },
        },
      ],
    });
  });
});

describe('jsonLdScript', () => {
  it('escapes angle brackets so the payload cannot close the script tag', () => {
    const payload = jsonLdScript({ headline: '</script><script>' });
    expect(payload).not.toContain('<');
    expect(payload).toContain('\\u003c/script>');
  });
});
