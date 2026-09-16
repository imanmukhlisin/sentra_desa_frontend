"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CatalogItem, HighlightItem } from "@/domain/entities/common";
import { HomeProducts } from "@/presentation/features/home-products";
import { HomeBannerSlideshow } from "@/presentation/features/home-banner-slideshow";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CraftIcon,
  FarmIcon,
  FashionIcon,
  FishIcon,
  FoodIcon,
  GridIcon,
  LivestockIcon,
  MoreIcon,
  ServiceIcon
} from "@/presentation/components/icons";

interface VillageFeatureItem {
  id: number;
  title: string;
  category: string;
  color: string;
  href: string;
  iconPath: string;
}

const villageFeatures: VillageFeatureItem[] = [
  { id: 1, title: "Profil Desa", category: "Data & Demografi", color: "#006e23", href: "/profil-desa/", iconPath: "/icons/services/profil-desa.svg" },
  { id: 2, title: "Potensi Desa", category: "Peluang Unggulan", color: "#dda63a", href: "/potensi-desa/", iconPath: "/icons/services/potensi-desa.svg" },
  { id: 3, title: "Informasi Desa", category: "Warta & Kebijakan", color: "#0284c7", href: "/layanan-desa/", iconPath: "/icons/services/informasi-desa.svg" },
  { id: 4, title: "Sentra Produk", category: "Katalog BUMDes", color: "#16a34a", href: "/sentra-produk/", iconPath: "/icons/services/sentra-produk.svg" },
  { id: 5, title: "Desa Ekspor", category: "Pasar Global", color: "#7c3aed", href: "/desa-ekspor/", iconPath: "/icons/services/desa-ekspor.svg" },
  { id: 6, title: "Desa Wisata", category: "Destinasi Budaya", color: "#0d9488", href: "/desa-wisata/", iconPath: "/icons/services/desa-wisata.svg" },
  { id: 7, title: "BUMDes", category: "Badan Usaha Desa", color: "#e5243b", href: "/bumdes/", iconPath: "/icons/services/bumdes.svg" },
  { id: 8, title: "KDMP", category: "Kader & Pangan", color: "#ea580c", href: "/kdmp/", iconPath: "/icons/services/kdmp.svg" },
  { id: 9, title: "LKDD", category: "Keuangan APBDes", color: "#a21942", href: "/lkdd/", iconPath: "/icons/services/lkdd.svg" },
  { id: 10, title: "Artikel", category: "Inovasi & Wawasan", color: "#4c9f38", href: "/artikel/", iconPath: "/icons/services/artikel.svg" },
  { id: 11, title: "Wishlist", category: "Kebutuhan Warga", color: "#dd1367", href: "/wishlist/", iconPath: "/icons/services/wishlist.svg" }
];

const categories = [
  { key: "all", label: "Semua", icon: GridIcon },
  { key: "makanan_minuman", label: "Makanan & Minuman", icon: FoodIcon },
  { key: "kerajinan", label: "Kerajinan", icon: CraftIcon },
  { key: "fashion", label: "Fashion", icon: FashionIcon },
  { key: "pertanian", label: "Pertanian", icon: FarmIcon },
  { key: "perikanan", label: "Perikanan", icon: FishIcon },
  { key: "peternakan", label: "Peternakan", icon: LivestockIcon },
  { key: "jasa", label: "Jasa", icon: ServiceIcon },
  { key: "lainnya", label: "Lainnya", icon: MoreIcon }
];


interface ArticleDisplayItem {
  id: string;
  title: string;
  badge: string;
  badgeBg: string;
  source: string;
  date: string;
  description: string;
  image: string;
  href: string;
}

