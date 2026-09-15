"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { formatCurrency } from "@/shared/utils/format";
import { BumdesIcon, PhoneIcon, MapPinIcon, StoreIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-800 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat profil BUMDes...</p>
        </div>
      </div>
    );
  }

  if (!bumdes) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <BumdesIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">BUMDes Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data BUMDes tidak tersedia atau telah diperbarui.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/bumdes">
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
  const businessType = String(raw.business_type || raw.jenis_usaha || "Perdagangan & Jasa Desa");
  const performance = String(raw.performance_category || raw.kategori_kinerja || "Maju");
  const unitCount = String(raw.unit_count || raw.jumlah_unit || "3");
  const turnover = Number(raw.annual_turnover ?? raw.omset ?? 150000000);
  const phone = String(raw.phone || raw.kontak || "6281234567890");

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/bumdes" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke BUMDes
          </Link>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase">
            Kinerja: {performance}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <ImageGalleryCarousel images={images} title={bumdes.title} />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 uppercase">
                  <BumdesIcon className="h-3.5 w-3.5" /> BUMDes Resmi
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {bumdes.title}
                </h1>
                <p className="mt-2 text-xs md:text-sm text-slate-500 flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4 text-amber-800 shrink-0" />
                  {bumdes.subtitle || bumdes.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-amber-50/40 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Direktur Utama</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={directorName}>
                    {directorName}
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jenis Usaha Utama</span>
                  <strong className="text-xs font-extrabold text-slate-800 mt-1 block truncate" title={businessType}>
                    {businessType}
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Jumlah Unit Usaha</span>
                  <strong className="text-sm font-black text-slate-900 mt-1 block">
                    {unitCount} Unit Usaha
                  </strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-3.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Omset Tahunan</span>
                  <strong className="text-xs font-black text-emerald-700 mt-1 block truncate">
                    {turnover > 0 ? formatCurrency(turnover) : "Terdaftar"}
                  </strong>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20Pengurus%20${encodeURIComponent(bumdes.title)},%20saya%20tertarik%20dengan%20layanan/produk%20BUMDes.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-amber-950 transition"
                >
                  <PhoneIcon className="h-4 w-4" /> Hubungi Pengurus BUMDes
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BumdesIcon className="h-5 w-5 text-amber-800" />
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
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <StoreIcon className="h-5 w-5 text-emerald-700" /> Produk & Komoditas BUMDes
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
