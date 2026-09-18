import { ClientDetailPage } from "@/presentation/features/client-detail-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<section className="bg-transparent pt-28"><div className="sentra-container"><div className="empty-state">Memuat informasi...</div></div></section>}>
      <ClientDetailPage />
    </Suspense>
  );
}
