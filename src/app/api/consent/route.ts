import { NextResponse } from 'next/server';
import { CONSENT_COOKIE_NAME, CONSENT_MAX_AGE_SECONDS, parseConsent } from '@/lib/consent';

function safeRedirect(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.includes('://')) {
    return '/en';
  }
  return value;
}

/** No-JS fallback. The banner posts here when the client handler is not attached. */
export async function POST(request: Request) {
  const form = await request.formData();
  const choice = parseConsent(String(form.get('choice') ?? ''));
  const redirectTo = safeRedirect(String(form.get('redirect') ?? ''));
  const response = NextResponse.redirect(new URL(redirectTo, request.url), 303);

  if (choice) {
    response.cookies.set(CONSENT_COOKIE_NAME, choice, {
      path: '/',
      maxAge: CONSENT_MAX_AGE_SECONDS,
      sameSite: 'lax',
      secure: new URL(request.url).protocol === 'https:',
    });
  }

  return response;
}
