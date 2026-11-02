import type { ConsentChoice } from '@/lib/consent';

export type ExplicitConsent = 'granted' | 'denied' | 'pending';

export type ConsentSyncAction = 'opt_in' | 'opt_out' | 'none';

/**
 * PostHog already stores its own consent cookie.
 * Calling opt-in again would send another `$opt_in` event.
 */
export function consentSyncAction(choice: ConsentChoice, status: ExplicitConsent): ConsentSyncAction {
  if (choice === 'accepted' && status !== 'granted') return 'opt_in';
  if (choice === 'rejected' && status !== 'denied') return 'opt_out';
  return 'none';
}
