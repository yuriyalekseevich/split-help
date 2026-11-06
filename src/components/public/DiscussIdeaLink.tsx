'use client';

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { ContactHashLink } from './ContactHashLink';

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
  if (placement === 'hero') {
    return (
      <a
        href="#contact"
        className={className}
        onClick={() => track('click_discuss_idea', { placement })}
      >
        {children}
      </a>
    );
  }

  return (
    <ContactHashLink placement="header" className={className}>
      {children}
    </ContactHashLink>
  );
}
