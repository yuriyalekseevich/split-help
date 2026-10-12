import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import type { CatalogService } from '@/lib/services/service-catalog.schema';
import { createServiceCatalog, type ServiceCatalog } from '@/lib/services/service-catalog.service';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Result } from '@/lib/types/result';

async function withCatalog<T>(
  operation: string,
  read: (catalog: ServiceCatalog) => Promise<Result<T>>,
  extra?: Record<string, unknown>,
): Promise<Result<T>> {
  try {
    const client = await createSupabaseServerClient();
    return await read(createServiceCatalog(client));
  } catch (error) {
    unstable_rethrow(error);
    const appError = toAppError(error, { table: 'services', operation, ...extra });
    logAppError(appError);
    return { success: false, error: toPublicError(appError) };
  }
}

/** Shared by the page and generateMetadata so one request hits Supabase once. */
export const listCatalogServices = cache((languageCode: string): Promise<Result<CatalogService[]>> => {
  return withCatalog('getAll', (catalog) => catalog.getAll(languageCode), { languageCode });
});

export const getCatalogServiceBySlug = cache(
  (slug: string, languageCode: string): Promise<Result<CatalogService | null>> => {
    return withCatalog('getBySlug', (catalog) => catalog.getBySlug(slug, languageCode), { slug, languageCode });
  },
);
