import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Daftar Akun" description="Buat akun masyarakat atau pelaku desa." fields={[{ name: "name", label: "Nama" }, { name: "email", label: "Email", type: "email" }, { name: "password", label: "Password", type: "password" }]} />;
}
