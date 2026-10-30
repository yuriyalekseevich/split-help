'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { track } from '@/lib/analytics';

type Placement = 'hero' | 'header';

export function DiscussIdeaLink({
  placement,
  className,
  children,
}: {
  placement: Placement;
  className?: string;
  children: ReactNode;
}) {
  function onClick() {
    track('click_discuss_idea', { placement });
  }

  if (placement === 'hero') {
    return (
      <a href="#contact" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href="/#contact" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
