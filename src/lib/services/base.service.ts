import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError, logAppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { denyMutations, type MutationGuard, type MutationOperation } from '@/lib/services/mutation-guard';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

export type ParseOutcome<T> = { success: true; data: T } | { success: false; error: AppError };

export type TableName = keyof Database['public']['Tables'];
export type RowOf<T extends TableName> = Tables<T>;
export type InsertOf<T extends TableName> = TablesInsert<T>;
export type UpdateOf<T extends TableName> = TablesUpdate<T>;

export type ListOptions<T extends TableName> = {
  orderBy?: keyof RowOf<T> & string;
  ascending?: boolean;
};

/**
 * Typed CRUD over one Supabase table.
 * Reads run immediately. Writes call `guard` first and do not touch the
 * database when the guard refuses. The default guard refuses every write.
 *
 * `getAll` returns an empty array when the table has no visible rows.
 * A SELECT hidden by RLS looks the same as an empty table: PostgREST
 * returns no rows and no error. Explicit denials (401, 42501) are errors.
 */
export class BaseService<T extends TableName, TParsed = RowOf<T>> {
  constructor(
    private readonly client: SupabaseClient<Database>,
    private readonly table: T,
    private readonly parseRow: (row: unknown) => ParseOutcome<TParsed>,
    private readonly guard: MutationGuard = denyMutations,
  ) {}

  async getAll(options?: ListOptions<T>): Promise<Result<TParsed[]>> {
    try {
      let query = this.query().select('*');
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }

      const { data, error } = await query;
      if (error) return this.failure('getAll', error);

      const rows = data ?? [];
      if (!Array.isArray(rows)) {
        return this.failure(
          'getAll',
          new AppError({ code: 'validation', context: { reason: 'expected_array' } }),
        );
      }

      const parsed: TParsed[] = [];
      for (const [index, row] of rows.entries()) {
        const result = this.parseRow(row);
        if (!result.success) {
          return this.failure('getAll', result.error, { index, id: readId(row) });
        }
        parsed.push(result.data);
      }

      return { success: true, data: parsed };
    } catch (error) {
      return this.failure('getAll', error);
    }
  }

  async getById(id: string | number): Promise<Result<TParsed | null>> {
    if (!isPrimaryKey(id)) {
      return this.failure('getById', new AppError({ code: 'validation', context: { reason: 'invalid_id' } }));
    }

    try {
      const { data, error } = await this.query().select('*').eq('id', id).maybeSingle();

      if (error) return this.failure('getById', error, { id });
      if (data === null) return { success: true, data: null };

      const result = this.parseRow(data);
      if (!result.success) return this.failure('getById', result.error, { id });
      return { success: true, data: result.data };
    } catch (error) {
      return this.failure('getById', error, { id });
    }
  }

  async create(input: InsertOf<T>): Promise<Result<TParsed>> {
    const denied = await this.authorize('create');
    if (denied) return denied;

    try {
      const { data, error } = await this.query().insert(input).select('*').single();
      if (error) return this.failure('create', error);
      return this.parseReturned('create', data);
    } catch (error) {
      return this.failure('create', error);
    }
  }

  async update(id: string | number, patch: UpdateOf<T>): Promise<Result<TParsed>> {
    if (!isPrimaryKey(id)) {
      return this.failure('update', new AppError({ code: 'validation', context: { reason: 'invalid_id' } }));
    }

    const denied = await this.authorize('update', { id });
    if (denied) return denied;

    try {
      const { data, error } = await this.query().update(patch).eq('id', id).select('*').maybeSingle();

      if (error) return this.failure('update', error, { id });
      if (data === null) {
        return this.failure('update', new AppError({ code: 'not_found' }), { id });
      }
      return this.parseReturned('update', data, { id });
    } catch (error) {
      return this.failure('update', error, { id });
    }
  }

  async remove(id: string | number): Promise<Result<null>> {
    if (!isPrimaryKey(id)) {
      return this.failure('remove', new AppError({ code: 'validation', context: { reason: 'invalid_id' } }));
    }

    const denied = await this.authorize('remove', { id });
    if (denied) return denied;

    try {
      const { data, error } = await this.query().delete().eq('id', id).select('id');
      if (error) return this.failure('remove', error, { id });
      if (!Array.isArray(data) || data.length === 0) {
        return this.failure('remove', new AppError({ code: 'not_found' }), { id });
      }
      return { success: true, data: null };
    } catch (error) {
      return this.failure('remove', error, { id });
    }
  }

  /**
   * Supabase's query builder cannot follow a generic table name.
   * The public methods stay typed; this narrows the builder to the calls we use.
   */
  private query(): Query {
    return this.client.from(this.table) as unknown as Query;
  }

  private async authorize(
    operation: MutationOperation,
    extra?: Record<string, unknown>,
  ): Promise<Result<never> | null> {
    const denial = await this.guard.authorize({ operation, table: String(this.table) });
    if (!denial) return null;
    return this.failure(operation, denial, extra);
  }

  private parseReturned(
    operation: string,
    row: unknown,
    extra?: Record<string, unknown>,
  ): Result<TParsed> {
    const result = this.parseRow(row);
    if (!result.success) return this.failure(operation, result.error, extra);
    return { success: true, data: result.data };
  }

  private failure(operation: string, error: unknown, extra?: Record<string, unknown>): Result<never> {
    const appError = toAppError(error, {
      table: String(this.table),
      operation,
      ...extra,
    });
    logAppError(appError);
    return { success: false, error: toPublicError(appError) };
  }
}

type PostgrestResult = { data: unknown; error: unknown };

type Query = PromiseLike<PostgrestResult> & {
  select(columns?: string): Query;
  insert(values: object): Query;
  update(values: object): Query;
  delete(): Query;
  order(column: string, options?: { ascending?: boolean }): Query;
  eq(column: string, value: string | number): Query;
  maybeSingle(): Promise<PostgrestResult>;
  single(): Promise<PostgrestResult>;
};

function isPrimaryKey(id: string | number): boolean {
  if (typeof id === 'number') return Number.isSafeInteger(id) && id > 0;
  return /^[0-9]+$/.test(id) && Number(id) > 0 && Number.isSafeInteger(Number(id));
}

function readId(row: unknown): string | number | undefined {
  if (typeof row !== 'object' || row === null || !('id' in row)) return undefined;
  const id = row.id;
  return typeof id === 'string' || typeof id === 'number' ? id : undefined;
}
