import { CatalogPage } from "@/presentation/features/catalog-page";

export default function Page() {
  return <CatalogPage kind="potentials" title="Potensi Desa" description="Informasi komoditas dan peluang investasi kawasan desa." categories={["pertanian", "perikanan", "peternakan", "pariwisata", "kerajinan"]} />;
}
