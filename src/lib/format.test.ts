import { describe, expect, it } from 'vitest';
import { linkify } from '@/lib/format';

describe('linkify', () => {
  it('turns an https address into a link and keeps the surrounding text', () => {
    const parts = linkify('List:\nhttps://www.portal.hr/trgovine/split\n(Portal.hr)');

    expect(parts).toEqual([
      { type: 'text', value: 'List:\n' },
      { type: 'link', href: 'https://www.portal.hr/trgovine/split', value: 'https://www.portal.hr/trgovine/split' },
      { type: 'text', value: '\n(Portal.hr)' },
    ]);
  });

  it('leaves a trailing period outside the link', () => {
    expect(linkify('See https://www.portal.hr/trgovine/split.')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'link', href: 'https://www.portal.hr/trgovine/split', value: 'https://www.portal.hr/trgovine/split' },
      { type: 'text', value: '.' },
    ]);
  });

  it('does not link a javascript address', () => {
    expect(linkify('javascript:alert(1)')).toEqual([{ type: 'text', value: 'javascript:alert(1)' }]);
  });
});
