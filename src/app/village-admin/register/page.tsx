import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Daftar Admin Desa" description="Ajukan akses pengelolaan profil dan konten desa." fields={[{ name: "name", label: "Nama Lengkap" }, { name: "email", label: "Email", type: "email" }, { name: "village", label: "Nama Desa" }, { name: "letter", label: "Nomor Surat Tugas" }]} />;
}
