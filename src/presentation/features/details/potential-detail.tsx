"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { formatCurrency } from "@/shared/utils/format";
import { PotentialIcon, MapPinIcon, PhoneIcon } from "@/presentation/components/icons";

export function PotentialDetail({ id }: { id: string }) {
  const [potential, setPotential] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("potentials", id)
      .then((item) => {
        if (active) {
          setPotential(item);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setPotential(null);
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat potensi desa & peluang investasi...</p>
        </div>
      </div>
    );
  }

  if (!potential) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <PotentialIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Potensi Desa Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data potensi desa tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/potensi-desa">
              Kembali ke Potensi Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = potential.raw || {};
  const images = potential.gallery?.length ? potential.gallery : potential.image ? [potential.image] : ["/images/header-sentradesa-1.webp"];
  const isInvestmentReady = raw.is_investment_ready === true || raw.is_investment_ready === 1 || String(raw.development_status).toLowerCase().includes("ready");
  const areaSize = String(raw.area_size || raw.total_area || "45");
  const productionVol = String(raw.production_volume || raw.volume_produksi || "250");
  const econValue = Number(raw.economic_value ?? 450000000);
  const phone = String(raw.phone || raw.contact_person || "6281234567890");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/potensi-desa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-orange-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Potensi Desa
          </Link>
          <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase border ${isInvestmentReady ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
            {isInvestmentReady ? "Siap Kemitraan Investasi" : "Dalam Pembinaan"}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <ImageGalleryCarousel images={images} title={potential.title} />
            </div>

            <div className={`p-4 rounded-2xl border ${isInvestmentReady ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'} flex items-start gap-3 shadow-2xs`}>
              <span className={`p-2 rounded-xl ${isInvestmentReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <PotentialIcon className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm">{isInvestmentReady ? "Siap Kerjasama Kemitraan Investasi" : "Pengembangan Sektor Potensial"}</h4>
                <p className="mt-1 text-xs opacity-90 leading-relaxed">
                  {isInvestmentReady 
                    ? "Potensi desa ini telah terverifikasi resmi dan siap menerima permohonan kerjasama investasi lokal & nasional." 
                    : "Potensi sektor desa sedang dalam pembinaan dan perancangan intensif."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-900 uppercase">
                  <PotentialIcon className="h-3.5 w-3.5" /> {potential.badge || "Komoditas Unggulan"}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {potential.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-orange-600 shrink-0" />
                  {potential.subtitle || potential.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Luas Wilayah Potensi</span>
                  <strong className="text-sm font-black text-slate-800 mt-1 block">
                    {areaSize} Ha
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Volume Produksi</span>
                  <strong className="text-sm font-black text-slate-800 mt-1 block">
                    {productionVol} ton / tahun
                  </strong>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-200 bg-emerald-50/50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimasi Nilai Ekonomi</span>
                  <strong className="text-base font-black text-emerald-800 mt-1 block">
                    {econValue > 0 ? `${formatCurrency(econValue)} / tahun` : "Tersedia Kemitraan"}
                  </strong>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pemerintah%20Desa,%20saya%20tertarik%20mengajukan%20kemitraan/investasi%20untuk%20${encodeURIComponent(potential.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-orange-700 transition"
                >
                  🤝 Ajukan Kemitraan Investasi
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PotentialIcon className="h-5 w-5 text-orange-600" />
            Deskripsi & Rincian Peluang Sektor
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: potential.body || potential.description || "<p>Potensi desa ini menawarkan nilai tambah ekonomi tinggi serta peluang kerjasama pemanfaatan lahan & hasil bumi secara berkelanjutan.</p>"
            }}
          />
        </div>
      </div>
    </div>
  );
}
