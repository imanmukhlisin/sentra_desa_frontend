"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon, UserIcon } from "@/presentation/components/icons";
import { useCart } from "@/presentation/context/cart-context";
import { authClient, AuthUser } from "@/infrastructure/api/auth-client";

export function Header() {
  const { openCart, totalCount } = useCart();
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(authClient.getUser());
  }, []);

  useEffect(() => {
    if (pathname?.includes("/login")) {
      setActiveTab("login");
    } else if (pathname?.includes("/register")) {
      setActiveTab("register");
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="floating-pill-header sentra-container">
      <div className={`floating-pill-nav ${scrolled ? "floating-pill-nav-scrolled" : "floating-pill-nav-top"}`}>
        {/* Logo & Brand Name: "SentraDesa" nyambung */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-3 pl-0.5 sm:pl-2" aria-label="SentraDesa">
          <Image
            src="/images/logo.png"
            alt="Logo SentraDesa"
            width={44}
            height={44}
            className="h-7 w-7 sm:h-11 sm:w-11 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
            priority
          />
          <span className="font-headline font-extrabold text-[14px] sm:text-[20px] md:text-[22px] text-slate-900 tracking-tight whitespace-nowrap drop-shadow-2xs">
            Sentra<span className="text-[#006e23]">Desa</span>
          </span>
        </Link>

        {/* Right Section: Auth Capsule + Cart */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3.5 pr-0.5 sm:pr-2">
          {user ? (
            <Link
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[14px] border border-slate-300/80 bg-white/90 px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#006e23] shadow-xs transition hover:bg-white active:scale-90 cursor-pointer"
              href="/profile/"
              title={`Akun: ${user.name}`}
            >
              <UserIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              <span className="max-w-[70px] sm:max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <div className="relative inline-flex items-center h-8 sm:h-12 md:h-[50px] rounded-[14px] bg-white/90 p-0.5 sm:p-1 border border-slate-300/80 shadow-xs select-none">
              {/* Sliding green background */}
              <span
                className={`absolute top-0.5 bottom-0.5 left-0.5 sm:top-1 sm:bottom-1 sm:left-1 w-[48px] sm:w-[84px] md:w-[92px] rounded-[11px] bg-[#006e23] shadow-xs transition-transform duration-300 ease-out pointer-events-none ${
                  activeTab === "register" ? "translate-x-full" : "translate-x-0"
                }`}
              />

              <Link
                href="/login/"
                onClick={() => setActiveTab("login")}
                className={`relative z-10 w-[48px] sm:w-[84px] md:w-[92px] h-7 sm:h-10 md:h-[42px] rounded-[11px] flex items-center justify-center text-[11px] sm:text-sm font-bold transition-all duration-150 cursor-pointer active:scale-90 ${
                  activeTab === "login" ? "text-white font-extrabold" : "text-slate-700 hover:text-slate-900"
                }`}
                title="Masuk ke Akun"
              >
                Masuk
              </Link>
              <Link
                href="/register/"
                onClick={() => setActiveTab("register")}
                className={`relative z-10 w-[48px] sm:w-[84px] md:w-[92px] h-7 sm:h-10 md:h-[42px] rounded-[11px] flex items-center justify-center text-[11px] sm:text-sm font-bold transition-all duration-150 cursor-pointer active:scale-90 ${
                  activeTab === "register" ? "text-white font-extrabold" : "text-slate-700 hover:text-slate-900"
                }`}
                title="Daftar Akun Baru"
              >
                Daftar
              </Link>
            </div>
          )}

          <button
            onClick={openCart}
            className="relative flex h-8 w-8 sm:h-12 sm:w-12 md:h-[50px] md:w-[50px] items-center justify-center rounded-[14px] border border-slate-300/80 bg-white/90 text-slate-800 transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#006e23] hover:border-[#006e23]/40 active:scale-90 cursor-pointer select-none shadow-xs"
            type="button"
            aria-label="Keranjang Belanja"
            title={`Keranjang Belanja (${totalCount} produk)`}
          >
            <ShoppingCartIcon className="h-4 w-4 sm:h-6 sm:w-6 transition-colors" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ba1a1a] px-0.5 text-[9px] font-extrabold text-white shadow-xs ring-1 sm:ring-2 ring-white">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

