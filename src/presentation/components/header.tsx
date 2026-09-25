"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ShoppingCartIcon, UserIcon } from "@/presentation/components/icons";
import { useCart } from "@/presentation/context/cart-context";
import { authClient, AuthUser } from "@/infrastructure/api/auth-client";

export function Header() {
  const { openCart, totalCount } = useCart();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(authClient.getUser());
  }, []);

  return (
    <header className="glass-header">
      <div className="sentra-container flex h-full items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 md:gap-3.5" aria-label="SentraDesa">
          <Image
            src="/images/logo.png"
            alt="Logo SentraDesa"
            width={48}
            height={48}
            className="h-10 w-auto object-contain sm:h-11 md:h-12 drop-shadow-2xs"
            priority
          />
          <div className="hidden leading-tight sm:block">
            <div className="font-headline text-[16px] md:text-[17px] font-black text-[#006e23] tracking-tight">
              SentraDesa
            </div>
            <div className="mt-0.5 text-[10px] md:text-[11px] font-semibold text-[#006e23]/80">
              Platform Ekosistem Digital Desa
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {user ? (
            <Link
              className="inline-flex items-center gap-2 rounded-2xl border border-[#006e23]/30 bg-white/85 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-[#006e23] shadow-xs transition hover:bg-white active:scale-95 cursor-pointer"
              href="/profile/"
              title={`Akun: ${user.name}`}
            >
              <UserIcon className="h-4 w-4" />
              <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              className="inline-flex items-center gap-2 rounded-2xl ambient-btn-primary px-5 py-2.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
              href="/login/"
              title="Masuk"
            >
              <span>Masuk</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={openCart}
            className="ambient-card relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-slate-700 transition hover:scale-105 hover:bg-white hover:text-[#006e23] active:scale-95 cursor-pointer select-none shadow-xs"
            type="button"
            aria-label="Keranjang Belanja"
            title={`Keranjang Belanja (${totalCount} produk)`}
          >
            <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-colors" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-extrabold text-white shadow-[0_2px_8px_rgba(186,26,26,0.45)] ring-2 ring-white animate-in zoom-in-75 duration-200">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

