import { CatalogPage } from "@/presentation/features/catalog-page";

export default function Page() {
  return (
    <CatalogPage
      kind="services"
      title="Informasi Desa"
      description="Informasi, panduan layanan administrasi publik, perizinan, dan pengumuman resmi desa."
      categories={[
        "administrasi_kependudukan",
        "surat_menyurat",
        "perizinan",
        "wisata",
        "bumdes",
        "pertanian"
      ]}
    />
  );
}
