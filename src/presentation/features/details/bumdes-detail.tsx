"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { formatCurrency } from "@/shared/utils/format";
import { BumdesIcon, PhoneIcon, MapPinIcon, StoreIcon, ChevronLeftIcon } from "@/presentation/components/icons";

export function BumdesDetail({ id }: { id: string }) {
  const [bumdes, setBumdes] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("bumdes", id)
      .then(async (item) => {
        if (!active) return;
        setBumdes(item);
        setLoading(false);
        if (item) {
          const villageId = String(item.raw?.village_id || "");
          const prods = await getCatalog("products", villageId ? { village_id: villageId } : undefined);
          if (active) setProducts(prods.slice(0, 4));
        }
      })
      .catch(() => {
        if (active) {
          setBumdes(null);
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
          <p className="text-xs font-bold text-slate-600">Memuat profil BUMDes...</p>
        </div>
      </div>
    );
  }

  if (!bumdes) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <BumdesIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">BUMDes Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data BUMDes tidak tersedia atau telah diperbarui.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/bumdes">
              Kembali ke Daftar BUMDes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = bumdes.raw || {};
  const images = bumdes.gallery?.length ? bumdes.gallery : bumdes.image ? [bumdes.image] : ["/images/header-sentradesa-1.webp"];
  const directorName = String(raw.director_name || raw.direktur || "Direktur BUMDes");
  const performance = String(raw.performance_category || raw.kategori_kinerja || "Berkembang");
  const legalNumber = raw.legal_number ? String(raw.legal_number) : "Terdaftar Resmi Kemenkumham";
  
  const businessUnitsList: string[] = Array.isArray(raw.business_units)
    ? raw.business_units.map(String)
    : typeof raw.business_units === "string" && raw.business_units
    ? String(raw.business_units).split(",")
    : [];

  const revenue = Number(raw.annual_revenue ?? raw.annual_turnover ?? 0);
  const initialCapital = Number(raw.initial_capital ?? 0);
  const phone = String(raw.phone || raw.kontak || "6281234567890");

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/bumdes" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke BUMDes</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            Kinerja: {performance}
          </span>
        </div>
      </div>

      <div className="sentra-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[14px] border border-white/85 bg-white/70 shadow-xs">
              <ImageGalleryCarousel images={images} title={bumdes.title} />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="ambient-card rounded-[14px] p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
                  <BumdesIcon className="h-3.5 w-3.5" /> BUMDes Resmi
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
                  {bumdes.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPinIcon className="h-4 w-4 text-[#006e23] shrink-0" />
                  {bumdes.subtitle || bumdes.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Direktur Utama</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={directorName}>
                    👤 {directorName}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Legalitas AHU / SK</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={legalNumber}>
                    📜 {legalNumber}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Modal Awal</span>
                  <strong className="text-xs font-black text-slate-900 mt-1 block truncate">
                    💰 {initialCapital > 0 ? formatCurrency(initialCapital) : "Penyertaan Desa"}
                  </strong>
                </div>
                <div className="rounded-[14px] border border-white/80 bg-white/70 backdrop-blur-xs p-3.5 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Omset Tahunan</span>
                  <strong className="text-xs font-black text-[#006e23] mt-1 block truncate">
                    📈 {revenue > 0 ? formatCurrency(revenue) : "Aktif Beroperasi"}
                  </strong>
                </div>
              </div>

              {businessUnitsList.length > 0 ? (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">Unit Usaha Aktif</h3>
                  <div className="flex flex-wrap gap-2">
                    {businessUnitsList.map((unit, idx) => (
                      <span key={idx} className="rounded-[10px] bg-[#006e23]/10 px-3 py-1.5 text-xs font-bold text-[#006e23] border border-[#006e23]/20">
                        ✓ {unit.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengurus%20${encodeURIComponent(bumdes.title)},%20saya%20tertarik%20dengan%20layanan/produk%20BUMDes.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 ambient-btn-primary rounded-[14px] px-6 py-3.5 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <PhoneIcon className="h-4 w-4" /> Hubungi Pengurus BUMDes
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 ambient-card rounded-[14px] p-6 md:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-extrabold text-[#171d18] border-b border-black/5 pb-3 flex items-center gap-2">
            <BumdesIcon className="h-5 w-5 text-[#006e23]" />
            Profil & Kinerja BUMDes
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: bumdes.body || bumdes.description || "<p>BUMDes ini bergerak aktif dalam pengelolaan unit usaha perdesaan, perdagangan komoditas lokal, dan penguatan kemandirian ekonomi desa.</p>"
            }}
          />
        </div>

        {products.length > 0 ? (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-[#171d18] flex items-center gap-2">
                <StoreIcon className="h-5 w-5 text-[#006e23]" /> Produk & Komoditas BUMDes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
