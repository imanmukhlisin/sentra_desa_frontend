import { ArtikelDetail } from "@/presentation/features/details/artikel-detail";

export function generateStaticParams() {
  return [{ slug: "1" }, { slug: "2" }];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <ArtikelDetail id={resolvedParams.slug} />;
}
