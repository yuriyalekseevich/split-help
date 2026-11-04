'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCookieConsent } from '@/components/consent/CookieConsentProvider';
import { pageleave, pageview } from '@/lib/analytics';

export function AnalyticsListener() {
  const { status } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (status === 'pending') return;
    pageview(search ? `${pathname}?${search}` : pathname);
  }, [pathname, search, status]);

  useEffect(() => {
    if (status === 'pending') return;
    const send = () => pageleave();
    window.addEventListener('pagehide', send);
    return () => window.removeEventListener('pagehide', send);
  }, [status]);

  return null;
}
