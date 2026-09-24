import { CatalogPage } from "@/presentation/features/catalog-page";
import { sampleBumdes } from "@/infrastructure/repositories/public-repository";

export default function Page() {
  return (
    <CatalogPage
      kind="bumdes"
      title="BUMDes"
      description="Profil dan usaha Badan Usaha Milik Desa."
      categories={["berkembang", "maju", "mandiri"]}
      initialItems={sampleBumdes}
    />
  );
}
