import type { Service, ServiceListItem } from '@/domain/service';
import type { ServiceRepository } from '@/domain/service-repository';
import { services as seedServices } from '@/infrastructure/data/services';

/**
 * File-backed repository. Swap this for Prisma by changing the
 * export in `./index.ts` — callers stay on `serviceRepository`.
 *
 * Mutations live in memory for this process only. They are here so the
 * interface is complete for a future admin panel. They do not survive a
 * new serverless instance. Prisma will persist them.
 */

let store: Service[] = seedServices.map((service) => structuredClone(service));

function bySortOrder(a: { sortOrder: number }, b: { sortOrder: number }) {
  return a.sortOrder - b.sortOrder;
}

function toListItem(service: Service): ServiceListItem {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    shortDescription: service.shortDescription,
    priceHint: service.priceHint,
    imageUrl: service.imageUrl,
    sortOrder: service.sortOrder,
  };
}

export const fileServiceRepository: ServiceRepository = {
  async getAllVisible() {
    return store
      .filter((service) => service.visible)
      .sort(bySortOrder)
      .map((service) => toListItem(structuredClone(service)));
  },

  async getAll() {
    return store
      .slice()
      .sort(bySortOrder)
      .map((service) => structuredClone(service));
  },

  async getBySlug(slug) {
    const found = store.find((service) => service.slug === slug);
    return found ? structuredClone(found) : null;
  },

  async getById(id) {
    const found = store.find((service) => service.id === id);
    return found ? structuredClone(found) : null;
  },

  async create(input) {
    const now = new Date();
    const service: Service = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    store.push(service);
    return structuredClone(service);
  },

  async update(id, patch) {
    const index = store.findIndex((service) => service.id === id);
    if (index === -1) {
      throw new Error(`Service not found: ${id}`);
    }

    const current = store[index];
    const next: Service = {
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
    store = store.filter((service) => service.id !== id);
  },
};
