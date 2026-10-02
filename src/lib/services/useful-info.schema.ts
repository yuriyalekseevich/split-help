import { z } from 'zod';
import { AppError, clientMessage } from '@/lib/errors/app-error';
import type { ParseOutcome } from '@/lib/services/base.service';
import type { UsefulInfo } from '@/lib/types/database';

const LIMITS = {
  title: 500,
  subtitle: 1000,
  description: 50_000,
} as const;

function emptyToNull(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

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

/** Required text. Missing and blank values fail. */
const requiredText = (max: number) => z.string().trim().min(1).max(max);

/** Optional text. Missing, null, and blank become null. */
const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.union([requiredText(max), z.null()]));

/** Optional image. Missing, null, and blank become null. A present value must be http(s). */
const optionalImageUrl = z.preprocess(
  emptyToNull,
  z.union([z.string().trim().refine(isSafeHttpUrl, 'invalid_image_url'), z.null()]),
);

export const usefulInfoRowSchema = z.object({
  id: idSchema,
  title: requiredText(LIMITS.title),
  subtitle: optionalText(LIMITS.subtitle),
  image_url: optionalImageUrl,
  description: requiredText(LIMITS.description),
  created_at: z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), 'invalid_date'),
});

function issueContext(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    code: issue.code,
  }));
}

export function parseUsefulInfoRow(input: unknown): ParseOutcome<UsefulInfo> {
  const parsed = usefulInfoRowSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: new AppError({
        code: 'validation',
        message: clientMessage('validation'),
        originalError: parsed.error,
        context: { issues: issueContext(parsed.error) },
      }),
    };
  }

  return { success: true, data: parsed.data };
}

export type UsefulInfoArticleSource = {
  id: number;
  image_url: string | null;
  created_at: string;
  status: string;
};

export type UsefulInfoTranslationSource = {
  useful_info_id: number;
  language_code: string;
  title: string;
  subtitle: string | null;
  description: string;
};

const PUBLISHED_STATUS = 'published';

function pickTranslation(
  translations: UsefulInfoTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): UsefulInfoTranslationSource | null {
  const exact = translations.find((item) => item.language_code === languageCode);
  if (exact) return exact;
  if (!fallbackLanguageCode || fallbackLanguageCode === languageCode) return null;
  return translations.find((item) => item.language_code === fallbackLanguageCode) ?? null;
}

/**
 * Published rows only. Text comes from the requested language, then the default language.
 * An article with neither translation is left out. Invalid text or image fails the whole list.
 */
export function assembleUsefulInfo(
  articles: UsefulInfoArticleSource[],
  translations: UsefulInfoTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): ParseOutcome<UsefulInfo[]> {
  const byArticle = new Map<number, UsefulInfoTranslationSource[]>();
  for (const translation of translations) {
    const group = byArticle.get(translation.useful_info_id);
    if (group) group.push(translation);
    else byArticle.set(translation.useful_info_id, [translation]);
  }

  const data: UsefulInfo[] = [];
  for (const article of articles) {
    if (article.status !== PUBLISHED_STATUS) continue;
    const chosen = pickTranslation(byArticle.get(article.id) ?? [], languageCode, fallbackLanguageCode);
    if (!chosen) continue;

    const parsed = parseUsefulInfoRow({
      id: article.id,
      title: chosen.title,
      subtitle: chosen.subtitle,
      image_url: article.image_url,
      description: chosen.description,
      created_at: article.created_at,
    });
    if (!parsed.success) {
      return {
        success: false,
        error: new AppError({
          code: parsed.error.code,
          message: parsed.error.message,
          originalError: parsed.error.originalError,
          context: { ...parsed.error.context, id: article.id },
        }),
      };
    }
    data.push(parsed.data);
  }

  return { success: true, data };
}

export function parseUsefulInfoId(value: string): number | null {
  if (!/^[0-9]+$/.test(value)) return null;
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}
