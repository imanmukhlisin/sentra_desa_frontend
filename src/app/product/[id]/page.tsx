import { ProductDetail } from "@/presentation/features/details/product-detail";

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "gamelan-bali" },
    { id: "tas-anyaman-bamboo" },
    { id: "kacang-gurih" },
    { id: "kacang-gurih-krispi" },
    { id: "keripik-singkong-pedas-manis" },
    { id: "madu-hutan-alami" },
    { id: "kopi-robusta-desa" },
    { id: "kerajinan-anyaman-bambu" },
    { id: "minyak-kelapa-vco" },
    { id: "sample-1" },
    { id: "sample-2" },
    { id: "sample-3" },
    { id: "sample-4" },
    { id: "sample-5" },
    { id: "sample-6" }
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <ProductDetail id={resolvedParams.id} />;
}
