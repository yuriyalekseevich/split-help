import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // The phone preview loads the site by LAN address. Dev assets are blocked until that host is listed.
  allowedDevOrigins: ['192.168.100.107'],
  async redirects() {
    return [
      { source: '/uk', destination: '/ua', permanent: true },
      { source: '/uk/:path*', destination: '/ua/:path*', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
