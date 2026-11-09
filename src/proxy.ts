import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { normalizeIndexablePath } from '@/lib/seo-path';

/**
 * Locale routing.
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`.
 * `/` redirects once to `/en` (`localePrefix: 'always'`, detection off).
 * Legacy `/uk` and locale-prefixed trailing slashes redirect once to the canonical path.
 * `/ingest` is never touched: PostHog needs those trailing slashes, and
 * `skipTrailingSlashRedirect` in next.config.ts keeps Next from stripping them.
 */
const handleI18n = createMiddleware(routing);

function urlWithPathname(request: NextRequest, pathname: string) {
  // A plain URL, not request.nextUrl. NextURL keeps the request's trailingSlash
  // flag and would put the slash back on the Location header, looping forever.
  const url = new URL(request.url);
  url.pathname = pathname;
  return url;
}

function withPathname(request: NextRequest, pathname: string) {
  return new NextRequest(urlWithPathname(request, pathname), {
    headers: request.headers,
    method: request.method,
  });
}

/** Locale redirects are stable (`localeDetection` is off), so they should be permanent. */
function permanentRedirect(response: NextResponse) {
  if (response.status !== 307 && response.status !== 302) return response;
  const location = response.headers.get('location');
  if (!location) return response;
  const redirected = NextResponse.redirect(location, 308);
  for (const cookie of response.headers.getSetCookie()) {
    redirected.headers.append('set-cookie', cookie);
  }
  return redirected;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/ingest' || pathname.startsWith('/ingest/')) {
    return NextResponse.next();
  }

  const normalized = normalizeIndexablePath(pathname);
  const response = handleI18n(normalized ? withPathname(request, normalized) : request);
  if (response.headers.has('location')) return permanentRedirect(response);

  if (normalized) {
    return NextResponse.redirect(urlWithPathname(request, normalized), 308);
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|ingest|_next|_vercel|.*\\..*).*)',
};
