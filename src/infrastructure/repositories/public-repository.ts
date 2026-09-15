import { CatalogItem, CatalogKind, DetailItem, Dictionary, HighlightItem, ListQuery } from "@/domain/entities/common";
import { HttpClient } from "@/infrastructure/api/http-client";
import { formatCurrency, stripHtml } from "@/shared/utils/format";

const endpoints: Record<CatalogKind, string> = {
  products: "public/products",
  villages: "public/villages",
  tourisms: "public/tourisms",
  articles: "public/articles",
  exports: "public/exports",
  potentials: "public/potentials",
  bumdes: "public/bumdes",
  kdmp: "public/kdmp",
  services: "public/services",
  lkdd: "public/lkdd",
  wishlists: "public/wishlists"
};

const pathPrefixes: Record<CatalogKind, string> = {
  products: "/product",
  villages: "/profil-desa",
  tourisms: "/desa-wisata",
  articles: "/artikel",
  exports: "/desa-ekspor",
  potentials: "/potensi-desa",
  bumdes: "/bumdes",
  kdmp: "/kdmp",
  services: "/layanan-desa",
  lkdd: "/lkdd",
  wishlists: "/wishlist"
};

export const sampleProducts: CatalogItem[] = [
  {
    id: "sample-1",
    slug: "keripik-singkong-pedas-manis",
    title: "Keripik Singkong Pedas Manis 250g",
    subtitle: "Desa Sukamaju • Rp 18.000",
    description: "Keripik singkong renyah dengan bumbu rempah pedas manis khas olahan usaha desa.",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    href: "/product/keripik-singkong-pedas-manis",
    badge: "Makanan & Minuman",
    price: 18000,
    meta: ["Desa Sukamaju, Kab. Bandung"],
    raw: {}
  },
  {
    id: "sample-2",
    slug: "kacang-gurih-krispi",
    title: "Kacang Gurih Krispi Khas Desa",
    subtitle: "Desa Banjar Agung • Rp 15.000",
    description: "Kacang olahan lokal renyah, gurih, dan lezat cocok untuk camilan keluarga.",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
    href: "/product/kacang-gurih-krispi",
    badge: "Makanan & Minuman",
    price: 15000,
    meta: ["Desa Banjar Agung, OKU Selatan"],
    raw: {}
  },
  {
    id: "sample-3",
    slug: "madu-hutan-alami",
    title: "Madu Hutan Alami Murni 500ml",
    subtitle: "Desa Asri • Rp 85.000",
    description: "Madu hutan murni dipanen langsung dari pepohonan hutan desa tanpa bahan pengawet.",
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop&q=80",
    href: "/product/madu-hutan-alami",
    badge: "Pertanian",
    price: 85000,
    meta: ["Desa Asri, Kab. Bandung"],
    raw: {}
  },
  {
    id: "sample-4",
    slug: "kopi-robusta-desa",
    title: "Kopi Robusta Sangrai Khas Desa",
    subtitle: "Desa Argopuro • Rp 45.000",
    description: "Biji kopi robusta pilihan dari perkebunan dataran tinggi desa dengan aroma mantap.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    href: "/product/kopi-robusta-desa",
    badge: "Makanan & Minuman",
    price: 45000,
    meta: ["Desa Argopuro, Kab. Jember"],
    raw: {}
  },
  {
    id: "sample-5",
    slug: "kerajinan-anyaman-bambu",
    title: "Tas Anyaman Bambu Alami",
    subtitle: "Desa Kreatif • Rp 65.000",
    description: "Kerajinan tangan ramah lingkungan berupa anyaman bambu tahan lama dan artistik.",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop&q=80",
    href: "/product/kerajinan-anyaman-bambu",
    badge: "Kerajinan",
    price: 65000,
    meta: ["Desa Kreatif, Kab. Tasikmalaya"],
    raw: {}
  },
  {
    id: "sample-6",
    slug: "minyak-kelapa-vco",
    title: "Minyak Kelapa Murni VCO 250ml",
    subtitle: "Desa Pesisir • Rp 50.000",
    description: "Virgin Coconut Oil (VCO) hasil olahan dingin kelapa segar pesisir desa.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    href: "/product/minyak-kelapa-vco",
    badge: "Pertanian",
    price: 50000,
    meta: ["Desa Pesisir, Kab. Kebumen"],
    raw: {}
  }
];

