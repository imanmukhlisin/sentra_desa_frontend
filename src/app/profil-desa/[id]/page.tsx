import { ProfileDesaDetail } from "@/presentation/features/details/profile-desa-detail";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return <ProfileDesaDetail id={resolvedParams.id} />;
}
