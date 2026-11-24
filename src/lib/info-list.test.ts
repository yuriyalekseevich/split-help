import { describe, expect, it } from 'vitest';
import { filterUsefulInfo } from '@/lib/info-list';
import type { UsefulInfo } from '@/lib/types/database';

const items: UsefulInfo[] = [
  {
    id: 1,
    slug: 'mup',
    title: 'How to book a MUP appointment',
    subtitle: 'Official portal',
    image_url: null,
    category: 'documents',
    description: 'Bring a passport.',
    created_at: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 2,
    slug: 'flat',
    title: 'Finding a flat',
    subtitle: 'Start with Njuškalo',
    image_url: null,
    category: 'housing',
    description: 'Check the city name.',
    created_at: '2026-03-02T08:00:00.000Z',
  },
  {
    id: 3,
    slug: 'bank',
    title: 'Opening a bank account',
    subtitle: null,
    image_url: null,
    category: 'finance',
    description: 'A MUP paper is sometimes required.',
    created_at: '2026-03-03T08:00:00.000Z',
  },
];

describe('filterUsefulInfo', () => {
  it('returns every article when the filter is all and the search is empty', () => {
    expect(filterUsefulInfo(items, 'all', '  ').map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('keeps one category', () => {
    expect(filterUsefulInfo(items, 'housing', '').map((item) => item.slug)).toEqual(['flat']);
  });

  it('matches title and subtitle without matching the description', () => {
    expect(filterUsefulInfo(items, 'all', 'mup').map((item) => item.slug)).toEqual(['mup']);
    expect(filterUsefulInfo(items, 'all', 'njuškalo').map((item) => item.slug)).toEqual(['flat']);
  });

  it('applies the category and the search together', () => {
    expect(filterUsefulInfo(items, 'documents', 'portal').map((item) => item.id)).toEqual([1]);
    expect(filterUsefulInfo(items, 'housing', 'portal')).toEqual([]);
  });
});
