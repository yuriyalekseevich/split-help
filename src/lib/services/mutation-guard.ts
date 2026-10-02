import { AppError } from '@/lib/errors/app-error';

export type MutationOperation = 'create' | 'update' | 'remove';

export type MutationRequest = {
  operation: MutationOperation;
  table: string;
};

/**
 * Plug admin auth in here later. A guard returns an AppError to refuse the
 * write, or null to allow it. Build `actor` from a verified server session.
 * Do not trust a role flag sent from the browser.
 */
export interface MutationGuard {
  authorize(request: MutationRequest): Promise<AppError | null>;
}

/** Fail closed until an admin session is wired up. Reads do not call this. */
export const denyMutations: MutationGuard = {
  async authorize(request) {
    return new AppError({
      code: 'permission',
      context: {
        table: request.table,
        operation: request.operation,
        reason: 'auth_not_configured',
      },
    });
  },
};
