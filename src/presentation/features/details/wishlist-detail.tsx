"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { WishlistIcon, MapPinIcon } from "@/presentation/components/icons";

export function WishlistDetail({ id }: { id: string }) {
  const [wishlist, setWishlist] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("wishlists", id)
      .then((data) => {
        if (active) {
          setWishlist(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setWishlist(null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-700 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat wishlist aspirasi desa...</p>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <WishlistIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Wishlist Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Aspirasi pembangunan desa tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/wishlist">
              Kembali ke Wishlist Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = wishlist.raw || {};
  const reqBudget = Number(raw.required_budget ?? raw.target_amount ?? 75000000);
  const raisedBudget = Number(raw.raised_budget ?? raw.current_amount ?? reqBudget * 0.45);
  const pct = Math.min(100, Math.round((raisedBudget / reqBudget) * 100));

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/wishlist" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-pink-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Wishlist Desa
          </Link>
          <span className="rounded-full bg-pink-50 border border-pink-200 px-3 py-1 text-[11px] font-extrabold text-pink-700 uppercase">
            Usulan Aspirasi
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-900 uppercase">
              <WishlistIcon className="h-3.5 w-3.5" /> Aspirasi Warga Desa
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {wishlist.title}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-pink-600" />
              {wishlist.subtitle || wishlist.meta?.join(", ") || "Desa Sentra"}
            </p>
          </div>

          <div className="space-y-2 rounded-xl bg-pink-50/50 p-4 border border-pink-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Perkembangan Dukungan / Realisasi</span>
              <span className="text-pink-700">{pct}% Terkumpul</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-pink-600 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-extrabold text-slate-800 pt-1">
              <span>{formatCurrency(raisedBudget)}</span>
              <span className="text-slate-400 font-normal">Target: {formatCurrency(reqBudget)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Deskripsi Usulan & Rencana Pembangunan
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: wishlist.body || wishlist.description || "<p>Usulan aspirasi fasilitas perdesaan yang diajukan oleh masyarakat desa untuk meningkatkan kesejahteraan bersama.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
