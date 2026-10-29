export type AnalyticsConfig = {
  key: string;
  host: string;
};

/**
 * PostHog is on only when the deploy sets the flag and both values.
 * A missing key does not throw: the site keeps working and sends nothing.
 */
export function readAnalyticsConfig(): AnalyticsConfig | null {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') return null;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
  if (!key || !host) return null;

  return { key, host };
}
