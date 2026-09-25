import { CatalogPage } from "@/presentation/features/catalog-page";
import { sampleTourisms } from "@/infrastructure/repositories/public-repository";

export default function Page() {
  return (
    <CatalogPage
      kind="tourisms"
      title="Desa Wisata"
      description="Destinasi dan daya tarik wisata desa di Indonesia."
      categories={["alam", "budaya", "buatan", "kuliner"]}
      initialItems={sampleTourisms}
    />
  );
}
