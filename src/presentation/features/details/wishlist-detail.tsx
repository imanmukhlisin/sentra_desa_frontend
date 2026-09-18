"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { WishlistIcon, MapPinIcon, ChevronLeftIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">Memuat wishlist aspirasi desa...</p>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <WishlistIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Wishlist Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Aspirasi pembangunan desa tidak tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/wishlist">
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
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6 max-w-4xl">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/wishlist" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Wishlist Desa</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            Usulan Aspirasi
          </span>
        </div>
      </div>

      <div className="sentra-container max-w-4xl space-y-6">
        {/* Main Header Card */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
              <WishlistIcon className="h-3.5 w-3.5" /> Aspirasi Warga Desa
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
              {wishlist.title}
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
              <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
              {wishlist.subtitle || wishlist.meta?.join(", ") || "Desa Sentra"}
            </p>
          </div>

          <div className="space-y-2.5 rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Perkembangan Dukungan / Realisasi</span>
              <span className="text-[#006e23] font-black">{pct}% Terkumpul</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/80">
              <div className="h-full rounded-full bg-[#006e23] transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-extrabold text-slate-800 pt-1">
              <span className="text-[#006e23]">{formatCurrency(raisedBudget)}</span>
              <span className="text-slate-400 font-medium">Target: {formatCurrency(reqBudget)}</span>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3">
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
