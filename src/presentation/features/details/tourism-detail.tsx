"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { formatCurrency } from "@/shared/utils/format";
import { MapPinIcon, TourismIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon } from "@/presentation/components/icons";
import { DetailSkeleton } from "@/presentation/components/skeleton";

export function TourismDetail({ id }: { id: string }) {
  const [tourism, setTourism] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("tourisms", id)
      .then((item) => {
        if (active) { setTourism(item); setLoading(false); }
      })
      .catch(() => {
        if (active) { setTourism(null); setLoading(false); }
      });
    return () => { active = false; };
  }, [id]);

  const images = useMemo(() => {
    if (!tourism) return ["/images/header-sentradesa-1.webp"];
    return tourism.gallery?.length ? tourism.gallery : tourism.image ? [tourism.image] : ["/images/header-sentradesa-1.webp"];
  }, [tourism]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  if (loading) {
    return <DetailSkeleton backLabel="Kembali ke Desa Wisata" />;
  }

  if (!tourism) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <TourismIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Destinasi Wisata Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data wisata desa ini belum tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/desa-wisata">
              Kembali ke Desa Wisata
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = tourism.raw || {};
  const ticketFee = Number(raw.entrance_fee ?? raw.fee ?? raw.ticket_price ?? tourism.price ?? 0);
  const operatingHours = String(raw.opening_hours || raw.operating_hours || raw.jam_operasional || "08.00 - 17.00 WIB");
  const facilities = String(raw.facilities || "Area Parkir, Toilet Umum, Musholla, Gazebo, Spot Foto, Warung Makan").split(",");
  const phone = String(raw.phone || raw.contact_person || "6281234567890");

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <div className="h-[92px] md:h-[98px]" />

      {/* Hero Section Full Edge-to-Edge */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white pt-8 pb-16 md:pt-10 md:pb-22">
        {images.map((imgUrl, idx) => (
          <div
            key={`${imgUrl}-${idx}`}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            <Image src={imgUrl} alt={`${tourism.title} - ${idx + 1}`} fill priority={idx === 0} className="object-cover object-center" unoptimized />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/35 z-[1]" />

        {images.length > 1 && (
          <>
            <button type="button" onClick={() => setCurrentSlide((p) => (p - 1 + images.length) % images.length)} aria-label="Foto sebelumnya" className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => setCurrentSlide((p) => (p + 1) % images.length)} aria-label="Foto berikutnya" className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="sentra-container relative z-10">
          <div className="mb-6 md:mb-8">
            <Link href="/desa-wisata" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-bold text-white transition shadow-sm active:scale-95 cursor-pointer">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Kembali ke Desa Wisata</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-red-700 shadow-md mb-3">
                <TourismIcon className="h-3.5 w-3.5" /> Destinasi Wisata Desa
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {tourism.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <MapPinIcon className="h-4.5 w-4.5 text-red-400 shrink-0" />
                {tourism.subtitle || tourism.meta?.join(", ") || "Indonesia"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(tourism.title)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[14px] ambient-btn-primary px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer">
                <MapPinIcon className="h-4 w-4" /> Petunjuk Arah Map
              </a>
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengelola%20${encodeURIComponent(tourism.title)},%20saya%20ingin%20bertanya%20mengenai%20kunjungan%20wisata.`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[14px] border border-white/85 bg-white/95 backdrop-blur-md px-5 py-3 text-xs sm:text-sm font-bold text-slate-900 shadow-md hover:bg-white transition active:scale-95 cursor-pointer">
                <PhoneIcon className="h-4 w-4 text-[#006e23]" /> Hubungi Pengelola
              </a>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrentSlide(i)} aria-label={`Foto ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === i ? "w-6 bg-white shadow-md ring-2 ring-white/60" : "w-2 bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Card */}
      <section className="sentra-container -mt-7 sm:-mt-9 relative z-20 mb-8">
        <div className="ambient-card rounded-[14px] grid grid-cols-2 gap-3.5 sm:gap-4 p-5 sm:p-6 shadow-md border border-white/85">
          <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 text-center shadow-xs">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Harga Tiket (HTM)</span>
            <strong className="block mt-1.5 text-sm sm:text-base font-extrabold text-[#006e23]">
              {ticketFee > 0 ? formatCurrency(ticketFee) : "Gratis / Terbuka"}
            </strong>
          </div>
          <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-4 text-center shadow-xs">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Jam Operasional</span>
            <strong className="block mt-1.5 text-xs sm:text-sm font-extrabold text-[#171d18] leading-tight">{operatingHours}</strong>
          </div>
        </div>
      </section>

      <div className="sentra-container">
        {/* Fasilitas */}
        <div className="mt-2 rounded-[14px] ambient-card p-6 md:p-8 shadow-md border border-white/85 space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3 flex items-center gap-2.5">
            <TourismIcon className="h-5 w-5 text-[#006e23]" /> Fasilitas Utama Destinasi
          </h2>
          <div className="flex flex-wrap gap-2">
            {facilities.map((fac, idx) => (
              <span key={idx} className="rounded-[10px] bg-[#006e23]/10 px-3 py-1.5 text-xs font-bold text-[#006e23] border border-[#006e23]/20">✓ {fac.trim()}</span>
            ))}
          </div>
        </div>

        {/* Informasi */}
        <div className="mt-6 rounded-[14px] ambient-card p-6 md:p-8 shadow-md border border-white/85 space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3 flex items-center gap-2.5">
            <TourismIcon className="h-5 w-5 text-[#006e23]" /> Informasi & Daya Tarik Wisata
          </h2>
          <div className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{ __html: tourism.body || tourism.description || "<p>Destinasi wisata desa ini menyuguhkan pemandangan indah, kearifan lokal, serta sarana rekreasi keluarga yang dikelola langsung oleh masyarakat desa.</p>" }}
          />
        </div>
      </div>
    </div>
  );
}
