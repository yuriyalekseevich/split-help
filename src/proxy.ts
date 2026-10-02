import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Locale routing.
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`; this is that file.
 * `/` redirects to `/en` because `localeDetection` is off and the
 * default locale is always prefixed (`localePrefix: 'always'`).
 */
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
