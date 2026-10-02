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
