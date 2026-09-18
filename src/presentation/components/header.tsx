import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShoppingCartIcon } from "@/presentation/components/icons";

export function Header() {
  return (
    <header className="glass-header">
      <div className="sentra-container flex h-full items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 md:gap-3.5" aria-label="Sentra Desa">
          <Image
            src="/images/logo.png"
            alt="Logo Sentra Desa"
            width={48}
            height={48}
            className="h-10 w-auto object-contain sm:h-11 md:h-12 drop-shadow-2xs"
            priority
          />
          <div className="hidden leading-none sm:block">
            <div className="font-headline text-[16px] md:text-[17px] font-extrabold tracking-wide text-[#006e23]">
              SENTRA DESA
            </div>
            <div className="mt-1 text-[10px] md:text-[10.5px] font-bold tracking-widest text-[#006e23]/80">
              BERDAYA DARI DESA
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-2xl ambient-btn-primary px-5 py-2.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
            href="/login/"
            title="Masuk"
          >
            <span>Masuk</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <button
            className="ambient-card relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-slate-700 transition hover:scale-105 hover:bg-white hover:text-[#006e23] active:scale-95 cursor-pointer select-none shadow-xs"
            type="button"
            aria-label="Keranjang Belanja"
            title="Keranjang Belanja (2 produk)"
          >
            <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-extrabold text-white shadow-[0_2px_8px_rgba(186,26,26,0.45)] ring-2 ring-white">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
