"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import {
  ArrowRightIcon,
  BumdesIcon,
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
    <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <Link
          href={moreHref}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 shadow-xs"
          style={{ backgroundColor: color }}
        >
          Selengkapnya {title}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  const [lkdd, setLkdd] = useState<CatalogItem[]>([]);
  const [services, setServices] = useState<CatalogItem[]>([]);
  const [articles, setArticles] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const detail = await getDetail("villages", id);
        if (!isMounted) return;
        setVillage(detail);

        // Fetch preview items for sub-modules filtered by village_id
        const [potData, bumData, tourData, prodData, lkddData, srvData, artData] = await Promise.all([
          getCatalog("potentials", { village_id: id }),
          getCatalog("bumdes", { village_id: id }),
          getCatalog("tourisms", { village_id: id }),
          getCatalog("products", { village_id: id }),
          getCatalog("lkdd", { village_id: id }),
          getCatalog("services", { village_id: id }),
          getCatalog("articles", { village_id: id })
        ]);

        if (!isMounted) return;
        setPotentials(potData);
        setBumdes(bumData);
        setTourisms(tourData);
        setProducts(prodData);
        setLkdd(lkddData);
        setServices(srvData);
        setArticles(artData);
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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sentra-emerald border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat profil desa lengkap...</p>
        </div>
      </div>
    );
  }

  if (!village) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <VillageIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Profil Desa Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Data profil desa dengan ID tersebut belum tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/profil-desa">
              Kembali ke Daftar Desa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = village.raw || {};
  const images = village.gallery && village.gallery.length ? village.gallery : village.image ? [village.image] : ["/images/header-sentradesa-1.webp"];
  const headName = String(raw.head_name || raw.kepala_desa || "Pemerintah Desa");
  const population = String(raw.population || raw.jumlah_penduduk || "-");
  const areaSize = String(raw.area_size || raw.luas_wilayah || "-");
  const phone = String(raw.phone || raw.telepon || "6281234567890");
  const villageCode = String(raw.code || raw.kode_desa || village.id);

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      {/* Top Header Breadcrumb */}
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/profil-desa" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sentra-emerald transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke List Profil Desa
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-extrabold text-blue-700 uppercase tracking-wide">
              Kode Desa: {villageCode}
            </span>
          </div>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        {/* Banner Hero & Village Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="relative h-[240px] md:h-[340px] w-full overflow-hidden bg-slate-900">
            <ImageGalleryCarousel images={images} title={village.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-auto flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white mb-2">
                  <VillageIcon className="h-3.5 w-3.5" /> Profil Desa Sentra
                </span>
                <h1 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-md">{village.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-xs md:text-sm text-slate-200">
                  <MapPinIcon className="h-4 w-4 text-emerald-400 shrink-0" />
                  {village.subtitle || village.meta?.join(", ") || "Indonesia"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <PhoneIcon className="h-4 w-4" /> Hubungi Kantor Desa
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(village.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md hover:bg-white transition"
                >
                  <MapPinIcon className="h-4 w-4 text-red-600" /> Lokasi Map
                </a>
              </div>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50/70 border-t border-slate-100">
            <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 text-center shadow-2xs">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kepala Desa</span>
              <strong className="block mt-1 text-sm font-extrabold text-slate-800 truncate" title={headName}>
                {headName}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 text-center shadow-2xs">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Penduduk</span>
              <strong className="block mt-1 text-sm font-extrabold text-slate-800">
                {population !== "-" ? `${population} Jiwa` : "Terdata"}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 text-center shadow-2xs">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Luas Wilayah</span>
              <strong className="block mt-1 text-sm font-extrabold text-slate-800">
                {areaSize !== "-" ? `${areaSize} Ha` : "Terdaftar"}
              </strong>
            </div>
            <div className="rounded-xl border border-slate-200/60 bg-white p-3.5 text-center shadow-2xs">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Desa</span>
              <strong className="block mt-1 text-sm font-extrabold text-emerald-600">
                Desa Mandiri
              </strong>
            </div>
          </div>
        </div>

        {/* Sejarah & Deskripsi Desa */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <VillageIcon className="h-5 w-5 text-blue-600" />
            Gambaran Umum & Sejarah Desa
          </h2>
          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-3"
            dangerouslySetInnerHTML={{
              __html: village.body || village.description || `<p>Desa ${village.title} merupakan salah satu perdesaan berkembang yang terus mendorong transparansi publik, penguatan ekonomi BUMDes, pengembangan potensi lokal, serta penyediaan layanan prima bagi seluruh warga desa.</p>`
            }}
          />
        </div>

        {/* 7 Sub-Module Preview Sections with "Selengkapnya" CTA buttons */}
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
