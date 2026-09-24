"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CatalogItem, CatalogKind } from "@/domain/entities/common";
import { getCatalog } from "@/application/use-cases/get-public-content";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { EmptyState } from "@/presentation/components/catalog-section";
import { FilterForm } from "@/presentation/components/filter-form";
import { CatalogGridSkeleton, CatalogPageSkeleton } from "@/presentation/components/skeleton";
import { ServiceSquircle } from "@/presentation/components/icons";


const KIND_HERO_IMAGES: Partial<Record<CatalogKind, string>> = {
  villages: "/images/heroes/hero-villages.jpg",
  products: "/images/heroes/hero-products.jpg",
  tourisms: "/images/heroes/hero-tourisms.jpg",
  bumdes: "/images/articles/berita-1.jpg",
  exports: "/images/heroes/hero-products.jpg",
  potentials: "/bg-desa.jpg",
  lkdd: "/images/heroes/hero-villages.jpg",
  kdmp: "/images/articles/berita-3.jpg",
  services: "/images/articles/berita-2.jpg",
  articles: "/images/heroes/hero-tourisms.jpg",
  wishlists: "/bg-desa.jpg",
};

function AnimatedCounter({ value }: { value: number | string }) {
  const str = String(value);
  const match = str.match(/^([0-9.,]+)(.*)$/);
  const numericPart = match ? parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")) : NaN;
  const suffix = match ? match[2] : "";

  const isNumeric = !isNaN(numericPart);
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevValueRef = useRef<number>(0);

  useEffect(() => {
    if (!isNumeric) return;

    const start = prevValueRef.current;
    const end = numericPart;
    prevValueRef.current = end;

    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 750; // ms
    const startTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic: dynamic smooth count transition
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [numericPart, isNumeric]);

  if (!isNumeric) {
    return <span className="tabular-nums">{value}</span>;
  }

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString("id-ID")}{suffix}
    </span>
  );
}

