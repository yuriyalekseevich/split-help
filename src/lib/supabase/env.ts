import { AppError } from '@/lib/errors/app-error';

export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

/**
 * Reads the public Supabase env. The anon key is meant for the browser,
 * but only the variable names are ever logged — never the values.
 */
export function readSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const missing = [
    url ? null : 'NEXT_PUBLIC_SUPABASE_URL',
    anonKey ? null : 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ].filter((name): name is string => name !== null);

  if (missing.length > 0 || !url || !anonKey) {
    throw new AppError({
      code: 'configuration',
      context: { missing },
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AppError({
      code: 'configuration',
      context: { reason: 'invalid_url' },
    });
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new AppError({
      code: 'configuration',
      context: { reason: 'invalid_url_protocol' },
    });
  }

  return { url, anonKey };
}
