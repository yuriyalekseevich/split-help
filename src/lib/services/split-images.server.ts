import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { assembleSplitImages, type SplitImage } from '@/lib/services/split-images.schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Result } from '@/lib/types/result';

export const listSplitImages = cache(async (languageCode: string): Promise<Result<SplitImage[]>> => {
  try {
    const client = await createSupabaseServerClient();
    const [imagesResult, languageResult] = await Promise.all([
      client
        .from('split_images')
        .select('id, image_url, alt_text, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true }),
      client.from('languages').select('code').eq('is_default', true).limit(1).maybeSingle(),
    ]);

    if (imagesResult.error) {
      const appError = toAppError(imagesResult.error, { table: 'split_images', operation: 'getAll' });
      logAppError(appError);
      return { success: false, error: toPublicError(appError) };
    }
    if (languageResult.error) {
      const appError = toAppError(languageResult.error, { table: 'languages', operation: 'getAll' });
      logAppError(appError);
      return { success: false, error: toPublicError(appError) };
    }

    const images = imagesResult.data ?? [];
    const translationsResult =
      images.length === 0
        ? { data: [], error: null }
        : await client
            .from('split_image_translations')
            .select('split_image_id, language_code, title, subtitle')
            .in(
              'split_image_id',
              images.map((image) => image.id),
            );

    if (translationsResult.error) {
      const appError = toAppError(translationsResult.error, {
        table: 'split_image_translations',
        operation: 'getAll',
      });
      logAppError(appError);
      return { success: false, error: toPublicError(appError) };
    }

    const assembled = assembleSplitImages(
      images,
      translationsResult.data ?? [],
      languageCode,
      languageResult.data?.code ?? null,
    );
    if (!assembled.success) {
      logAppError(assembled.error);
      return { success: false, error: toPublicError(assembled.error) };
    }
    return { success: true, data: assembled.data };
  } catch (error) {
    unstable_rethrow(error);
    const appError = toAppError(error, { table: 'split_images', operation: 'getAll' });
    logAppError(appError);
    return { success: false, error: toPublicError(appError) };
  }
});
