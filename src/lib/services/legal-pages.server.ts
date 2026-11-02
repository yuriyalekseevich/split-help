import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { readLegalPage } from '@/lib/services/legal-pages.service';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { LegalPage } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

/** Shared by the page and any later caller so one request hits Supabase once. */
export const getLegalPage = cache((slug: string, languageCode: string): Promise<Result<LegalPage | null>> => {
  return withLegalPage(slug, languageCode);
});

async function withLegalPage(slug: string, languageCode: string): Promise<Result<LegalPage | null>> {
  try {
    const client = await createSupabaseServerClient();
    return await readLegalPage(client, slug, languageCode);
  } catch (error) {
    unstable_rethrow(error);
    const appError = toAppError(error, { table: 'legal_pages', operation: 'getBySlug', slug, languageCode });
    logAppError(appError);
    return { success: false, error: toPublicError(appError) };
  }
}
