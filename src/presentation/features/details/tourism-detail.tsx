"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { formatCurrency } from "@/shared/utils/format";
import { MapPinIcon, TourismIcon, PhoneIcon } from "@/presentation/components/icons";

export function TourismDetail({ id }: { id: string }) {
  const [tourism, setTourism] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("tourisms", id)
      .then((item) => {
        if (active) {
          setTourism(item);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setTourism(null);
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat detail destinasi desa wisata...</p>
        </div>
      </div>
    );
  }

  if (!tourism) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <TourismIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Destinasi Wisata Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data wisata tidak tersedia atau telah diperbarui.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/desa-wisata">
              Kembali ke Desa Wisata
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = tourism.raw || {};
  const images = tourism.gallery?.length ? tourism.gallery : tourism.image ? [tourism.image] : ["/images/header-sentradesa-1.webp"];
  const ticketFee = Number(raw.fee ?? raw.ticket_price ?? tourism.price ?? 0);
  const operatingHours = String(raw.operating_hours || raw.jam_operasional || "08.00 - 17.00 WIB");
  const facilities = String(raw.facilities || "Area Parkir, Toilet Umum, Musholla, Gazebo, Spot Foto, Warung Makan").split(",");
  const phone = String(raw.phone || raw.contact_person || "6281234567890");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/desa-wisata" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Desa Wisata
          </Link>
          <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[11px] font-bold text-red-700 uppercase">
            {tourism.badge || "Wisata Alam"}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <ImageGalleryCarousel images={images} title={tourism.title} />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-800 uppercase">
                  <TourismIcon className="h-3.5 w-3.5" /> {tourism.badge || "Destinasi Wisata"}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {tourism.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-red-600 shrink-0" />
                  {tourism.subtitle || tourism.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-red-50/50 p-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Harga Tiket Masuk (HTM)</span>
                  <strong className="text-lg font-black text-red-700 mt-1 block">
                    {ticketFee > 0 ? formatCurrency(ticketFee) : "Gratis / Terbuka"}
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jam Operasional</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block leading-tight">
                    {operatingHours}
                  </strong>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Fasilitas Utama Destinasi</h3>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((fac, idx) => (
                    <span key={idx} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200/60">
                      ✓ {fac.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(tourism.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-red-700 transition"
                >
                  <MapPinIcon className="h-4 w-4" /> Petunjuk Arah Map
                </a>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengelola%20${encodeURIComponent(tourism.title)},%20saya%20ingin%20bertanya%20mengenai%20kunjungan%20wisata.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sentra-button-outline px-5 py-3 text-xs font-bold"
                >
                  <PhoneIcon className="h-4 w-4 mr-1 text-emerald-600" /> Hubungi Pengelola
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <TourismIcon className="h-5 w-5 text-red-600" />
            Informasi & Daya Tarik Wisata
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: tourism.body || tourism.description || "<p>Destinasi wisata desa ini menyuguhkan pemandangan indah, kearifan lokal, serta sarana rekreasi keluarga yang dikelola langsung oleh masyarakat desa.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
