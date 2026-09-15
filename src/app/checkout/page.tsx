import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Checkout" description="Lengkapi informasi pemesanan produk desa." fields={[{ name: "name", label: "Nama Pembeli" }, { name: "phone", label: "Nomor WhatsApp" }, { name: "address", label: "Alamat Pengiriman" }]} />;
}
