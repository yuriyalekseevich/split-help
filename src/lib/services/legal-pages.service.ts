import type { SupabaseClient } from '@supabase/supabase-js';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { assembleLegalPage, parseLegalSlug } from '@/lib/services/legal-pages.schema';
import type { Database, LegalPage } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

export async function readLegalPage(
  client: SupabaseClient<Database>,
  slug: string,
  languageCode: string,
): Promise<Result<LegalPage | null>> {
  const parsedSlug = parseLegalSlug(slug);
  if (!parsedSlug) return { success: true, data: null };

  try {
    const pageResult = await client
      .from('legal_pages')
      .select('id, slug')
      .eq('slug', parsedSlug)
      .maybeSingle();

    if (pageResult.error) return failure('getBySlug', pageResult.error, { slug: parsedSlug });
    if (!pageResult.data) return { success: true, data: null };

    const [translationsResult, languageResult] = await Promise.all([
      client
        .from('legal_pages_translations')
        .select('legal_page_id, language_code, title, content')
        .eq('legal_page_id', pageResult.data.id),
      client.from('languages').select('code').eq('is_default', true).limit(1).maybeSingle(),
    ]);

    if (translationsResult.error) return failure('getBySlug', translationsResult.error, { slug: parsedSlug });
    if (languageResult.error) return failure('getBySlug', languageResult.error, { slug: parsedSlug });

    const assembled = assembleLegalPage(
      pageResult.data,
      translationsResult.data ?? [],
      languageCode,
      languageResult.data?.code ?? null,
    );
    if (!assembled.success) return failure('getBySlug', assembled.error, { slug: parsedSlug });
    return { success: true, data: assembled.data };
  } catch (error) {
    return failure('getBySlug', error, { slug: parsedSlug });
  }
}

function failure(operation: string, error: unknown, extra?: Record<string, unknown>): Result<never> {
  const appError = toAppError(error, { table: 'legal_pages', operation, ...extra });
  logAppError(appError);
  return { success: false, error: toPublicError(appError) };
}
