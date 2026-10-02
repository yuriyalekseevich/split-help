export interface LocalizedString {
  en: string;
  ru: string;
  hr: string;
  uk: string;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  /** Multiline. One bullet per line. */
  included: LocalizedString;
  priceHint?: LocalizedString;
  imageUrl: string;
  visible: boolean;
  sortOrder: number;
  /** Reserved for Stripe. Integer euro cents. Not charged yet. */
  priceCents?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceListItem = Pick<
  Service,
  | 'id'
  | 'slug'
  | 'title'
  | 'shortDescription'
  | 'priceHint'
  | 'imageUrl'
  | 'sortOrder'
>;

export type ServiceDetail = Service;
