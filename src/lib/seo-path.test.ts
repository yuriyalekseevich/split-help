import { describe, expect, it } from 'vitest';
import { normalizeIndexablePath } from '@/lib/seo-path';

describe('normalizeIndexablePath', () => {
  it('leaves canonical paths and unprefixed trailing slashes alone', () => {
    expect(normalizeIndexablePath('/en/info')).toBeNull();
    expect(normalizeIndexablePath('/info/')).toBeNull();
    expect(normalizeIndexablePath('/')).toBeNull();
    expect(normalizeIndexablePath('/ingest/e/')).toBeNull();
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
