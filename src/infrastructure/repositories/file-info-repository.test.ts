import { describe, expect, it } from 'vitest';
import type { InfoTopic } from '@/domain/info-topic';
import type { LocalizedString } from '@/domain/service';
import { createFileInfoRepository } from './file-info-repository';

function text(value: string): LocalizedString {
  return { en: value, ru: value, hr: value, uk: value };
}

function topic(overrides: Partial<InfoTopic> & Pick<InfoTopic, 'id' | 'slug'>): InfoTopic {
  const now = new Date('2026-03-01T08:00:00.000Z');
  return {
    title: text(overrides.slug),
    summary: text('summary'),
    links: [],
    visible: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('createFileInfoRepository', () => {
  it('returns visible topics in sort order and keeps hidden ones out', async () => {
    const repository = createFileInfoRepository([
      topic({ id: 'b', slug: 'second', sortOrder: 2 }),
      topic({ id: 'hidden', slug: 'draft', sortOrder: 0, visible: false }),
      topic({ id: 'a', slug: 'first', sortOrder: 1 }),
    ]);

    const visible = await repository.getAllVisible();
    expect(visible.map((item) => item.slug)).toEqual(['first', 'second']);

    const all = await repository.getAll();
    expect(all.map((item) => item.slug)).toEqual(['draft', 'first', 'second']);
  });

  it('finds a topic by slug and by id', async () => {
    const repository = createFileInfoRepository([
      topic({ id: 'info_mup', slug: 'mup-appointment' }),
    ]);

    expect((await repository.getBySlug('mup-appointment'))?.id).toBe('info_mup');
    expect((await repository.getBySlug('missing'))).toBeNull();
    expect((await repository.getById('info_mup'))?.slug).toBe('mup-appointment');
  });

  it('does not let callers mutate the stored topic', async () => {
    const repository = createFileInfoRepository([
      topic({ id: 'info_mup', slug: 'mup-appointment' }),
    ]);
    const loaded = await repository.getBySlug('mup-appointment');
    loaded!.title.en = 'changed';

    expect((await repository.getBySlug('mup-appointment'))?.title.en).toBe('mup-appointment');
  });

  it('creates, updates, and deletes in memory', async () => {
    const repository = createFileInfoRepository([]);
    const created = await repository.create({
      slug: 'new-note',
      title: text('New'),
      summary: text('A note'),
      links: [],
      visible: true,
      sortOrder: 3,
    });

    expect(created.id).toEqual(expect.any(String));
    const updated = await repository.update(created.id, { visible: false });
    expect(updated.visible).toBe(false);
    expect(updated.id).toBe(created.id);
    expect((await repository.getAllVisible())).toHaveLength(0);

    await repository.delete(created.id);
    expect(await repository.getById(created.id)).toBeNull();
  });

  it('throws when updating a missing topic', async () => {
    const repository = createFileInfoRepository([]);
    await expect(repository.update('missing', { visible: false })).rejects.toThrow(
      /not found/,
    );
  });
});
