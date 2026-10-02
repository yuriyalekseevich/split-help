import type { PublicError } from '@/lib/errors/app-error';

/**
 * Every service method returns this. The error object is public:
 * it has no original cause, SQL, or row payload.
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: PublicError };
