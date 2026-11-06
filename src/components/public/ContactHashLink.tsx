'use client';

import type { MouseEvent, ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { track } from '@/lib/analytics';

function stickyHeaderOffset() {
  const header = document.querySelector('header');
  if (!header || getComputedStyle(header).position !== 'sticky') return 0;
  return header.getBoundingClientRect().height;
}

/** Moves to the contact section. CSS smooth scrolling drops programmatic scrolls, so it is turned off for this jump. */
function scrollToContact() {
  const target = document.getElementById('contact');
  if (!target) return false;

  const scrolling = document.scrollingElement ?? document.documentElement;
  const top = Math.max(0, target.getBoundingClientRect().top + scrolling.scrollTop - stickyHeaderOffset());
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  html.getClientRects();
  scrolling.scrollTop = top;
  html.style.scrollBehavior = previous;
  return true;
}

/** Scrolls to the contact section when it is already on the page. Otherwise the link navigates home. */
export function ContactHashLink({
  className,
  children,
  placement,
}: {
  className?: string;
  children: ReactNode;
  placement?: 'idea' | 'footer' | 'header';
}) {
  const pathname = usePathname();
  const onHome = pathname === '/';

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (placement) {
      track('click_discuss_idea', { placement });
    }
    if (!onHome) return;

    event.preventDefault();
    const nextUrl = `${window.location.pathname}${window.location.search}#contact`;
    if (window.location.hash !== '#contact') {
      window.history.pushState(null, '', nextUrl);
    }
    scrollToContact();
  }

  if (!onHome) {
    return (
      <Link href="/#contact" className={className} onClick={onClick}>
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
