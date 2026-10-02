import { describe, expect, it } from 'vitest';
import { AppError, toAppError, toPublicError } from '@/lib/errors/app-error';
import { BaseService, type InsertOf } from '@/lib/services/base.service';
import { assembleUsefulInfo, parseUsefulInfoRow } from '@/lib/services/useful-info.schema';
import type { Database } from '@/lib/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

const row = {
  id: 4,
  title: 'Где искать жильё',
  subtitle: 'Сначала Njuškalo',
  image_url: 'https://cdn.example.com/flat.jpg',
  description: 'Откройте список и проверьте город.',
  created_at: '2026-03-01T08:00:00.000Z',
};

type QueryResult = { data: unknown; error: unknown };

function stubClient(handlers: {
  list?: QueryResult;
  find?: QueryResult;
  inserted?: QueryResult;
  onFrom?: () => void;
}) {
  function chain(result: QueryResult) {
    const builder: Record<string, unknown> = {};
    const self = () => builder;
    builder.select = self;
    builder.order = self;
    builder.eq = self;
    builder.insert = () => chain(handlers.inserted ?? { data: null, error: null });
    builder.update = self;
    builder.delete = self;
    builder.maybeSingle = () => Promise.resolve(handlers.find ?? { data: null, error: null });
    builder.single = () => Promise.resolve(result);
    builder.then = (
      resolve: (value: QueryResult) => unknown,
      reject?: (reason: unknown) => unknown,
    ) => Promise.resolve(result).then(resolve, reject);
    return builder;
  }

  return {
    from() {
      handlers.onFrom?.();
      return chain(handlers.list ?? { data: [], error: null });
    },
  } as unknown as SupabaseClient<Database>;
}

describe('parseUsefulInfoRow', () => {
  it('accepts a row and coerces a numeric id', () => {
    const parsed = parseUsefulInfoRow({ ...row, id: '4', subtitle: '  ', image_url: '' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.id).toBe(4);
      expect(parsed.data.subtitle).toBeNull();
      expect(parsed.data.image_url).toBeNull();
    }
  });

  it('accepts a row that only has the required fields', () => {
    const parsed = parseUsefulInfoRow({
      id: 4,
      title: '  Где искать жильё  ',
      description: '  Откройте список и проверьте город.  ',
      created_at: row.created_at,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe('Где искать жильё');
      expect(parsed.data.description).toBe('Откройте список и проверьте город.');
      expect(parsed.data.subtitle).toBeNull();
      expect(parsed.data.image_url).toBeNull();
    }
  });

  it('rejects a missing title, a missing description, and an unsafe image url', () => {
    expect(parseUsefulInfoRow({ ...row, title: '  ' }).success).toBe(false);
    expect(parseUsefulInfoRow({ ...row, description: '   ' }).success).toBe(false);
    const { title: _title, ...withoutTitle } = row;
    const { description: _description, ...withoutDescription } = row;
    expect(parseUsefulInfoRow(withoutTitle).success).toBe(false);
    expect(parseUsefulInfoRow(withoutDescription).success).toBe(false);
    expect(parseUsefulInfoRow({ ...row, image_url: 'javascript:alert(1)' }).success).toBe(false);
    expect(parseUsefulInfoRow({ ...row, image_url: 'https://user:pass@cdn.example.com/a.jpg' }).success).toBe(false);
    expect(parseUsefulInfoRow({ ...row, created_at: 'yesterday' }).success).toBe(false);
  });
});

describe('assembleUsefulInfo', () => {
  const articles = [
    {
      id: 5,
      image_url: 'https://broker.hr/flat.jpg',
      created_at: '2026-10-02T15:25:07.395Z',
      status: 'published',
    },
    {
      id: 3,
      image_url: 'https://www.redomat.com/ticket.jpg',
      created_at: '2026-10-02T15:22:41.658Z',
      status: 'published',
    },
    {
      id: 9,
      image_url: null,
      created_at: '2026-10-01T10:00:00.000Z',
      status: 'draft',
    },
  ];

  const translations = [
    {
      useful_info_id: 5,
      language_code: 'en',
      title: 'Finding Accommodation in Split',
      subtitle: 'Top local classifieds',
      description: 'Start with the main listing sites.',
    },
    {
      useful_info_id: 5,
      language_code: 'ru',
      title: 'Поиск жилья в Сплите',
      subtitle: 'Главные сайты объявлений',
      description: 'Начните с основных площадок.',
    },
    {
      useful_info_id: 3,
      language_code: 'ru',
      title: 'Как забронировать талон в МУП',
      subtitle: null,
      description: 'Официальный портал.',
    },
    {
      useful_info_id: 9,
      language_code: 'en',
      title: 'Hidden draft',
      subtitle: null,
      description: 'Should not be public.',
    },
  ];

  it('uses the requested language, then the default language, and skips drafts', () => {
    const result = assembleUsefulInfo(articles, translations, 'en', 'ru');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.map((item) => [item.id, item.title])).toEqual([
      [5, 'Finding Accommodation in Split'],
      [3, 'Как забронировать талон в МУП'],
    ]);
    expect(result.data[0]).toMatchObject({
      subtitle: 'Top local classifieds',
      image_url: 'https://broker.hr/flat.jpg',
    });
  });

  it('falls back to the default language when the requested translation is missing', () => {
    const result = assembleUsefulInfo(articles, translations, 'hr', 'ru');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.map((item) => [item.id, item.title])).toEqual([
      [5, 'Поиск жилья в Сплите'],
      [3, 'Как забронировать талон в МУП'],
    ]);
    expect(result.data[1]?.subtitle).toBeNull();
  });

  it('rejects an unsafe image on the parent row', () => {
    const result = assembleUsefulInfo(
      [{ ...articles[0], image_url: 'javascript:alert(1)' }],
      translations,
      'en',
      'ru',
    );
    expect(result.success).toBe(false);
  });
});

