import { describe, expect, it } from 'vitest';
import { legalBlocks, legalInline } from '@/lib/legal-content';

const SAMPLE = [
  'Our website uses cookies to work.',
  '',
  '**What are cookies?**',
  'Small text files stored on your device.',
  '',
  '**1. Types of cookies we use**',
  '• **Strictly necessary cookies:** required for the site.',
  '• **Analytical cookies:** used to count visits.',
].join('\n');

describe('legal content', () => {
  it('splits blank lines, headings, and bullets', () => {
    expect(legalBlocks(SAMPLE)).toEqual([
      { type: 'paragraph', text: 'Our website uses cookies to work.' },
      { type: 'heading', text: 'What are cookies?' },
      { type: 'paragraph', text: 'Small text files stored on your device.' },
      { type: 'heading', text: '1. Types of cookies we use' },
      {
        type: 'list',
        items: [
          '**Strictly necessary cookies:** required for the site.',
          '**Analytical cookies:** used to count visits.',
        ],
      },
    ]);
  });

  it('keeps unmatched asterisks as text and marks bold spans', () => {
    expect(legalInline('See **PostHog** and a lone ** asterisk')).toEqual([
      { type: 'text', value: 'See ' },
      { type: 'strong', value: 'PostHog' },
      { type: 'text', value: ' and a lone ** asterisk' },
    ]);
  });
});