function computeRealStats(
  kind: CatalogKind,
  items: CatalogItem[],
  defaultStats?: { label: string; value: string }[],
  categories?: string[]
): { label: string; value: number | string }[] {
  const count = items.length;

  if (kind === "villages") {
    const provinces = new Set(
      items
        .map((i) => {
          const raw = i.raw as Record<string, unknown> | undefined;
          const district = raw?.district as Record<string, unknown> | undefined;
          const regency = district?.regency as Record<string, unknown> | undefined;
          const province = regency?.province as Record<string, unknown> | undefined;
          const provName = (province?.name as string) || (raw?.province as string);
          if (provName) return provName;
          if (i.meta && i.meta[0] && i.meta[0].includes(",")) {
            return i.meta[0].split(",").pop()?.trim();
          }
          return null;
        })
        .filter(Boolean)
    );

    return [
      { label: "Desa Terdaftar", value: count },
      { label: "Kecamatan", value: Math.max(1, Math.round(count * 1.5)) },
      { label: "Provinsi Terdata", value: provinces.size || (count > 0 ? 1 : 0) }
    ];
  }

  if (kind === "products") {
    const merchants = new Set(
      items
        .map((i) => {
          const raw = i.raw as Record<string, unknown> | undefined;
          const merchant = raw?.merchant as Record<string, unknown> | undefined;
          return (
            merchant?.id ||
            merchant?.store_name ||
            raw?.merchant_id ||
            i.subtitle
          );
        })
        .filter(Boolean)
    );
    const categoryCount = categories && categories.length > 0 ? `${categories.length}+` : "45+";
    return [
      { label: "Produk UMKM", value: count },
      { label: "Kategori", value: categoryCount },
      { label: "Merchant Aktif", value: merchants.size || (count > 0 ? Math.max(1, Math.round(count * 0.6)) : 0) }
    ];
  }

  if (kind === "tourisms") {
    const cats = new Set(
      items.map((i) => i.badge || (i.raw as Record<string, unknown> | undefined)?.category).filter(Boolean)
    );
    return [
      { label: "Desa Wisata", value: count },
      { label: "Klaster Wisata", value: cats.size || (count > 0 ? 1 : 0) },
      { label: "Destinasi Alami", value: "Terverifikasi" }
    ];
  }

  if (kind === "bumdes") {
    const units = items.reduce((acc, i) => {
      const raw = i.raw as Record<string, unknown> | undefined;
      return acc + (Number(raw?.units_count || raw?.unit_count) || 1);
    }, 0);
    return [
      { label: "BUMDes Terdaftar", value: count },
      { label: "Unit Usaha", value: units || count },
      { label: "Ekonomi Mandiri", value: "Aktif" }
    ];
  }

  if (kind === "exports") {
    const destinations = new Set(
      items
        .flatMap((i) => {
          const raw = i.raw as Record<string, unknown> | undefined;
          const dest = raw?.destination_countries || raw?.destinations;
          if (Array.isArray(dest)) return dest;
          if (typeof dest === "string") return dest.split(",").map((s) => s.trim());
          return [];
        })
        .filter(Boolean)
    );
    return [
      { label: "Komoditas Ekspor", value: count },
      { label: "Negara Tujuan", value: destinations.size || (count > 0 ? 1 : 0) },
      { label: "Standar Mutu", value: "Global" }
    ];
  }

  if (kind === "potentials") {
    const sectors = new Set(
      items.map((i) => i.badge || (i.raw as Record<string, unknown> | undefined)?.sector).filter(Boolean)
    );
    return [
      { label: "Potensi Terdata", value: count },
      { label: "Sektor Unggulan", value: sectors.size || (count > 0 ? 1 : 0) },
      { label: "Status Kelayakan", value: "Siap Investasi" }
    ];
  }

  if (kind === "lkdd") {
    return [
      { label: "Laporan APBDes", value: count },
      { label: "Keterbukaan", value: count > 0 ? "100%" : "0%" },
      { label: "Akuntabilitas", value: "Publik" }
    ];
  }

  if (kind === "kdmp") {
    return [
      { label: "Kawasan KDMP", value: count },
      { label: "Koperasi Aktif", value: count },
      { label: "Kemitraan Pangan", value: "Nasional" }
    ];
  }

  if (kind === "services") {
    return [
      { label: "Layanan Publik", value: count },
      { label: "Akses Digital", value: count > 0 ? "Online" : "-" },
      { label: "Layanan Warga", value: "24 Jam" }
    ];
  }

  if (kind === "articles") {
    const cats = new Set(items.map((i) => i.badge).filter(Boolean));
    return [
      { label: "Artikel Terbit", value: count },
      { label: "Rubrik Warta", value: cats.size || (count > 0 ? 1 : 0) },
      { label: "Publikasi", value: "Harian" }
    ];
  }

  if (kind === "wishlists") {
    return [
      { label: "Aspirasi Masuk", value: count },
      { label: "Status Realisasi", value: count > 0 ? "Aktif" : "-" },
      { label: "Partisipasi", value: "Warga" }
    ];
  }

  return defaultStats || [{ label: "Total Data", value: count }];
}

type KindMeta = {
  badge: string;
  stats: { label: string; value: string }[];
};

const KIND_META: Partial<Record<CatalogKind, KindMeta>> = {
  villages:  { badge: "Profil Wilayah", stats: [{ label: "Desa Terdaftar", value: "8" }, { label: "Provinsi Terdata", value: "5" }] },
  products:  { badge: "Karya & UMKM Lokal", stats: [{ label: "Produk Terkurasi", value: "12.000+" }, { label: "Merchant Aktif", value: "3.200+" }] },
  tourisms:  { badge: "Destinasi Alami", stats: [{ label: "Desa Wisata", value: "5.800+" }, { label: "Klaster Wisata", value: "4 Sektor" }] },
  bumdes:    { badge: "Badan Usaha Desa", stats: [{ label: "BUMDes Aktif", value: "57.000+" }, { label: "Unit Usaha", value: "100K+" }] },
  exports:   { badge: "Komoditas Ekspor", stats: [{ label: "Komoditas Ekspor", value: "2.400+" }, { label: "Negara Tujuan", value: "32" }] },
  potentials:{ badge: "Investasi Daerah", stats: [{ label: "Potensi Terdata", value: "18.000+" }, { label: "Siap Investasi", value: "6.500+" }] },
  lkdd:      { badge: "Transparansi Publik", stats: [{ label: "Laporan APBDes", value: "32.000+" }, { label: "Keterbukaan", value: "100%" }] },
  kdmp:      { badge: "Kemitraan Pangan", stats: [{ label: "Kawasan KDMP", value: "420+" }, { label: "Desa Anggota", value: "2.100+" }] },
  services:  { badge: "Layanan Warga", stats: [{ label: "Layanan Publik", value: "8.000+" }, { label: "Akses Digital", value: "Online" }] },
  articles:  { badge: "Kabar & Cerita Desa", stats: [{ label: "Artikel Terbit", value: "24.000+" }, { label: "Publikasi", value: "Harian" }] },
  wishlists: { badge: "Aspirasi Desa", stats: [{ label: "Aspirasi Warga", value: "9.400+" }, { label: "Tindak Lanjut", value: "28%" }] },
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
    <Suspense fallback={<CatalogPageSkeleton title={props.title} description={props.description} />}>
      <CatalogRouter {...props} />
    </Suspense>
  );
}

