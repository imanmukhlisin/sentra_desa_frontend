import { SimpleFormPage } from "@/presentation/features/simple-form-page";

export default function Page() {
  return <SimpleFormPage title="Tambah Produk" description="Form produk merchant." fields={[{ name: "name", label: "Nama Produk" }, { name: "price", label: "Harga", type: "number" }, { name: "stock", label: "Stok", type: "number" }, { name: "category", label: "Kategori" }]} />;
}
