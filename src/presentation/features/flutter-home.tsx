"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CatalogItem, HighlightItem } from "@/domain/entities/common";
import { HomeProducts } from "@/presentation/features/home-products";
import {
  ChevronDownIcon,
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
  SearchIcon,
  ServiceIcon
} from "@/presentation/components/icons";

interface VillageFeatureItem {
  id: number;
  title: string;
  color: string;
  href: string;
  iconPath: string;
}

const villageFeatures: VillageFeatureItem[] = [
  { id: 1, title: "Profil Desa", color: "#006e23", href: "/profil-desa/", iconPath: "/icons/services/profil-desa.svg" },
  { id: 2, title: "Potensi Desa", color: "#dda63a", href: "/potensi-desa/", iconPath: "/icons/services/potensi-desa.svg" },
  { id: 3, title: "Informasi Desa", color: "#0284c7", href: "/layanan-desa/", iconPath: "/icons/services/informasi-desa.svg" },
  { id: 4, title: "Sentra Produk", color: "#16a34a", href: "/sentra-produk/", iconPath: "/icons/services/sentra-produk.svg" },
  { id: 5, title: "Desa Ekspor", color: "#7c3aed", href: "/desa-ekspor/", iconPath: "/icons/services/desa-ekspor.svg" },
  { id: 6, title: "Desa Wisata", color: "#0d9488", href: "/desa-wisata/", iconPath: "/icons/services/desa-wisata.svg" },
  { id: 7, title: "BUMDES", color: "#e5243b", href: "/bumdes/", iconPath: "/icons/services/bumdes.svg" },
  { id: 8, title: "KDMP", color: "#ea580c", href: "/kdmp/", iconPath: "/icons/services/kdmp.svg" },
  { id: 9, title: "LKDD", color: "#a21942", href: "/lkdd/", iconPath: "/icons/services/lkdd.svg" },
  { id: 10, title: "Artikel", color: "#4c9f38", href: "/artikel/", iconPath: "/icons/services/artikel.svg" },
  { id: 11, title: "Wishlist Desa", color: "#dd1367", href: "/wishlist/", iconPath: "/icons/services/wishlist.svg" }
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


type HeroSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
};

const defaultHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    image: "/images/header-sentradesa-1.webp",
    title: "Produk Desa,\ndibeli melalui Sentra Desa.",
    subtitle: "Kita dukung ekonomi desa: produsen menyediakan komoditas dan produk unggulan, Sentra Desa menjadi perantara transaksi terpercaya, dan pengiriman menjangkau seluruh nusantara.",
    ctaText: "Lihat Produk",
    ctaHref: "#produk-desa"
  },
  {
    id: "hero-2",
    image: "/bg-desa.jpg",
    title: "Potensi Alam &\nKomoditas Unggulan Desa",
    subtitle: "Eksplorasi hasil bumi, rempah, dan komoditas pertanian terbaik langsung dari petani dan kelompok tani lokal di seluruh nusantara.",
    ctaText: "Jelajahi Potensi",
    ctaHref: "/potensi-desa/"
  },
  {
    id: "hero-3",
    image: "/images/articles/berita-1.jpg",
    title: "BUMDes Berdaya,\nEkonomi Warga Mandiri",
    subtitle: "Karya kerajinan tangan artistik dan inovasi unit usaha BUMDes yang siap bersaing di pasar nasional hingga pasar ekspor global.",
    ctaText: "Lihat BUMDes",
    ctaHref: "/bumdes/"
  },
  {
    id: "hero-4",
    image: "/images/articles/berita-2.jpg",
    title: "Pesona Desa Wisata &\nKekayaan Budaya Nusantara",
    subtitle: "Nikmati keindahan panorama alam, ekowisata perbukitan, serta tradisi luhur masyarakat perdesaan yang ramah dan lestari.",
    ctaText: "Kunjungi Wisata",
    ctaHref: "/desa-wisata/"
  },
  {
    id: "hero-5",
    image: "/images/articles/berita-3.jpg",
    title: "Ketahanan Pangan &\nTransparansi Membangun Desa",
    subtitle: "Kemitraan pangan KDMP serta transparansi keterbukaan tata kelola desa demi kesejahteraan bersama seluruh masyarakat.",
    ctaText: "Profil Desa",
    ctaHref: "/profil-desa/"
  }
];

