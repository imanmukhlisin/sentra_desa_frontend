import { CatalogPage } from "@/presentation/features/catalog-page";
import { samplePotentials } from "@/infrastructure/repositories/public-repository";

export default function Page() {
  return (
    <CatalogPage
      kind="potentials"
      title="Potensi Desa"
      description="Informasi komoditas unggulan dan peluang investasi kawasan desa se-Indonesia."
      categories={[
        "pertanian",
        "perkebunan",
        "peternakan",
        "perikanan",
        "pariwisata",
        "industri",
        "kehutanan",
        "tambang",
        "sdm"
      ]}
      initialItems={samplePotentials}
    />
  );
}
