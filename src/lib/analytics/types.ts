export type AnalyticsProperty = string | number | boolean | null;

export type AnalyticsProperties = Record<string, AnalyticsProperty>;

/**
 * One vendor behind the public analytics functions.
 * A new provider implements this and nothing in the UI changes.
 */
export interface AnalyticsProvider {
  pageview(path: string): void;
  pageleave(): void;
  track(name: string, properties?: AnalyticsProperties): void;
}
