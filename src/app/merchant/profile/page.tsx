import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Profil Merchant" description="Kelola identitas toko, kontak, dan alamat merchant." fields={[{ name: "store_name", label: "Nama Toko" }, { name: "phone", label: "Nomor WhatsApp" }, { name: "address", label: "Alamat Toko" }]} />;
}
