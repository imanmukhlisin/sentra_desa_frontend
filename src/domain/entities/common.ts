export type Dictionary = Record<string, unknown>;

export type ListQuery = {
  search?: string;
  category?: string;
  type?: string;
  sector?: string;
  village_id?: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  page?: string;
  per_page?: string;
  limit?: string;
};

export type CatalogKind =
  | "products"
  | "villages"
  | "tourisms"
  | "bumdes"
  | "potentials"
  | "exports"
  | "kdmp"
  | "services"
  | "lkdd"
  | "articles"
  | "wishlists";

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  href: string;
  badge?: string;
  price?: number;
  meta?: string[];
  raw: Dictionary;
};

export type DetailItem = CatalogItem & {
  body?: string;
  gallery?: string[];
  facts?: { label: string; value: string }[];
};

export type HighlightItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  link_url?: string | null;
  link_label?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export interface PublicRepository {
  list(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[]>;
  listFresh(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[] | null>;
  detail(kind: CatalogKind, id: string): Promise<DetailItem | null>;
  getHighlights(): Promise<HighlightItem[]>;
}
