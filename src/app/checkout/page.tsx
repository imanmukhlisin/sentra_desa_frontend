"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/infrastructure/api/auth-client";
import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function CheckoutPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = authClient.getToken();
    if (!token) {
      router.replace("/login?redirect=/checkout");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-slate-500 font-semibold text-sm">
        Memeriksa sesi login...
      </div>
    );
  }

  const user = authClient.getUser();

  return (
    <SimpleFormPage
      title="Checkout Produk Desa"
      description={`Selesaikan pemesanan Anda${user ? `, ${user.name}` : ""}.`}
      fields={[
        { name: "name", label: "Nama Lengkap Pembeli" },
        { name: "phone", label: "Nomor WhatsApp / Kontak" },
        { name: "address", label: "Alamat Lengkap Pengiriman" }
      ]}
    />
  );
}
