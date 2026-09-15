import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Masuk" description="Akses akun Sentra Desa." fields={[{ name: "email", label: "Email", type: "email" }, { name: "password", label: "Password", type: "password" }]} />;
}