export class LaravelPublicRepository {
  constructor(private readonly http = new HttpClient()) {}

  async list(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[]> {
    return (await this.listFresh(kind, query)) ?? [];
  }

  async listFresh(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[] | null> {
    const data = await this.http.get<unknown>(endpoints[kind], query);
    
    if (data === null || (Array.isArray(data) && data.length === 0)) {
      if (kind === "products" && (!query?.category || query.category === "all")) {
        return sampleProducts;
      }
      return data === null ? null : [];
    }

    const items = unwrapList(data).map((item) => mapCatalogItem(kind, item));
    if (items.length === 0 && kind === "products" && (!query?.category || query.category === "all")) {
      return sampleProducts;
    }
    return items;
  }

  async detail(kind: CatalogKind, id: string): Promise<DetailItem | null> {
    let data: unknown = null;
    if (kind === "villages") {
      data = await this.http.get<unknown>(`public/villages/${id}/profile`);
      if (!data) {
        data = await this.http.get<unknown>(`public/villages/${id}`);
      }
      if (!data) {
        // Fallback: search village list to match by code or id or name
        const searchRes = await this.http.get<unknown>("public/villages", { search: id });
        const list = unwrapList(searchRes);
        const match = list.find((v) => text(v.id) === id || text(v.code) === id || text(v.slug) === id);
        if (match) {
          const matchId = text(match.id) || id;
          data = await this.http.get<unknown>(`public/villages/${matchId}/profile`);
          if (!data) data = match;
        } else if (list.length > 0) {
          const firstId = text(list[0].id) || id;
          data = await this.http.get<unknown>(`public/villages/${firstId}/profile`);
          if (!data) data = list[0];
        }
      }
    } else {
      data = await this.http.get<unknown>(`${endpoints[kind]}/${id}`);
    }

    const raw = unwrapDetail(data);
    
    if (!raw && kind === "products") {
      const match = sampleProducts.find((p) => p.id === id || p.slug === id);
      if (match) {
        return {
          ...match,
          body: match.description,
          gallery: [match.image!],
          facts: [
            { label: "Kategori", value: match.badge || "Produk Desa" },
            { label: "Harga", value: formatCurrency(match.price || 0) },
            { label: "Lokasi", value: match.meta?.[0] || "Desa Sentra" }
          ]
        };
      }
    }

    if (!raw && kind === "villages") {
      // Emergency fallback for village detail
      return {
        id,
        slug: id,
        title: `Profil Desa (${id})`,
        subtitle: "Sentra Desa Indonesia",
        description: "Informasi profil kawasan perdesaan, statistik wilayah, dan potensi publik.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
        href: `/detail/?kind=villages&id=${encodeURIComponent(id)}`,
        badge: "Profil Desa",
        body: "Selamat datang di halaman resmi Profil Desa Sentra Desa. Informasi wilayah, statistik, dan potensi perdesaan disajikan secara rinci untuk publik.",
        gallery: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
        ],
        facts: [
          { label: "Kode Desa", value: id },
          { label: "Status", value: "Terverifikasi Publik" }
        ],
        raw: {}
      };
    }
    
    return raw ? mapDetailItem(kind, raw) : null;
  }

  async getHighlights(): Promise<HighlightItem[]> {
    const data = await this.http.get<unknown>("public/highlights");
    if (data === null) return [];
    return unwrapList(data).map((raw) => ({
      id: text(raw.id),
      title: text(raw.title),
      subtitle: text(raw.subtitle) || null,
      image: imageUrl(text(raw.image)),
      link_url: text(raw.link_url) || null,
      link_label: text(raw.link_label) || null,
      sort_order: number(raw.sort_order),
      is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true
    }));
  }
}

function unwrapList(data: unknown): Dictionary[] {
  if (Array.isArray(data)) return data as Dictionary[];
  if (isRecord(data) && Array.isArray(data.data)) return data.data as Dictionary[];
  return [];
}

function unwrapDetail(data: unknown): Dictionary | null {
  if (!isRecord(data)) return null;
  if (isRecord(data.data)) return unwrapDetail(data.data);
  if (isRecord(data.village)) return unwrapDetail(data.village);
  if (isRecord(data.product)) return unwrapDetail(data.product);
  if (isRecord(data.tourism)) return unwrapDetail(data.tourism);
  if (isRecord(data.article)) return unwrapDetail(data.article);
  if (isRecord(data.potential)) return unwrapDetail(data.potential);
  if (isRecord(data.bumdes)) return unwrapDetail(data.bumdes);
  if (isRecord(data.export)) return unwrapDetail(data.export);
  if (isRecord(data.service)) return unwrapDetail(data.service);
  return data;
}

function mapCatalogItem(kind: CatalogKind, raw: Dictionary): CatalogItem {
  const nestedVillage = record(raw.village);
  const rawId = text(raw.id);
  const rawCode = text(raw.code);
  const rawSlug = text(raw.slug);

  const id = rawId || rawSlug || rawCode;
  const slug = rawSlug || rawCode || id;
  const title = titleFor(kind, raw);
  const subtitle = subtitleFor(kind, raw, nestedVillage);
  const description = truncate(text(raw.description) || text(raw.content) || text(raw.summary), 140);
  const image = imageUrl(text(raw.image) || text(raw.cover_image) || text(raw.thumbnail) || text(raw.logo));
  const price = number(raw.price);
  const badge = badgeFor(kind, raw);

  const prefix = pathPrefixes[kind] || "/detail";
  const param = kind === "villages" ? (rawId || id) : (rawSlug || rawId || rawCode);
  const href = `${prefix}/?id=${encodeURIComponent(param)}`;

  return {
    id: rawId || id,
    slug: slug || id,
    title,
    subtitle,
    description,
    image,
    href,
    badge,
    price,
    meta: metaFor(kind, raw, nestedVillage),
    raw
  };
}

function mapDetailItem(kind: CatalogKind, raw: Dictionary): DetailItem {
  const item = mapCatalogItem(kind, raw);
  const villageRaw = record(raw.village);
  const merchantRaw = record(raw.merchant);
  const stats = record(raw.statistics);
  const body = text(raw.description) || text(raw.content) || text(raw.history) || text(raw.summary) || item.description;
  const gallery = galleryUrls(raw.gallery || raw.images || raw.photos);

  const facts: { label: string; value: string }[] = [];

  const villageName = text(villageRaw.name) || text(raw.village_name);
  const locationStr = locationFrom(raw) || locationFrom(villageRaw);

  if (villageName) facts.push({ label: "Desa", value: villageName });
  if (locationStr) facts.push({ label: "Lokasi", value: locationStr });

  if (kind === "products") {
    if (item.badge) facts.push({ label: "Kategori", value: item.badge });
    if (item.price) facts.push({ label: "Harga", value: formatCurrency(item.price) });
    if (text(raw.stock)) facts.push({ label: "Stok", value: `${text(raw.stock)} Pcs` });
    if (text(raw.weight)) facts.push({ label: "Berat", value: `${text(raw.weight)} gram` });
    if (text(merchantRaw.name)) facts.push({ label: "Merchant / Toko", value: text(merchantRaw.name) });
  } else if (kind === "tourisms") {
    if (item.badge) facts.push({ label: "Jenis Wisata", value: item.badge });
    const feeNum = number(raw.fee) ?? number(raw.ticket_price) ?? number(raw.price);
    facts.push({ label: "Harga Tiket (HTM)", value: feeNum ? formatCurrency(feeNum) : text(raw.fee) || "Gratis" });
    if (text(raw.operating_hours)) facts.push({ label: "Jam Operasional", value: text(raw.operating_hours) });
    if (text(raw.facilities)) facts.push({ label: "Fasilitas Utama", value: text(raw.facilities) });
  } else if (kind === "potentials") {
    if (item.badge) facts.push({ label: "Kategori Potensi", value: item.badge });
    if (text(raw.total_area) || text(raw.area_size)) facts.push({ label: "Luas Wilayah", value: `${text(raw.total_area || raw.area_size)} Ha` });
    const econVal = number(raw.economic_value);
    if (econVal) facts.push({ label: "Nilai Ekonomi", value: `${formatCurrency(econVal)} / th` });
    else if (text(raw.economic_value)) facts.push({ label: "Nilai Ekonomi", value: text(raw.economic_value) });
    if (text(raw.production_volume)) facts.push({ label: "Volume Produksi", value: `${text(raw.production_volume)} ton/th` });
    const isReady = raw.is_investment_ready === true || raw.is_investment_ready === 1 || String(raw.development_status).toLowerCase().includes("ready");
    facts.push({ label: "Status Investasi", value: isReady ? "Siap Investasi" : text(raw.status_label) || text(raw.development_status) || "Dalam Pengembangan" });
  } else if (kind === "bumdes") {
    const bumdesBadge = text(raw.performance_category) || item.badge;
    if (bumdesBadge) facts.push({ label: "Kategori Kinerja", value: bumdesBadge });
    if (text(raw.director_name)) facts.push({ label: "Direktur Utama", value: text(raw.director_name) });
    if (text(raw.business_type)) facts.push({ label: "Jenis Usaha", value: text(raw.business_type) });
    if (text(raw.unit_count)) facts.push({ label: "Jumlah Unit Usaha", value: `${text(raw.unit_count)} Unit` });
  } else if (kind === "exports") {
    if (text(raw.destination_country)) facts.push({ label: "Negara Tujuan", value: text(raw.destination_country) });
    if (text(raw.export_volume)) facts.push({ label: "Volume Ekspor", value: text(raw.export_volume) });
    if (text(raw.production_capacity)) facts.push({ label: "Kapasitas Produksi", value: text(raw.production_capacity) });
    if (text(raw.certification)) facts.push({ label: "Sertifikasi", value: text(raw.certification) });
  } else if (kind === "kdmp") {
    if (text(raw.sector)) facts.push({ label: "Sektor Utama", value: text(raw.sector) });
    if (text(raw.member_villages_count)) facts.push({ label: "Desa Anggota", value: `${text(raw.member_villages_count)} Desa` });
    if (text(raw.area_size)) facts.push({ label: "Luas Kawasan", value: `${text(raw.area_size)} Ha` });
  } else if (kind === "services") {
    if (item.badge) facts.push({ label: "Kategori Layanan", value: item.badge });
    if (text(raw.processing_time)) facts.push({ label: "Waktu Proses", value: text(raw.processing_time) });
    const costNum = number(raw.cost);
    facts.push({ label: "Biaya Layanan", value: costNum ? formatCurrency(costNum) : text(raw.cost) || "Gratis" });
    if (text(raw.requirements)) facts.push({ label: "Persyaratan Berkas", value: text(raw.requirements) });
  } else if (kind === "articles") {
    if (item.badge) facts.push({ label: "Kategori", value: item.badge });
    if (text(raw.author)) facts.push({ label: "Penulis", value: text(raw.author) });
    if (text(raw.published_at) || text(raw.created_at)) facts.push({ label: "Tanggal Terbit", value: text(raw.published_at || raw.created_at).split("T")[0] });
  } else if (kind === "lkdd") {
    if (text(raw.fiscal_year) || text(raw.year)) facts.push({ label: "Tahun Anggaran", value: text(raw.fiscal_year || raw.year) });
    const budgetNum = number(raw.total_budget) ?? number(raw.amount);
    if (budgetNum) facts.push({ label: "Total Anggaran", value: formatCurrency(budgetNum) });
    facts.push({ label: "Status Verifikasi", value: text(raw.verification_status) || "Terverifikasi Resmi" });
  } else if (kind === "wishlists") {
    if (item.badge) facts.push({ label: "Kategori", value: item.badge });
    const reqBudget = number(raw.required_budget) ?? number(raw.target_amount);
    if (reqBudget) facts.push({ label: "Anggaran Dibutuhkan", value: formatCurrency(reqBudget) });
    if (text(raw.status)) facts.push({ label: "Status Realisasi", value: text(raw.status) });
  } else if (kind === "villages") {
    if (text(raw.head_name)) facts.push({ label: "Kepala Desa", value: text(raw.head_name) });
    if (text(raw.population)) facts.push({ label: "Populasi", value: `${text(raw.population)} Jiwa` });
    if (text(raw.area_size)) facts.push({ label: "Luas Wilayah", value: `${text(raw.area_size)} Ha` });
    if (text(raw.code)) facts.push({ label: "Kode Desa", value: text(raw.code) });
    if (stats.total_products !== undefined) facts.push({ label: "Total Produk", value: `${text(stats.total_products)} Produk` });
    if (stats.total_tourisms !== undefined) facts.push({ label: "Total Wisata", value: `${text(stats.total_tourisms)} Destinasi` });
  }

  return { ...item, body, gallery, facts };
}

function titleFor(kind: CatalogKind, raw: Dictionary) {
  if (kind === "lkdd") return text(raw.title) || `Laporan Dana Desa ${text(raw.year)}`;
  return text(raw.name) || text(raw.title) || text(raw.store_name) || text(raw.product_name) || "Sentra Desa";
}

function subtitleFor(kind: CatalogKind, raw: Dictionary, village: Dictionary) {
  if (kind === "products" && raw.price) return formatCurrency(number(raw.price));
  if (kind === "exports") return text(raw.destination_country);
  if (kind === "lkdd") return text(raw.fiscal_year) || text(raw.year);
  return locationFrom(raw) || text(village.name);
}

function badgeFor(kind: CatalogKind, raw: Dictionary) {
  return text(raw.category) || text(raw.type) || text(raw.sector) || (kind === "villages" ? "Profil Desa" : "");
}

function metaFor(kind: CatalogKind, raw: Dictionary, village: Dictionary) {
  return [
    locationFrom(raw) || text(village.name),
    kind === "products" && raw.stock ? `Stok ${text(raw.stock)}` : "",
    kind === "exports" ? text(raw.destination_country) : "",
    text(raw.phone)
  ].filter(Boolean);
}

function locationFrom(raw: Dictionary) {
  const district = text(record(raw.district).name) || text(raw.district);
  const regency = text(record(record(raw.district).regency).name) || text(raw.regency);
  const province = text(record(record(record(raw.district).regency).province).name) || text(raw.province);
  return [district, regency, province].filter(Boolean).join(", ");
}

function fact(label: string, value?: string) {
  return value ? { label, value } : null;
}

function galleryUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => imageUrl(text(item))).filter((url): url is string => Boolean(url));
  }
  if (typeof value === "string" && value) {
    const url = imageUrl(value);
    return url ? [url] : [];
  }
  return [];
}

function imageUrl(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `https://sentradesa.id/storage/${path}`;
}

function truncate(str: string, length: number) {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

function isRecord(value: unknown): value is Dictionary {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown): Dictionary {
  return isRecord(value) ? value : {};
}

function text(value: unknown) {
  return stripHtml(value == null ? "" : String(value));
}

function number(value: unknown) {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
