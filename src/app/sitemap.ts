import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { alternatesFor, locales } from '@/lib/i18n';
import { parseServiceSlug } from '@/lib/services/service-catalog.schema';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import type { Database } from '@/lib/types/supabase';

export const revalidate = 86400;

const PUBLISHED = 'published';

type Frequency = 'weekly' | 'monthly';

function modifiedAt(updatedAt: string | null, createdAt: string): Date {
  for (const value of [updatedAt, createdAt]) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

function localized(
  path: string,
  changeFrequency: Frequency,
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const alternates = alternatesFor(locale, path);
    return {
      url: alternates.canonical,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
      alternates: { languages: alternates.languages },
    };
  });
}

function staticRoutes(): MetadataRoute.Sitemap {
  return [
    ...localized('', 'weekly', 1),
    ...localized('/info', 'monthly', 0.8),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = staticRoutes();

  try {
    const { url, anonKey } = readSupabasePublicEnv();
    const supabase = createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const [articles, articleText, services, serviceText] = await Promise.all([
      supabase
        .from('useful_info')
        .select('id, updated_at, created_at')
        .eq('status', PUBLISHED),
      supabase.from('useful_info_translations').select('useful_info_id'),
      supabase
        .from('services')
        .select('id, slug, updated_at, created_at')
        .eq('status', PUBLISHED)
        .eq('is_active', true),
      supabase.from('service_translations').select('service_id'),
    ]);

    if (
      articles.error ||
      !articles.data ||
      articleText.error ||
      !articleText.data ||
      services.error ||
      !services.data ||
      serviceText.error ||
      !serviceText.data
    ) {
      return pages;
    }

    const articleIds = new Set(articleText.data.map((row) => row.useful_info_id));
    for (const article of articles.data) {
      if (!articleIds.has(article.id)) continue;
      pages.push(
        ...localized(
          `/info/${article.id}`,
          'monthly',
          0.7,
          modifiedAt(article.updated_at, article.created_at),
        ),
      );
    }

    const translatedServices = new Set(serviceText.data.map((row) => row.service_id));
    for (const service of services.data) {
      if (!translatedServices.has(service.id)) continue;
      const slug = parseServiceSlug(service.slug);
      if (slug === null) continue;
      pages.push(
        ...localized(
          `/service/${slug}`,
          'monthly',
          0.7,
          modifiedAt(service.updated_at, service.created_at),
        ),
      );
    }
  } catch {
    return staticRoutes();
  }

  return pages;
}
