import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/shared/config/site";

export function Footer() {
  return (
    <footer className="mt-10 bg-sentra-soft px-6 py-10">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        <div className="flex items-center justify-center gap-3">
          <Image src="/images/logo.png" alt="" width={40} height={40} className="h-10 w-auto object-contain" />
          <div className="text-left">
            <strong className="block text-sm font-black text-sentra-emerald">{siteConfig.name.toUpperCase()}</strong>
            <span className="text-[11px] text-slate-500">Berdaya dari Desa</span>
          </div>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">Portal digital desa untuk mempertemukan produk, layanan, informasi, dan peluang ekonomi lokal.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-500">
          <Link className="hover:text-sentra-emerald" href="/wishlist/">Wishlist Antar Desa</Link>
          <Link className="hover:text-sentra-emerald" href="/village-admin/register/">Daftar Admin Desa</Link>
          <Link className="hover:text-sentra-emerald" href="/merchant/dashboard/">Dashboard Merchant</Link>
        </div>
      </div>
    </footer>
  );
}