const defaultSampleArticles: ArticleDisplayItem[] = [
  {
    id: "sample-art-1",
    title: "Penguatan BUMDes Bersama Dorong Ekspor Kerajinan Bambu Desa ke Mancanegara",
    badge: "BERITA",
    badgeBg: "bg-[#006e23]",
    source: "SentraDesa.id",
    date: "12 Mei 2026",
    description: "Sinergi kelompok perajin bambu lokal sukses menembus pasar ritel internasional dengan standar kualitas ekspor terverifikasi.",
    image: "/images/articles/berita-1.jpg",
    href: "/artikel/?id=penguatan-bumdes-ekspor-bambu"
  },
  {
    id: "sample-art-2",
    title: "Sosialisasi Regulasi Pemanfaatan Dana Desa 2026 untuk Transformasi Digital & Pasar Lokal",
    badge: "REGULASI",
    badgeBg: "bg-[#a04110]",
    source: "Kemendesa, PDTT",
    date: "10 Mei 2026",
    description: "Panduan alokasi prioritas APBDes guna mempercepat digitalisasi sentra komoditas pangan dan gerai BUMDes modern.",
    image: "/images/articles/berita-2.jpg",
    href: "/artikel/?id=sosialisasi-regulasi-dana-desa-2026"
  },
  {
    id: "sample-art-3",
    title: "Program KDMP Sukses Sambungkan Ratusan UMKM Desa Langsung ke Pasar Nasional",
    badge: "EKONOMI DESA",
    badgeBg: "bg-[#825500]",
    source: "KabarDesa.co",
    date: "08 Mei 2026",
    description: "Fasilitasi rantai pasok terintegrasi berhasil menaikkan omzet pelaku usaha lokal hingga 45% dalam kuartal pertama tahun ini.",
    image: "/images/articles/berita-3.jpg",
    href: "/artikel/?id=program-kdmp-umkm-desa-pasar-nasional"
  }
];

function getBadgeBg(badge: string) {
  const lower = badge.toLowerCase();
  if (lower.includes("regulasi") || lower.includes("aturan")) return "bg-[#a04110]";
  if (lower.includes("ekonomi") || lower.includes("kdmp") || lower.includes("pasar")) return "bg-[#825500]";
  return "bg-[#006e23]";
}

function resolveArticles(backendArticles?: CatalogItem[]): ArticleDisplayItem[] {
  // Gunakan mockup rapi jika data backend masih kosong/tes/kurang dari 3
  const isTestingData =
    !backendArticles ||
    backendArticles.length < 3 ||
    backendArticles.some((a) => !a.image || !a.title || a.title.trim().toLowerCase() === "tes");

  if (isTestingData) {
    return defaultSampleArticles;
  }

  const mapped = backendArticles.slice(0, 3).map((item, idx) => {
    const raw = item.raw || {};
    const fallback = defaultSampleArticles[idx] || defaultSampleArticles[0];

    const village = typeof raw.village === "object" && raw.village !== null ? (raw.village as Record<string, unknown>) : null;
    const villageName = village?.name ? String(village.name) : (raw.village_name ? String(raw.village_name) : null);
    const authorName = raw.author ? String(raw.author) : null;
    const source = villageName || authorName || fallback.source;

    const rawDate = raw.published_at || raw.created_at;
    let dateStr = fallback.date;
    if (rawDate) {
      try {
        dateStr = new Date(String(rawDate)).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      } catch {
        dateStr = String(rawDate).split("T")[0];
      }
    }

    const badge = String(item.badge || raw.category || raw.type || fallback.badge).toUpperCase();

    return {
      id: item.id || fallback.id,
      title: item.title || fallback.title,
      badge,
      badgeBg: getBadgeBg(badge),
      source,
      date: dateStr,
      description: item.description || fallback.description,
      image: item.image || fallback.image,
      href: item.href || `/artikel/?id=${item.slug || item.id}`
    };
  });

  return mapped.length > 0 ? mapped : defaultSampleArticles;
}


