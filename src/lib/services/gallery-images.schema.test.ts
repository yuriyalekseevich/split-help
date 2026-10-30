import { describe, expect, it } from 'vitest';
import { assembleGalleryImages, gallerySlides } from '@/lib/services/gallery-images.schema';

describe('assembleGalleryImages', () => {
  it('keeps safe photos in sort order and drops an unsafe address', () => {
    const images = assembleGalleryImages([
      {
        id: 2,
        image_url: 'https://images.example/bus.jpg',
        description: '  City bus  ',
        sort_order: 2,
      },
      {
        id: 9,
        image_url: 'javascript:alert(1)',
        description: 'Bad',
        sort_order: 0,
      },
      {
        id: 1,
        image_url: 'https://images.example/train.jpg',
        description: '',
        sort_order: 1,
      },
      {
        id: 4,
        image_url: 'https://user:pass@images.example/secret.jpg',
        sort_order: 1,
      },
    ]);

    expect(images.map((image) => image.id)).toEqual([1, 2]);
    expect(images[0]?.description).toBeNull();
    expect(images[1]?.description).toBe('City bus');
  });

  it('puts a missing sort order after numbered photos', () => {
    const images = assembleGalleryImages([
      { id: 3, image_url: 'https://images.example/c.jpg', sort_order: null },
      { id: 1, image_url: 'https://images.example/a.jpg', sort_order: 2 },
      { id: 2, image_url: 'http://images.example/b.jpg' },
    ]);

    expect(images.map((image) => image.id)).toEqual([1, 2, 3]);
  });

  it('uses the description as the caption and the title when there is none', () => {
    const slides = gallerySlides(
      [
        {
          id: 1,
          imageUrl: 'https://images.example/train.jpg',
          sortOrder: 1,
          description: 'Train to Zagreb',
        },
        {
          id: 2,
          imageUrl: 'https://images.example/plain.jpg',
          sortOrder: 2,
          description: null,
        },
      ],
      'Airport transfer',
    );

    expect(slides[0]).toMatchObject({ alt: 'Train to Zagreb', caption: 'Train to Zagreb' });
    expect(slides[1]).toMatchObject({ alt: 'Airport transfer', caption: null });
  });
});
