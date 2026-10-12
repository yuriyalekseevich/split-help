import { z } from 'zod';
import { AppError, clientMessage } from '@/lib/errors/app-error';
import type { ParseOutcome } from '@/lib/services/base.service';

const rowSchema = z.object({
  id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  image_url: z
    .string()
    .trim()
    .url()
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password;
      } catch {
        return false;
      }
    }, 'invalid_image_url'),
  alt_text: z.string().trim().min(1).max(300),
  sort_order: z.number().int().min(0).max(1_000_000),
  is_active: z.boolean(),
});

const translationSchema = z.object({
  split_image_id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  language_code: z.string().trim().min(2).max(12),
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(500),
});

export type SplitImage = {
  id: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  title: string;
  subtitle: string;
};

type Translation = z.infer<typeof translationSchema>;

function pickTranslation(
  rows: Translation[],
  languageCode: string,
  defaultLanguage: string | null,
) {
  return (
    rows.find((row) => row.language_code === languageCode) ??
    rows.find((row) => row.language_code === defaultLanguage) ??
    rows[0] ??
    null
  );
}

export function assembleSplitImages(
  rows: unknown[],
  translations: unknown[] = [],
  languageCode = 'en',
  defaultLanguage: string | null = 'en',
): ParseOutcome<SplitImage[]> {
  const copyByImage = new Map<number, Translation[]>();

  for (const row of translations) {
    const parsed = translationSchema.safeParse(row);
    if (!parsed.success) continue;
    const current = copyByImage.get(parsed.data.split_image_id) ?? [];
    current.push(parsed.data);
    copyByImage.set(parsed.data.split_image_id, current);
  }

  const data: SplitImage[] = [];

  for (const [index, row] of rows.entries()) {
    const parsed = rowSchema.safeParse(row);
    if (!parsed.success) {
      return {
        success: false,
        error: new AppError({
          code: 'validation',
          message: clientMessage('validation'),
          originalError: parsed.error,
          context: { index },
        }),
      };
    }
    if (!parsed.data.is_active) continue;
    const copy = pickTranslation(
      copyByImage.get(parsed.data.id) ?? [],
      languageCode,
      defaultLanguage,
    );
    data.push({
      id: parsed.data.id,
      imageUrl: parsed.data.image_url,
      altText: parsed.data.alt_text,
      sortOrder: parsed.data.sort_order,
      title: copy?.title ?? '',
      subtitle: copy?.subtitle ?? '',
    });
  }

  data.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  return { success: true, data };
}
