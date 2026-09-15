"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { KdmpIcon, MapPinIcon } from "@/presentation/components/icons";

export function KdmpDetail({ id }: { id: string }) {
  const [kdmp, setKdmp] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("kdmp", id)
      .then((data) => {
        if (active) {
          setKdmp(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setKdmp(null);
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-800 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat detail KDMP...</p>
        </div>
      </div>
    );
  }

  if (!kdmp) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <KdmpIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">KDMP Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data Kawasan Perdesaan Mandiri Pangan tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/kdmp">
              Kembali ke KDMP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = kdmp.raw || {};
  const sector = String(raw.sector || raw.sektor || "Pertanian & Ketahanan Pangan");
  const memberVillages = String(raw.member_villages_count || raw.jumlah_desa || "5 Desa Pembina");
  const areaSize = String(raw.area_size || raw.luas_kawasan || "120");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/kdmp" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke KDMP
          </Link>
          <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[11px] font-extrabold text-red-900 uppercase">
            Kawasan Perdesaan
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-900 uppercase">
              <KdmpIcon className="h-3.5 w-3.5" /> Program Mandiri Pangan
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {kdmp.title}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-500 flex items-center gap-1">
              <MapPinIcon className="h-4 w-4 text-red-700" />
              {kdmp.subtitle || kdmp.meta?.join(", ") || "Kawasan Perdesaan Sentra"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-red-50/40 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sektor Utama</span>
              <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                🌾 {sector}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Desa Anggota Kawasan</span>
              <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                {memberVillages}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Luas Total Kawasan</span>
              <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                {areaSize} Ha
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Gambaran Program & Rincian Sektor Kawasan
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: kdmp.body || kdmp.description || "<p>KDMP ini mengkoordinasikan potensi lintas desa untuk mewujudkan ketahanan dan kemandirian pangan nasional berbasis pemberdayaan masyarakat lokal.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
