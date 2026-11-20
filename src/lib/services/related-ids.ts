/** Curated lists stay short. A longer array is cut, not rejected. */
const MAX_RELATED_IDS = 12;

/**
 * bigint[] from Postgres: numbers, numeric strings, or a `{1,2}` literal.
 * Drops blanks, duplicates, and non-positive ids. Keeps the stored order.
 */
export function parseRelatedIds(value: unknown, excludeId?: number): number[] {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === '{}') return [];
    const inner = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;
    if (inner === '') return [];
    return parseRelatedIds(inner.split(','), excludeId);
  }

  if (!Array.isArray(value)) return [];

  const seen = new Set<number>();
  const ids: number[] = [];
  for (const item of value) {
    const id = coerceId(item);
    if (id === null || id === excludeId || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length >= MAX_RELATED_IDS) break;
  }
  return ids;
}

/** Editorial order from the id array. Rows that were not published are left out. */
export function orderByIds<T extends { id: number }>(items: readonly T[], ids: readonly number[]): T[] {
  const rank = new Map(ids.map((id, index) => [id, index]));
  return items
    .filter((item) => rank.has(item.id))
    .sort((left, right) => (rank.get(left.id) ?? 0) - (rank.get(right.id) ?? 0));
}

function coerceId(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value === 'string' && /^[0-9]+$/.test(value.trim())) {
    const id = Number(value.trim());
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }
  return null;
}