describe('BaseService', () => {
  it('returns an empty array when the table has no rows', async () => {
    const service = new BaseService(stubClient({ list: { data: null, error: null } }), 'useful_info', parseUsefulInfoRow);
    const result = await service.getAll();
    expect(result).toEqual({ success: true, data: [] });
  });

  it('returns a public validation error and does not throw', async () => {
    const service = new BaseService(
      stubClient({ list: { data: [{ ...row, title: '' }], error: null } }),
      'useful_info',
      parseUsefulInfoRow,
    );
    const result = await service.getAll();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('validation');
      expect(result.error).not.toHaveProperty('originalError');
    }
  });

  it('maps a permission failure without leaking the database message', async () => {
    const service = new BaseService(
      stubClient({
        list: {
          data: null,
          error: { code: '42501', message: 'permission denied for table useful_info', details: 'secret' },
        },
      }),
      'useful_info',
      parseUsefulInfoRow,
    );
    const result = await service.getAll();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('permission');
      expect(result.error.message).not.toContain('useful_info');
      expect(JSON.stringify(result.error)).not.toContain('secret');
    }
  });

  it('refuses writes before calling Supabase', async () => {
    let called = false;
    const service = new BaseService(
      stubClient({ onFrom: () => { called = true; } }),
      'useful_info',
      parseUsefulInfoRow,
    );
    const result = await service.create({} as InsertOf<'useful_info'>);
    expect(called).toBe(false);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.code).toBe('permission');
  });
});

describe('toAppError', () => {
  it('classifies network failures and strips the cause from the public error', () => {
    const error = toAppError(new TypeError('fetch failed'), { table: 'useful_info', operation: 'getAll' });
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('network');
    expect(toPublicError(error)).toEqual({ code: 'network', message: error.message });
    expect(toPublicError(error)).not.toHaveProperty('originalError');
  });
});
