import { describe, expect, it } from 'vitest';
import { consentCookie, parseConsent, readConsentCookie } from '@/lib/consent';

describe('consent cookie', () => {
  it('accepts only the two stored choices', () => {
    expect(parseConsent('accepted')).toBe('accepted');
    expect(parseConsent('rejected')).toBe('rejected');
    expect(parseConsent('yes')).toBeNull();
    expect(parseConsent(undefined)).toBeNull();
  });

  it('reads the choice out of a cookie header and ignores other cookies', () => {
    expect(readConsentCookie('locale=en; split_help_cookie_consent=rejected')).toBe('rejected');
    expect(readConsentCookie('locale=en')).toBeNull();
  });

  it('writes a lax cookie and adds Secure only on https', () => {
    expect(consentCookie('accepted', false)).toBe(
      'split_help_cookie_consent=accepted; Path=/; Max-Age=15552000; SameSite=Lax',
    );
    expect(consentCookie('rejected', true)).toContain('; Secure');
  });
});
