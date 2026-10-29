import type { AnalyticsConfig } from './env';
import type { AnalyticsProvider } from './types';

const POSTHOG_PAGEVIEW = '$pageview';
const POSTHOG_PAGELEAVE = '$pageleave';

export function createPostHogProvider(config: AnalyticsConfig): AnalyticsProvider {
  let ready: Promise<typeof import('posthog-js').default> | null = null;

  function load() {
    ready ??= import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(config.key, {
          api_host: config.host,
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          disable_session_recording: true,
          rageclick: false,
          capture_dead_clicks: false,
          capture_exceptions: false,
          capture_performance: false,
          person_profiles: 'identified_only',
        });
      }
      return posthog;
    });
    return ready;
  }

  return {
    pageview(path) {
      void load().then((posthog) => {
        posthog.capture(POSTHOG_PAGEVIEW, {
          $current_url: new URL(path, window.location.origin).href,
        });
      });
    },
    pageleave() {
      void load().then((posthog) => posthog.capture(POSTHOG_PAGELEAVE));
    },
    track(name, properties) {
      void load().then((posthog) => posthog.capture(name, properties));
    },
  };
}
