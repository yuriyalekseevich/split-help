import { httpUrl, linkify, splitParagraphs } from '@/lib/format';

export type InfoText = { type: 'text'; value: string } | { type: 'strong'; value: string };

export type InfoInline = InfoText | { type: 'link'; href: string; children: InfoText[] };

export type InfoBlock =
  | { type: 'heading'; inlines: InfoInline[] }
  | { type: 'paragraph'; inlines: InfoInline[] };

const HEADING = /^(#{1,3})\s+(\S.*)$/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
const BOLD = /\*\*([^*]+)\*\*/g;

function boldParts(text: string): InfoText[] {
  const parts: InfoText[] = [];
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

/** Bold inside ordinary text, and bare http(s) addresses as links. */
function linkifyParts(text: string): InfoInline[] {
  return linkify(text).flatMap((part): InfoInline[] => {
    if (part.type === 'link') {
      return [{ type: 'link', href: part.href, children: [{ type: 'text', value: part.value }] }];
    }
    return boldParts(part.value);
  });
}

/** `**bold**`, `[label](url)`, and bare http(s) addresses. Anything else stays text. */
export function infoInline(text: string): InfoInline[] {
  const inlines: InfoInline[] = [];
  let last = 0;

  for (const match of text.matchAll(MARKDOWN_LINK)) {
    const index = match.index ?? 0;
    if (index > last) inlines.push(...linkifyParts(text.slice(last, index)));
    const href = httpUrl(match[2] ?? '');
    if (href) {
      inlines.push({ type: 'link', href, children: boldParts(match[1] ?? '') });
    } else {
      inlines.push(...linkifyParts(match[0]));
    }
    last = index + match[0].length;
  }

  if (last < text.length) inlines.push(...linkifyParts(text.slice(last)));
  if (inlines.length === 0) inlines.push({ type: 'text', value: text });
  return inlines;
}

/**
 * Info articles are a small markdown subset.
 * A blank line starts a paragraph. `#` to `###` on their own line are headings.
 */
export function infoBlocks(content: string): InfoBlock[] {
  const blocks: InfoBlock[] = [];

  for (const paragraph of splitParagraphs(content)) {
    const lines = paragraph
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let plain: string[] = [];

    const flushPlain = () => {
      if (plain.length === 0) return;
      blocks.push({ type: 'paragraph', inlines: infoInline(plain.join('\n')) });
      plain = [];
    };

    for (const line of lines) {
      const heading = line.match(HEADING);
      if (heading) {
        flushPlain();
        blocks.push({ type: 'heading', inlines: infoInline(heading[2] ?? '') });
        continue;
      }
      plain.push(line);
    }

    flushPlain();
  }

  return blocks;
}

function visibleText(inlines: InfoInline[]): string {
  return inlines
    .map((part) => {
      if (part.type === 'text' || part.type === 'strong') return part.value;
      const label = visibleText(part.children).trim();
      if (/^https?:\/\//i.test(label)) return '';
      return label;
    })
    .join('');
}

/** Card lead: the words a reader sees, without heading marks or raw addresses. */
export function infoExcerpt(content: string): string {
  return infoBlocks(content)
    .map((block) => visibleText(block.inlines))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
