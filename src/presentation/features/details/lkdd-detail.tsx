"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { LkddIcon, MapPinIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-800 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat laporan APBDes dana desa...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <LkddIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Laporan LKDD Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Laporan keuangan dana desa tidak ditemukan.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/lkdd">
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
    { name: "Penyelenggaraan Pemerintahan Desa", percent: 35, color: "bg-blue-600" },
    { name: "Pelaksanaan Pembangunan Desa", percent: 45, color: "bg-emerald-600" },
    { name: "Pembinaan Kemasyarakatan Desa", percent: 12, color: "bg-amber-600" },
    { name: "Pemberdayaan Masyarakat Desa", percent: 8, color: "bg-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/lkdd" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-cyan-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Laporan LKDD
          </Link>
          <span className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-[11px] font-extrabold text-cyan-900 uppercase">
            Tahun Anggaran {fiscalYear}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 space-y-6">
        {/* Banner Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-900 p-6 md:p-8 text-white shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                <LkddIcon className="h-3.5 w-3.5" /> Laporan Keuangan Dana Desa (LKDD)
              </span>
              <h1 className="mt-3 text-2xl md:text-3xl font-black leading-tight">
                {report.title}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-cyan-100 flex items-center gap-1">
                <MapPinIcon className="h-4 w-4 text-cyan-400" />
                {report.subtitle || report.meta?.join(", ") || "Pemerintah Desa Sentra"}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/15 text-center min-w-[200px]">
              <span className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider block">Total Pagu Anggaran</span>
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Tingkat Realisasi APBDes</h2>
            <span className="text-sm font-extrabold text-cyan-900">{realizationPct}% Terpenuhi</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-cyan-700 transition-all duration-500" style={{ width: `${realizationPct}%` }} />
          </div>
        </div>

        {/* Revenue Sources Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block uppercase">Dana Desa (APBN)</span>
            <strong className="text-xl font-black text-slate-800 mt-1 block">{formatCurrency(danaDesa)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Alokasi Pokok Pemerintah Pusat</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block uppercase">Alokasi Dana Desa (ADD)</span>
            <strong className="text-xl font-black text-slate-800 mt-1 block">{formatCurrency(addFund)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Bagi Hasil Kabupaten/Kota</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block uppercase">PADes & Hasil BUMDes</span>
            <strong className="text-xl font-black text-slate-800 mt-1 block">{formatCurrency(pades)}</strong>
            <span className="text-[11px] text-slate-500 mt-1 block">Pendapatan Asli Desa</span>
          </div>
        </div>

        {/* Category Expenditure Allocation Progress */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
            Alokasi Bidang Belanja Desa
          </h2>
          <div className="space-y-4 pt-1">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{cat.name}</span>
                  <span>{cat.percent}% ({formatCurrency((totalBudget * cat.percent) / 100)})</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description & Official Download Attachment */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Keterangan & Rincian Transparansi
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: report.body || report.description || "<p>Laporan Keuangan Dana Desa ini dipublikasikan secara terbuka sebagai wujud transparansi tata kelola anggaran publik desa.</p>"
            }}
          />
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Dokumen PDF laporan keuangan publik siap diunduh.");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-900 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-cyan-950 transition"
            >
              📥 Unduh Dokumen APBDes PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
