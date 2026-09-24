"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/presentation/context/cart-context";
import { authClient } from "@/infrastructure/api/auth-client";
import { formatCurrency } from "@/shared/utils/format";
import {
  XIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  ShoppingBagIcon
} from "@/presentation/components/icons";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice
  } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(authClient.getToken()));
  }, [isOpen]);

  const checkoutHref = isLoggedIn ? "/checkout/" : "/login/?redirect=/checkout/";

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Floating Island Drawer Panel (Matching SentraDesa Aesthetic) */}
      <aside
        ref={drawerRef}
        aria-label="Keranjang Belanja"
        aria-modal="true"
        role="dialog"
        className={`fixed z-[100] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
        } top-2 bottom-2 right-2 left-2 sm:left-auto sm:top-4 sm:bottom-4 sm:right-4 w-auto sm:w-[430px] max-w-[calc(100vw-16px)] sm:max-w-[430px] rounded-[14px] bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,110,35,0.08)] overflow-hidden`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100/90 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-[14px] bg-[#006e23]/10 text-[#006e23] shadow-xs">
              <ShoppingCartIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-extrabold text-[16px] sm:text-[18px] text-slate-900 leading-tight">
                  Keranjang Belanja
                </h2>
                {totalCount > 0 && (
                  <span className="inline-flex items-center rounded-[8px] bg-[#006e23]/10 px-2 py-0.5 text-[11px] font-bold text-[#006e23]">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {totalCount === 0 ? "Belum ada produk" : `${totalCount} produk siap di-checkout`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[14px] border border-slate-200/80 bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-150 active:scale-90 cursor-pointer shadow-xs"
            aria-label="Tutup Keranjang"
          >
            <XIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-horizontal-scrollbar">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12 px-4">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-[18px] bg-emerald-50/80 border border-emerald-100 text-[#006e23] mb-4 shadow-xs">
                <ShoppingCartIcon className="h-10 w-10 sm:h-11 sm:w-11 opacity-85" />
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-slate-900">
                Keranjang Anda Kosong
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 max-w-[250px] leading-relaxed">
                Belum ada produk desa yang Anda masukkan ke keranjang belanja.
              </p>
              <Link
                href="/sentra-produk/"
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#00521b] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(0,110,35,0.3)] transition-all duration-150 active:scale-95"
              >
                <span>Jelajahi Produk Desa</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group relative flex gap-3 sm:gap-3.5 rounded-[14px] border border-slate-200/80 bg-white/90 p-3 sm:p-3.5 shadow-xs transition hover:border-[#006e23]/35 hover:shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[14px] bg-slate-100 border border-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ShoppingBagIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Info & Counter */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 flex h-6 w-6 items-center justify-center rounded-[8px] text-slate-400 hover:text-red-500 hover:bg-red-50 transition active:scale-90 cursor-pointer"
                          aria-label={`Hapus ${item.title}`}
                          title="Hapus dari keranjang"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5 tabular-nums">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      {/* Quantity Stepper (Rounded consistent) */}
                      <div className="flex items-center rounded-[10px] border border-slate-200 bg-slate-50/80 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-[8px] text-slate-600 hover:bg-white hover:text-[#006e23] transition active:scale-90 cursor-pointer"
                          aria-label="Kurangi jumlah"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-extrabold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-[8px] text-slate-600 hover:bg-white hover:text-[#006e23] transition active:scale-90 cursor-pointer"
                          aria-label="Tambah jumlah"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <strong className="text-xs sm:text-sm font-black text-[#006e23] tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100/90 bg-white/80 p-4 sm:p-5 backdrop-blur-md space-y-3 sm:space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Subtotal Belanja</span>
                <p className="text-[11px] text-slate-400">Belum termasuk ongkos kirim</p>
              </div>
              <strong className="font-headline text-lg sm:text-xl font-black text-[#006e23] tabular-nums">
                {formatCurrency(totalPrice)}
              </strong>
            </div>

            <div className="flex gap-2 sm:gap-2.5">
              <Link
                href={checkoutHref}
                onClick={closeCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#00521b] text-white py-3 sm:py-3.5 px-5 text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(0,110,35,0.28)] transition-all duration-150 active:scale-95 text-center cursor-pointer"
              >
                <span>{isLoggedIn ? "Lanjut ke Checkout" : "Masuk untuk Checkout"}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[14px] border border-slate-200/80 bg-white/90 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 active:scale-90 cursor-pointer shadow-xs"
                title="Kosongkan Keranjang"
                aria-label="Kosongkan Keranjang"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
