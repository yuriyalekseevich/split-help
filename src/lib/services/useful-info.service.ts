import type { SupabaseClient } from '@supabase/supabase-js';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { BaseService } from '@/lib/services/base.service';
import type { MutationGuard } from '@/lib/services/mutation-guard';
import { assembleUsefulInfo, parseUsefulInfoRow } from '@/lib/services/useful-info.schema';
import type { Database, UsefulInfo, UsefulInfoInsert, UsefulInfoUpdate } from '@/lib/types/database';
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
    .select('id, image_url, created_at, status')
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

function failure(operation: string, error: unknown, extra?: Record<string, unknown>): Result<never> {
  const appError = toAppError(error, { table: 'useful_info', operation, ...extra });
  logAppError(appError);
  return { success: false, error: toPublicError(appError) };
}
