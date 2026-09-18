"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { formatCurrency } from "@/shared/utils/format";
import { PotentialIcon, MapPinIcon, ChevronLeftIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">Memuat potensi desa & peluang investasi...</p>
        </div>
      </div>
    );
  }

  if (!potential) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <PotentialIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Potensi Desa Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data potensi desa tidak tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/potensi-desa">
              Kembali ke Potensi Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = potential.raw || {};
  const villageRaw = typeof raw.village === "object" && raw.village !== null ? (raw.village as Record<string, unknown>) : {};
  const villageId = String(villageRaw.id || raw.village_id || "");
  const images = potential.gallery?.length ? potential.gallery : potential.image ? [potential.image] : ["/images/header-sentradesa-1.webp"];
  const investmentNeeds = String(raw.investment_needs || "");
  const developmentStatus = String(raw.development_status || "");
  const isInvestmentReady = raw.is_investment_ready === true || raw.is_investment_ready === 1 || developmentStatus.toLowerCase().includes("ready") || developmentStatus.toLowerCase().includes("produktif");
  const areaSize = String(raw.total_area || raw.area_size || "45");
  const productionVol = String(raw.production_volume || raw.volume_produksi || "-");
  const econValue = Number(raw.economic_value ?? 0);
  const phone = String(raw.phone || villageRaw.phone || "6281234567890");

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/potensi-desa" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Potensi Desa</span>
          </Link>
          <div className="flex items-center gap-2">
            {developmentStatus ? (
              <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-1 text-[11px] font-extrabold uppercase text-slate-700">
                {developmentStatus}
              </span>
            ) : null}
            <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
              {isInvestmentReady ? "Siap Kemitraan Investasi" : "Dalam Pembinaan"}
            </span>
          </div>
        </div>
      </div>

      <div className="sentra-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="overflow-hidden rounded-[14px] border border-white/85 bg-white/70 shadow-xs">
              <ImageGalleryCarousel images={images} title={potential.title} />
            </div>

            <div className={`p-4 rounded-[14px] border ${isInvestmentReady ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'} flex items-start gap-3 shadow-xs`}>
              <span className={`p-2 rounded-[10px] ${isInvestmentReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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

            {investmentNeeds ? (
              <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs">
                <span className="block text-[11px] font-black uppercase tracking-wider text-[#006e23]">
                  Kebutuhan Investasi Teridentifikasi
                </span>
                <p className="mt-1.5 text-xs md:text-sm font-semibold text-slate-800 leading-relaxed">
                  {investmentNeeds}
                </p>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="ambient-card rounded-[14px] p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
                  <PotentialIcon className="h-3.5 w-3.5" /> {potential.badge || "Komoditas Unggulan"}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
                  {potential.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
                  {potential.subtitle || potential.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Luas Wilayah Potensi</span>
                  <strong className="text-sm font-black text-slate-800 mt-1 block">
                    {areaSize} Ha
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Volume Produksi</span>
                  <strong className="text-sm font-black text-slate-800 mt-1 block">
                    {productionVol !== "-" ? `${productionVol} ton/th` : "-"}
                  </strong>
                </div>
                <div className="col-span-2 rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimasi Nilai Ekonomi</span>
                  <strong className="text-base font-black text-[#006e23] mt-1 block">
                    {econValue > 0 ? `${formatCurrency(econValue)} / tahun` : "Tersedia Kemitraan"}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pemerintah%20Desa,%20saya%20tertarik%20mengajukan%20kemitraan/investasi%20untuk%20${encodeURIComponent(potential.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 ambient-btn-primary rounded-[14px] px-6 py-3.5 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition"
                >
                  🤝 Ajukan Kemitraan Investasi
                </a>
                {villageId ? (
                  <Link
                    href={`/profil-desa/?id=${encodeURIComponent(villageId)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-slate-300 bg-white/80 hover:bg-white px-5 py-3.5 text-xs font-bold text-slate-700 transition"
                  >
                    Profil Desa
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3 flex items-center gap-2">
            <PotentialIcon className="h-5 w-5 text-[#006e23]" />
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
