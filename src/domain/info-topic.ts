import type { LocalizedString } from './service';

export type InfoLinkKind = 'site' | 'group';

export interface InfoLink {
  id: string;
  url: string;
  /** Brand or page name. The same in every language. */
  label: string;
  kind: InfoLinkKind;
  featured?: boolean;
  note?: LocalizedString;
}

/**
 * One useful-info topic. A later admin dashboard can store the same shape.
 * Pages read it only through `InfoRepository`.
 */
export interface InfoTopic {
  id: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  /** Paragraphs separated by a blank line. */
  body?: LocalizedString;
  links: InfoLink[];
  visible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Fields the public search box looks through. Dates stay on the server. */
export interface InfoSearchDocument {
  title: LocalizedString;
  summary: LocalizedString;
  body?: LocalizedString;
  links: Array<Pick<InfoLink, 'label' | 'url'> & { note?: LocalizedString }>;
}
