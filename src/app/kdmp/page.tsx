import { CatalogPage } from "@/presentation/features/catalog-page";

export default function Page() {
  return (
    <CatalogPage
      kind="kdmp"
      title="Koperasi Desa Merah Putih (KDMP)"
      description="Direktori Koperasi Desa Merah Putih untuk kemandirian pangan dan ekonomi produktif desa."
      categories={["aktif", "persiapan"]}
    />
  );
}
