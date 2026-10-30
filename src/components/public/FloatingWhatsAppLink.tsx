'use client';

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';

export function FloatingWhatsAppLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() => track('click_whatsapp', { source: 'floating' })}
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#0f6b4c] text-white shadow-lg md:hidden"
    >
      {children}
    </a>
  );
}
