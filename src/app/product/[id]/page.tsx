import { ProductDetail } from "@/presentation/features/details/product-detail";

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "keripik-singkong-pedas-manis" },
    { id: "kacang-gurih-krispi" },
    { id: "madu-hutan-alami" },
    { id: "kopi-robusta-desa" },
    { id: "kerajinan-anyaman-bambu" },
    { id: "minyak-kelapa-vco" }
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <ProductDetail id={resolvedParams.id} />;
}
