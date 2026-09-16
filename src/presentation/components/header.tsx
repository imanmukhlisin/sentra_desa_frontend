import Image from "next/image";
import Link from "next/link";
import { AddBusinessIcon, ArrowRightIcon, SearchIcon, ShoppingBagIcon } from "@/presentation/components/icons";

export function Header() {
  return (
    <header className="glass-header">
      <div className="sentra-container flex h-full items-center justify-between gap-2 px-3 md:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Sentra Desa">
          <Image src="/images/logo.png" alt="" width={42} height={42} className="h-9 w-auto object-contain md:h-11" priority />
          <div className="hidden leading-none md:block">
            <div className="font-headline text-[15px] font-extrabold tracking-wide text-[#006e23]">SENTRA DESA</div>
            <div className="mt-1 text-[9.5px] font-bold tracking-widest text-[#006e23]/80">BERDAYA DARI DESA</div>
          </div>
        </Link>

        <form className="mx-2 md:mx-6 flex h-[42px] max-w-[460px] flex-1 items-center rounded-full border border-[#b9ccb5]/60 bg-[#eff6ec] px-4 transition focus-within:border-[#006e23] focus-within:bg-white focus-within:shadow-sm">
          <SearchIcon className="h-4 w-4 shrink-0 text-[#3b4b39]" />
          <input
            name="search"
            aria-label="Cari produk desa"
            placeholder="Cari produk desa, komoditas, pasar desa..."
            className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-xs text-[#171d18] outline-none placeholder:text-[#3b4b39]/70"
          />
        </form>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-[#b9ccb5] bg-white px-3.5 py-2 text-xs font-semibold text-[#171d18] shadow-sm transition hover:bg-[#eff6ec]"
            href="/village-admin/register/"
            title="Registrasi Desa"
          >
            <AddBusinessIcon className="h-4 w-4 text-[#3b4b39]" />
            <span className="hidden sm:inline">Registrasi Desa</span>
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e23] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#005319]"
            href="/login/"
            title="Masuk"
          >
            <span>Masuk</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
          <button className="relative ml-1 p-1 text-[#171d18] transition hover:scale-105" type="button" aria-label="Keranjang">
            <ShoppingBagIcon className="h-6 w-6 text-[#171d18]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ba1a1a] text-[10px] font-bold text-white">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
