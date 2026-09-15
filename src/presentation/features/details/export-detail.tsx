"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { GlobeIcon, MapPinIcon, PhoneIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-900 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat komoditas desa ekspor...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <GlobeIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Komoditas Ekspor Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data komoditas desa ekspor tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/desa-ekspor">
              Kembali ke Desa Ekspor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = item.raw || {};
  const images = item.gallery?.length ? item.gallery : item.image ? [item.image] : ["/images/header-sentradesa-1.webp"];
  const country = String(raw.destination_country || raw.negara_tujuan || "Jepang, Malaysia, Singapura & UEA");
  const volume = String(raw.export_volume || raw.volume_ekspor || "50 Ton / Bulan");
  const certs = String(raw.certification || raw.sertifikasi || "Sertifikat Halal MUI, Organik Indonesia, HACCP, ISO 22000").split(",");
  const moq = String(raw.min_order || raw.moq || "1 Ton");
  const phone = String(raw.phone || "6281234567890");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/desa-ekspor" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Desa Ekspor
          </Link>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[11px] font-extrabold text-indigo-900 uppercase">
            Standar Mutu Ekspor
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <ImageGalleryCarousel images={images} title={item.title} />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-950 uppercase">
                  <GlobeIcon className="h-3.5 w-3.5" /> Komoditas Ekspor Desa
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {item.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-indigo-800 shrink-0" />
                  {item.subtitle || item.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-indigo-50/40 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Negara Tujuan Ekspor</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block leading-tight">
                    🌐 {country}
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kapasitas Produksi</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                    {volume}
                  </strong>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Minimum Pemesanan (MOQ)</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block">
                    {moq}
                  </strong>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Sertifikasi & Mutu Interasional</h3>
                <div className="flex flex-wrap gap-2">
                  {certs.map((c, idx) => (
                    <span key={idx} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      🏅 {c.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20tertarik%20mengajukan%20penawaran/inquiry%20ekspor%20untuk%20${encodeURIComponent(item.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-900 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-indigo-950 transition"
                >
                  🌐 Permohonan Penawaran / Export Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-indigo-900" />
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
