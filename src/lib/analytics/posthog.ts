import type { AnalyticsConfig } from './env';
import { consentSyncAction } from './consent';
import { CONSENT_COOKIE_NAME, parseConsent, readConsentCookie, type ConsentChoice } from '@/lib/consent';
import type { AnalyticsProperties, AnalyticsProvider } from './types';

const POSTHOG_PAGEVIEW = '$pageview';
const POSTHOG_PAGELEAVE = '$pageleave';

export function posthogInitOptions(
  // Callers still pass AnalyticsConfig. Ingestion is fixed to the /ingest proxy.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: AnalyticsConfig,
) {
  return {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
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
  is_capturing: () => boolean;
};

/** Cookieless opt-out deletes the SDK manager, and the next `$pageview` then throws before the request. */
function ensurePageViewManager(posthog: { pageViewManager?: unknown }) {
  if (posthog.pageViewManager) return;
  posthog.pageViewManager = {
    doPageView: (_timestamp: Date, pageViewId: string) => ({ $pageview_id: pageViewId }),
    doPageLeave: () => ({}),
    doEvent: () => ({}),
    destroy() {},
  };
}

function storedConsent(): ConsentChoice | null {
  if (typeof document === 'undefined') return null;
  const fromCookie = readConsentCookie(document.cookie);
  if (fromCookie) return fromCookie;
  try {
    return parseConsent(localStorage.getItem(CONSENT_COOKIE_NAME));
  } catch {
    return null;
  }
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

  function send(name: string, properties?: AnalyticsProperties) {
    const choice = storedConsent();
    // A visit with no choice yet must not boot PostHog. `on_reject` drops those events.
    if (!choice && !ready) return;
    void load()
      .then((posthog) => {
        if (choice) applyConsent(posthog, choice);
        if (!posthog.is_capturing()) {
          console.warn('PostHog capture skipped', name, posthog.get_explicit_consent_status());
          return;
        }
        ensurePageViewManager(posthog);
        posthog.capture(name, properties, { send_instantly: true });
      })
      .catch((error: unknown) => {
        console.error('PostHog capture failed', name, error);
      });
  }

  return {
    pageview(path) {
      send(POSTHOG_PAGEVIEW, {
        $current_url: new URL(path, window.location.origin).href,
      });
    },
    pageleave() {
      send(POSTHOG_PAGELEAVE);
    },
    track(name, properties) {
      send(name, properties);
    },
    syncConsent(choice) {
      return load().then((posthog) => {
        applyConsent(posthog, choice);
      });
    },
  };
}
