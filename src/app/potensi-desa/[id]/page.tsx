import { PotentialDetail } from "@/presentation/features/details/potential-detail";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <PotentialDetail id={resolvedParams.id} />;
}
