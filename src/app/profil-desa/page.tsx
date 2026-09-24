import { CatalogPage } from "@/presentation/features/catalog-page";
import { sampleVillages } from "@/infrastructure/repositories/public-repository";

export default function Page() {
  return (
    <CatalogPage
      kind="villages"
      title="Profil Desa"
      description="Daftar desa beserta informasi wilayah, profil, dan statistik publik."
      initialItems={sampleVillages}
    />
  );
}
