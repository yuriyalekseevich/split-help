import { describe, expect, it } from 'vitest';
import { assembleCatalogServices, parseServiceSlug } from '@/lib/services/service-catalog.schema';

const services = [
  {
    id: 1,
    slug: 'muzh-na-chas',
    image_url: 'https://images.example/handyman.jpg',
    sort_order: 2,
    is_active: true,
    status: 'published',
  },
  {
    id: 2,
    slug: 'draft-job',
    image_url: null,
    sort_order: 9,
    is_active: true,
    status: 'draft',
  },
  {
    id: 3,
    slug: 'gelievye-shary',
    image_url: null,
    sort_order: 1,
    is_active: true,
    status: 'published',
  },
  {
    id: 4,
    slug: 'hidden-job',
    image_url: null,
    sort_order: 0,
    is_active: false,
    status: 'published',
  },
];

const translations = [
  {
    service_id: 1,
    language_code: 'en',
    title: 'Handyman',
    subtitle: 'Small repairs in Split.',
    description: 'We put up shelves',
    price_description: 'from €25 an hour',
  },
  {
    service_id: 1,
    language_code: 'ru',
    title: 'Муж на час',
    subtitle: 'Мелкий ремонт в Сплите.',
    description: 'Повесим полки',
    price_description: 'от 25 € в час',
  },
  {
    service_id: 3,
    language_code: 'ru',
    title: 'Шары с гелием на праздник',
    subtitle: null,
    description: 'Привезём по Сплиту',
    price_description: 'от 15 €',
  },
  {
    service_id: 4,
    language_code: 'ru',
    title: 'Скрытая услуга',
    subtitle: null,
    description: 'Не показываем',
    price_description: null,
  },
];

describe('assembleCatalogServices', () => {
  it('keeps published services in the requested language and drops drafts', () => {
    const result = assembleCatalogServices(services, translations, 'ru', 'en');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual([
      {
        id: 3,
        slug: 'gelievye-shary',
        sortOrder: 1,
        title: 'Шары с гелием на праздник',
        subtitle: null,
        description: 'Привезём по Сплиту',
        priceDescription: 'от 15 €',
        imageUrl: null,
      },
      {
        id: 1,
        slug: 'muzh-na-chas',
        sortOrder: 2,
        title: 'Муж на час',
        subtitle: 'Мелкий ремонт в Сплите.',
        description: 'Повесим полки',
        priceDescription: 'от 25 € в час',
        imageUrl: 'https://images.example/handyman.jpg',
      },
    ]);
  });

  it('falls back to the default language when the requested translation is missing', () => {
    const result = assembleCatalogServices(services, translations, 'hr', 'en');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.map((item) => item.title)).toEqual(['Handyman']);
  });

  it('rejects an unsafe image', () => {
    for (const imageUrl of ['javascript:alert(1)', '/services/muzh-na-chas.jpg']) {
      const result = assembleCatalogServices(
        [{ ...services[0], image_url: imageUrl }],
        translations,
        'en',
        'ru',
      );
      expect(result.success).toBe(false);
    }
  });
});

describe('parseServiceSlug', () => {
  it('accepts the catalog slugs and rejects paths', () => {
    expect(parseServiceSlug('muzh-na-chas')).toBe('muzh-na-chas');
    expect(parseServiceSlug('../services')).toBeNull();
    expect(parseServiceSlug('Muzh')).toBeNull();
  });
});
