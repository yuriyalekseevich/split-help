import { z } from 'zod';
import { AppError, clientMessage } from '@/lib/errors/app-error';
import type { ParseOutcome } from '@/lib/services/base.service';

const LIMITS = {
  title: 500,
  subtitle: 1000,
  description: 50_000,
  priceDescription: 1000,
  slug: 160,
} as const;

const PUBLISHED_STATUS = 'published';

function emptyToNull(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

function isSafeImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
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

const requiredText = (max: number) => z.string().trim().min(1).max(max);

const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.union([requiredText(max), z.null()]));

const optionalImageUrl = z.preprocess(
  emptyToNull,
  z.union([z.string().trim().refine(isSafeImageUrl, 'invalid_image_url'), z.null()]),
);

const catalogServiceRowSchema = z.object({
  id: idSchema,
  slug: requiredText(LIMITS.slug),
  sort_order: z.number().int().min(0).max(1_000_000),
  title: requiredText(LIMITS.title),
  subtitle: optionalText(LIMITS.subtitle),
  description: requiredText(LIMITS.description),
  price_description: optionalText(LIMITS.priceDescription),
  image_url: optionalImageUrl,
});

export type CatalogService = {
  id: number;
  slug: string;
  sortOrder: number;
  title: string;
  subtitle: string | null;
  description: string;
  priceDescription: string | null;
  imageUrl: string | null;
};

export type CatalogServiceSource = {
  id: number;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  status: string;
};

export type CatalogServiceTranslationSource = {
  service_id: number;
  language_code: string;
  title: string;
  subtitle: string | null;
  description: string;
  price_description: string | null;
};

function issueContext(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    code: issue.code,
  }));
}

function pickTranslation(
  translations: CatalogServiceTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): CatalogServiceTranslationSource | null {
  const exact = translations.find((item) => item.language_code === languageCode);
  if (exact) return exact;
  if (!fallbackLanguageCode || fallbackLanguageCode === languageCode) return null;
  return translations.find((item) => item.language_code === fallbackLanguageCode) ?? null;
}

/**
 * Published, active rows only. Text comes from the requested language, then the default language.
 * A service with neither translation is left out. Invalid text or image fails the whole list.
 */
export function assembleCatalogServices(
  services: CatalogServiceSource[],
  translations: CatalogServiceTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): ParseOutcome<CatalogService[]> {
  const byService = new Map<number, CatalogServiceTranslationSource[]>();
  for (const translation of translations) {
    const group = byService.get(translation.service_id);
    if (group) group.push(translation);
    else byService.set(translation.service_id, [translation]);
  }

  const data: CatalogService[] = [];
  for (const service of services) {
    if (service.status !== PUBLISHED_STATUS || !service.is_active) continue;
    const chosen = pickTranslation(byService.get(service.id) ?? [], languageCode, fallbackLanguageCode);
    if (!chosen) continue;

    const parsed = catalogServiceRowSchema.safeParse({
      id: service.id,
      slug: service.slug,
      sort_order: service.sort_order,
      title: chosen.title,
      subtitle: chosen.subtitle,
      description: chosen.description,
      price_description: chosen.price_description,
      image_url: service.image_url,
    });
    if (!parsed.success) {
      return {
        success: false,
        error: new AppError({
          code: 'validation',
          message: clientMessage('validation'),
          originalError: parsed.error,
          context: { issues: issueContext(parsed.error), id: service.id },
        }),
      };
    }

    data.push({
      id: parsed.data.id,
      slug: parsed.data.slug,
      sortOrder: parsed.data.sort_order,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      description: parsed.data.description,
      priceDescription: parsed.data.price_description,
      imageUrl: parsed.data.image_url,
    });
  }

  data.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  return { success: true, data };
}

/** Public service URLs use a lowercase slug. Anything else is not a catalog page. */
export function parseServiceSlug(value: string): string | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return null;
  return value;
}
