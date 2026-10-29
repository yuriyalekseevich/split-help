import { readAnalyticsConfig, type AnalyticsConfig } from './env';
import { noopAnalytics } from './noop';
import type { AnalyticsProperties, AnalyticsProvider } from './types';

export type { AnalyticsProperties, AnalyticsProvider } from './types';

function createLazyPostHogProvider(config: AnalyticsConfig): AnalyticsProvider {
  let ready: Promise<AnalyticsProvider> | null = null;

  function load() {
    ready ??= import('./posthog').then(({ createPostHogProvider }) => createPostHogProvider(config));
    return ready;
  }

  return {
    pageview(path) {
      void load().then((provider) => provider.pageview(path));
    },
    pageleave() {
      void load().then((provider) => provider.pageleave());
    },
    track(name, properties) {
      void load().then((provider) => provider.track(name, properties));
    },
  };
}

/** Picks PostHog when configured. Otherwise the calls do nothing. */
export function createAnalyticsProvider(config: AnalyticsConfig | null = readAnalyticsConfig()): AnalyticsProvider {
  if (!config || typeof window === 'undefined') return noopAnalytics;
  return createLazyPostHogProvider(config);
}

let provider: AnalyticsProvider | null = null;

function client(): AnalyticsProvider {
  if (typeof window === 'undefined') return noopAnalytics;
  provider ??= createAnalyticsProvider();
  return provider;
}

export function pageview(path: string): void {
  client().pageview(path);
}

export function pageleave(): void {
  client().pageleave();
}

export function track(name: string, properties?: AnalyticsProperties): void {
  client().track(name, properties);
}
