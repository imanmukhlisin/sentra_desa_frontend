"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { GlobeIcon, MapPinIcon, PhoneIcon, ChevronLeftIcon } from "@/presentation/components/icons";

export function ExportDetail({ id }: { id: string }) {
  const [item, setItem] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("exports", id)
      .then((data) => {
        if (active) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setItem(null);
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
          <p className="text-xs font-bold text-slate-600">Memuat komoditas desa ekspor...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <GlobeIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Komoditas Ekspor Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data komoditas desa ekspor tidak tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/desa-ekspor">
              Kembali ke Desa Ekspor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = item.raw || {};
  const images = item.gallery?.length ? item.gallery : item.image ? [item.image] : ["/images/header-sentradesa-1.webp"];
  
  const destArray = Array.isArray(raw.destination_countries)
    ? raw.destination_countries.map(String)
    : raw.destination_country
    ? [String(raw.destination_country)]
    : ["Jepang", "Malaysia", "Singapura"];
  const country = destArray.join(", ");
  
  const hsCode = raw.hs_code ? String(raw.hs_code) : null;
  const exportStatus = raw.export_status ? String(raw.export_status).replace(/_/g, " ").toUpperCase() : "SIAP EKSPOR";
  const volume = raw.export_volume ? `${raw.export_volume} ${raw.unit || "Ton / Periode"}` : "50 Ton / Bulan";
  
  const certs: string[] = Array.isArray(raw.certifications)
    ? raw.certifications.map(String)
    : typeof raw.certification === "string" && raw.certification
    ? String(raw.certification).split(",")
    : ["Sertifikat Organik", "Halal MUI", "HACCP"];

  const contactPerson = String(raw.contact_person || "Pengurus Koperasi / PIC Ekspor");
  const phone = String(raw.contact_phone || raw.phone || "6281234567890");
  const email = raw.contact_email ? String(raw.contact_email) : null;

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/desa-ekspor" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Desa Ekspor</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            {exportStatus}
          </span>
        </div>
      </div>

      <div className="sentra-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[14px] border border-white/85 bg-white/70 shadow-xs">
              <ImageGalleryCarousel images={images} title={item.title} />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="ambient-card rounded-[14px] p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
                  <GlobeIcon className="h-3.5 w-3.5" /> Komoditas Ekspor Desa
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
                  {item.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
                  {item.subtitle || item.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Klasifikasi HS Code</span>
                  <strong className="text-xs font-black text-[#171d18] mt-1 block">
                    📋 {hsCode ? `HS ${hsCode}` : "Tersertifikasi"}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kapasitas Produksi</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate">
                    📦 {volume}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Negara Tujuan Ekspor</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block leading-tight truncate" title={country}>
                    🌐 {country}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kontak Koperasi / PIC</span>
                  <strong className="text-xs font-black text-[#006e23] mt-1 block truncate" title={contactPerson}>
                    👤 {contactPerson}
                  </strong>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">Sertifikasi & Standar Mutu</h3>
                <div className="flex flex-wrap gap-2">
                  {certs.map((c, idx) => (
                    <span key={idx} className="rounded-[10px] bg-[#006e23]/10 px-3 py-1.5 text-xs font-bold text-[#006e23] border border-[#006e23]/20">
                      🏅 {c.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(contactPerson)},%20saya%20tertarik%20mengajukan%20inquiry%20ekspor%20untuk%20komoditas%20${encodeURIComponent(item.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 ambient-btn-primary rounded-[14px] px-5 py-3.5 text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  <PhoneIcon className="h-4 w-4" /> Hubungi Kontak Koperasi ({contactPerson})
                </a>
                {email ? (
                  <a
                    href={`mailto:${email}?subject=Inquiry%20Ekspor%20${encodeURIComponent(item.title)}`}
                    className="rounded-[14px] border border-slate-300 bg-white/80 hover:bg-white px-4 py-3 text-xs font-bold text-slate-700 transition"
                  >
                    ✉ Email Koperasi
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3 flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-[#006e23]" />
            Spesifikasi Produk & Standar Ekspor
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: item.body || item.description || "<p>Produk desa ini telah memenuhi standar kualitas ekspor komoditas internasional dengan jaminan mutu dan pengemasan steril.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
