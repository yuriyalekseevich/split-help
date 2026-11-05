import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_COOKIE_NAME } from '@/lib/consent';
import { createPostHogProvider } from '@/lib/analytics/posthog';

const { client } = vi.hoisted(() => {
  const client = {
    __loaded: false,
    status: 'pending' as 'pending' | 'granted' | 'denied',
    calls: [] as string[],
    pageViewManager: undefined as { kind: string } | undefined,
    init() {
      client.__loaded = true;
      client.pageViewManager = { kind: 'sdk' };
      client.calls.push('init');
    },
    capture(name: string, _properties?: unknown, options?: { send_instantly?: boolean }) {
      if (!client.pageViewManager) throw new Error('pageViewManager missing');
      const instant = options?.send_instantly ? ':instant' : '';
      client.calls.push(`capture:${name}${instant}`);
    },
    opt_in_capturing() {
      client.status = 'granted';
      client.calls.push('opt_in');
    },
    opt_out_capturing() {
      client.status = 'denied';
      client.pageViewManager = undefined;
      client.calls.push('opt_out');
    },
    get_explicit_consent_status() {
      return client.status;
    },
    is_capturing() {
      return client.status !== 'pending';
    },
  };
  return { client };
});

vi.mock('posthog-js', () => ({ default: client }));

const config = { key: 'phc_test', host: 'https://eu.i.posthog.com' };

function cookieJar(value: string) {
  return { cookie: value };
}

describe('PostHog consent capture', () => {
  beforeEach(() => {
    client.__loaded = false;
    client.status = 'pending';
    client.calls = [];
    client.pageViewManager = undefined;
    vi.stubGlobal('window', { location: { origin: 'https://www.split-help.com' } });
    vi.stubGlobal('document', cookieJar(''));
    vi.stubGlobal('localStorage', { getItem: () => null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not boot PostHog while the visitor has not chosen', async () => {
    createPostHogProvider(config).pageview('/en');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(client.calls).toEqual([]);
    expect(client.__loaded).toBe(false);
  });

  it('opts in before the pageview when the visitor has accepted', async () => {
    vi.stubGlobal('document', cookieJar(`${CONSENT_COOKIE_NAME}=accepted`));
    createPostHogProvider(config).pageview('/en');
    await vi.waitFor(() => expect(client.calls).toContain('capture:$pageview:instant'));
    expect(client.calls).toEqual(['init', 'opt_in', 'capture:$pageview:instant']);
  });

  it('opts out before the pageview when the visitor has rejected', async () => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key === CONSENT_COOKIE_NAME ? 'rejected' : null),
    });
    createPostHogProvider(config).pageview('/en');
    await vi.waitFor(() => expect(client.calls).toContain('capture:$pageview:instant'));
    expect(client.calls).toEqual(['init', 'opt_out', 'capture:$pageview:instant']);
    expect(client.pageViewManager).toEqual(
      expect.objectContaining({
        doPageView: expect.any(Function),
      }),
    );
  });

  it('sends the pageview after an explicit opt-in even if storage is empty', async () => {
    const provider = createPostHogProvider(config);
    await provider.syncConsent('accepted');
    provider.pageview('/en');
    await vi.waitFor(() => expect(client.calls).toContain('capture:$pageview:instant'));
    expect(client.calls.indexOf('opt_in')).toBeLessThan(client.calls.indexOf('capture:$pageview:instant'));
  });
});
