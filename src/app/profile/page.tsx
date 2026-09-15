import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Profil Pengguna" description="Kelola data akun dan kontak." fields={[{ name: "name", label: "Nama" }, { name: "phone", label: "Nomor HP" }, { name: "address", label: "Alamat" }]} />;
}
