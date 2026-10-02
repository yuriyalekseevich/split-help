import type { Service, ServiceDetail, ServiceListItem } from './service';

/**
 * The only way the app reads and writes services.
 * Pages, components, and route handlers depend on this interface —
 * never on a database client or the seed file.
 */
export interface ServiceRepository {
  getAllVisible(): Promise<ServiceListItem[]>;
  /** For a future admin panel. Includes hidden services. */
  getAll(): Promise<Service[]>;
  getBySlug(slug: string): Promise<ServiceDetail | null>;
  /** For a future admin panel. */
  getById(id: string): Promise<Service | null>;
  create(
    input: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Service>;
  update(id: string, patch: Partial<Service>): Promise<Service>;
  delete(id: string): Promise<void>;
}
