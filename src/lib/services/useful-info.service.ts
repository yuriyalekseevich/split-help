import type { SupabaseClient } from '@supabase/supabase-js';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { BaseService } from '@/lib/services/base.service';
import type { MutationGuard } from '@/lib/services/mutation-guard';
import { orderByIds, parseRelatedIds } from '@/lib/services/related-ids';
import { assembleUsefulInfo, parseUsefulInfoRow } from '@/lib/services/useful-info.schema';
import type {
  Database,
  UsefulInfo,
  UsefulInfoDetail,
  UsefulInfoInsert,
  UsefulInfoUpdate,
} from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

const PUBLISHED_STATUS = 'published';

/**
 * Public reads join `useful_info` (image, status, dates) with
 * `useful_info_translations` (title, subtitle, description per language).
 * Writes still touch the parent row only. Pass a MutationGuard when writes open.
 */
export function createUsefulInfoService(
  client: SupabaseClient<Database>,
  guard?: MutationGuard,
) {
  const base = new BaseService(client, 'useful_info', parseUsefulInfoRow, guard);

  return {
    getAll: (languageCode: string) => readUsefulInfo(client, 'getAll', languageCode),
    getById: (id: number, languageCode: string) => readUsefulInfoById(client, id, languageCode),
    getBySlug: (slug: string, languageCode: string) => readUsefulInfoBySlug(client, slug, languageCode),
    getByIds: (ids: number[], languageCode: string) => readUsefulInfoByIds(client, ids, languageCode),
    create: (input: UsefulInfoInsert) => base.create(input),
    update: (id: number, patch: UsefulInfoUpdate) => base.update(id, patch),
    remove: (id: number) => base.remove(id),
  };
}

export type UsefulInfoService = ReturnType<typeof createUsefulInfoService>;

async function readUsefulInfo(
  client: SupabaseClient<Database>,
  operation: string,
  languageCode: string,
  id?: number,
): Promise<Result<UsefulInfo[]>> {
  let articlesQuery = client
    .from('useful_info')
    .select('id, slug, image_url, created_at, status')
    .eq('status', PUBLISHED_STATUS)
    .order('created_at', { ascending: false });
  let translationsQuery = client
    .from('useful_info_translations')
    .select('useful_info_id, language_code, title, subtitle, description');

  if (id !== undefined) {
    articlesQuery = articlesQuery.eq('id', id);
    translationsQuery = translationsQuery.eq('useful_info_id', id);
  }

  try {
    const [articlesResult, translationsResult, languageResult] = await Promise.all([
      articlesQuery,
      translationsQuery,
      client.from('languages').select('code').eq('is_default', true).limit(1).maybeSingle(),
    ]);

    const extra = id === undefined ? undefined : { id };
    if (articlesResult.error) return failure(operation, articlesResult.error, extra);
    if (translationsResult.error) return failure(operation, translationsResult.error, extra);
    if (languageResult.error) return failure(operation, languageResult.error, extra);

    const assembled = assembleUsefulInfo(
      articlesResult.data ?? [],
      translationsResult.data ?? [],
      languageCode,
      languageResult.data?.code ?? null,
    );
    if (!assembled.success) return failure(operation, assembled.error, extra);
    return { success: true, data: assembled.data };
  } catch (error) {
    return failure(operation, error, id === undefined ? undefined : { id });
  }
}

async function readUsefulInfoById(
  client: SupabaseClient<Database>,
  id: number,
  languageCode: string,
): Promise<Result<UsefulInfo | null>> {
  const result = await readUsefulInfo(client, 'getById', languageCode, id);
  if (!result.success) return result;
  return { success: true, data: result.data[0] ?? null };
}

async function readUsefulInfoBySlug(
  client: SupabaseClient<Database>,
  slug: string,
  languageCode: string,
): Promise<Result<UsefulInfoDetail | null>> {
  try {
    const articlesResult = await client
      .from('useful_info')
      .select('id, slug, image_url, created_at, status, related_service_ids, related_info_ids')
      .eq('status', PUBLISHED_STATUS)
      .eq('slug', slug)
      .order('created_at', { ascending: false });

    if (articlesResult.error) return failure('getBySlug', articlesResult.error, { slug });
    const articles = articlesResult.data ?? [];
    if (articles.length === 0) return { success: true, data: null };

    const assembled = await assemblePublished(client, 'getBySlug', languageCode, articles, { slug });
    if (!assembled.success) return assembled;
    const item = assembled.data[0] ?? null;
    if (!item) return { success: true, data: null };

    const source = articles.find((article) => article.id === item.id) ?? articles[0];
    return {
      success: true,
      data: {
        ...item,
        relatedServiceIds: parseRelatedIds(source?.related_service_ids),
        relatedInfoIds: parseRelatedIds(source?.related_info_ids, item.id),
      },
    };
  } catch (error) {
    return failure('getBySlug', error, { slug });
  }
}

async function readUsefulInfoByIds(
  client: SupabaseClient<Database>,
  ids: number[],
  languageCode: string,
): Promise<Result<UsefulInfo[]>> {
  if (ids.length === 0) return { success: true, data: [] };

  try {
    const articlesResult = await client
      .from('useful_info')
      .select('id, slug, image_url, created_at, status')
      .eq('status', PUBLISHED_STATUS)
      .in('id', ids);

    if (articlesResult.error) return failure('getByIds', articlesResult.error);
    const assembled = await assemblePublished(client, 'getByIds', languageCode, articlesResult.data ?? []);
    if (!assembled.success) return assembled;
    return { success: true, data: orderByIds(assembled.data, ids) };
  } catch (error) {
    return failure('getByIds', error);
  }
}

async function assemblePublished(
  client: SupabaseClient<Database>,
  operation: string,
  languageCode: string,
  articles: { id: number; slug: string | null; image_url: string | null; created_at: string; status: string }[],
  extra?: Record<string, unknown>,
): Promise<Result<UsefulInfo[]>> {
  if (articles.length === 0) return { success: true, data: [] };

  const [translationsResult, languageResult] = await Promise.all([
    client
      .from('useful_info_translations')
      .select('useful_info_id, language_code, title, subtitle, description')
      .in(
        'useful_info_id',
        articles.map((article) => article.id),
      ),
    client.from('languages').select('code').eq('is_default', true).limit(1).maybeSingle(),
  ]);

  if (translationsResult.error) return failure(operation, translationsResult.error, extra);
  if (languageResult.error) return failure(operation, languageResult.error, extra);

  const assembled = assembleUsefulInfo(
    articles,
    translationsResult.data ?? [],
    languageCode,
    languageResult.data?.code ?? null,
  );
  if (!assembled.success) return failure(operation, assembled.error, extra);
  return { success: true, data: assembled.data };
}

function failure(operation: string, error: unknown, extra?: Record<string, unknown>): Result<never> {
  const appError = toAppError(error, { table: 'useful_info', operation, ...extra });
  logAppError(appError);
  return { success: false, error: toPublicError(appError) };
}
