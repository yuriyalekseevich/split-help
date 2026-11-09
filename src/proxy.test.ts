import { NextRequest, NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/middleware', () => ({
  default: () => (request: NextRequest) => {
    const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
    const prefixed = /^\/(en|ru|hr|ua)(\/|$)/.test(pathname);
    if (!prefixed) {
      const destination = pathname === '/' ? '/en' : `/en${pathname}`;
      return NextResponse.redirect(new URL(destination, request.url), 307);
    }
    return NextResponse.next();
  },
}));

import proxy from '@/proxy';

async function respond(path: string) {
  const response = await proxy(new NextRequest(`https://split-help.com${path}`));
  return { status: response.status, location: response.headers.get('location') };
}

function parsed(location: string | null) {
  return new URL(location ?? '', 'https://split-help.com');
}

describe('proxy', () => {
  it('sends / to /en in one permanent redirect', async () => {
    const result = await respond('/');
    expect(result.status).toBe(308);
    expect(parsed(result.location).pathname).toBe('/en');
  });

  it('sends an unprefixed trailing slash straight to the default locale', async () => {
    const result = await respond('/info/');
    expect(result.status).toBe(308);
    expect(parsed(result.location).pathname).toBe('/en/info');
  });

  it('sends legacy uk and a trailing slash to the canonical url in one hop', async () => {
    const result = await respond('/uk/info/');
    expect(result.status).toBe(308);
    expect(parsed(result.location).pathname).toBe('/ua/info');
  });

  it('strips a trailing slash from a locale path and keeps the query', async () => {
    const result = await respond('/en/info/?utm_source=google');
    expect(result.status).toBe(308);
    const url = parsed(result.location);
    expect(url.pathname).toBe('/en/info');
    expect(url.search).toBe('?utm_source=google');
  });

  it('serves a canonical locale path without redirecting', async () => {
    const result = await respond('/en/info?utm_source=google');
    expect(result.location).toBeNull();
  });

  it('does not redirect the posthog proxy', async () => {
    const result = await respond('/ingest/e/');
    expect(result.status).toBe(200);
    expect(result.location).toBeNull();
  });
});
