import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Daftar Merchant" description="Mulai menjual produk desa di Sentra Desa." fields={[{ name: "store_name", label: "Nama Toko" }, { name: "owner_name", label: "Nama Pemilik" }, { name: "phone", label: "Nomor WhatsApp" }, { name: "email", label: "Email", type: "email" }]} />;
}
