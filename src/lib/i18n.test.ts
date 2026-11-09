import { describe, expect, it } from 'vitest';
import { alternatesFor, htmlLanguage, pageMetadata } from '@/lib/i18n';

describe('alternatesFor', () => {
  it('builds an absolute canonical with no query string', () => {
    const alternates = alternatesFor('en', '/info');
    expect(alternates.canonical).toBe('https://split-help.com/en/info');
    expect(alternates.languages.uk).toBe('https://split-help.com/ua/info');
    expect(alternates.languages['x-default']).toBe('https://split-help.com/en/info');
  });

  it('omits locales that have no translation', () => {
    expect(alternatesFor('ru', '/info/finding-accommodation', ['ru']).languages).toEqual({
      ru: 'https://split-help.com/ru/info/finding-accommodation',
      'x-default': 'https://split-help.com/ru/info/finding-accommodation',
    });
  });
});

describe('pageMetadata', () => {
  it('points a fallback page at the locale whose text is on the page', () => {
    const meta = pageMetadata({
      locale: 'hr',
      title: 'Handyman',
      description: 'Small repairs',
      path: '/service/muzh-na-chas',
      contentLocale: 'en',
      publishedLocales: ['en', 'ru'],
    });
    expect(meta.alternates?.canonical).toBe('https://split-help.com/en/service/muzh-na-chas');
    expect(meta.alternates?.languages).toEqual({
      en: 'https://split-help.com/en/service/muzh-na-chas',
      ru: 'https://split-help.com/ru/service/muzh-na-chas',
      'x-default': 'https://split-help.com/en/service/muzh-na-chas',
    });
  });
});

describe('htmlLanguage', () => {
  it('uses the Ukrainian language tag for the ua prefix', () => {
    expect(htmlLanguage('ua')).toBe('uk');
    expect(htmlLanguage('en')).toBe('en');
  });
});
