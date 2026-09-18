"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { unwrapList, mapCatalogItem } from "@/infrastructure/repositories/public-repository";
import { CatalogCard } from "@/presentation/components/catalog-card";
import {
  ArrowRightIcon,
  BumdesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  KdmpIcon,
  LkddIcon,
  MapPinIcon,
  NewsIcon,
  PotentialIcon,
  StoreIcon,
  TourismIcon,
  VillageIcon,
  WishlistIcon,
  PhoneIcon,
  UserIcon
} from "@/presentation/components/icons";
import { formatCurrency } from "@/shared/utils/format";

type ModuleSectionProps = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: CatalogItem[];
  moreHref: string;
};

function ModuleSection({ title, subtitle, icon: Icon, color, items, moreHref }: ModuleSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-8 rounded-[10px] ambient-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#171d18]">{title}</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500">{subtitle}</p>
          </div>
        </div>
        <Link
          href={moreHref}
          className="inline-flex items-center gap-2 rounded-2xl ambient-btn-primary px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
        >
          <span>Selengkapnya {title}</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {items.slice(0, 3).map((item) => (
          <CatalogCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export function ProfileDesaDetail({ id }: { id: string }) {
  const [village, setVillage] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [potentials, setPotentials] = useState<CatalogItem[]>([]);
  const [bumdes, setBumdes] = useState<CatalogItem[]>([]);
  const [tourisms, setTourisms] = useState<CatalogItem[]>([]);
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [exports, setExports] = useState<CatalogItem[]>([]);
  const [lkdd, setLkdd] = useState<CatalogItem[]>([]);
  const [services, setServices] = useState<CatalogItem[]>([]);
  const [articles, setArticles] = useState<CatalogItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = useMemo(() => {
    if (!village) return ["/images/header-sentradesa-1.webp"];
    return village.gallery && village.gallery.length
      ? village.gallery
      : village.image
      ? [village.image]
      : ["/images/header-sentradesa-1.webp"];
  }, [village]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const detail = await getDetail("villages", id);
        if (!isMounted) return;
        setVillage(detail);

        const raw = detail?.raw || {};
        const rawPot = unwrapList(raw.potentials || raw.potentials_preview);
        const rawBum = unwrapList(raw.bumdes || raw.bumdes_preview);
        const rawTour = unwrapList(raw.tourisms || raw.tourisms_preview);
        const rawProd = unwrapList(raw.products || raw.products_preview);
        const rawExp = unwrapList(raw.export_products || raw.export_products_preview);
        const rawLkdd = unwrapList(raw.lkdd || raw.lkdd_preview);
        const rawSrv = unwrapList(raw.services || raw.services_preview || raw.village_services);
        const rawArt = unwrapList(raw.contents || raw.contents_preview || raw.articles);

        setPotentials(rawPot.map((p) => mapCatalogItem("potentials", p)));
        setBumdes(rawBum.map((b) => mapCatalogItem("bumdes", b)));
        setTourisms(rawTour.map((t) => mapCatalogItem("tourisms", t)));
        setProducts(rawProd.map((p) => mapCatalogItem("products", p)));
        setExports(rawExp.map((e) => mapCatalogItem("exports", e)));
        setLkdd(rawLkdd.map((l) => mapCatalogItem("lkdd", l)));
        setServices(rawSrv.map((s) => mapCatalogItem("services", s)));
        setArticles(rawArt.map((a) => mapCatalogItem("articles", a)));
      } catch (err) {
        console.error("Error fetching village details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat profil desa lengkap...</p>
        </div>
      </div>
    );
  }

  if (!village) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[10px] ambient-card p-8 max-w-md mx-auto my-12">
            <VillageIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Profil Desa Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data profil desa dengan ID tersebut belum tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-2xl font-bold" href="/profil-desa">
              Kembali ke Daftar Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = village.raw || {};
  const headName = String(raw.head_name || raw.mayor_name || raw.kepala_desa || "Pemerintah Desa");
  const population = String(raw.population || raw.jumlah_penduduk || "-");
  const areaSize = String(raw.area_size || raw.luas_wilayah || "-");
  const phone = String(raw.contact_phone || raw.phone || raw.telepon || "");
  const email = String(raw.contact_email || raw.email || "");
  const address = String(raw.address || "");
  const vision = String(raw.vision || "");
  const mission = String(raw.mission || "");

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Spacer untuk fixed glass-header */}
      <div className="h-[92px] md:h-[98px]" />

      {/* Hero Section: Full Edge-to-Edge Hero Banner seperti di Dashboard Utama */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white pt-8 pb-16 md:pt-10 md:pb-22">
        {/* Full Image Backgrounds - Multi slide dengan smooth transition */}
        {images.map((imgUrl, idx) => (
          <div
            key={`${imgUrl}-${idx}`}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === currentSlide
                ? "opacity-100 scale-100 z-0"
                : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            <Image
              src={imgUrl}
              alt={`${village.title} - ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              unoptimized
            />
          </div>
        ))}

        {/* Gradasi Lembut agar teks dan tombol terbaca sangat jelas */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/35 z-[1]" />

        {/* Navigation Arrows untuk multi-gambar */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)}
              aria-label="Foto sebelumnya"
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % images.length)}
              aria-label="Foto berikutnya"
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition cursor-pointer shadow-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Hero Content */}
        <div className="sentra-container relative z-10">
          {/* Tombol Back yang Disesuaikan di dalam Hero Banner */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/profil-desa"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 hover:bg-black/70 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-bold text-white transition shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Kembali ke List Profil Desa</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-[#006e23] shadow-md mb-3">
                <VillageIcon className="h-3.5 w-3.5 text-[#006e23]" /> Profil Desa Sentra
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {village.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <MapPinIcon className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                {village.subtitle || village.meta?.join(", ") || "Indonesia"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {phone ? (
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl ambient-btn-primary px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>Hubungi Kantor Desa</span>
                </a>
              ) : null}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(village.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/85 bg-white/95 backdrop-blur-md px-5 py-3 text-xs sm:text-sm font-bold text-slate-900 shadow-md hover:bg-white transition active:scale-95 cursor-pointer"
              >
                <MapPinIcon className="h-4 w-4 text-[#ba1a1a]" />
                <span>Lokasi Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* Slide Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === i ? "w-6 bg-white shadow-md ring-2 ring-white/60" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Key Statistics Grid */}
      <section className="sentra-container -mt-7 sm:-mt-9 relative z-20 mb-8">
        <div className="ambient-card rounded-[10px] grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 p-5 sm:p-6 shadow-md border border-white/85">
          <div className="rounded-[8px] border border-slate-200/80 bg-white/90 p-4 text-center shadow-xs transition hover:scale-[1.02] hover:bg-white">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Kepala Desa</span>
            <strong className="block mt-1.5 text-sm sm:text-base font-extrabold text-[#171d18] truncate" title={headName}>
              {headName}
            </strong>
          </div>
          <div className="rounded-[8px] border border-slate-200/80 bg-white/90 p-4 text-center shadow-xs transition hover:scale-[1.02] hover:bg-white">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Jumlah Penduduk</span>
            <strong className="block mt-1.5 text-sm sm:text-base font-extrabold text-[#171d18]">
              {population !== "-" ? `${population} Jiwa` : "Terdata"}
            </strong>
          </div>
          <div className="rounded-[8px] border border-slate-200/80 bg-white/90 p-4 text-center shadow-xs transition hover:scale-[1.02] hover:bg-white">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Luas Wilayah</span>
            <strong className="block mt-1.5 text-sm sm:text-base font-extrabold text-[#171d18]">
              {areaSize !== "-" ? `${areaSize} Ha` : "Terdaftar"}
            </strong>
          </div>
          <div className="rounded-[8px] border border-slate-200/80 bg-white/90 p-4 text-center shadow-xs transition hover:scale-[1.02] hover:bg-white">
            <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Status Desa</span>
            <strong className="block mt-1.5 text-sm sm:text-base font-extrabold text-[#006e23]">
              {raw.is_featured ? "Desa Unggulan" : "Desa Terverifikasi"}
            </strong>
          </div>
        </div>
      </section>

      <div className="sentra-container">

        {/* Visi & Misi Desa */}
        {(vision || mission) ? (
          <div className="mt-8 rounded-[10px] ambient-card p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-extrabold text-[#171d18] border-b border-slate-200/70 pb-3 flex items-center gap-2.5">
              <VillageIcon className="h-5 w-5 text-[#006e23]" />
              Visi & Misi Desa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vision ? (
                <div className="rounded-2xl bg-[#006e23]/5 border border-[#006e23]/20 p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#006e23]">Visi Desa</h3>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-slate-800 italic leading-relaxed">"{vision}"</p>
                </div>
              ) : null}
              {mission ? (
                <div className="rounded-2xl bg-white/80 border border-slate-200/80 p-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Misi Desa</h3>
                  <div className="mt-2 text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {mission}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Sejarah & Deskripsi Desa */}
        <div className="mt-8 rounded-[10px] ambient-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-[#171d18] border-b border-slate-200/70 pb-3 flex items-center gap-2.5">
            <VillageIcon className="h-5 w-5 text-[#006e23]" />
            Gambaran Umum & Sejarah Desa
          </h2>
          <div
            className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-[#3b4b39]/90 space-y-3"
            dangerouslySetInnerHTML={{
              __html: village.body || village.description || `<p>Desa ${village.title} merupakan salah satu perdesaan berkembang yang terus mendorong transparansi publik, penguatan ekonomi BUMDes, pengembangan potensi lokal, serta penyediaan layanan prima bagi seluruh warga desa.</p>`
            }}
          />
        </div>

        {/* Kontak & Kantor Desa */}
        {(address || email || phone) ? (
          <div className="mt-8 rounded-[10px] ambient-card p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-[#171d18] border-b border-slate-200/70 pb-3 flex items-center gap-2.5">
              <MapPinIcon className="h-5 w-5 text-[#ba1a1a]" />
              Kontak & Alamat Kantor Desa
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {address ? (
                <div className="rounded-2xl bg-white/85 p-4 border border-slate-200/80 shadow-2xs">
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[11px]">Alamat Kantor</span>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{address}</p>
                </div>
              ) : null}
              {phone ? (
                <div className="rounded-2xl bg-white/85 p-4 border border-slate-200/80 shadow-2xs">
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[11px]">Telepon / WhatsApp</span>
                  <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-bold text-[#006e23] hover:underline">
                    {phone}
                  </a>
                </div>
              ) : null}
              {email ? (
                <div className="rounded-2xl bg-white/85 p-4 border border-slate-200/80 shadow-2xs">
                  <span className="block font-bold text-slate-400 uppercase tracking-wider text-[11px]">Email Resmi</span>
                  <a href={`mailto:${email}`} className="mt-1 block text-sm font-bold text-[#0284c7] hover:underline">
                    {email}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Sub-Module Preview Sections with "Selengkapnya" CTA buttons */}
        <ModuleSection
          title="Potensi Desa"
          subtitle="Peluang investasi, komoditas unggulan & sumber daya alam desa"
          icon={PotentialIcon}
          color="#E65100"
          items={potentials}
          moreHref={`/potensi-desa?village_id=${village.id}`}
        />

        <ModuleSection
          title="BUMDes"
          subtitle="Badan Usaha Milik Desa & unit bisnis produktif"
          icon={BumdesIcon}
          color="#4E342E"
          items={bumdes}
          moreHref={`/bumdes?village_id=${village.id}`}
        />

        <ModuleSection
          title="Desa Wisata"
          subtitle="Destinasi daya tarik rekreasi & keindahan alam desa"
          icon={TourismIcon}
          color="#C62828"
          items={tourisms}
          moreHref={`/desa-wisata?village_id=${village.id}`}
        />

        <ModuleSection
          title="Sentra Produk UMKM"
          subtitle="Produk makanan, olahan pertanian & kerajinan lokal desa"
          icon={StoreIcon}
          color="#2E7D32"
          items={products}
          moreHref={`/sentra-produk?village_id=${village.id}`}
        />

        <ModuleSection
          title="Komoditas Desa Ekspor"
          subtitle="Produk komoditas unggulan desa berdaya saing pasar global"
          icon={GlobeIcon}
          color="#00695C"
          items={exports}
          moreHref={`/desa-ekspor?village_id=${village.id}`}
        />

        <ModuleSection
          title="Laporan Keuangan (LKDD)"
          subtitle="Transparansi realisasi anggaran pendapatan & belanja APBDes"
          icon={LkddIcon}
          color="#006064"
          items={lkdd}
          moreHref={`/lkdd?village_id=${village.id}`}
        />

        <ModuleSection
          title="Layanan Desa"
          subtitle="Panduan & pengajuan dokumen administrasi publik desa"
          icon={NewsIcon}
          color="#00695C"
          items={services}
          moreHref={`/layanan-desa?village_id=${village.id}`}
        />

        <ModuleSection
          title="Artikel & Kabar Desa"
          subtitle="Berita terkini dan publikasi kegiatan pembangunan desa"
          icon={NewsIcon}
          color="#1565C0"
          items={articles}
          moreHref={`/artikel?village_id=${village.id}`}
        />

      </div>
    </div>
  );
}
