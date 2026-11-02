import { splitParagraphs } from '@/lib/format';

export type InlinePart = { type: 'text'; value: string } | { type: 'strong'; value: string };

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

const BULLET = /^[•●∙]\s*/;
const ONLY_BOLD = /^\*\*([^*]+)\*\*$/;
const BOLD = /\*\*([^*]+)\*\*/g;

/** `**bold**` inside a line. Unmatched asterisks stay as text. */
export function legalInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;

  for (const match of text.matchAll(BOLD)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: 'text', value: text.slice(last, index) });
    parts.push({ type: 'strong', value: match[1] ?? '' });
    last = index + match[0].length;
  }

  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  if (parts.length === 0) parts.push({ type: 'text', value: text });
  return parts;
}

/**
 * Legal copy is plain text: a blank line starts a paragraph,
 * a line that is only `**...**` is a heading, and `•` lines are a list.
 */
export function legalBlocks(content: string): LegalBlock[] {
  const blocks: LegalBlock[] = [];

  for (const paragraph of splitParagraphs(content)) {
    const lines = paragraph
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let list: string[] | null = null;
    let plain: string[] = [];

    const flushList = () => {
      if (list && list.length > 0) blocks.push({ type: 'list', items: list });
      list = null;
    };
    const flushPlain = () => {
      if (plain.length > 0) blocks.push({ type: 'paragraph', text: plain.join('\n') });
      plain = [];
    };

    for (const line of lines) {
      if (BULLET.test(line)) {
        flushPlain();
        list ??= [];
        list.push(line.replace(BULLET, ''));
        continue;
      }

      flushList();
      const heading = line.match(ONLY_BOLD);
      if (heading) {
        flushPlain();
        blocks.push({ type: 'heading', text: heading[1] ?? '' });
        continue;
      }

      plain.push(line);
    }

    flushPlain();
    flushList();
  }

  return blocks;
}
