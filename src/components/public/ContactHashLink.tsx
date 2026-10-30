'use client';

import type { MouseEvent, ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { track } from '@/lib/analytics';

const HEADER_OFFSET = 88;

export function ContactHashLink({
  className,
  children,
  placement,
}: {
  className?: string;
  children: ReactNode;
  placement: 'idea' | 'footer';
}) {
  const pathname = usePathname();

  function trackClick() {
    track('click_discuss_idea', { placement });
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    trackClick();
    const target = document.getElementById('contact');
    if (!target) return;

    event.preventDefault();
    const scrolling = document.scrollingElement ?? document.documentElement;
    const top = target.getBoundingClientRect().top + scrolling.scrollTop - HEADER_OFFSET;
    scrolling.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    const nextUrl = `${window.location.pathname}${window.location.search}#contact`;
    window.history.pushState(null, '', nextUrl);
  }

  if (pathname !== '/') {
    return (
      <Link href="/#contact" className={className} onClick={trackClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href="#contact" className={className} onClick={onClick}>
      {children}
    </a>
  );
}
