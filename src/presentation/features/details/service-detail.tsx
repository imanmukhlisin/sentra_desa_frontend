"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { NewsIcon, MapPinIcon, PhoneIcon } from "@/presentation/components/icons";

export function ServiceDetail({ id }: { id: string }) {
  const [service, setService] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("services", id)
      .then((data) => {
        if (active) {
          setService(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setService(null);
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-800 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat panduan layanan desa...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <NewsIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Layanan Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data layanan publik desa tidak ditemukan.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/layanan-desa">
              Kembali ke Layanan Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = service.raw || {};
  const processingTime = String(raw.processing_time || raw.waktu_proses || "1 - 2 Hari Kerja");
  const cost = Number(raw.cost ?? raw.biaya ?? 0);
  const requirements = String(raw.requirements || raw.persyaratan || "Fotokopi KTP Pemohon, Fotokopi Kartu Keluarga (KK), Surat Pengantar RT/RW").split(",");
  const phone = String(raw.phone || "6281234567890");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/layanan-desa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Layanan Desa
          </Link>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-extrabold text-emerald-800 uppercase">
            Layanan Publik Desa
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 space-y-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900 uppercase">
                <NewsIcon className="h-3.5 w-3.5" /> Administrasi Desa
              </span>
              <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {service.title}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-500 flex items-center gap-1">
                <MapPinIcon className="h-4 w-4 text-emerald-600" />
                {service.subtitle || service.meta?.join(", ") || "Kantor Desa Sentra"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Biaya Pengurusan</span>
              <strong className="text-xl font-black text-emerald-800 mt-1 block">
                {cost > 0 ? formatCurrency(cost) : "Gratis / Rp 0"}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimasi Waktu Proses</span>
              <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                ⏱ {processingTime}
              </strong>
            </div>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
            Syarat & Berkas Administrasi Yang Dibutuhkan
          </h2>
          <ul className="space-y-2.5">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs font-bold text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700">
                  ✓
                </span>
                <span>{req.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed Information & Action */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Panduan & Prosedur Pelayanan
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: service.body || service.description || "<p>Pemohon datang ke Kantor Desa membawa dokumen persyaratan lengkap untuk divalidasi oleh petugas pelayanan publik.</p>"
            }}
          />

          <div className="pt-3 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Petugas%20Layanan%20Desa,%20saya%20ingin%20berkonsultasi%20mengenai%20${encodeURIComponent(service.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition"
            >
              <PhoneIcon className="h-4 w-4" /> Konsultasi via WhatsApp Desa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
