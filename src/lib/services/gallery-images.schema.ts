import { z } from 'zod';

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    if (url.username || url.password) return false;
    return true;
  } catch {
    return false;
  }
}

const idSchema = z.preprocess((value) => {
  if (typeof value === 'string' && /^[0-9]+$/.test(value)) return Number(value);
  return value;
}, z.number().int().positive().max(Number.MAX_SAFE_INTEGER));

const rowSchema = z.object({
  id: idSchema,
  image_url: z.string().trim().refine(isSafeHttpUrl, 'invalid_image_url'),
  sort_order: z.number().int().min(0).max(1_000_000).nullable().optional(),
  description: z.unknown().optional(),
});

export type GalleryImage = {
  id: number;
  imageUrl: string;
  sortOrder: number;
  description: string | null;
};

export type GallerySlide = {
  id: number;
  imageUrl: string;
  alt: string;
  caption: string | null;
};

const UNSORTED = Number.MAX_SAFE_INTEGER;
const CAPTION_LIMIT = 300;

function readCaption(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > CAPTION_LIMIT ? `${trimmed.slice(0, CAPTION_LIMIT - 1)}…` : trimmed;
}

/**
 * Photos attached to one service or useful-info row.
 * A row with an unsafe address is left out. The rest stay, in sort order.
 */
export function assembleGalleryImages(rows: unknown[]): GalleryImage[] {
  const data: GalleryImage[] = [];

  for (const row of rows) {
    const parsed = rowSchema.safeParse(row);
    if (!parsed.success) continue;
    data.push({
      id: parsed.data.id,
      imageUrl: parsed.data.image_url,
      sortOrder: parsed.data.sort_order ?? UNSORTED,
      description: readCaption(parsed.data.description),
    });
  }

  data.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  return data;
}

/** Caption becomes the slide text. Without one, the page title is the image alt. */
export function gallerySlides(images: GalleryImage[], fallbackAlt: string): GallerySlide[] {
  return images.map((image) => ({
    id: image.id,
    imageUrl: image.imageUrl,
    alt: image.description ?? fallbackAlt,
    caption: image.description,
  }));
}
