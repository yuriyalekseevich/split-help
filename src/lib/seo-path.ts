import { locales } from '@/lib/i18n';

/**
 * Single public URL for a request path.
 * Returns null when the path should be left to locale routing.
 * `/uk` becomes `/ua`. A trailing slash is removed only after a real locale prefix,
 * so `/info/` can still redirect straight to `/en/info` in one hop.
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

  return path === pathname ? null : path;
}
