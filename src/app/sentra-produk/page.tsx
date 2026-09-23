import { CatalogPage } from "@/presentation/features/catalog-page";
import { sampleProducts } from "@/infrastructure/repositories/public-repository";

export default function Page() {
  return (
    <CatalogPage
      kind="products"
      title="Sentra Produk"
      description="Produk unggulan desa, UMKM, dan merchant lokal."
      categories={["makanan_minuman", "kerajinan", "fashion", "pertanian", "perikanan", "peternakan", "jasa", "lainnya"]}
      initialItems={sampleProducts}
    />
  );
}
