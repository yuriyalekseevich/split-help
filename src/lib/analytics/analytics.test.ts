import { afterEach, describe, expect, it } from 'vitest';
import { posthogInitOptions } from '@/lib/analytics/posthog';
import { readAnalyticsConfig } from '@/lib/analytics/env';
import { createAnalyticsProvider } from '@/lib/analytics';
import { noopAnalytics } from '@/lib/analytics/noop';

const ENV_KEYS = [
  'NEXT_PUBLIC_ANALYTICS_ENABLED',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_POSTHOG_HOST',
] as const;

describe('analytics config', () => {
  const previous = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  it('stays off until the flag and both PostHog values are set', () => {
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
    expect(readAnalyticsConfig()).toBeNull();

    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = 'true';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test';
    expect(readAnalyticsConfig()).toBeNull();

    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com';
    expect(readAnalyticsConfig()).toEqual({
      key: 'phc_test',
      host: 'https://eu.i.posthog.com',
    });
  });

  it('counts a rejection without cookies', () => {
    const options = posthogInitOptions({ key: 'phc_test', host: 'https://eu.i.posthog.com' });
    expect(options.cookieless_mode).toBe('on_reject');
    expect(options.api_host).toBe('/ingest');
    expect(options.ui_host).toBe('https://eu.posthog.com');
  });

  it('uses the no-op provider when analytics is off', () => {
    expect(createAnalyticsProvider(null)).toBe(noopAnalytics);
  });
});
