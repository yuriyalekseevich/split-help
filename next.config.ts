import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // The phone preview loads the site by LAN address. Dev assets are blocked until that host is listed.
  allowedDevOrigins: ['192.168.100.102', '192.168.100.107'],
  // PostHog posts to `/ingest/.../` with a trailing slash. Next's own slash
  // redirect runs before rewrites and would drop that body. Public pages
  // collapse slashes in src/proxy.ts, which also sends legacy `/uk` to `/ua`
  // in the same hop. Do not add a `/uk` redirect here or the slash hop stacks.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path(.*)',
        destination: 'https://eu-assets.i.posthog.com/static/:path',
      },
      {
        source: '/ingest/array/:path(.*)',
        destination: 'https://eu-assets.i.posthog.com/array/:path',
      },
      {
        source: '/ingest/:path(.*)',
        destination: 'https://eu.i.posthog.com/:path',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
