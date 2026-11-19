import { describe, expect, it } from 'vitest';
import { normalizeIndexablePath } from '@/lib/seo-path';

describe('normalizeIndexablePath', () => {
  it('leaves canonical paths and unprefixed trailing slashes alone', () => {
    expect(normalizeIndexablePath('/en/info')).toBeNull();
    expect(normalizeIndexablePath('/info/')).toBeNull();
    expect(normalizeIndexablePath('/')).toBeNull();
    expect(normalizeIndexablePath('/ingest/e/')).toBeNull();
  });

  it('sends retired info slugs to the current slug for every locale', () => {
    for (const locale of ['en', 'ru', 'hr', 'ua'] as const) {
      expect(normalizeIndexablePath(`/${locale}/info/accommodation-in-split`)).toBe(
        `/${locale}/info/long-term-rentals-split`,
      );
      expect(normalizeIndexablePath(`/${locale}/info/sunday-shops-split`)).toBe(
        `/${locale}/info/shops-open-on-sunday-split`,
      );
    }
  });

  it('folds a trailing slash and legacy uk into the current info slug', () => {
    expect(normalizeIndexablePath('/en/info/accommodation-in-split/')).toBe(
      '/en/info/long-term-rentals-split',
    );
    expect(normalizeIndexablePath('/uk/info/sunday-shops-split/')).toBe(
      '/ua/info/shops-open-on-sunday-split',
    );
    expect(normalizeIndexablePath('/info/accommodation-in-split')).toBe(
      '/info/long-term-rentals-split',
    );
  });

  it('leaves the current info slugs alone', () => {
    expect(normalizeIndexablePath('/en/info/long-term-rentals-split')).toBeNull();
    expect(normalizeIndexablePath('/ua/info/shops-open-on-sunday-split')).toBeNull();
  });

  it('collapses a locale-prefixed slash and legacy uk into one path', () => {
    expect(normalizeIndexablePath('/en/info/')).toBe('/en/info');
    expect(normalizeIndexablePath('/en/')).toBe('/en');
    expect(normalizeIndexablePath('/uk')).toBe('/ua');
    expect(normalizeIndexablePath('/uk/')).toBe('/ua');
    expect(normalizeIndexablePath('/UK/info/')).toBe('/ua/info');
    expect(normalizeIndexablePath('/en//info/')).toBe('/en/info');
  });
});