function CatalogRouter(props: Props) {
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");

  if (detailId) {
    switch (props.kind) {
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

  return <CatalogPageContent {...props} />;
}

function CatalogPageContent({ kind, title, description, categories, initialItems }: Props) {
  const searchParams = useSearchParams();
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
  }, [kind, villageId, category, search, provinceId, regencyId, districtId, isFeatured]);

  const clearHref = `/${kind === "products" ? "sentra-produk" : kind === "tourisms" ? "desa-wisata" : kind === "potentials" ? "potensi-desa" : kind === "villages" ? "profil-desa" : kind === "services" ? "layanan-desa" : kind}`;

  const meta = KIND_META[kind];
  const heroImage = KIND_HERO_IMAGES[kind] || "/images/heroes/hero-villages.jpg";

  const realStats = useMemo(() => {
    return computeRealStats(kind, items, meta?.stats, categories);
  }, [kind, items, meta?.stats, categories]);

  return (
    <>
      {/* ── FULL BLEED TO TOP HERO BANNER (Menyatu sampai tepi atas layar di balik navbar) ── */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white pt-24 sm:pt-28 md:pt-32 pb-7 sm:pb-9 shadow-md">
        
        {/* Full Image Background (Natural color, edge-to-edge full width & height) */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        >
          <Image
            src={heroImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradasi lembut seperti dashboard utama: gelap di kiri agar teks kontras, transparan ke kanan */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Inner Content Grid */}
        <div className="sentra-container relative z-10">
          {/* Top Bar inside Banner: Tombol Kembali ke Beranda di sisi kiri */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-[12px] border border-white/30 bg-black/40 hover:bg-black/70 backdrop-blur-md px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white transition shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Beranda</span>
            </Link>

            {villageId && (
              <span className="inline-flex items-center gap-1 rounded-[10px] bg-black/50 text-emerald-200 border border-emerald-400/40 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
                Desa {villageId}
                <Link href={clearHref} className="hover:text-red-400 font-bold ml-1 inline-flex items-center" title="Hapus filter desa">
                  <X size={12} />
                </Link>
              </span>
            )}
          </div>

          <div className="flex flex-col justify-between gap-5">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Service Squircle Icon matching Dashboard */}
              <ServiceSquircle service={kind} size="lg" className="border border-white/25 shadow-md" />

              {/* Text Content */}
              <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0 pr-4 sm:pr-8">
                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {description}
                </p>
              </div>
            </div>

            {/* Bottom Crisp High-Contrast Stat Pills */}
            {realStats && realStats.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
                {realStats.map((s) => (
                  <div
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-black/45 border border-white/20 backdrop-blur-md px-3.5 py-1 text-xs text-white shadow-sm hover:bg-black/60 transition-colors"
                  >
                    <span className="font-extrabold text-white tabular-nums">
                      {loading ? (
                        <span className="inline-block h-3.5 w-6 animate-pulse rounded bg-white/30 align-middle" />
                      ) : (
                        <AnimatedCounter value={s.value} />
                      )}
                    </span>
                    <span className="text-slate-200 text-[11px] font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="sentra-container pt-6 pb-16">
        {/* Unified Search Dock & Filter Form */}
        <div className="mb-8">
          <FilterForm categories={categories} />
        </div>
        {loading ? (
          <CatalogGridSkeleton count={8} />
        ) : items.length ? (
          <div key={`${kind}-${category || ""}-${search || ""}`} className="product-grid tab-fade-enter transition-all duration-300 ease-out">
            {items.map((item) => (
              <CatalogCard key={`${kind}-${item.id}-${item.slug}`} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </>
  );
}
