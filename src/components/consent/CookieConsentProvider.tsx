'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { pageview, syncConsent } from '@/lib/analytics';
import { consentCookie, parseConsent, readConsentCookie, CONSENT_COOKIE_NAME, type ConsentChoice } from '@/lib/consent';

type Status = ConsentChoice | 'pending';

type CookieConsentContextValue = {
  status: Status;
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openBanner: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({
  initialChoice,
  children,
}: {
  initialChoice: ConsentChoice | null;
  children: ReactNode;
}) {
  const [choice, setChoice] = useState<ConsentChoice | null>(initialChoice);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (initialChoice) setChoice(initialChoice);
  }, [initialChoice]);

  useEffect(() => {
    if (choice) return;
    const stored = readConsentCookie(document.cookie) ?? parseConsent(localStorage.getItem(CONSENT_COOKIE_NAME));
    if (stored) setChoice(stored);
  }, [choice]);

  function choose(next: ConsentChoice) {
    try {
      document.cookie = consentCookie(next, window.location.protocol === 'https:');
    } catch {
      // A sandboxed frame can refuse document.cookie. The form post still records the choice.
    }
    try {
      localStorage.setItem(CONSENT_COOKIE_NAME, next);
    } catch {
      // Private mode can block localStorage.
    }
    setChoice(next);
    setReopened(false);
    const path = `${window.location.pathname}${window.location.search}`;
    void syncConsent(next)
      .then(() => pageview(path))
      .catch(() => {});
  }

  const value: CookieConsentContextValue = {
    status: choice ?? 'pending',
    bannerOpen: reopened || choice === null,
    accept: () => choose('accepted'),
    reject: () => choose('rejected'),
    openBanner: () => setReopened(true),
  };

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const value = useContext(CookieConsentContext);
  if (!value) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return value;
}
