import { ServiceDetail } from "@/presentation/features/details/service-detail";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <ServiceDetail id={resolvedParams.id} />;
}
