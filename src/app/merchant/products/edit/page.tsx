"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return (
    <Suspense fallback={<section className="section"><div className="container empty">Memuat produk...</div></section>}>
      <EditProductPage />
    </Suspense>
  );
}

function EditProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return (
    <SimpleFormPage
      title={productId ? `Edit Produk ${productId}` : "Edit Produk"}
      description="Perbarui informasi produk merchant."
      fields={[
        { name: "name", label: "Nama Produk" },
        { name: "price", label: "Harga", type: "number" },
        { name: "stock", label: "Stok", type: "number" },
        { name: "category", label: "Kategori" }
      ]}
    />
  );
}
