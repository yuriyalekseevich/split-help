'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageleave, pageview } from '@/lib/analytics';

export function AnalyticsListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    pageview(search ? `${pathname}?${search}` : pathname);
  }, [pathname, search]);

  useEffect(() => {
    const send = () => pageleave();
    window.addEventListener('pagehide', send);
    return () => window.removeEventListener('pagehide', send);
  }, []);

  return null;
}
