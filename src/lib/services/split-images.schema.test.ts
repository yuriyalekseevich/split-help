import { describe, expect, it } from 'vitest';
import { assembleSplitImages } from '@/lib/services/split-images.schema';

describe('assembleSplitImages', () => {
  it('keeps active photos in sort order and drops inactive ones', () => {
    const result = assembleSplitImages([
      {
        id: 2,
        image_url: 'https://images.example/palace.jpg',
        alt_text: 'Palace',
        sort_order: 2,
        is_active: true,
      },
      {
        id: 3,
        image_url: 'https://images.example/hidden.jpg',
        alt_text: 'Hidden',
        sort_order: 0,
        is_active: false,
      },
      {
        id: 1,
        image_url: 'https://images.example/riva.jpg',
        alt_text: 'Riva',
        sort_order: 1,
        is_active: true,
      },
    ]);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.map((image) => image.altText)).toEqual(['Riva', 'Palace']);
  });

  it('uses the requested language, then the default language', () => {
    const images = [
      {
        id: 1,
        image_url: 'https://images.example/riva.jpg',
        alt_text: 'Riva',
        sort_order: 1,
        is_active: true,
      },
    ];
    const translations = [
      { split_image_id: 1, language_code: 'en', title: 'Need help?', subtitle: 'We come to you.' },
      { split_image_id: 1, language_code: 'ru', title: 'Нужна помощь?', subtitle: 'Приедем сами.' },
    ];

    const russian = assembleSplitImages(images, translations, 'ru', 'en');
    const croatian = assembleSplitImages(images, translations, 'hr', 'en');

    expect(russian.success && russian.data[0]?.title).toBe('Нужна помощь?');
    expect(croatian.success && croatian.data[0]?.title).toBe('Need help?');
  });

  it('rejects an unsafe image address', () => {
    const result = assembleSplitImages([
      {
        id: 1,
        image_url: 'javascript:alert(1)',
        alt_text: 'Bad',
        sort_order: 1,
        is_active: true,
      },
    ]);
    expect(result.success).toBe(false);
  });
});
