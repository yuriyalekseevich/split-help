import { describe, expect, it } from 'vitest';
import { orderByIds, parseRelatedIds } from '@/lib/services/related-ids';

describe('parseRelatedIds', () => {
  it('keeps a positive id list and drops blanks, duplicates, and junk', () => {
    expect(parseRelatedIds([3, '4', 3, 0, -1, 1.5, '', null, 'nope'])).toEqual([3, 4]);
    expect(parseRelatedIds(null)).toEqual([]);
    expect(parseRelatedIds('{8, 2, 8}')).toEqual([8, 2]);
  });

  it('drops the current record and caps a very long list', () => {
    expect(parseRelatedIds([5, 5, 9], 5)).toEqual([9]);
    expect(parseRelatedIds(Array.from({ length: 20 }, (_, index) => index + 1))).toHaveLength(12);
  });
});

describe('orderByIds', () => {
  it('follows the stored id order and skips rows that were filtered out', () => {
    const items = [
      { id: 2, title: 'second' },
      { id: 9, title: 'dropped' },
      { id: 1, title: 'first' },
    ];
    expect(orderByIds(items, [1, 2, 3]).map((item) => item.id)).toEqual([1, 2]);
  });
});
