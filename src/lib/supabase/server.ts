import 'server-only';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import type { Database } from '@/lib/types/supabase';

/**
 * One client per request. Do not cache the return value across requests.
 * Cookie writes fail inside Server Components; once admin auth exists,
 * refresh the session from `src/proxy.ts` before the page renders.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const { url, anonKey } = readSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. The proxy will own the refresh.
        }
      },
    },
  });
}