export function FlutterHome({
  products,
  highlights
}: {
  products: CatalogItem[];
  highlights?: HighlightItem[];
  articles?: CatalogItem[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const bannerSlides: HeroSlide[] = useMemo(() => {
    if (highlights && highlights.length > 0 && highlights.some((h) => h.image)) {
      return highlights.filter((h) => Boolean(h.image)).map((h, i) => ({
        id: h.id || `highlight-${i}`,
        image: h.image!,
        title: h.title || defaultHeroSlides[i % defaultHeroSlides.length].title,
        subtitle: h.subtitle || defaultHeroSlides[i % defaultHeroSlides.length].subtitle,
        ctaText: h.link_label || defaultHeroSlides[i % defaultHeroSlides.length].ctaText,
        ctaHref: h.link_url || defaultHeroSlides[i % defaultHeroSlides.length].ctaHref
      }));
    }
    return defaultHeroSlides;
  }, [highlights]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlideIndices, setLoadedSlideIndices] = useState<number[]>([0]);

  // Otomatis berganti slide setiap 4.5 detik + lazy load slide berikutnya
  useEffect(() => {
    if (bannerSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % bannerSlides.length;
        setLoadedSlideIndices((curr) => (curr.includes(next) ? curr : [...curr, next]));
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const goToSlide = (idx: number) => {
    setLoadedSlideIndices((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
    setCurrentSlide(idx);
  };

  const scrollByOffset = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    ref.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    const target = document.getElementById("produk-desa");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sentra-shell">
      {/* Hero Section: Full Edge-to-Edge Slideshow Gambar Otomatis Bergerak dengan Gradasi Halus */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white pt-28 pb-20 sm:pt-32 md:pt-40 md:pb-28">
        {/* Full Image Backgrounds - Lazy loaded & GPU accelerated cross-fade */}
        {bannerSlides.map((slide, idx) => {
          const isLoaded = loadedSlideIndices.includes(idx);
          if (!isLoaded) return null;

          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out will-change-[opacity] transform-gpu ${
                idx === currentSlide
                  ? "opacity-100 z-0"
                  : "opacity-0 pointer-events-none z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover object-center"
                unoptimized
              />
            </div>
          );
        })}

        {/* Gradasi Lembut agar teks terbaca sangat jelas */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/15 z-[1]" />

        {/* Navigation Arrows for desktop */}
        {bannerSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToSlide((currentSlide - 1 + bannerSlides.length) % bannerSlides.length)}
              aria-label="Slide sebelumnya"
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-[14px] bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide((currentSlide + 1) % bannerSlides.length)}
              aria-label="Slide berikutnya"
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-[14px] bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Hero Content - Dinamis berganti mengikuti active slide */}
        <div className="sentra-container relative z-10 pointer-events-none">
          <div className="relative min-h-[220px] sm:min-h-[250px] md:min-h-[280px] flex items-center">
            {bannerSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={slide.id || idx}
                  className={`w-full max-w-2xl text-left transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform] ${
                    isActive
                      ? "opacity-100 translate-y-0 relative z-10 pointer-events-auto"
                      : "opacity-0 -translate-y-2.5 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-white leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    {slide.title.split("\n").map((line, lIdx, arr) => (
                      <span key={lIdx}>
                        {line}
                        {lIdx < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-4 text-xs sm:text-sm md:text-base text-white font-medium font-sans leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    {slide.subtitle}
                  </p>
                  <div className="mt-6">
                    <a
                      href={slide.ctaHref}
                      className="inline-flex items-center justify-center rounded-[14px] bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition duration-200"
                    >
                      {slide.ctaText}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide Dots Indicator */}
        {bannerSlides.length > 1 && (
          <div className="absolute bottom-11 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === i ? "w-6 bg-white shadow-md ring-2 ring-white/60" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section 11 Kategori Layanan Desa */}
      <section className="sentra-container pt-8 md:pt-10">
          {/* 11 Kategori Layanan Desa dengan Jarak yang Seragam & Konsisten */}
          <div className="flex flex-wrap justify-center items-start gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-9 gap-y-6 sm:gap-y-7 md:gap-y-8 w-full max-w-5xl mx-auto">
            {villageFeatures.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col items-center justify-start text-center w-[92px] sm:w-[105px] md:w-[118px] lg:w-[124px] transition-transform duration-200 hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <div
                  className="flex h-14 w-14 sm:h-16 sm:w-16 md:h-[68px] md:w-[68px] items-center justify-center rounded-[14px] shadow-[0_6px_18px_-2px_rgba(0,0,0,0.14)] transition-all duration-200 group-hover:scale-108 group-hover:shadow-[0_10px_24px_-2px_rgba(0,0,0,0.22)]"
                  style={{ backgroundColor: item.color }}
                >
                  <Image
                    src={item.iconPath}
                    alt={item.title}
                    width={36}
                    height={36}
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 object-contain drop-shadow-xs"
                    unoptimized
                  />
                </div>
                <span className="mt-2.5 font-sans text-xs sm:text-[13px] md:text-sm font-bold text-[#171d18] group-hover:text-[#006e23] transition-colors leading-tight text-center">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
      </section>


      {/* Section Produk & Filter Pencarian */}
      <section id="produk-desa" className="sentra-container scroll-mt-[110px] pt-8 md:pt-10">
        {/* Fitur Cari yang rapi, presisi, dan tertata */}
        <div>
          <form
            onSubmit={handleSearchSubmit}
            className="w-full rounded-[14px] ambient-card p-2.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
          >
            {/* Input Pencarian dengan Icon yang Proporsional */}
            <div className="relative flex-1 min-w-0 flex items-center">
              <div className="pointer-events-none absolute left-4 flex items-center justify-center text-slate-400">
                <SearchIcon className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari kopi, beras, kerajinan, produk desa..."
                className="h-[52px] w-full rounded-[14px] border border-slate-200/85 bg-white/85 pl-12 pr-4 text-sm sm:text-base font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#006e23]/60 focus:outline-none focus:ring-3 focus:ring-[#006e23]/10 transition shadow-xs"
              />
            </div>

            {/* Pilihan Kategori Dropdown dengan Chevron Custom */}
            <div className="relative shrink-0 sm:w-60 md:w-64 flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const target = document.getElementById("produk-desa");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-[52px] w-full appearance-none rounded-[14px] border border-slate-200/85 bg-white/85 px-4 pr-10 text-sm sm:text-base font-semibold text-slate-700 focus:bg-white focus:border-[#006e23]/60 focus:outline-none focus:ring-3 focus:ring-[#006e23]/10 transition cursor-pointer shadow-xs"
              >
                <option value="all">Semua kategori</option>
                <option value="makanan_minuman">Makanan & Minuman</option>
                <option value="kerajinan">Kerajinan</option>
                <option value="fashion">Fashion</option>
                <option value="pertanian">Pertanian</option>
                <option value="perikanan">Perikanan</option>
                <option value="peternakan">Peternakan</option>
                <option value="jasa">Jasa</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <div className="pointer-events-none absolute right-4 flex items-center justify-center text-slate-400">
                <ChevronDownIcon className="h-4 w-4" />
              </div>
            </div>

            {/* Tombol Cari yang Tertata Rapi dengan Icon dan Teks */}
            <button
              type="submit"
              className="h-[52px] shrink-0 inline-flex items-center justify-center gap-2.5 rounded-[14px] ambient-btn-primary px-7 sm:px-8 text-sm sm:text-base font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <SearchIcon className="h-5 w-5 text-white shrink-0" />
              <span>Cari</span>
            </button>
          </form>
        </div>

        {/* Filter Kategori Produk */}
        <div className="mt-5 flex items-center gap-3">
          <button
            className="ambient-card flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-[14px] text-slate-700 hover:bg-white hover:text-[#006e23] transition cursor-pointer active:scale-95"
            type="button"
            aria-label="Geser kategori ke kiri"
            onClick={() => scrollByOffset(scrollRef, -260)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="custom-horizontal-scrollbar flex h-[62px] md:h-[66px] flex-1 items-center gap-3 overflow-x-auto pb-1 scroll-smooth"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={(e) => {
                    setSelectedCategory(category.key);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      inline: "center",
                      block: "nearest"
                    });
                  }}
                  className={`inline-flex h-[44px] md:h-[48px] shrink-0 items-center gap-2.5 rounded-[14px] px-5 md:px-6 text-xs sm:text-sm md:text-[15px] font-bold snap-center transition-all duration-300 ease-out cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? "ambient-btn-primary scale-[1.02] shadow-[0_6px_20px_rgba(0,110,35,0.3)]"
                      : "ambient-card text-[#171d18] hover:bg-white hover:scale-[1.01]"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-300 ${isActive ? "text-white scale-110" : "text-[#006e23]"}`} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <button
            className="ambient-card flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-[14px] text-slate-700 hover:bg-white hover:text-[#006e23] transition cursor-pointer active:scale-95"
            type="button"
            aria-label="Geser kategori ke kanan"
            onClick={() => scrollByOffset(scrollRef, 260)}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="sentra-container pb-14">
        <HomeProducts initialProducts={products} category={selectedCategory} search={activeSearch} />
      </section>
    </div>
  );
}
