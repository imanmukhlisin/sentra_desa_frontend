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
            <strong className="block font-headline text-sm font-extrabold text-[#006e23]">{siteConfig.name.toUpperCase()}</strong>
            <span className="font-sans text-[11px] font-semibold text-[#6b7c68]">Berdaya dari Desa</span>
          </div>
        </div>
        <p className="mt-4 max-w-xl font-sans text-xs md:text-sm leading-6 text-[#3b4b39]">Portal digital desa untuk mempertemukan produk, layanan, informasi, dan peluang ekonomi lokal.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4 font-sans text-xs font-semibold text-[#3b4b39]">
          <Link className="transition hover:text-[#006e23]" href="/wishlist/">Wishlist Antar Desa</Link>
          <Link className="transition hover:text-[#006e23]" href="/village-admin/register/">Daftar Admin Desa</Link>
          <Link className="transition hover:text-[#006e23]" href="/merchant/dashboard/">Dashboard Merchant</Link>
        </div>
      </div>
    </footer>
  );
}
