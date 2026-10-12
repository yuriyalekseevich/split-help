import type { SupabaseClient } from '@supabase/supabase-js';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { assembleCatalogServices, type CatalogService } from '@/lib/services/service-catalog.schema';
import type { Database } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

const PUBLISHED_STATUS = 'published';

/**
 * Public reads join `services` (slug, image, status, sort order) with
 * `service_translations` (title, subtitle, description, price per language).
 */
export function createServiceCatalog(client: SupabaseClient<Database>) {
  return {
    getAll: (languageCode: string) => readCatalog(client, 'getAll', languageCode),
    getBySlug: (slug: string, languageCode: string) => readCatalogBySlug(client, slug, languageCode),
  };
}

export type ServiceCatalog = ReturnType<typeof createServiceCatalog>;

async function readCatalog(
  client: SupabaseClient<Database>,
  operation: string,
  languageCode: string,
  slug?: string,
): Promise<Result<CatalogService[]>> {
  let servicesQuery = client
    .from('services')
    .select('id, slug, image_url, is_active, sort_order, status')
    .eq('status', PUBLISHED_STATUS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (slug !== undefined) {
    servicesQuery = servicesQuery.eq('slug', slug);
  }

  const extra = slug === undefined ? undefined : { slug };

  try {
    const [servicesResult, languageResult] = await Promise.all([
      servicesQuery,
      client.from('languages').select('code').eq('is_default', true).limit(1).maybeSingle(),
    ]);

    if (servicesResult.error) return failure(operation, servicesResult.error, extra);
    if (languageResult.error) return failure(operation, languageResult.error, extra);

    const services = servicesResult.data ?? [];
    if (services.length === 0) return { success: true, data: [] };

    const translationsResult = await client
      .from('service_translations')
      .select('service_id, language_code, title, subtitle, description, price_description')
      .in(
        'service_id',
        services.map((service) => service.id),
      );

    if (translationsResult.error) return failure(operation, translationsResult.error, extra);

    const assembled = assembleCatalogServices(
      services,
      translationsResult.data ?? [],
      languageCode,
      languageResult.data?.code ?? null,
    );
    if (!assembled.success) return failure(operation, assembled.error, extra);
    return { success: true, data: assembled.data };
  } catch (error) {
    return failure(operation, error, extra);
  }
}

async function readCatalogBySlug(
  client: SupabaseClient<Database>,
  slug: string,
  languageCode: string,
): Promise<Result<CatalogService | null>> {
  const result = await readCatalog(client, 'getBySlug', languageCode, slug);
  if (!result.success) return result;
  return { success: true, data: result.data[0] ?? null };
}

function failure(operation: string, error: unknown, extra?: Record<string, unknown>): Result<never> {
  const appError = toAppError(error, { table: 'services', operation, ...extra });
  logAppError(appError);
  return { success: false, error: toPublicError(appError) };
}
