import { describe, expect, it } from 'vitest';
import { assembleLegalPage, parseLegalSlug } from '@/lib/services/legal-pages.schema';

const page = { id: 1, slug: 'privacy-policy' };
const translations = [
  {
    legal_page_id: 1,
    language_code: 'en',
    title: 'Privacy Policy',
    content: 'English text.',
  },
  {
    legal_page_id: 1,
    language_code: 'hr',
    title: 'Politika privatnosti',
    content: 'Hrvatski tekst.',
  },
];

describe('legal pages', () => {
  it('uses the requested language', () => {
    const result = assembleLegalPage(page, translations, 'hr', 'en');
    expect(result.success && result.data).toMatchObject({
      title: 'Politika privatnosti',
      content: 'Hrvatski tekst.',
    });
  });

  it('falls back to the default language when the locale has no row', () => {
    const result = assembleLegalPage(page, translations, 'ua', 'en');
    expect(result.success && result.data).toMatchObject({ title: 'Privacy Policy' });
  });

  it('is absent when the slug is not a legal page', () => {
    expect(parseLegalSlug('info')).toBeNull();
    const result = assembleLegalPage({ id: 9, slug: 'about' }, translations, 'en', 'en');
    expect(result).toEqual({ success: true, data: null });
  });
});
