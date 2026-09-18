"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CatalogItem, CatalogKind } from "@/domain/entities/common";
import { getCatalog } from "@/application/use-cases/get-public-content";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { EmptyState } from "@/presentation/components/catalog-section";
import { FilterForm } from "@/presentation/components/filter-form";


type KindMeta = {
  iconPath: string;
  gradient: string;
  badge: string;
  stats: { label: string; value: string }[];
};

const KIND_META: Partial<Record<CatalogKind, KindMeta>> = {
  villages:  { iconPath: "/icons/services/profil-desa.svg",   gradient: "from-[#006e23] via-[#1a8a3a] to-[#e88d43]/60", badge: "bg-emerald-100 text-emerald-800 border-emerald-200",  stats: [{ label: "Desa Terdaftar", value: "74.961+" }, { label: "Provinsi", value: "38" }, { label: "Akses Terbuka", value: "24/7" }] },
  products:  { iconPath: "/icons/services/sentra-produk.svg", gradient: "from-[#16a34a] via-emerald-700 to-teal-500/60", badge: "bg-emerald-100 text-emerald-800 border-emerald-200",  stats: [{ label: "Produk UMKM", value: "12.000+" }, { label: "Kategori", value: "45+" }, { label: "Merchant Aktif", value: "3.200+" }] },
  tourisms:  { iconPath: "/icons/services/desa-wisata.svg",   gradient: "from-[#0d9488] via-teal-600 to-cyan-400/60",   badge: "bg-teal-100 text-teal-800 border-teal-200",         stats: [{ label: "Destinasi Wisata", value: "5.800+" }, { label: "Kategori", value: "4" }, { label: "Siap Dikunjungi", value: "✓" }] },
  bumdes:    { iconPath: "/icons/services/bumdes.svg",        gradient: "from-[#e5243b] via-rose-600 to-orange-400/60", badge: "bg-rose-100 text-rose-800 border-rose-200",         stats: [{ label: "BUMDes Aktif", value: "57.000+" }, { label: "Unit Usaha", value: "100K+" }, { label: "Kinerja Maju", value: "42%" }] },
  exports:   { iconPath: "/icons/services/desa-ekspor.svg",   gradient: "from-[#7c3aed] via-violet-700 to-sky-500/60",  badge: "bg-violet-100 text-violet-900 border-violet-200",  stats: [{ label: "Komoditas Ekspor", value: "2.400+" }, { label: "Negara Tujuan", value: "32" }, { label: "Bersertifikat", value: "✓" }] },
  potentials:{ iconPath: "/icons/services/potensi-desa.svg",  gradient: "from-[#dda63a] via-amber-600 to-yellow-400/60",badge: "bg-amber-100 text-amber-800 border-amber-200",      stats: [{ label: "Potensi Terdata", value: "18.000+" }, { label: "Siap Investasi", value: "6.500+" }, { label: "Sektor", value: "12" }] },
  lkdd:      { iconPath: "/icons/services/lkdd.svg",          gradient: "from-[#a21942] via-pink-700 to-rose-400/60",  badge: "bg-pink-100 text-pink-900 border-pink-200",        stats: [{ label: "Laporan Publik", value: "32.000+" }, { label: "Transparan", value: "100%" }, { label: "Diperbarui", value: "Rutin" }] },
  kdmp:      { iconPath: "/icons/services/kdmp.svg",          gradient: "from-[#ea580c] via-orange-600 to-rose-400/60",badge: "bg-orange-100 text-orange-900 border-orange-200",   stats: [{ label: "Kawasan KDMP", value: "420+" }, { label: "Desa Anggota", value: "2.100+" }, { label: "Sektor Pangan", value: "8" }] },
  services:  { iconPath: "/icons/services/informasi-desa.svg",gradient: "from-[#0284c7] via-blue-600 to-sky-400/60",   badge: "bg-sky-100 text-sky-800 border-sky-200",           stats: [{ label: "Layanan Publik", value: "8.000+" }, { label: "Gratis", value: "Mayoritas" }, { label: "Online & Offline", value: "✓" }] },
  articles:  { iconPath: "/icons/services/artikel.svg",       gradient: "from-[#4c9f38] via-lime-600 to-teal-400/60",  badge: "bg-lime-100 text-lime-800 border-lime-200",        stats: [{ label: "Artikel Terbit", value: "24.000+" }, { label: "Desa Pelapor", value: "12.000+" }, { label: "Update", value: "Harian" }] },
  wishlists: { iconPath: "/icons/services/wishlist.svg",      gradient: "from-[#dd1367] via-pink-600 to-fuchsia-400/60",badge: "bg-pink-100 text-pink-800 border-pink-200",        stats: [{ label: "Aspirasi Warga", value: "9.400+" }, { label: "Terealisasi", value: "28%" }, { label: "Diproses", value: "Aktif" }] },
};

// Detail page components (used when ?id= param present)
import { ProfileDesaDetail } from "@/presentation/features/details/profile-desa-detail";
import { ProductDetail } from "@/presentation/features/details/product-detail";
import { TourismDetail } from "@/presentation/features/details/tourism-detail";
import { BumdesDetail } from "@/presentation/features/details/bumdes-detail";
import { LkddDetail } from "@/presentation/features/details/lkdd-detail";
import { PotentialDetail } from "@/presentation/features/details/potential-detail";
import { ExportDetail } from "@/presentation/features/details/export-detail";
import { ServiceDetail } from "@/presentation/features/details/service-detail";
import { KdmpDetail } from "@/presentation/features/details/kdmp-detail";
import { ArtikelDetail } from "@/presentation/features/details/artikel-detail";
import { WishlistDetail } from "@/presentation/features/details/wishlist-detail";

