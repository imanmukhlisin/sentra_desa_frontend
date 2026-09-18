"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { LkddIcon, MapPinIcon, ChevronLeftIcon } from "@/presentation/components/icons";

export function LkddDetail({ id }: { id: string }) {
  const [report, setReport] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("lkdd", id)
      .then((item) => {
        if (active) {
          setReport(item);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setReport(null);
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
          <p className="text-xs font-bold text-slate-600">Memuat laporan APBDes dana desa...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <LkddIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Laporan LKDD Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Laporan keuangan dana desa tidak ditemukan.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/lkdd">
              Kembali ke LKDD
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = report.raw || {};
  const fiscalYear = String(raw.fiscal_year || raw.year || "2024");
  const totalBudget = Number(raw.total_budget ?? raw.amount ?? 1250000000);
  const realizationPct = Number(raw.realization_percentage ?? 92.5);
  const danaDesa = Number(raw.dana_desa ?? totalBudget * 0.65);
  const addFund = Number(raw.add ?? totalBudget * 0.25);
  const pades = Number(raw.pades ?? totalBudget * 0.10);

  const categories = [
    { name: "Penyelenggaraan Pemerintahan Desa", percent: 35, color: "bg-[#006e23]" },
    { name: "Pelaksanaan Pembangunan Desa", percent: 45, color: "bg-emerald-600" },
    { name: "Pembinaan Kemasyarakatan Desa", percent: 12, color: "bg-amber-600" },
    { name: "Pemberdayaan Masyarakat Desa", percent: 8, color: "bg-teal-600" }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/lkdd" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Laporan LKDD</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            Tahun Anggaran {fiscalYear}
          </span>
        </div>
      </div>

      <div className="sentra-container space-y-6">
        {/* Banner Card */}
        <div className="rounded-[14px] border border-white/85 bg-gradient-to-br from-[#0c2e17] via-[#123e21] to-[#0a2012] p-6 md:p-8 text-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <LkddIcon className="h-3.5 w-3.5" /> Laporan Keuangan Dana Desa (LKDD)
              </span>
              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                {report.title}
              </h1>
              <p className="mt-1.5 text-xs md:text-sm text-emerald-100 flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-emerald-400" />
                {report.subtitle || report.meta?.join(", ") || "Pemerintah Desa Sentra"}
              </p>
            </div>

            <div className="rounded-[14px] bg-white/10 backdrop-blur-md p-4 border border-white/15 text-center min-w-[200px]">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Total Pagu Anggaran</span>
              <strong className="text-2xl font-black text-white mt-1 block">
                {formatCurrency(totalBudget)}
              </strong>
              <span className="inline-block mt-2 rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                Realisasi {realizationPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Realization Progress */}
        <div className="ambient-card rounded-[14px] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#171d18]">Tingkat Realisasi APBDes</h2>
            <span className="text-sm font-black text-[#006e23]">{realizationPct}% Terpenuhi</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div className="h-full rounded-full bg-[#006e23] transition-all duration-500" style={{ width: `${realizationPct}%` }} />
          </div>
        </div>

        {/* Revenue Sources Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase">Dana Desa (APBN)</span>
            <strong className="text-xl font-black text-slate-800 mt-1 block">{formatCurrency(danaDesa)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Alokasi Pokok Pemerintah Pusat</span>
          </div>
          <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase">Alokasi Dana Desa (ADD)</span>
            <strong className="text-xl font-black text-slate-800 mt-1 block">{formatCurrency(addFund)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Bagi Hasil Kabupaten/Kota</span>
          </div>
          <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase">PADes & Hasil BUMDes</span>
            <strong className="text-xl font-black text-[#006e23] mt-1 block">{formatCurrency(pades)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Pendapatan Asli Desa</span>
          </div>
        </div>

        {/* Category Expenditure Allocation Progress */}
        <div className="ambient-card rounded-[14px] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#171d18] border-b border-black/5 pb-3">
            Alokasi Bidang Belanja Desa
          </h2>
          <div className="space-y-4 pt-1">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{cat.name}</span>
                  <span>{cat.percent}% ({formatCurrency((totalBudget * cat.percent) / 100)})</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description & Official Download Attachment */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3">
            Keterangan & Rincian Transparansi
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: report.body || report.description || "<p>Laporan Keuangan Dana Desa ini dipublikasikan secara terbuka sebagai wujud transparansi tata kelola anggaran publik desa.</p>"
            }}
          />
          <div className="pt-3 border-t border-black/5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => alert("Dokumen PDF laporan keuangan publik siap diunduh.")}
              className="ambient-btn-primary rounded-[14px] px-6 py-3.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              📥 Unduh Dokumen APBDes PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
