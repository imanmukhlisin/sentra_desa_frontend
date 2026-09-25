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

function CartItemQuantityInput({
  itemId,
  quantity,
  onUpdate
}: {
  itemId: string;
  quantity: number;
  onUpdate: (id: string, q: number) => void;
}) {
  const [val, setVal] = useState(String(quantity));

  useEffect(() => {
    setVal(String(quantity));
  }, [quantity]);

  const commit = () => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) {
      setVal(String(quantity));
      onUpdate(itemId, quantity);
    } else {
      onUpdate(itemId, parsed);
    }
  };

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/70 p-0.5">
      <button
        type="button"
        onClick={() => onUpdate(itemId, Math.max(1, quantity - 1))}
        className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-[#006e23] transition cursor-pointer"
        aria-label="Kurangi jumlah"
      >
        <MinusIcon className="h-3 w-3" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={val}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          setVal(raw);
          const num = parseInt(raw, 10);
          if (!isNaN(num) && num >= 1) {
            onUpdate(itemId, num);
          }
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-10 sm:w-12 bg-transparent text-center text-xs font-extrabold text-[#171d18] tabular-nums focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#006e23]/30 rounded py-0.5"
        aria-label="Jumlah produk"
      />
      <button
        type="button"
        onClick={() => onUpdate(itemId, quantity + 1)}
        className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-white hover:text-[#006e23] transition cursor-pointer"
        aria-label="Tambah jumlah"
      >
        <PlusIcon className="h-3 w-3" />
      </button>
    </div>
  );
}

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

      {/* Rightbar Drawer Panel */}
      <aside
        ref={drawerRef}
        aria-label="Keranjang Belanja"
        aria-modal="true"
        role="dialog"
        className={`fixed top-0 bottom-0 right-0 z-[100] w-full max-w-md bg-white/95 backdrop-blur-xl shadow-[-10px_0_40px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } border-l border-white/60`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006e23]/10 text-[#006e23]">
              <ShoppingCartIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#171d18] leading-tight">
                Keranjang Belanja
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {totalCount} {totalCount === 1 ? "produk" : "produk"} dipilih
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
            aria-label="Tutup Keranjang"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#006e23]/10 text-[#006e23] mb-4">
                <ShoppingBagIcon className="h-10 w-10 opacity-75" />
              </div>
              <h3 className="text-base font-bold text-[#171d18]">Keranjang Anda Kosong</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-[240px]">
                Belum ada produk desa yang Anda masukkan ke keranjang belanja.
              </p>
              <Link
                href="/sentra-produk/"
                onClick={closeCart}
                className="ambient-btn-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition active:scale-95"
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
                  className="group relative flex gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs transition hover:border-[#006e23]/30"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
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
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#171d18] line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          aria-label={`Hapus ${item.title}`}
                          title="Hapus dari keranjang"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-0.5 tabular-nums">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Stepper (Bisa diketik & tombol +/-) */}
                      <CartItemQuantityInput
                        itemId={item.id}
                        quantity={item.quantity}
                        onUpdate={updateQuantity}
                      />

                      {/* Item Total */}
                      <strong className="text-xs sm:text-sm font-extrabold text-[#006e23] tabular-nums">
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
          <div className="border-t border-slate-200/80 bg-white/80 p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Subtotal Belanja</span>
                <p className="text-[11px] text-slate-400">Belum termasuk ongkos kirim</p>
              </div>
              <strong className="text-lg sm:text-xl font-black text-[#006e23] tabular-nums">
                {formatCurrency(totalPrice)}
              </strong>
            </div>

            <div className="flex gap-2">
              <Link
                href={checkoutHref}
                onClick={closeCart}
                className="flex-1 ambient-btn-primary flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 text-center"
              >
                <span>{isLoggedIn ? "Lanjut ke Checkout" : "Masuk untuk Checkout"}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-red-600 transition cursor-pointer"
                title="Kosongkan Keranjang"
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
