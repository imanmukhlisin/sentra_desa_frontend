import Image from "next/image";
import Link from "next/link";
import { AddBusinessIcon, LoginIcon, SearchIcon, ShoppingBagIcon } from "@/presentation/components/icons";

export function Header() {
  return (
    <header className="glass-header">
      <div className="sentra-container flex h-full items-center gap-2 px-3 md:px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Sentra Desa">
          <Image src="/images/logo.png" alt="" width={42} height={42} className="h-8 w-auto object-contain md:h-[42px]" priority />
          <div className="ml-[15px] hidden leading-tight md:block">
            <div className="text-base font-black text-sentra-emerald">SENTRA DESA</div>
            <div className="text-[10px] text-slate-400">Berdaya dari Desa</div>
          </div>
        </Link>

        <div className="hidden flex-1 md:block" />

        <form className="mx-2 flex h-[42px] max-w-[400px] flex-1 items-center rounded-xl bg-black/[0.06] px-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-black/45" />
          <input
            name="search"
            aria-label="Cari produk desa"
            placeholder="Cari produk desa..."
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none placeholder:text-slate-500"
          />
        </form>

        <div className="hidden flex-1 md:block" />

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
          <Link className="sentra-button-outline px-2.5 md:px-3.5" href="/village-admin/register/" title="Registrasi Desa">
            <AddBusinessIcon className="h-[17px] w-[17px]" />
            <span className="hidden md:inline">Registrasi Desa</span>
          </Link>
          <Link className="sentra-button-primary px-2.5 md:px-3.5" href="/login/" title="Masuk">
            <LoginIcon className="h-[17px] w-[17px]" />
            <span className="hidden md:inline">Masuk</span>
          </Link>
          <button className="relative" type="button" aria-label="Keranjang">
            <ShoppingBagIcon className="h-[26px] w-[26px] text-slate-900" />
          </button>
        </div>
      </div>
    </header>
  );
}
