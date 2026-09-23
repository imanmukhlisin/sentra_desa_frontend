"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { NewsIcon, MapPinIcon, PhoneIcon, ChevronLeftIcon } from "@/presentation/components/icons";
import { DetailSkeleton } from "@/presentation/components/skeleton";

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
    return <DetailSkeleton backLabel="Kembali ke Layanan Desa" />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <NewsIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Layanan Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data layanan publik desa tidak ditemukan.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/layanan-desa">
              Kembali ke Layanan Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = service.raw || {};
  const isContent = raw.__source === "contents" || (!raw.requirements && !raw.process_steps && !raw.processing_time && Boolean(raw.content));
  
  const processingTime = String(raw.processing_time || raw.waktu_proses || "1 - 3 Hari Kerja");
  const cost = Number(raw.cost ?? raw.biaya ?? 0);
  const officeHours = String(raw.office_hours || raw.jam_pelayanan || "Senin - Jumat (08:00 - 15:00 WIB)");
  const phone = String(raw.phone || raw.contact_phone || "6281234567890");

  const rawReqs = raw.requirements || raw.persyaratan;
  const requirements: string[] = Array.isArray(rawReqs)
    ? rawReqs.map(String).filter((r) => r.trim().length > 0)
    : typeof rawReqs === "string" && rawReqs.trim().length > 0
    ? rawReqs.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    : ["Fotokopi Kartu Tanda Penduduk (KTP)", "Fotokopi Kartu Keluarga (KK)", "Surat Pengantar RT/RW Setempat"];

  const categoryLabel = String(raw.category || (isContent ? "INFORMASI DESA" : "LAYANAN DESA")).replace(/_/g, " ").toUpperCase();
  const dateFormatted = raw.created_at
    ? new Date(String(raw.created_at)).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/layanan-desa" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Informasi Desa</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            {isContent ? "Informasi Publik Desa" : "Layanan Administrasi Desa"}
          </span>
        </div>
      </div>

      <div className="sentra-container space-y-6">
        {/* Main Info Card */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
              <NewsIcon className="h-3.5 w-3.5" /> {categoryLabel}
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
              {service.title}
            </h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
                {service.subtitle || service.meta?.join(", ") || "Pemerintah Desa Sentra"}
              </span>
              {dateFormatted && (
                <span className="text-slate-400">• Dipublikasikan: {dateFormatted}</span>
              )}
            </div>
          </div>

          {service.image && (
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-[14px] border border-white/80 shadow-xs">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          )}

          {!isContent && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Biaya Layanan</span>
                <strong className="text-xl font-black text-[#006e23] mt-1 block">
                  {cost > 0 ? formatCurrency(cost) : "Gratis / Rp 0"}
                </strong>
              </div>
              <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimasi Waktu</span>
                <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                  ⏱ {processingTime}
                </strong>
              </div>
              <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jam Layanan</span>
                <strong className="text-sm font-extrabold text-slate-800 mt-1 block">
                  🏢 {officeHours}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Requirements Checklist (Only for Administrative Services) */}
        {!isContent && (
          <div className="ambient-card rounded-[14px] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-extrabold text-[#171d18] border-b border-black/5 pb-3">
              Syarat & Berkas Administrasi Yang Dibutuhkan
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 text-xs font-bold text-slate-700 shadow-xs">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006e23]/10 text-[11px] font-black text-[#006e23]">
                    ✓
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Information & Action */}
        <div className="ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3">
            {isContent ? "Uraian Informasi Publik" : "Panduan & Prosedur Pelayanan"}
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: service.body || service.description || String(raw.process_steps || raw.content || "<p>Informasi resmi terkait layanan desa.</p>")
            }}
          />

          {/* Gallery if present */}
          {service.gallery && service.gallery.length > 0 && (
            <div className="pt-4 border-t border-black/5 space-y-3">
              <h3 className="text-sm font-bold text-slate-700">Dokumentasi & Galeri Foto</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {service.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-[14px] overflow-hidden border border-white/80 shadow-xs">
                    <img src={img} alt={`${service.title} ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-black/5 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Petugas%20Desa,%20saya%20ingin%20berkonsultasi%20mengenai%20${encodeURIComponent(service.title)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="ambient-btn-primary rounded-[14px] px-6 py-3.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition"
            >
              <PhoneIcon className="h-4 w-4" /> Konsultasi via WhatsApp Desa
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
