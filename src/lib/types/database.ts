import type { Database } from '@/lib/types/supabase';

export type { Database } from '@/lib/types/supabase';

/** Indexed access stays valid when `T` is generic. The generated `Tables<>` helper does not. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums = Database['public']['Enums'];

export type UsefulInfoRow = Database['public']['Tables']['useful_info']['Row'];
export type UsefulInfoTranslationRow = Database['public']['Tables']['useful_info_translations']['Row'];
export type LanguageRow = Database['public']['Tables']['languages']['Row'];

export type UsefulInfoInsert = TablesInsert<'useful_info'>;
export type UsefulInfoUpdate = TablesUpdate<'useful_info'>;

/**
 * Flat article the public pages render.
 * Title, subtitle, and description live on `useful_info_translations`, not on the row.
 */
export type UsefulInfo = {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  description: string;
  created_at: string;
};
