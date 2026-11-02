export const CONSENT_COOKIE_NAME = 'split_help_cookie_consent';

/** Six months. Long enough to remember the choice, short of a permanent record. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export type ConsentChoice = 'accepted' | 'rejected';

export function parseConsent(value: string | undefined | null): ConsentChoice | null {
  if (value === 'accepted' || value === 'rejected') return value;
  return null;
}

/** Read the choice from a `document.cookie` or `Cookie` header string. */
export function readConsentCookie(header: string): ConsentChoice | null {
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    if (trimmed.slice(0, separator) !== CONSENT_COOKIE_NAME) continue;
    return parseConsent(decodeURIComponent(trimmed.slice(separator + 1)));
  }
  return null;
}

/** First-party record of the choice. This cookie is the consent itself, so it does not need a prior opt-in. */
export function consentCookie(choice: ConsentChoice, secure: boolean): string {
  const securePart = secure ? '; Secure' : '';
  return `${CONSENT_COOKIE_NAME}=${choice}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${securePart}`;
}
