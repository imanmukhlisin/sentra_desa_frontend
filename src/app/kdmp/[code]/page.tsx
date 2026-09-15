import { KdmpDetail } from "@/presentation/features/details/kdmp-detail";

export function generateStaticParams() {
  return [{ code: "1" }, { code: "2" }];
}

export default async function Page({ params }: { params: Promise<{ code: string }> | { code: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <KdmpDetail id={resolvedParams.code} />;
}
