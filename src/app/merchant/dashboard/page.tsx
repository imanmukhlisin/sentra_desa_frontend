import Link from "next/link";

export default function Page() {
  return (
    <section className="min-h-screen bg-[#f4fbf2] pt-[112px] pb-14">
      <div className="sentra-container px-4 md:px-6">
        <div className="rounded-xl border border-[#b9ccb5]/50 bg-white p-6 shadow-xs">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#006e23]">Merchant</span>
          <h1 className="mt-1 font-headline text-2xl md:text-[28px] font-bold text-[#171d18]">Dashboard Merchant</h1>
          <p className="mt-1 font-sans text-sm leading-6 text-[#3b4b39]">Ringkasan produk, pesanan, dan profil toko siap disambungkan ke API autentikasi Laravel.</p>
        </div>
        <div className="standard-grid mt-6">
          {[
            ["Produk", "/merchant/products"],
            ["Tambah Produk", "/merchant/products/add"],
            ["Profil Toko", "/merchant/profile"]
          ].map(([label, href]) => (
            <Link key={href} className="group rounded-xl border border-[#b9ccb5]/50 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-[#006e23] hover:shadow-sm" href={href}>
              <h3 className="font-headline text-base font-bold text-[#171d18] transition-colors group-hover:text-[#006e23]">{label}</h3>
              <p className="mt-1 font-sans text-xs md:text-sm text-[#3b4b39]">Kelola {label.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
