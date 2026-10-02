import type { InfoTopic } from './info-topic';

/**
 * The only way the app reads and writes useful-info topics.
 * Pages depend on this interface, never on the seed file.
 * A later admin dashboard replaces the file implementation behind it.
 */
export interface InfoRepository {
  getAllVisible(): Promise<InfoTopic[]>;
  /** For a future admin panel. Includes hidden topics. */
  getAll(): Promise<InfoTopic[]>;
  getBySlug(slug: string): Promise<InfoTopic | null>;
  /** For a future admin panel. */
  getById(id: string): Promise<InfoTopic | null>;
  create(input: Omit<InfoTopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<InfoTopic>;
  update(id: string, patch: Partial<InfoTopic>): Promise<InfoTopic>;
  delete(id: string): Promise<void>;
}
