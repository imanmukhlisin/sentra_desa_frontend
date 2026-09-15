import { CatalogKind, ListQuery } from "@/domain/entities/common";
import { LaravelPublicRepository, sampleProducts } from "@/infrastructure/repositories/public-repository";

const repository = new LaravelPublicRepository();

export function getCatalog(kind: CatalogKind, query?: ListQuery) {
  return repository.list(kind, query);
}

export function getFreshCatalog(kind: CatalogKind, query?: ListQuery) {
  return repository.listFresh(kind, query);
}

export function getDetail(kind: CatalogKind, id: string) {
  return repository.detail(kind, id);
}

export async function getStaticCatalogParams(kind: CatalogKind, paramName: string) {
  const items = await repository.list(kind, { limit: "50", per_page: "50" });
  return items
    .map((item) => item.slug || item.id)
    .filter(Boolean)
    .map((value) => ({ [paramName]: value }));
}

export async function getHomeContent() {
  const [products, villages, tourisms, articles, exports, highlights] = await Promise.all([
    repository.list("products", { limit: "6" }),
    repository.list("villages", { per_page: "6" }),
    repository.list("tourisms", { limit: "6" }),
    repository.list("articles", { per_page: "3", limit: "3" }),
    repository.list("exports", { limit: "4" }),
    repository.getHighlights()
  ]);

  const finalProducts = products && products.length ? products : sampleProducts;

  return { products: finalProducts, villages, tourisms, articles, exports, highlights };
}
