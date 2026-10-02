import 'client-only';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import type { Database } from '@/lib/types/supabase';

/**
 * Browser client for interactive forms and, later, realtime.
 * Server components must use `createSupabaseServerClient` instead.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  const { url, anonKey } = readSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
