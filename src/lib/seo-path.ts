import { locales } from '@/lib/i18n';

/** Retired useful-info slugs. The public URL is the current slug. */
const retiredInfoSlugs: Record<string, string> = {
  'accommodation-in-split': 'long-term-rentals-split',
  'sunday-shops-split': 'shops-open-on-sunday-split',
};

const infoSlugPath = new RegExp(`^/(?:(${locales.join('|')})/)?info/([^/]+)/?$`);

function withCurrentInfoSlug(path: string): string {
  const match = infoSlugPath.exec(path);
  if (!match) return path;
  const next = retiredInfoSlugs[match[2]];
  if (!next) return path;
  return match[1] ? `/${match[1]}/info/${next}` : `/info/${next}`;
}

/**
 * Single public URL for a request path.
 * Returns null when the path should be left to locale routing.
 * `/uk` becomes `/ua`. A trailing slash is removed only after a real locale prefix,
 * so `/info/` can still redirect straight to `/en/info` in one hop.
 * Retired info slugs fold into that same path.
 */
export function normalizeIndexablePath(pathname: string): string | null {
  let path = pathname.replace(/\/{2,}/g, '/');
  const legacy = /^\/uk(?=\/|$)/i.exec(path);
  if (legacy) {
    path = `/ua${path.slice(legacy[0].length)}`;
  }

  if (path.length > 1 && path.endsWith('/')) {
    const stripped = path.replace(/\/+$/, '');
    const prefixed = locales.some(
      (locale) => stripped === `/${locale}` || stripped.startsWith(`/${locale}/`),
    );
    if (prefixed) path = stripped;
  }

  path = withCurrentInfoSlug(path);

  return path === pathname ? null : path;
}
