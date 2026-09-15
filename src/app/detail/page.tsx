import { ClientDetailPage } from "@/presentation/features/client-detail-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<section className="bg-sentra-bg pt-[112px]"><div className="sentra-container"><div className="empty-state">Memuat informasi...</div></div></section>}>
      <ClientDetailPage />
    </Suspense>
  );
}
