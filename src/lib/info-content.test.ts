import { describe, expect, it } from 'vitest';
import { infoBlocks, infoExcerpt, infoFaq } from '@/lib/info-content';

const SAMPLE = [
  '### 📍 Где находится MUP в Сплите',
  '',
  '**Адрес:** PU splitsko-dalmatinska, Trg Hrvatske bratstva zajednice 9, 21000 Split',
  '',
  '👉 [**Открыть в Google Maps**](https://maps.google.com/?q=PU+Split)',
  '',
  'See https://www.portal.hr/trgovine/split.',
  '',
  '[click](javascript:alert(1))',
].join('\n');

describe('infoBlocks', () => {
  const blocks = infoBlocks(SAMPLE);

  it('turns a hash heading into a heading and keeps the emoji', () => {
    expect(blocks[0]).toEqual({
      type: 'heading',
      inlines: [{ type: 'text', value: '📍 Где находится MUP в Сплите' }],
    });
  });

  it('marks bold spans and leaves the rest of the line as text', () => {
    expect(blocks[1]).toEqual({
      type: 'paragraph',
      inlines: [
        { type: 'strong', value: 'Адрес:' },
        { type: 'text', value: ' PU splitsko-dalmatinska, Trg Hrvatske bratstva zajednice 9, 21000 Split' },
      ],
    });
  });

  it('turns a markdown link into a link and keeps bold in the label', () => {
    expect(blocks[2]).toEqual({
      type: 'paragraph',
      inlines: [
        { type: 'text', value: '👉 ' },
        {
          type: 'link',
          href: 'https://maps.google.com/?q=PU+Split',
          children: [{ type: 'strong', value: 'Открыть в Google Maps' }],
        },
      ],
    });
  });

  it('keeps a bare https address as a link and leaves the trailing period outside', () => {
    expect(blocks[3]).toEqual({
      type: 'paragraph',
      inlines: [
        { type: 'text', value: 'See ' },
        {
          type: 'link',
          href: 'https://www.portal.hr/trgovine/split',
          children: [{ type: 'text', value: 'https://www.portal.hr/trgovine/split' }],
        },
        { type: 'text', value: '.' },
      ],
    });
  });

  it('does not link a javascript address', () => {
    expect(blocks[4]).toEqual({
      type: 'paragraph',
      inlines: [{ type: 'text', value: '[click](javascript:alert(1))' }],
    });
  });
});

describe('infoExcerpt', () => {
  it('drops heading marks, bold marks, and raw addresses', () => {
    const text = infoExcerpt(SAMPLE);
    expect(text).toContain('Открыть в Google Maps');
    expect(text).toContain('Адрес: PU splitsko-dalmatinska');
    expect(text).not.toContain('###');
    expect(text).not.toContain('**');
    expect(text).not.toContain('maps.google.com');
    expect(text).not.toContain('portal.hr');
  });
});

const FAQ = [
  'Intro outside the section.',
  '',
  '## ❓ Wrong level',
  '',
  '**9. Not in a level-three section**',
  '',
  'No.',
  '',
  '### ❓ Questions',
  '',
  'Lead in that is not a question.',
  '',
  '**Just bold**',
  '',
  '**1. Where is MUP?**',
  '',
  'Apply at the office. See https://www.portal.hr/mup.',
  '',
  '**2. Which documents?**',
  '',
  'Passport and a **photo**.',
  'Read [the portal](https://www.example.com/docs).',
  '',
  '**3. Empty next**',
  '',
  '### 📍 Next section',
  '',
  '**4. After the section**',
  '',
  'This answer is outside.',
].join('\n');

describe('infoFaq', () => {
  it('returns nothing when there is no FAQ heading', () => {
    expect(infoFaq('**1. Where?**\n\nAt the office.')).toEqual([]);
  });

  it('ignores a level-two heading that starts with the emoji', () => {
    const content = ['## ❓ Questions', '', '**1. Where?**', '', 'At the office.'].join('\n');
    expect(infoFaq(content)).toEqual([]);
  });

  it('reads numbered bold questions and keeps the answer text', () => {
    expect(infoFaq(FAQ)).toEqual([
      {
        question: 'Where is MUP?',
        answer: 'Apply at the office. See https://www.portal.hr/mup.',
      },
      {
        question: 'Which documents?',
        answer: 'Passport and a photo. Read the portal.',
      },
    ]);
  });

  it('stops at the next heading', () => {
    const questions = infoFaq(FAQ).map((item) => item.question);
    expect(questions).not.toContain('After the section');
  });

  it('does not treat a bold line without a number as a question', () => {
    const questions = infoFaq(FAQ).map((item) => item.question);
    expect(questions).not.toContain('Just bold');
    expect(questions).not.toContain('Not in a level-three section');
  });

  it('drops a question that has no answer', () => {
    const questions = infoFaq(FAQ).map((item) => item.question);
    expect(questions).not.toContain('Empty next');
  });
});
