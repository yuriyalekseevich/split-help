import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { assembleGalleryImages, type GalleryImage } from '@/lib/services/gallery-images.schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Result } from '@/lib/types/result';

type GalleryTable = 'service_images' | 'useful_info_images';

function failure(table: GalleryTable, parentId: number, error: unknown): Result<GalleryImage[]> {
  const appError = toAppError(error, { table, operation: 'getAll', id: parentId });
  logAppError(appError);
  return { success: false, error: toPublicError(appError) };
}

function finish(table: GalleryTable, parentId: number, error: unknown, rows: unknown[] | null): Result<GalleryImage[]> {
  if (error) return failure(table, parentId, error);
  return { success: true, data: assembleGalleryImages(rows ?? []) };
}

/** Extra photos for one published service. Descriptions are the slide captions. An empty list means the cover image stays. */
export const listServiceImages = cache(async (serviceId: number): Promise<Result<GalleryImage[]>> => {
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client
      .from('service_images')
      .select('id, image_url, description, sort_order')
      .eq('service_id', serviceId)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true });

    return finish('service_images', serviceId, error, data);
  } catch (error) {
    unstable_rethrow(error);
    return failure('service_images', serviceId, error);
  }
});

/** Extra photos for one useful-info article. Descriptions are the slide captions. */
export const listUsefulInfoImages = cache(async (usefulInfoId: number): Promise<Result<GalleryImage[]>> => {
  try {
    const client = await createSupabaseServerClient();
    const { data, error } = await client
      .from('useful_info_images')
      .select('id, image_url, description, sort_order')
      .eq('useful_info_id', usefulInfoId)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('id', { ascending: true });

    return finish('useful_info_images', usefulInfoId, error, data);
  } catch (error) {
    unstable_rethrow(error);
    return failure('useful_info_images', usefulInfoId, error);
  }
});