type Props = {
  kind: CatalogKind;
  title: string;
  description: string;
  categories?: string[];
  initialItems?: CatalogItem[];
};

export function CatalogPage(props: Props) {
  return (
    <Suspense fallback={<CatalogSkeleton title={props.title} description={props.description} />}>
      <CatalogPageContent {...props} />
    </Suspense>
  );
}

function CatalogPageContent({ kind, title, description, categories, initialItems }: Props) {
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const villageId = searchParams.get("village_id");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const provinceId = searchParams.get("province_id");
  const regencyId = searchParams.get("regency_id");
  const districtId = searchParams.get("district_id");
  const isFeatured = searchParams.get("is_featured");

  const [items, setItems] = useState<CatalogItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems || initialItems.length === 0);

  useEffect(() => {
    if (detailId) return;

    let isMounted = true;
    setLoading(true);

    const query = {
      village_id: villageId || undefined,
      category: category || undefined,
      search: search || undefined,
      province_id: provinceId || undefined,
      regency_id: regencyId || undefined,
      district_id: districtId || undefined,
      is_featured: isFeatured || undefined
    };

    getCatalog(kind, query)
      .then((res) => {
        if (isMounted) {
          setItems(res || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [kind, detailId, villageId, category, search, provinceId, regencyId, districtId, isFeatured]);

  if (detailId) {
    switch (kind) {
      case "villages":
        return <ProfileDesaDetail id={detailId} />;
      case "products":
        return <ProductDetail id={detailId} />;
      case "tourisms":
        return <TourismDetail id={detailId} />;
      case "bumdes":
        return <BumdesDetail id={detailId} />;
      case "lkdd":
        return <LkddDetail id={detailId} />;
      case "potentials":
        return <PotentialDetail id={detailId} />;
      case "exports":
        return <ExportDetail id={detailId} />;
      case "services":
        return <ServiceDetail id={detailId} />;
      case "kdmp":
        return <KdmpDetail id={detailId} />;
      case "articles":
        return <ArtikelDetail id={detailId} />;
      case "wishlists":
        return <WishlistDetail id={detailId} />;
    }
  }

  const clearHref = `/${kind === "products" ? "sentra-produk" : kind === "tourisms" ? "desa-wisata" : kind === "potentials" ? "potensi-desa" : kind === "villages" ? "profil-desa" : kind === "services" ? "layanan-desa" : kind}`;

  const meta = KIND_META[kind];

  return (
    <>
      <section className="pt-28 md:pt-32 pb-4 sm:pb-6">
        <div className="sentra-container">
          {/* Hero header card with gradient + icon + stats */}
          <div className="relative overflow-hidden rounded-[14px] shadow-lg">
            {/* Gradient background layer */}
            <div className={`absolute inset-0 bg-gradient-to-br ${meta?.gradient ?? "from-[#006e23] to-[#e88d43]/60"} opacity-90`} />
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-black/20 blur-3xl" />
            <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-white/5" />
            {/* Big faint icon watermark */}
            {meta?.iconPath && (
              <div className="pointer-events-none absolute -right-4 -bottom-6 opacity-10">
                <Image src={meta.iconPath} alt="" width={208} height={208} className="h-52 w-52 object-contain brightness-0 invert" unoptimized />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  {/* Icon badge — same rounded square as dashboard */}
                  {meta?.iconPath && (
                    <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-white/20 backdrop-blur-sm border border-white/25 shadow-md">
                      <Image src={meta.iconPath} alt="" width={36} height={36} className="h-9 w-9 object-contain" unoptimized />
                    </div>
                  )}
                  <div>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest bg-white/90 ${meta?.badge ?? "text-[#006e23] border-emerald-200"}`}>
                      Sentra Desa
                    </span>
                    <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                      {title}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm sm:text-base leading-relaxed text-white/80">
                      {description}
                    </p>
                  </div>
                </div>

                {villageId ? (
                  <div className="flex items-center gap-2 rounded-[14px] border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs">
                    <span>Filter Desa: {villageId}</span>
                    <Link href={clearHref} className="ml-1 underline hover:text-white/70">
                      Tampilkan Semua
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* Quick-stat pills */}
              {meta?.stats && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {meta.stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5">
                      <strong className="text-sm font-extrabold text-white">{s.value}</strong>
                      <span className="text-xs text-white/75 font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-2">
        <div className="sentra-container">
          <FilterForm categories={categories} />
          {loading ? (
            <div className="py-16 text-center text-sm font-bold text-slate-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#006e23] border-r-transparent align-[-0.125em]" />
              <p className="mt-3">Memuat data...</p>
            </div>
          ) : items.length ? (
            <div className="product-grid">
              {items.map((item) => (
                <CatalogCard key={`${kind}-${item.id}-${item.slug}`} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

function CatalogSkeleton({ title, description }: { title: string; description: string }) {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-4 sm:pb-6">
        <div className="sentra-container">
          <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-[#006e23] via-[#1a8a3a] to-[#e88d43]/60 p-6 sm:p-8 shadow-lg">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white/90 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">
              Sentra Desa
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
              {description}
            </p>
          </div>
        </div>
      </section>
      <section className="pb-16 pt-2">
        <div className="sentra-container">
          <div className="py-16 text-center text-sm font-bold text-slate-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#006e23] border-r-transparent align-[-0.125em]" />
            <p className="mt-3">Memuat data...</p>
          </div>
        </div>
      </section>
    </>
  );
}
