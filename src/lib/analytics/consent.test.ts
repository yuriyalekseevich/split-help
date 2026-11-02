import { describe, expect, it } from 'vitest';
import { consentSyncAction } from '@/lib/analytics/consent';

describe('consentSyncAction', () => {
  it('opts in only when the visitor has not already granted consent', () => {
    expect(consentSyncAction('accepted', 'pending')).toBe('opt_in');
    expect(consentSyncAction('accepted', 'denied')).toBe('opt_in');
    expect(consentSyncAction('accepted', 'granted')).toBe('none');
  });

  it('opts out only when the visitor has not already denied consent', () => {
    expect(consentSyncAction('rejected', 'pending')).toBe('opt_out');
    expect(consentSyncAction('rejected', 'granted')).toBe('opt_out');
    expect(consentSyncAction('rejected', 'denied')).toBe('none');
  });
});