export function FlutterHome({
  products,
  highlights,
  articles
}: {
  products: CatalogItem[];
  highlights?: HighlightItem[];
  articles?: CatalogItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuresScrollRef = useRef<HTMLDivElement>(null);
  const displayArticles = resolveArticles(articles);

  const scrollByOffset = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    ref.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="sentra-shell">
      <div className="h-[85px]" />
      <HomeBannerSlideshow highlights={highlights} />

      {/* Section Kategori Layanan Desa */}
      <section className="sentra-container pt-6 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Kategori Layanan Desa</h2>
            <p className="mt-1 font-sans text-xs text-[#3b4b39] md:text-sm leading-relaxed">
              Akses digital terpadu percepatan ekonomi, publikasi komoditas, kelembagaan BUMDes, dan layanan desa nusantara.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="icon-button"
              type="button"
              aria-label="Geser layanan ke kiri"
              onClick={() => scrollByOffset(featuresScrollRef, -260)}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Geser layanan ke kanan"
              onClick={() => scrollByOffset(featuresScrollRef, 260)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feature Cards Horizontal Scroller */}
        <div
          ref={featuresScrollRef}
          className="custom-horizontal-scrollbar mt-5 flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        >
          {villageFeatures.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex w-[170px] shrink-0 flex-col items-center rounded-xl border border-[#b9ccb5]/50 bg-white p-4 pt-5 pb-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#006e23] hover:shadow-md active:border-[#006e23] active:ring-2 active:ring-[#006e23]/25 cursor-pointer select-none"
            >
                {/* Tanda Indikator Bisa Diklik (Top-Right Action Cue) */}
                <span
                  className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#eff6ec] text-[#6b7c68] transition-all duration-200 group-hover:bg-[#006e23] group-hover:text-white group-hover:scale-105 group-active:bg-[#006e23] group-active:text-white"
                  title="Klik untuk membuka"
                >
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>

                {/* Lingkaran Icon: Warna-warni Khas Layanan */}
                <div
                  className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: item.color }}
                >
                  <Image
                    src={item.iconPath}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain drop-shadow-xs"
                    unoptimized
                  />
                </div>

                {/* Judul: Hitam, Berubah Hijau saat Hover / Klik */}
                <h3 className="line-clamp-2 font-headline text-xs font-bold leading-tight transition-colors mb-1.5 min-h-[32px] flex items-center justify-center text-[#171d18] group-hover:text-[#006e23] group-active:text-[#006e23]">
                  {item.title}
                </h3>

                {/* Kategori: Selaras Warna Hitam, Berubah Hijau saat Hover / Klik */}
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider mt-auto transition-colors text-[#171d18] group-hover:text-[#006e23] group-active:text-[#006e23]">
                  {item.category}
                </span>
              </Link>
            ))}
        </div>
      </section>

      {/* Section Kabar Terkini Desa */}
      <section className="sentra-container pt-8 md:pt-10">
        <div>
          <h2 className="section-title">Kabar Terkini Desa</h2>
          <p className="mt-1 font-sans text-xs text-[#3b4b39] md:text-sm leading-relaxed">
            Berita kemajuan ekonomi, inovasi BUMDes, dan regulasi desa nusantara
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#b9ccb5]/50 bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:border-[#006e23] hover:shadow-md"
            >
              {/* Image Container with Badge */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e9f0e7]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Category Badge matching screenshot */}
                <div className="absolute left-3 top-3 z-10">
                  <span
                    className={`inline-block rounded px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${article.badgeBg}`}
                  >
                    {article.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Meta Row: Source & Date */}
                <div className="mb-2.5 flex items-center justify-between font-sans text-[11px] font-medium text-[#6b7c68]">
                  <span className="truncate max-w-[65%] font-semibold text-[#3b4b39]">
                    {article.source}
                  </span>
                  <span>{article.date}</span>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 font-headline text-[15px] md:text-[16px] font-bold leading-snug text-[#171d18] transition-colors group-hover:text-[#006e23]">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 flex-1 font-sans text-xs md:text-[13px] leading-relaxed text-[#3b4b39]">
                  {article.description}
                </p>

                {/* CTA Link */}
                <div className="mt-auto inline-flex items-center gap-1 font-sans text-[12px] font-semibold text-[#006e23] transition group-hover:translate-x-0.5">
                  <span>Baca Selengkapnya</span>
                  <span className="text-xs">&gt;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Produk */}
      <section id="produk-desa" className="sentra-container pt-8 md:pt-10">
        <div>
          <h2 className="section-title">Produk</h2>
          <p className="mt-1 font-sans text-xs text-[#3b4b39] md:text-sm leading-relaxed">
            Komoditas dan kerajinan terbaik produksi desa bersertifikasi mutu.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            className="icon-button shrink-0"
            type="button"
            aria-label="Geser kategori ke kiri"
            onClick={() => scrollByOffset(scrollRef, -240)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="custom-horizontal-scrollbar flex h-[58px] flex-1 items-center gap-2.5 overflow-x-auto pb-1 scroll-smooth"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(category.key)}
                  className={`inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition cursor-pointer select-none ${
                    isActive
                      ? "border-transparent bg-[#006e23] text-white shadow-sm"
                      : "border-[#b9ccb5] bg-white text-[#171d18] hover:bg-[#eff6ec]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#3b4b39]"}`} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <button
            className="icon-button shrink-0"
            type="button"
            aria-label="Geser kategori ke kanan"
            onClick={() => scrollByOffset(scrollRef, 240)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="sentra-container pb-14">
        <HomeProducts initialProducts={products} category={selectedCategory} />
      </section>
    </div>
  );
}
