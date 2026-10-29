/** Split a repository multiline field into bullet strings. */
export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Split a note into paragraphs. A blank line starts the next paragraph. */
export function splitParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export type TextPart =
  | { type: 'text'; value: string }
  | { type: 'link'; href: string; value: string };

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

function httpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Turn bare http(s) addresses into links. The visible text stays as written. */
export function linkify(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0];
    const index = match.index ?? 0;
    const trimmed = raw.replace(/[.,;:!?)]+$/, '');
    const href = httpUrl(trimmed);
    if (index > last) parts.push({ type: 'text', value: text.slice(last, index) });
    if (href) {
      parts.push({ type: 'link', href, value: trimmed });
      const trailing = raw.slice(trimmed.length);
      if (trailing) parts.push({ type: 'text', value: trailing });
    } else {
      parts.push({ type: 'text', value: raw });
    }
    last = index + raw.length;
  }

  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  if (parts.length === 0) parts.push({ type: 'text', value: text });
  return parts;
}

/**
 * Reserved for Stripe. `cents` is an integer (for example 2500 → €25.00).
 * Not used by the public pages until a service has `priceCents`.
 */
export function formatPriceCents(
  cents: number,
  locale: string,
  currency = 'EUR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
