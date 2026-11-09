import { z } from 'zod';
import { AppError, clientMessage } from '@/lib/errors/app-error';
import { indexableLocales } from '@/lib/i18n';
import type { ParseOutcome } from '@/lib/services/base.service';
import type { LegalPage } from '@/lib/types/database';

const LIMITS = {
  title: 500,
  content: 200_000,
} as const;

const LEGAL_SLUGS = ['privacy-policy', 'cookie-policy'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const idSchema = z.preprocess((value) => {
  if (typeof value === 'string' && /^[0-9]+$/.test(value)) return Number(value);
  return value;
}, z.number().int().positive().max(Number.MAX_SAFE_INTEGER));

const requiredText = (max: number) => z.string().trim().min(1).max(max);

const legalPageSchema = z.object({
  id: idSchema,
  slug: z.enum(LEGAL_SLUGS),
  title: requiredText(LIMITS.title),
  content: requiredText(LIMITS.content),
});

function issueContext(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    code: issue.code,
  }));
}

export function parseLegalSlug(value: string): LegalSlug | null {
  return (LEGAL_SLUGS as readonly string[]).includes(value) ? (value as LegalSlug) : null;
}

export function parseLegalPage(input: unknown): ParseOutcome<LegalPage> {
  const parsed = legalPageSchema.safeParse(input);
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

export type LegalTranslationSource = {
  legal_page_id: number;
  language_code: string;
  title: string;
  content: string;
};

function pickTranslation(
  translations: LegalTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): LegalTranslationSource | null {
  const exact = translations.find((item) => item.language_code === languageCode);
  if (exact) return exact;
  if (!fallbackLanguageCode || fallbackLanguageCode === languageCode) return null;
  return translations.find((item) => item.language_code === fallbackLanguageCode) ?? null;
}

/**
 * Text comes from the requested language, then the default language.
 * An unknown slug, or a page with no translation, is absent rather than an error.
 */
export function assembleLegalPage(
  page: { id: number; slug: string } | null,
  translations: LegalTranslationSource[],
  languageCode: string,
  fallbackLanguageCode: string | null,
): ParseOutcome<LegalPage | null> {
  if (!page) return { success: true, data: null };
  const slug = parseLegalSlug(page.slug);
  if (!slug) return { success: true, data: null };

  const group = translations.filter((item) => item.legal_page_id === page.id);
  const chosen = pickTranslation(group, languageCode, fallbackLanguageCode);
  const indexed = indexableLocales(
    group.map((item) => item.language_code),
    chosen?.language_code ?? null,
  );
  if (!chosen || !indexed) return { success: true, data: null };

  const parsed = parseLegalPage({
    id: page.id,
    slug,
    title: chosen.title,
    content: chosen.content,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: new AppError({
        code: parsed.error.code,
        message: parsed.error.message,
        originalError: parsed.error.originalError,
        context: { ...parsed.error.context, id: page.id },
      }),
    };
  }

  return { success: true, data: { ...parsed.data, ...indexed } };
}
