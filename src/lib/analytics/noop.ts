import type { AnalyticsProvider } from './types';

export const noopAnalytics: AnalyticsProvider = {
  pageview() {},
  pageleave() {},
  track() {},
};
