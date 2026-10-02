import type { InfoTopic } from '@/domain/info-topic';
import type { InfoRepository } from '@/domain/info-repository';
import { infoTopics as seedTopics } from '@/infrastructure/data/info-topics';

/**
 * File-backed repository. Swap this for a dashboard-backed one by changing
 * the export in `./index.ts`. Callers stay on `infoRepository`.
 *
 * Mutations live in memory for this process only. They do not survive a
 * new serverless instance. The admin store will persist them.
 */
export function createFileInfoRepository(seed: readonly InfoTopic[]): InfoRepository {
  let store: InfoTopic[] = seed.map((topic) => structuredClone(topic));

  function bySortOrder(a: { sortOrder: number }, b: { sortOrder: number }) {
    return a.sortOrder - b.sortOrder;
  }

  return {
    async getAllVisible() {
      return store
        .filter((topic) => topic.visible)
        .sort(bySortOrder)
        .map((topic) => structuredClone(topic));
    },

    async getAll() {
      return store
        .slice()
        .sort(bySortOrder)
        .map((topic) => structuredClone(topic));
    },

    async getBySlug(slug) {
      const found = store.find((topic) => topic.slug === slug);
      return found ? structuredClone(found) : null;
    },

    async getById(id) {
      const found = store.find((topic) => topic.id === id);
      return found ? structuredClone(found) : null;
    },

    async create(input) {
      const now = new Date();
      const topic: InfoTopic = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      store.push(topic);
      return structuredClone(topic);
    },

    async update(id, patch) {
      const index = store.findIndex((topic) => topic.id === id);
      if (index === -1) {
        throw new Error(`Info topic not found: ${id}`);
      }

      const current = store[index];
      const next: InfoTopic = {
        ...current,
        ...patch,
        id: current.id,
        createdAt: current.createdAt,
        updatedAt: new Date(),
      };
      store[index] = next;
      return structuredClone(next);
    },

    async delete(id) {
      store = store.filter((topic) => topic.id !== id);
    },
  };
}

export const fileInfoRepository = createFileInfoRepository(seedTopics);
