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
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="floating-pill-header">
      <div className="sentra-container w-full">
        <div
          data-scrolled={scrolled ? "true" : "false"}
          className={`floating-pill-nav ${scrolled ? "floating-pill-nav-scrolled" : "floating-pill-nav-top"}`}
        >
          {/* Logo & Brand Name: Logo tampil di mobile & desktop, tulisan SentraDesa di-hide di mobile */}
          <Link
            href="/"
            className="flex min-w-0 shrink items-center gap-2.5 sm:gap-3.5 pl-0.5 sm:pl-2"
            aria-label="SentraDesa"
          >
            <Image
              src="/images/logo.png"
              alt="Logo SentraDesa"
              width={56}
              height={56}
              className="h-10 w-10 min-[390px]:h-11 min-[390px]:w-11 sm:h-12 sm:w-12 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
              priority
            />
            <span className="hidden sm:inline-block font-headline font-extrabold text-[20px] md:text-[22px] text-slate-900 tracking-tight whitespace-nowrap drop-shadow-2xs">
              Sentra<span className="text-[#006e23]">Desa</span>
            </span>
          </Link>

          {/* Right Section: Auth Capsule + Cart */}
          <div className="flex shrink-0 items-center gap-2 min-[390px]:gap-2.5 sm:gap-3.5 pr-0.5 sm:pr-2">
            {user ? (
              <Link
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-[12px] sm:rounded-[14px] border border-slate-300/80 bg-white/95 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#006e23] shadow-xs transition hover:bg-white active:scale-95 cursor-pointer"
                href="/profile/"
                title={`Akun: ${user.name || user.email || "Pengguna"}`}
              >
                <UserIcon className="h-5 w-5 sm:h-5 sm:w-5" />
                <span className="max-w-[75px] sm:max-w-[120px] truncate">
                  {user.name && user.name.trim()
                    ? user.name.trim().split(" ")[0]
                    : (user.email ? user.email.split("@")[0] : "Akun")}
                </span>
              </Link>
            ) : (
              <div className="relative inline-flex items-center h-10 min-[390px]:h-11 sm:h-12 md:h-[50px] rounded-[12px] sm:rounded-[14px] bg-white/95 p-0.5 sm:p-1 border border-slate-300/80 shadow-xs select-none">
                {/* Sliding green background indicator */}
                <span
                  className={`absolute top-0.5 bottom-0.5 left-0.5 sm:top-1 sm:bottom-1 sm:left-1 w-[56px] min-[390px]:w-[62px] sm:w-[84px] md:w-[92px] rounded-[10px] sm:rounded-[11px] bg-[#006e23] shadow-sm pointer-events-none auth-slide-indicator ${
                    activeTab === "register" ? "translate-x-full" : "translate-x-0"
                  }`}
                />

                <Link
                  href="/login/"
                  onClick={() => setActiveTab("login")}
                  className={`relative z-10 w-[56px] min-[390px]:w-[62px] sm:w-[84px] md:w-[92px] h-9 min-[390px]:h-10 sm:h-10 md:h-[42px] rounded-[10px] sm:rounded-[11px] flex items-center justify-center text-xs min-[390px]:text-[13px] sm:text-sm font-bold transition-colors duration-300 cursor-pointer select-none ${
                    activeTab === "login" ? "text-white" : "text-slate-700 hover:text-slate-900"
                  }`}
                  title="Masuk ke Akun"
                >
                  Masuk
                </Link>
                <Link
                  href="/register/"
                  onClick={() => setActiveTab("register")}
                  className={`relative z-10 w-[56px] min-[390px]:w-[62px] sm:w-[84px] md:w-[92px] h-9 min-[390px]:h-10 sm:h-10 md:h-[42px] rounded-[10px] sm:rounded-[11px] flex items-center justify-center text-xs min-[390px]:text-[13px] sm:text-sm font-bold transition-colors duration-300 cursor-pointer select-none ${
                    activeTab === "register" ? "text-white" : "text-slate-700 hover:text-slate-900"
                  }`}
                  title="Daftar Akun Baru"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 min-[390px]:h-11 min-[390px]:w-11 sm:h-12 sm:w-12 md:h-[50px] md:w-[50px] shrink-0 items-center justify-center rounded-[12px] sm:rounded-[14px] border border-slate-300/80 bg-white/95 text-slate-800 transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[#006e23] hover:border-[#006e23]/40 active:scale-95 cursor-pointer select-none shadow-xs"
              type="button"
              aria-label="Keranjang Belanja"
              title={`Keranjang Belanja (${totalCount} produk)`}
            >
              <ShoppingCartIcon className="h-[18px] w-[18px] min-[390px]:h-5 min-[390px]:w-5 sm:h-6 sm:w-6 transition-colors" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[9px] sm:text-[10px] font-extrabold text-white shadow-xs ring-2 ring-white">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

