"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CatalogItem, HighlightItem } from "@/domain/entities/common";
import { HomeProducts } from "@/presentation/features/home-products";
import { HomeBannerSlideshow } from "@/presentation/features/home-banner-slideshow";
import {
  AddBusinessIcon,
  ArrowRightIcon,
  ArticleIcon,
  BumdesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CraftIcon,
  FarmIcon,
  FashionIcon,
  FishIcon,
  FoodIcon,
  GlobeIcon,
  GridIcon,
  KdmpIcon,
  LkddIcon,
  LivestockIcon,
  MoreIcon,
  NewsIcon,
  PotentialIcon,
  RocketIcon,
  ServiceIcon,
  StoreIcon,
  TourismIcon,
  VillageIcon,
  WishlistIcon
} from "@/presentation/components/icons";

const explorationMenus = [
  { title: "Profil Desa", href: "/profil-desa/", icon: VillageIcon, color: "#1565C0" },
  { title: "Potensi Desa", href: "/potensi-desa/", icon: PotentialIcon, color: "#E65100" },
  { title: "Informasi Desa", href: "/layanan-desa/", icon: NewsIcon, color: "#00695C" },
  { title: "Sentra Produk", href: "/sentra-produk/", icon: StoreIcon, color: "#2E7D32" },
  { title: "Desa Ekspor", href: "/desa-ekspor/", icon: GlobeIcon, color: "#283593" },
  { title: "Desa Wisata", href: "/desa-wisata/", icon: TourismIcon, color: "#C62828" },
  { title: "BUMDES", href: "/bumdes/", icon: BumdesIcon, color: "#4E342E" },
  { title: "KDMP", href: "/kdmp/", icon: KdmpIcon, color: "#B71C1C" },
  { title: "LKDD", href: "/lkdd/", icon: LkddIcon, color: "#006064" },
  { title: "Artikel", href: "/artikel/", icon: ArticleIcon, color: "#1565C0" },
  { title: "Wishlist Desa", href: "/wishlist/", icon: WishlistIcon, color: "#AD1457" }
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

export function FlutterHome({ products, highlights }: { products: CatalogItem[]; highlights?: HighlightItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <div className="sentra-shell">
      <div className="h-[100px]" />
      <HomeBannerSlideshow highlights={highlights} />

      <section className="sentra-container px-5 py-10">
        <h2 className="section-title">Desa Kita</h2>
        <div className="mt-[25px] flex justify-center">
          <div className="flex w-full flex-wrap justify-center gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-5">
            {explorationMenus.map((menu) => {
              const Icon = menu.icon;
              return (
                <Link key={menu.title} href={menu.href} className="flex w-[30%] flex-col items-center text-center min-[400px]:w-[22%] sm:w-[17%] lg:w-[14%]">
                  <div
                    className="flex aspect-square w-[62%] min-w-[54px] max-w-[86px] items-center justify-center rounded-[32%] border-[1.5px] shadow-[0_5px_14px_rgba(0,0,0,0.12)]"
                    style={{
                      color: menu.color,
                      borderColor: `${menu.color}26`,
                      background: `linear-gradient(135deg, ${menu.color}2e, ${menu.color}14)`,
                      boxShadow: `0 5px 14px ${menu.color}2e`
                    }}
                  >
                    <Icon className="h-[46%] w-[46%]" />
                  </div>
                  <span className="mt-2.5 line-clamp-2 text-[11px] font-bold leading-[1.3] text-slate-800 md:text-[12.5px]">{menu.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sentra-container px-5">
        <Link href="/merchant/register/" className="mb-5 flex w-full overflow-hidden rounded-flutter bg-gradient-to-br from-sentra-emerald via-sentra-green to-sentra-light p-5 text-white shadow-cta md:p-7">
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <span className="rounded-[10px] bg-white/20 p-2">
                <RocketIcon className="h-5 w-5" />
              </span>
              <h2 className="text-base font-extrabold md:text-[19px]">Punya Usaha di Desa?</h2>
            </div>
            <p className="mt-2 max-w-2xl text-xs leading-[1.4] text-white/85 md:text-[13px]">Daftarkan UMKM Anda dan jual produk ke seluruh Indonesia melalui Sentra Desa.</p>
            <span className="mt-3.5 inline-flex items-center gap-1.5 rounded-[10px] bg-white px-4 py-2.5 text-xs font-bold text-sentra-emerald">
              Daftar Sebagai Merchant
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
          <RocketIcon className="ml-5 hidden h-20 w-20 text-white/15 md:block" />
        </Link>
      </section>

      <section className="sentra-container py-2.5">
        <div className="px-5">
          <h2 className="section-title">Produk</h2>
        </div>
        <div className="mt-[15px] flex items-center gap-2.5">
          <div className="w-[5px] md:w-[15px]" />
          <button
            className="icon-button shrink-0"
            type="button"
            aria-label="Geser kategori ke kiri"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="custom-horizontal-scrollbar flex h-[62px] flex-1 items-center gap-3 overflow-x-auto pb-2 scroll-smooth"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(category.key)}
                  className={`inline-flex h-[46px] shrink-0 items-center gap-2 rounded-[14px] border px-5 py-3 text-[13px] font-black transition cursor-pointer select-none ${
                    isActive
                      ? "border-transparent bg-sentra-emerald text-white shadow-md shadow-sentra-emerald/20 scale-[1.02]"
                      : "border-slate-200 bg-white text-slate-900 hover:border-sentra-emerald/40 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] ${isActive ? "text-white" : "text-black/60"}`} />
                  {category.label}
                </button>
              );
            })}
          </div>

          <button
            className="icon-button shrink-0"
            type="button"
            aria-label="Geser kategori ke kanan"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <div className="w-[5px] md:w-[15px]" />
        </div>
        <div className="h-5" />
      </section>

      <section className="sentra-container">
        <HomeProducts initialProducts={products} category={selectedCategory} />
      </section>
    </div>
  );
}
