import { CatalogPage } from "@/presentation/features/catalog-page";

export default function Page() {
  return <CatalogPage kind="bumdes" title="BUMDes" description="Profil dan usaha Badan Usaha Milik Desa." categories={["perdagangan", "jasa", "pertanian", "wisata"]} />;
}
