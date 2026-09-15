import { CatalogPage } from "@/presentation/features/catalog-page";

export default function Page() {
  return (
    <CatalogPage
      kind="products"
      title="Sentra Produk"
      description="Produk unggulan desa, UMKM, dan merchant lokal."
      categories={["makanan_minuman", "kerajinan", "fashion", "pertanian", "perikanan", "peternakan", "jasa", "lainnya"]}
    />
  );
}
