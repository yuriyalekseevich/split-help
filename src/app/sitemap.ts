import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { alternatesFor, locales, localesMatching, type Locale } from '@/lib/i18n';
import { parseServiceSlug } from '@/lib/services/service-catalog.schema';
import { parseUsefulInfoSlug } from '@/lib/services/useful-info.schema';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import type { Database } from '@/lib/types/supabase';

export const revalidate = 86400;

const PUBLISHED = 'published';

type Frequency = 'weekly' | 'monthly';

type LanguageRow = { id: number; language: string };

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
  published: readonly Locale[] = locales,
): MetadataRoute.Sitemap {
  return published.map((locale) => {
    const alternates = alternatesFor(locale, path, published);
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
  return [...localized('', 'weekly', 1), ...localized('/info', 'monthly', 0.8)];
}

function legalFallback(): MetadataRoute.Sitemap {
  return [...localized('/privacy-policy', 'monthly', 0.3), ...localized('/cookie-policy', 'monthly', 0.3)];
}

function groupLanguages(rows: LanguageRow[]): Map<number, string[]> {
  const grouped = new Map<number, string[]>();
  for (const row of rows) {
    const current = grouped.get(row.id);
    if (current) current.push(row.language);
    else grouped.set(row.id, [row.language]);
  }
  return grouped;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = staticRoutes();

  try {
    const { url, anonKey } = readSupabasePublicEnv();
    const supabase = createClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const [articles, articleText, services, serviceText, legalPages, legalText] = await Promise.all([
      supabase.from('useful_info').select('id, slug, updated_at, created_at').eq('status', PUBLISHED),
      supabase.from('useful_info_translations').select('useful_info_id, language_code'),
      supabase
        .from('services')
        .select('id, slug, updated_at, created_at')
        .eq('status', PUBLISHED)
        .eq('is_active', true),
      supabase.from('service_translations').select('service_id, language_code'),
      supabase.from('legal_pages').select('id, slug'),
      supabase.from('legal_pages_translations').select('legal_page_id, language_code'),
    ]);

    if (!articles.error && articles.data && !articleText.error && articleText.data) {
      const languages = groupLanguages(
        articleText.data.map((row) => ({ id: row.useful_info_id, language: row.language_code })),
      );
      for (const article of articles.data) {
        const slug = article.slug === null ? null : parseUsefulInfoSlug(article.slug);
        const published = localesMatching(languages.get(article.id) ?? []);
        if (slug === null || published.length === 0) continue;
        pages.push(
          ...localized(
            `/info/${slug}`,
            'monthly',
            0.7,
            modifiedAt(article.updated_at, article.created_at),
            published,
          ),
        );
      }
    }

    if (!services.error && services.data && !serviceText.error && serviceText.data) {
      const languages = groupLanguages(
        serviceText.data.map((row) => ({ id: row.service_id, language: row.language_code })),
      );
      for (const service of services.data) {
        const slug = parseServiceSlug(service.slug);
        const published = localesMatching(languages.get(service.id) ?? []);
        if (slug === null || published.length === 0) continue;
        pages.push(
          ...localized(
            `/service/${slug}`,
            'monthly',
            0.7,
            modifiedAt(service.updated_at, service.created_at),
            published,
          ),
        );
      }
    }

    if (legalPages.error || !legalPages.data || legalText.error || !legalText.data) {
      pages.push(...legalFallback());
    } else {
      const languages = groupLanguages(
        legalText.data.map((row) => ({ id: row.legal_page_id, language: row.language_code })),
      );
      for (const page of legalPages.data) {
        if (page.slug !== 'privacy-policy' && page.slug !== 'cookie-policy') continue;
        const published = localesMatching(languages.get(page.id) ?? []);
        if (published.length === 0) continue;
        pages.push(...localized(`/${page.slug}`, 'monthly', 0.3, undefined, published));
      }
    }
  } catch {
    pages.push(...legalFallback());
  }

  return pages;
}
