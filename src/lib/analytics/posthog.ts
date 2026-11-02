import type { AnalyticsConfig } from './env';
import { consentSyncAction } from './consent';
import { readConsentCookie, type ConsentChoice } from '@/lib/consent';
import type { AnalyticsProvider } from './types';

const POSTHOG_PAGEVIEW = '$pageview';
const POSTHOG_PAGELEAVE = '$pageleave';

export function posthogInitOptions(config: AnalyticsConfig) {
  return {
    api_host: config.host,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    rageclick: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_performance: false,
    person_profiles: 'identified_only' as const,
    cookieless_mode: 'on_reject' as const,
  };
}

type ConsentClient = {
  opt_in_capturing: () => void;
  opt_out_capturing: () => void;
  get_explicit_consent_status: () => 'granted' | 'denied' | 'pending';
};

function storedConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return null;
  return readConsentCookie(document.cookie);
}

function applyConsent(posthog: ConsentClient, choice: ConsentChoice) {
  const action = consentSyncAction(choice, posthog.get_explicit_consent_status());
  if (action === 'opt_in') posthog.opt_in_capturing();
  else if (action === 'opt_out') posthog.opt_out_capturing();
}

export function createPostHogProvider(config: AnalyticsConfig): AnalyticsProvider {
  let ready: Promise<typeof import('posthog-js').default> | null = null;

  function load() {
    ready ??= import('posthog-js').then(({ default: posthog }) => {
      if (!posthog.__loaded) {
        posthog.init(config.key, posthogInitOptions(config));
      }
      const choice = storedConsent();
      if (choice) applyConsent(posthog, choice);
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
    syncConsent(choice) {
      return load().then((posthog) => {
        applyConsent(posthog, choice);
      });
    },
  };
}
