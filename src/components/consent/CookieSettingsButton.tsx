'use client';

import { useCookieConsent } from '@/components/consent/CookieConsentProvider';

export function CookieSettingsButton({ label }: { label: string }) {
  const { openBanner } = useCookieConsent();

  return (
    <button
      type="button"
      onClick={openBanner}
      className="text-left text-sm font-medium text-white/80 transition hover:text-mint"
    >
      {label}
    </button>
  );
}
