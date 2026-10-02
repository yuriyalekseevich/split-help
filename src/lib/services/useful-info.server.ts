import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { createUsefulInfoService, type UsefulInfoService } from '@/lib/services/useful-info.service';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { UsefulInfo } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

async function withUsefulInfoService<T>(
  operation: string,
  read: (service: UsefulInfoService) => Promise<Result<T>>,
  extra?: Record<string, unknown>,
): Promise<Result<T>> {
  try {
    const client = await createSupabaseServerClient();
    return await read(createUsefulInfoService(client));
  } catch (error) {
    unstable_rethrow(error);
    const appError = toAppError(error, { table: 'useful_info', operation, ...extra });
    logAppError(appError);
    return { success: false, error: toPublicError(appError) };
  }
}

/** Shared by the page and generateMetadata so one request hits Supabase once. */
export const listUsefulInfo = cache((languageCode: string): Promise<Result<UsefulInfo[]>> => {
  return withUsefulInfoService('getAll', (service) => service.getAll(languageCode), { languageCode });
});

export const getUsefulInfoById = cache((id: number, languageCode: string): Promise<Result<UsefulInfo | null>> => {
  return withUsefulInfoService('getById', (service) => service.getById(id, languageCode), { id, languageCode });
});
