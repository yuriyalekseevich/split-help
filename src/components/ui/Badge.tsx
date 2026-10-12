import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-mint/20 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-ink">
      {children}
    </span>
  );
}
