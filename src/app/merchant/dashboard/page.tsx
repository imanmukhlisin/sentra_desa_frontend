import Link from "next/link";

export default function Page() {
  return (
    <section className="bg-sentra-bg pt-[112px]">
      <div className="sentra-container px-5">
        <div className="rounded-flutter bg-white p-5 shadow-flutter">
          <span className="text-[10px] font-black uppercase tracking-[1px] text-sentra-emerald">Merchant</span>
          <h1 className="mt-1 text-2xl font-black text-slate-800">Dashboard Merchant</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">Ringkasan produk, pesanan, dan profil toko siap disambungkan ke API autentikasi Laravel.</p>
        </div>
        <div className="standard-grid mt-5">
          {[
            ["Produk", "/merchant/products"],
            ["Tambah Produk", "/merchant/products/add"],
            ["Profil Toko", "/merchant/profile"]
          ].map(([label, href]) => (
            <Link key={href} className="rounded-flutter border border-slate-200 bg-white p-5 shadow-flutter transition hover:-translate-y-0.5 hover:shadow-flutter-hover" href={href}>
              <h3 className="text-base font-black text-slate-800">{label}</h3>
              <p className="mt-1 text-sm text-slate-500">Kelola {label.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
