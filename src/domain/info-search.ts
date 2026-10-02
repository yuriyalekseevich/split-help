import type { LocalizedString } from './service';
import type { InfoSearchDocument } from './info-topic';

/**
 * Plain text search over topic content.
 * Later this can be replaced by a smarter search without changing the page:
 * the page still receives the same documents and renders `searchInfoTopics`.
 */
export function searchInfoTopics<T extends InfoSearchDocument>(
  topics: readonly T[],
  query: string,
): T[] {
  const needle = normalize(query);
  if (!needle) return topics.slice();
  return topics.filter((topic) => haystack(topic).includes(needle));
}

/** Link labels that contain the query. Empty when the query is blank. */
export function matchedLinkLabels(
  topic: InfoSearchDocument,
  query: string,
): string[] {
  const needle = normalize(query);
  if (!needle) return [];

  const labels: string[] = [];
  for (const link of topic.links) {
    const text = normalize([link.label, link.url, ...localeValues(link.note)].join(' '));
    if (text.includes(needle)) labels.push(link.label);
  }
  return labels;
}

function haystack(topic: InfoSearchDocument): string {
  const parts = [
    ...localeValues(topic.title),
    ...localeValues(topic.summary),
    ...localeValues(topic.body),
  ];
  for (const link of topic.links) {
    parts.push(link.label, link.url, ...localeValues(link.note));
  }
  return normalize(parts.join(' '));
}

function localeValues(value?: LocalizedString): string[] {
  if (!value) return [];
  return [value.en, value.ru, value.hr, value.uk];
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}
