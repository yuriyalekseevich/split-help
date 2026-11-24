import { infoCategories, type UsefulInfo } from '@/lib/types/database';

export const infoFilters = ['all', ...infoCategories] as const;
export type InfoFilter = (typeof infoFilters)[number];

/** Category pill plus a case-insensitive match on title and subtitle. */
export function filterUsefulInfo(
  items: readonly UsefulInfo[],
  category: InfoFilter,
  query: string,
): UsefulInfo[] {
  const needle = query.trim().toLowerCase();

  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!needle) return true;
    return `${item.title} ${item.subtitle ?? ''}`.toLowerCase().includes(needle);
  });
}
