import { CatalogItem, CatalogKind, DetailItem, Dictionary, HighlightItem, ListQuery } from "@/domain/entities/common";
import { HttpClient } from "@/infrastructure/api/http-client";
import { formatCurrency, stripHtml } from "@/shared/utils/format";

const endpoints: Record<CatalogKind, string> = {
  products: "public/products",
  villages: "public/villages",
  tourisms: "public/tourisms",
  articles: "public/articles",
  exports: "public/export-products",
  potentials: "public/village-potentials",
  bumdes: "public/bumdes",
  kdmp: "public/kdmp",
  services: "public/village-services",
  lkdd: "public/lkdd",
  wishlists: "public/wishlists"
};

const pathPrefixes: Record<CatalogKind, string> = {
  products: "/sentra-produk",
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
    slug: "gamelan-bali",
    title: "Gamelan Bali",
    subtitle: "Desa Seni • Rp 2.450.000",
    description: "Alat musik gamelan ukir kayu jati dan perunggu buatan seniman desa Bali.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    href: "/product/gamelan-bali",
    badge: "KERAJINAN",
    price: 2450000,
    meta: ["Desa Seni, Bali"],
    raw: {}
  },
  {
    id: "sample-2",
    slug: "tas-anyaman-bamboo",
    title: "Tas Anyaman Bamboo",
    subtitle: "Desa Kreatif • Rp 125.000",
    description: "Tas ramah lingkungan buatan tangan dari serat bambu & rotan desa pilihan.",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop&q=80",
    href: "/product/tas-anyaman-bamboo",
    badge: "KERAJINAN",
    price: 125000,
    meta: ["Desa Kreatif, Tasikmalaya"],
    raw: {}
  },
  {
    id: "sample-3",
    slug: "kacang-gurih",
    title: "Kacang Gurih",
    subtitle: "Desa Banjar Agung • Rp 22.000",
    description: "Kacang Gurih sangat gurih, renyah dan enak olahan petani lokal.",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
    href: "/product/kacang-gurih",
    badge: "MAKANAN_MINUMAN",
    price: 22000,
    meta: ["Desa Banjar Agung, OKU Selatan"],
    raw: {}
  },
  {
    id: "sample-4",
    slug: "keripik-singkong-pedas-manis",
    title: "Keripik Singkong Pedas Manis",
    subtitle: "Desa Sukamaju • Rp 18.000",
    description: "Keripik singkong renyah dengan bumbu pedas manis istimewa khas desa.",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    href: "/product/keripik-singkong-pedas-manis",
    badge: "MAKANAN_MINUMAN",
    price: 18000,
    meta: ["Desa Sukamaju, Kab. Bandung"],
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

export const sampleArticles: CatalogItem[] = [
  {
    id: "art-1",
    slug: "panen-raya-padi-organik-tembus-rekor-baru",
    title: "Panen Raya Padi Organik Tembus Rekor Baru di Desa Sukamaju",
    subtitle: "Desa Sukamaju, Kab. Bandung",
    description: "Petani desa sukses meningkatkan produktivitas panen hingga 30% menggunakan teknologi pupuk hayati mandiri ramah lingkungan.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
    href: "/artikel/?id=panen-raya-padi-organik-tembus-rekor-baru",
    badge: "Pertanian",
    meta: ["Desa Sukamaju, Kab. Bandung", "14 Sep 2026", "Humas Desa"],
    raw: {
      author: "Tim Humas Desa",
      published_at: "2026-09-14",
      category: "Pertanian",
      content: "<p>Kegiatan panen raya padi organik di desa berhasil mencatatkan hasil gemilang. Dengan penerapan teknologi pertanian presisi dan penggunaan pupuk hayati ramah lingkungan, para petani sukses mencatatkan surplus panen yang kini siap disalurkan ke pasar regional dan nasional.</p><p>Kepala Desa menyatakan komitmennya untuk terus mendukung sarana irigasi tersier dan pembinaan berkelanjutan bagi kelompok tani lokal guna memperkuat kedaulatan pangan desa.</p>"
    }
  },
  {
    id: "art-2",
    slug: "pengembangan-destinasi-ekowisata-berbasis-komunitas",
    title: "Pengembangan Destinasi Ekowisata Berbasis Komunitas Warga",
    subtitle: "Desa Kedewatan, Gianyar, Bali",
    description: "Inisiatif desa dalam membuka akses wisata alam berbasis kelestarian lingkungan dan pemberdayaan pemuda pengrajin lokal.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    href: "/artikel/?id=pengembangan-destinasi-ekowisata-berbasis-komunitas",
    badge: "Wisata",
    meta: ["Desa Kedewatan, Bali", "12 Sep 2026", "Pokdarwis Desa"],
    raw: {
      author: "Pokdarwis Desa",
      published_at: "2026-09-12",
      category: "Wisata",
      content: "<p>Melalui musyawarah desa, disepakati pembukaan rute jelajah alam dan konservasi mata air sebagai daya tarik ekowisata percontohan. Diharapkan langkah ini membuka peluang ekonomi baru bagi pengrajin cenderamata dan pemandu lokal.</p>"
    }
  },
  {
    id: "art-3",
    slug: "digitalisasi-umkm-desa-pasar-ekspor",
    title: "Digitalisasi UMKM Desa: Dari Pasar Tradisional ke Pasar Ekspor",
    subtitle: "Desa Cibadak, Kab. Bogor",
    description: "Pelatihan packaging dan branding produk olahan pangan lokal mengantarkan produk perdesaan merambah pasar luar negeri.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    href: "/artikel/?id=digitalisasi-umkm-desa-pasar-ekspor",
    badge: "UMKM",
    meta: ["Desa Cibadak, Kab. Bogor", "10 Sep 2026", "Pendamping Desa"],
    raw: {
      author: "Pendamping Desa",
      published_at: "2026-09-10",
      category: "UMKM",
      content: "<p>Produk olahan seperti keripik singkong, madu hutan, dan virgin coconut oil (VCO) asal desa kini mendapatkan sertifikasi halal dan standar mutu ekspor. Transformasi digital ini difasilitasi oleh platform Sentra Desa.</p>"
    }
  },
  {
    id: "art-4",
    slug: "transparansi-realisasi-dana-desa-semester-1",
    title: "Transparansi Realisasi Dana Desa Semester I Berjalan Akuntabel",
    subtitle: "Desa Leuwiliang, Kab. Bogor",
    description: "Pemerintah Desa mempublikasikan rincian APBDes secara terbuka melalui papan informasi dan portal digital Sentra Desa.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
    href: "/artikel/?id=transparansi-realisasi-dana-desa-semester-1",
    badge: "Transparansi",
    meta: ["Desa Leuwiliang, Kab. Bogor", "08 Sep 2026", "Sekretariat Desa"],
    raw: {
      author: "Sekretariat Desa",
      published_at: "2026-09-08",
      category: "Transparansi",
      content: "<p>Sebagai wujud pertanggungjawaban publik, pemdes memaparkan realisasi belanja bidang infrastruktur jalan usaha tani, penanganan stunting, dan bantuan permodalan BUMDes secara transparan dan akuntabel.</p>"
    }
  }
];

export const sampleLkdd: CatalogItem[] = [
  {
    id: "lkdd-1",
    slug: "lkdd-ta-2025-desa-sukamaju",
    title: "Laporan Keuangan Dana Desa TA 2025",
    subtitle: "Desa Sukamaju, Kab. Bandung",
    description: "Publikasi transparansi pertanggungjawaban realisasi anggaran pendapatan dan belanja desa (APBDes) TA 2025.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80",
    href: "/lkdd/?id=lkdd-1",
    badge: "TA 2025",
    price: 1485000000,
    meta: ["Desa Sukamaju, Kab. Bandung", "Realisasi 94.2%", "Terverifikasi Resmi"],
    raw: {
      fiscal_year: 2025,
      total_budget: 1485000000,
      realization_percentage: 94.2,
      head_name: "H. Suryadi, S.Sos",
      head_title: "Kepala Desa",
      dana_desa: 890000000,
      alokasi_dana_desa: 245000000,
      pendapatan_asli_desa: 85000000,
      bagi_hasil_pajak: 42000000,
      belanja_pembangunan: 620000000,
      belanja_pemerintahan: 380000000,
      belanja_pembinaan: 95000000,
      belanja_pemberdayaan: 145000000,
      belanja_bencana: 45000000,
      silpa: 18500000,
      verification_status: "Terverifikasi Resmi"
    }
  },
  {
    id: "lkdd-2",
    slug: "lkdd-ta-2024-desa-kedewatan",
    title: "Laporan Keuangan Dana Desa TA 2024",
    subtitle: "Desa Kedewatan, Gianyar, Bali",
    description: "Realisasi anggaran terfokus pada jalan lingkungan, sanitasi bersih, dan saluran drainase permukiman desa.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    href: "/lkdd/?id=lkdd-2",
    badge: "TA 2024",
    price: 1280000000,
    meta: ["Desa Kedewatan, Bali", "Realisasi 96.8%", "Terverifikasi Resmi"],
    raw: {
      fiscal_year: 2024,
      total_budget: 1280000000,
      realization_percentage: 96.8,
      head_name: "Drs. I Wayan Sudarma",
      head_title: "Perbekel / Kepala Desa",
      dana_desa: 780000000,
      alokasi_dana_desa: 210000000,
      pendapatan_asli_desa: 110000000,
      belanja_pembangunan: 540000000,
      belanja_pemerintahan: 310000000,
      belanja_pembinaan: 75000000,
      belanja_pemberdayaan: 120000000,
      belanja_bencana: 30000000,
      silpa: 12000000,
      verification_status: "Terverifikasi Resmi"
    }
  },
  {
    id: "lkdd-3",
    slug: "lkdd-ta-2025-semester-1-cibadak",
    title: "Laporan APBDes Semester I TA 2025",
    subtitle: "Desa Cibadak, Kab. Bogor",
    description: "Laporan capaian serapan anggaran semester pertama untuk penanganan stunting dan bantuan modal BUMDes.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    href: "/lkdd/?id=lkdd-3",
    badge: "Semester I 2025",
    price: 760000000,
    meta: ["Desa Cibadak, Kab. Bogor", "Realisasi 91.5%", "Terverifikasi Resmi"],
    raw: {
      fiscal_year: 2025,
      period: "semester_1",
      total_budget: 760000000,
      realization_percentage: 91.5,
      head_name: "Bambang Prasetyo",
      head_title: "Kepala Desa",
      dana_desa: 490000000,
      alokasi_dana_desa: 135000000,
      pendapatan_asli_desa: 60000000,
      belanja_pembangunan: 340000000,
      belanja_pemerintahan: 190000000,
      belanja_pembinaan: 48000000,
      belanja_pemberdayaan: 85000000,
      silpa: 9500000,
      verification_status: "Terverifikasi Resmi"
    }
  }
];

export const sampleWishlists: CatalogItem[] = [
  {
    id: "wish-1",
    slug: "saluran-irigasi-tersier-blok-sawah-timur",
    title: "Pembangunan Saluran Irigasi Tersier Blok Sawah Timur",
    subtitle: "Desa Sukamaju, Kab. Bandung",
    description: "Dibutuhkan semenisasi saluran irigasi sepanjang 800 meter untuk mengairi 45 hektar lahan persawahan tadah hujan.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    href: "/wishlist/?id=wish-1",
    badge: "Pertanian",
    price: 85000000,
    meta: ["Desa Sukamaju, Kab. Bandung", "Target: 800 Meter", "Status: Terbuka"],
    raw: {
      category: "Pertanian",
      required_budget: 85000000,
      raised_budget: 45000000,
      quantity: 800,
      unit: "meter",
      status: "Terbuka",
      needed_by: "November 2026"
    }
  },
  {
    id: "wish-2",
    slug: "pengadaan-alat-mesin-pengering-gabah-dryer",
    title: "Pengadaan Alat Mesin Pengering Gabah (Dryer) Poktan",
    subtitle: "Desa Banjar Agung, OKU Selatan",
    description: "Mesin pengering gabah kapasitas 5 ton/hari guna mengatasi kendala penjemuran saat musim penghujan dan menjaga kualitas beras.",
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80",
    href: "/wishlist/?id=wish-2",
    badge: "Pertanian",
    price: 120000000,
    meta: ["Desa Banjar Agung, OKU Selatan", "Target: 1 Unit", "Status: Terbuka"],
    raw: {
      category: "Pertanian",
      required_budget: 120000000,
      raised_budget: 72000000,
      quantity: 1,
      unit: "unit",
      status: "Terbuka",
      needed_by: "Oktober 2026"
    }
  },
  {
    id: "wish-3",
    slug: "pembangunan-gazebo-dan-sanitasi-wisata-bukit",
    title: "Pembangunan Gazebo & Sanitasi Wisata Bukit",
    subtitle: "Desa Kedewatan, Gianyar, Bali",
    description: "Penyediaan 6 unit gazebo peristirahatan dan toilet umum standar wisata untuk meningkatkan kenyamanan wisatawan.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    href: "/wishlist/?id=wish-3",
    badge: "Pariwisata",
    price: 65000000,
    meta: ["Desa Kedewatan, Bali", "Target: 6 Unit Gazebo", "Status: Terbuka"],
    raw: {
      category: "Pariwisata",
      required_budget: 65000000,
      raised_budget: 38000000,
      quantity: 6,
      unit: "unit",
      status: "Terbuka",
      needed_by: "Desember 2026"
    }
  },
  {
    id: "wish-4",
    slug: "pelatihan-barista-dan-pengolahan-kopi-lokal",
    title: "Pelatihan Barista & Pengolahan Kopi Lokal",
    subtitle: "Desa Argopuro, Kab. Jember",
    description: "Program pemberdayaan pemuda desa melalui pelatihan roasting, brewing, dan manajemen kedai kopi sentra desa.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
    href: "/wishlist/?id=wish-4",
    badge: "SDM & Kejuruan",
    price: 35000000,
    meta: ["Desa Argopuro, Jember", "Target: 25 Pemuda", "Status: Terbuka"],
    raw: {
      category: "SDM",
      required_budget: 35000000,
      raised_budget: 28000000,
      quantity: 25,
      unit: "peserta",
      status: "Terbuka",
      needed_by: "Oktober 2026"
    }
  }
];

export const sampleKdmp: CatalogItem[] = [
  {
    id: "2",
    slug: "kdmp-labbajau-001",
    title: "Koperasi Desa Merah Putih Labuan Bajo",
    subtitle: "Labuan Bajo, Manggarai Barat, NTT",
    description: "Koperasi Desa Merah Putih Labuhan Bajau berfokus pada pengembangan sektor perikanan dan perdagangan hasil laut serta simpan pinjam.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    href: "/kdmp/?id=2",
    badge: "KDMP AKTIF",
    meta: ["Labuan Bajo, NTT", "189 Anggota", "Aset Rp 580 Juta"],
    raw: {
      code: "KDMP-LABBAJAU-001",
      nomor_badan_hukum: "0002/BH/KDMP/2025",
      status: "aktif",
      ketua_name: "Bapak Ridwan Nainggolan",
      sekretaris_name: "Bapak Dodi Hartono",
      bendahara_name: "Ibu Nurhasanah",
      total_members: 189,
      modal_awal: 200000000,
      total_assets: 580000000,
      unit_usaha: ["simpan_pinjam", "perikanan", "perdagangan"],
      phone: "6281234567890"
    }
  }
];

export const sampleExports: CatalogItem[] = [
  {
    id: "udang-vaname-beku",
    slug: "udang-vaname-beku",
    title: "Udang Vaname Beku",
    subtitle: "Tujuan: Jepang, USA, Uni Eropa",
    description: "Komoditas udang vaname beku kualitas premium hasil budidaya tambak pesisir ramah lingkungan berstandar sertifikasi ekspor internasional.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    href: "/desa-ekspor/?id=udang-vaname-beku",
    badge: "HS 030617",
    meta: ["Pesisir Desa", "50 Ton / Bulan", "Siap Ekspor"],
    raw: {
      hs_code: "030617",
      destination_countries: ["Jepang", "USA", "Uni Eropa"],
      export_status: "siap_ekspor",
      export_volume: 50,
      unit: "Ton / Bulan",
      certifications: ["HACCP", "BAP", "ASC"],
      contact_person: "Bapak Hadi 3",
      contact_phone: "6281234567890"
    }
  }
];

export const sampleVillages: CatalogItem[] = [
  {
    id: "51080317",
    slug: "51080317",
    title: "Desa Cibadak",
    subtitle: "Ciampea, Kab. Bogor, Jawa Barat",
    description: "Desa Cibadak memiliki potensi besar di bidang pertanian, pariwisata, dan UMKM. Masyarakat desa aktif mengembangkan produk unggulan daerah.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080317",
    badge: "Profil Desa",
    meta: ["Ciampea, Kab. Bogor, Jawa Barat", "6.302 Jiwa", "45.79 Ha"],
    raw: {
      id: 51080317,
      code: "3201032002",
      name: "Desa Cibadak",
      population: 6302,
      area_size: "45.79",
      head_name: "Kepala Desa Desa Cibadak",
      district: {
        name: "Ciampea",
        regency: {
          name: "KABUPATEN BOGOR",
          province: { name: "JAWA BARAT" }
        }
      }
    }
  },
  {
    id: "51080356",
    slug: "51080356",
    title: "Desa Kedewatan",
    subtitle: "Ubud, Kab. Badung, Bali",
    description: "Desa Kedewatan memiliki keunggulan ekowisata perbukitan, kerajinan seni ukir, dan budaya agraris yang lestari.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080356",
    badge: "Profil Desa",
    meta: ["Ubud, Kab. Badung, Bali", "4.164 Jiwa", "27.52 Ha"],
    raw: {
      id: 51080356,
      code: "5108032006",
      name: "Desa Kedewatan",
      population: 4164,
      area_size: "27.52",
      head_name: "Kepala Desa Desa Kedewatan",
      district: {
        name: "Ubud",
        regency: {
          name: "KABUPATEN BADUNG",
          province: { name: "BALI" }
        }
      }
    }
  },
  {
    id: "51080309",
    slug: "51080309",
    title: "Desa Leuwiliang",
    subtitle: "Leuwiliang, Kab. Bogor, Jawa Barat",
    description: "Pusat perniagaan dan sentra komoditas pertanian perbukitan dengan kelembagaan ekonomi desa yang produktif.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080309",
    badge: "Profil Desa",
    meta: ["Leuwiliang, Kab. Bogor, Jawa Barat", "12.050 Jiwa", "28.23 Ha"],
    raw: {
      id: 51080309,
      code: "3201022001",
      name: "Desa Leuwiliang",
      population: 12050,
      area_size: "28.23",
      head_name: "Kepala Desa Desa Leuwiliang",
      district: {
        name: "Leuwiliang",
        regency: {
          name: "KABUPATEN BOGOR",
          province: { name: "JAWA BARAT" }
        }
      }
    }
  },
  {
    id: "51080347",
    slug: "51080347",
    title: "Desa Lukluk",
    subtitle: "Mengwi, Kab. Badung, Bali",
    description: "Desa agraris dengan sistem subak tradisional yang terawat serta sentra pengrajin cenderamata lokal khas Bali.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080347",
    badge: "Profil Desa",
    meta: ["Mengwi, Kab. Badung, Bali", "6.280 Jiwa", "23.24 Ha"],
    raw: {
      id: 51080347,
      code: "5108022003",
      name: "Desa Lukluk",
      population: 6280,
      area_size: "23.24",
      head_name: "Kepala Desa Desa Lukluk",
      district: {
        name: "Mengwi",
        regency: {
          name: "KABUPATEN BADUNG",
          province: { name: "BALI" }
        }
      }
    }
  },
  {
    id: "51080308",
    slug: "51080308",
    title: "Desa Sukaluyu",
    subtitle: "Nanggung, Kab. Bogor, Jawa Barat",
    description: "Kawasan pertanian terpadu dan perkebunan teh rakyat dengan pemandangan pegunungan asri.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080308",
    badge: "Profil Desa",
    meta: ["Nanggung, Kab. Bogor, Jawa Barat", "8.808 Jiwa", "18.86 Ha"],
    raw: {
      id: 51080308,
      code: "3201012009",
      name: "Desa Sukaluyu",
      population: 8808,
      area_size: "18.86",
      head_name: "Kepala Desa Desa Sukaluyu",
      district: {
        name: "Nanggung",
        regency: {
          name: "KABUPATEN BOGOR",
          province: { name: "JAWA BARAT" }
        }
      }
    }
  },
  {
    id: "51080328",
    slug: "51080328",
    title: "Desa Sukawening",
    subtitle: "Ciwidey, Kab. Bandung, Jawa Barat",
    description: "Sentra hortikultura dataran tinggi, agrowisata stroberi, dan pengolahan produk organik masyarakat Ciwidey.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    href: "/profil-desa/?id=51080328",
    badge: "Profil Desa",
    meta: ["Ciwidey, Kab. Bandung, Jawa Barat", "4.331 Jiwa", "9.03 Ha"],
    raw: {
      id: 51080328,
      code: "3204012007",
      name: "Desa Sukawening",
      population: 4331,
      area_size: "9.03",
      head_name: "Kepala Desa Desa Sukawening",
      district: {
        name: "Ciwidey",
        regency: {
          name: "KABUPATEN BANDUNG",
          province: { name: "JAWA BARAT" }
        }
      }
    }
  }
];

export const sampleTourisms: CatalogItem[] = [
  {
    id: "tour-1",
    slug: "bukit-campuhan-ekowisata",
    title: "Bukit Campuhan Ekowisata",
    subtitle: "Desa Kedewatan, Ubud, Bali",
    description: "Jalur trekking punggung bukit hijau nan asri dengan panorama lembah sungai dan hembusan angin segar pegunungan Ubud.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80",
    href: "/desa-wisata/?id=tour-1",
    badge: "Wisata Alam",
    price: 15000,
    meta: ["Desa Kedewatan, Ubud, Bali", "Tiket Rp 15.000", "Buka 06.00 - 18.00"],
    raw: { category: "alam", entrance_fee: 15000, village: { name: "Desa Kedewatan" } }
  },
  {
    id: "tour-2",
    slug: "air-terjun-curug-luhur",
    title: "Air Terjun Curug Luhur",
    subtitle: "Desa Cibadak, Ciampea, Bogor",
    description: "Destinasi wisata air terjun kembar alami dengan kolam pemandian mata air pegunungan yang jernih dan sejuk.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
    href: "/desa-wisata/?id=tour-2",
    badge: "Wisata Alam",
    price: 20000,
    meta: ["Desa Cibadak, Ciampea, Bogor", "Tiket Rp 20.000", "Buka 07.00 - 17.00"],
    raw: { category: "alam", entrance_fee: 20000, village: { name: "Desa Cibadak" } }
  },
  {
    id: "tour-3",
    slug: "desa-wisata-budaya-lukluk",
    title: "Desa Wisata Budaya Lukluk",
    subtitle: "Desa Lukluk, Mengwi, Bali",
    description: "Pusat pelestarian seni tari, arsitektur pura tradisional, dan kerajinan ukir kayu khas perdesaan Badung.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&auto=format&fit=crop&q=80",
    href: "/desa-wisata/?id=tour-3",
    badge: "Wisata Budaya",
    price: 25000,
    meta: ["Desa Lukluk, Mengwi, Bali", "Tiket Rp 25.000", "Buka Setiap Hari"],
    raw: { category: "budaya", entrance_fee: 25000, village: { name: "Desa Lukluk" } }
  }
];

export const samplePotentials: CatalogItem[] = [
  {
    id: "pot-1",
    slug: "pertanian-kopi-arabika-organik",
    title: "Perkebunan Kopi Arabika Organik",
    subtitle: "Desa Sukawening, Ciwidey, Bandung",
    description: "Potensi perkebunan kopi arabika dataran tinggi 1.400 mdpl dengan kapasitas panen 35 ton per tahun dan standar mutu ekspor.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    href: "/potensi-desa/?id=pot-1",
    badge: "Perkebunan",
    price: 450000000,
    meta: ["Desa Sukawening, Ciwidey", "Luas 25 Ha", "Siap Investasi"],
    raw: { sector: "perkebunan", area_size: "25", economic_value: 450000000, is_investment_ready: true, village: { name: "Desa Sukawening" } }
  },
  {
    id: "pot-2",
    slug: "budidaya-vanili-organik-premium",
    title: "Budidaya Vanili Organik Premium",
    subtitle: "Desa Kedewatan, Ubud, Bali",
    description: "Sentra perkebunan vanili organik kualitas ekspor dengan sistem greenhouse modern dan kemitraan kelompok tani.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    href: "/potensi-desa/?id=pot-2",
    badge: "Pertanian",
    price: 320000000,
    meta: ["Desa Kedewatan, Ubud, Bali", "Luas 12 Ha", "Siap Investasi"],
    raw: { sector: "pertanian", area_size: "12", economic_value: 320000000, is_investment_ready: true, village: { name: "Desa Kedewatan" } }
  }
];

export const sampleBumdes: CatalogItem[] = [
  {
    id: "bum-1",
    slug: "bumdes-makmur-jaya",
    title: "BUMDes Makmur Jaya",
    subtitle: "Desa Sukaluyu, Nanggung, Bogor",
    description: "Badan Usaha Milik Desa yang mengelola unit perdagangan pupuk, simpan pinjam produktif, dan logistik panen pertanian.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    href: "/bumdes/?id=bum-1",
    badge: "BUMDes Maju",
    meta: ["Desa Sukaluyu, Nanggung, Bogor", "3 Unit Usaha", "25 Karyawan"],
    raw: { performance_category: "maju", director_name: "Direktur Ahmad", unit_count: 3, village: { name: "Desa Sukaluyu" } }
  },
  {
    id: "bum-2",
    slug: "bumdes-sejahtera-mandiri",
    title: "BUMDes Sejahtera Mandiri",
    subtitle: "Desa Lukluk, Mengwi, Bali",
    description: "Pengembangan potensi desa di bidang unit pengelola ekowisata, sentra oleh-oleh kerajinan, dan peternakan terpadu.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    href: "/bumdes/?id=bum-2",
    badge: "BUMDes Berkembang",
    meta: ["Desa Lukluk, Mengwi, Bali", "3 Unit Usaha", "18 Karyawan"],
    raw: { performance_category: "berkembang", director_name: "Direktur Budi", unit_count: 3, village: { name: "Desa Lukluk" } }
  }
];

const fallbackCatalogMap: Partial<Record<CatalogKind, CatalogItem[]>> = {
  villages: sampleVillages,
  products: sampleProducts,
  articles: sampleArticles,
  tourisms: sampleTourisms,
  potentials: samplePotentials,
  bumdes: sampleBumdes,
  lkdd: sampleLkdd,
  wishlists: sampleWishlists,
  kdmp: sampleKdmp,
  exports: sampleExports
};

export class LaravelPublicRepository {
  constructor(private readonly http = new HttpClient()) {}

  async list(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[]> {
    return (await this.listFresh(kind, query)) ?? [];
  }

  async listFresh(kind: CatalogKind, query?: ListQuery): Promise<CatalogItem[] | null> {
    if (kind === "services") {
      const [vsRes, cRes] = await Promise.all([
        this.http.get<unknown>("public/village-services", query).catch(() => null),
        this.http.get<unknown>("public/contents", query).catch(() => null)
      ]);

      const vsItems = vsRes !== null ? unwrapList(vsRes) : [];
      const cItems = cRes !== null ? unwrapList(cRes) : [];

      const mappedVs = vsItems.map((item) =>
        mapCatalogItem("services", {
          ...item,
          __source: "village-services",
          badge: item.category ? String(item.category).replace(/_/g, " ").toUpperCase() : "LAYANAN PUBLIK"
        })
      );

      const mappedContents = cItems.map((item) =>
        mapCatalogItem("services", {
          ...item,
          __source: "contents",
          name: item.name || item.title,
          badge: item.category ? String(item.category).replace(/_/g, " ").toUpperCase() : "INFORMASI DESA"
        })
      );

      const combined = [...mappedVs, ...mappedContents];
      if (combined.length > 0) {
        if (query?.category && query.category !== "all") {
          const cat = String(query.category).toLowerCase();
          const filtered = combined.filter((c) =>
            String(c.badge || "").toLowerCase().includes(cat) ||
            String(c.raw?.category || "").toLowerCase().includes(cat)
          );
          return filtered.length > 0 ? filtered : combined;
        }
        return combined;
      }
    } else {
      const data = await this.http.get<unknown>(endpoints[kind], query);
      const items = data !== null ? unwrapList(data) : [];
      if (items.length > 0) {
        return items.map((item) => mapCatalogItem(kind, item));
      }
    }

    // Fallback sample data if API returned empty array or null
    const samples = fallbackCatalogMap[kind];
    if (samples && samples.length > 0) {
      if (query?.category && query.category !== "all") {
        const filtered = samples.filter((s) => s.badge?.toLowerCase().includes(String(query.category).toLowerCase()));
        return filtered.length > 0 ? filtered : samples;
      }
      return samples;
    }

    return [];
  }

  async detail(kind: CatalogKind, id: string): Promise<DetailItem | null> {
    let data: unknown = null;
    if (kind === "services") {
      data = await this.http.get<unknown>(`public/village-services/${id}`).catch(() => null);
      if (!data) {
        data = await this.http.get<unknown>(`public/contents/${id}`).catch(() => null);
      }
      if (!data) {
        const [vsRes, cRes] = await Promise.all([
          this.http.get<unknown>("public/village-services", { search: id }).catch(() => null),
          this.http.get<unknown>("public/contents", { search: id }).catch(() => null)
        ]);
        const all = [...unwrapList(vsRes), ...unwrapList(cRes)];
        const match = all.find((item) => text(item.slug) === id || text(item.id) === id);
        if (match) data = match;
      }
    } else if (kind === "villages") {
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

    const raw = unwrapDetail(data, kind);
    
    if (!raw) {
      const samples = fallbackCatalogMap[kind];
      if (samples && samples.length > 0) {
        const match = samples.find((p) => p.id === id || p.slug === id) || samples[0];
        if (match) {
          const rawItem = {
            ...match.raw,
            id: match.id,
            slug: match.slug,
            title: match.title,
            name: match.title,
            description: match.description,
            image: match.image,
            price: match.price,
            badge: match.badge
          };
          return mapDetailItem(kind, rawItem);
        }
      }

      if (kind === "villages") {
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

  async getProvinces(): Promise<{ id: number; name: string }[]> {
    const data = await this.http.get<unknown>("public/provinces");
    if (!data) return [];
    return unwrapList(data).map((raw) => ({
      id: Number(raw.id),
      name: String(raw.name)
    }));
  }
}

export function unwrapList(data: unknown): Dictionary[] {
  if (Array.isArray(data)) return data as Dictionary[];
  if (isRecord(data)) {
    if (Array.isArray(data.data)) return data.data as Dictionary[];
    if (isRecord(data.data) && Array.isArray(data.data.data)) return data.data.data as Dictionary[];
  }
  return [];
}

function unwrapDetail(data: unknown, kind?: CatalogKind): Dictionary | null {
  if (!isRecord(data)) return null;
  if (isRecord(data.data)) return unwrapDetail(data.data, kind);
  if (kind === "villages" && isRecord(data.village)) {
    return {
      ...data,
      ...data.village,
      village: data.village
    };
  }
  if (isRecord(data.product)) return unwrapDetail(data.product, kind);
  if (isRecord(data.tourism)) return unwrapDetail(data.tourism, kind);
  if (isRecord(data.article)) return unwrapDetail(data.article, kind);
  if (isRecord(data.potential)) return unwrapDetail(data.potential, kind);
  if (isRecord(data.bumdes)) return unwrapDetail(data.bumdes, kind);
  if (isRecord(data.export)) return unwrapDetail(data.export, kind);
  if (isRecord(data.service)) return unwrapDetail(data.service, kind);
  return data;
}

export function mapCatalogItem(kind: CatalogKind, raw: Dictionary): CatalogItem {
  const nestedVillage = record(raw.village);
  const rawId = text(raw.id);
  const rawCode = text(raw.code);
  const rawSlug = text(raw.slug);

  const id = rawId || rawSlug || rawCode;
  const slug = rawSlug || rawCode || id;
  const title = titleFor(kind, raw);
  const subtitle = subtitleFor(kind, raw, nestedVillage);
  const description = truncate(text(raw.description) || text(raw.content) || text(raw.summary), 140);
  const image =
    imageUrl(text(raw.image) || text(raw.cover_image) || text(raw.thumbnail) || text(raw.logo)) ||
    (kind === "villages"
      ? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80"
      : kind === "potentials"
      ? "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80"
      : kind === "products"
      ? fallbackProductImage(raw)
      : undefined);
  const price = number(raw.price);
  const badge = badgeFor(kind, raw);

  const prefix = pathPrefixes[kind] || "/detail";
  const param = (kind === "villages" || kind === "potentials") ? (rawId || id) : (rawSlug || rawId || rawCode);
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
    const discountPrice = number(raw.discount_price);
    if (discountPrice && item.price && discountPrice < item.price) {
      facts.push({ label: "Harga Promo", value: formatCurrency(discountPrice) });
    }
    if (text(raw.stock)) facts.push({ label: "Stok", value: `${text(raw.stock)} Pcs` });
    if (text(raw.weight)) facts.push({ label: "Berat", value: `${text(raw.weight)} gram` });
    const storeName = text(merchantRaw.store_name) || text(merchantRaw.name) || text(raw.merchant_name) || text(raw.store_name);
    if (storeName) facts.push({ label: "Merchant / Toko", value: storeName });
  } else if (kind === "tourisms") {
    if (item.badge) facts.push({ label: "Jenis Wisata", value: item.badge });
    const feeNum = number(raw.entrance_fee) ?? number(raw.fee) ?? number(raw.ticket_price) ?? number(raw.price);
    facts.push({ label: "Harga Tiket (HTM)", value: feeNum ? formatCurrency(feeNum) : text(raw.entrance_fee || raw.fee) || "Gratis" });
    if (text(raw.opening_hours || raw.operating_hours)) facts.push({ label: "Jam Operasional", value: text(raw.opening_hours || raw.operating_hours) });
    if (text(raw.facilities)) facts.push({ label: "Fasilitas Utama", value: text(raw.facilities) });
  } else if (kind === "potentials") {
    if (item.badge) facts.push({ label: "Kategori Potensi", value: item.badge });
    if (text(raw.total_area) || text(raw.area_size)) facts.push({ label: "Luas Wilayah", value: `${text(raw.total_area || raw.area_size)} Ha` });
    const econVal = number(raw.economic_value);
    if (econVal) facts.push({ label: "Nilai Ekonomi", value: `${formatCurrency(econVal)} / th` });
    else if (text(raw.economic_value)) facts.push({ label: "Nilai Ekonomi", value: text(raw.economic_value) });
    if (text(raw.production_volume)) facts.push({ label: "Volume Produksi", value: `${text(raw.production_volume)} ton/th` });
    const isReady = raw.is_investment_ready === true || raw.is_investment_ready === 1 || String(raw.development_status).toLowerCase().includes("ready") || String(raw.development_status).toLowerCase().includes("produktif");
    facts.push({ label: "Status Investasi", value: isReady ? "Siap Investasi" : text(raw.status_label) || text(raw.development_status) || "Dalam Pengembangan" });
    if (text(raw.investment_needs)) facts.push({ label: "Kebutuhan Investasi", value: text(raw.investment_needs) });
    if (text(raw.development_status)) facts.push({ label: "Status Pengembangan", value: text(raw.development_status) });
  } else if (kind === "bumdes") {
    const bumdesBadge = text(raw.performance_category) || item.badge;
    if (bumdesBadge) facts.push({ label: "Kategori Kinerja", value: bumdesBadge });
    if (text(raw.legal_number)) facts.push({ label: "Legalitas AHU", value: text(raw.legal_number) });
    if (text(raw.director_name)) facts.push({ label: "Direktur Utama", value: text(raw.director_name) });
    const unitCount = Array.isArray(raw.business_units) ? raw.business_units.length : number(raw.unit_count);
    if (unitCount) facts.push({ label: "Unit Usaha Aktif", value: `${unitCount} Unit Usaha` });
    const rev = number(raw.annual_revenue) ?? number(raw.annual_turnover);
    if (rev) facts.push({ label: "Omset Tahunan", value: formatCurrency(rev) });
    const cap = number(raw.initial_capital);
    if (cap) facts.push({ label: "Modal Awal", value: formatCurrency(cap) });
    if (text(raw.employee_count) && Number(raw.employee_count) > 0) facts.push({ label: "Tenaga Kerja", value: `${text(raw.employee_count)} Orang` });
  } else if (kind === "exports") {
    if (text(raw.hs_code)) facts.push({ label: "HS Code", value: text(raw.hs_code) });
    if (text(raw.export_status)) facts.push({ label: "Status Ekspor", value: text(raw.export_status).replace(/_/g, " ").toUpperCase() });
    const dests = Array.isArray(raw.destination_countries) ? raw.destination_countries.join(", ") : text(raw.destination_country);
    if (dests) facts.push({ label: "Negara Tujuan", value: dests });
    if (text(raw.export_volume)) facts.push({ label: "Kapasitas / Volume", value: `${text(raw.export_volume)} ${text(raw.unit || "Ton")}` });
    const certList = Array.isArray(raw.certifications) ? raw.certifications.join(", ") : text(raw.certification);
    if (certList) facts.push({ label: "Sertifikasi Mutu", value: certList });
    if (text(raw.contact_person)) facts.push({ label: "Kontak Koperasi / PIC", value: text(raw.contact_person) });
    if (text(raw.contact_phone || raw.phone)) facts.push({ label: "Telepon / WA", value: text(raw.contact_phone || raw.phone) });
    if (raw.has_export_license !== undefined) facts.push({ label: "Izin Ekspor", value: raw.has_export_license ? "Memiliki Izin Resmi" : "Proses Pengurusan" });
  } else if (kind === "kdmp") {
    if (text(raw.code)) facts.push({ label: "Kode KDMP", value: text(raw.code) });
    if (text(raw.nomor_badan_hukum)) facts.push({ label: "Legalitas Badan Hukum", value: text(raw.nomor_badan_hukum) });
    if (text(raw.status)) facts.push({ label: "Status Operasional", value: text(raw.status).toUpperCase() });
    if (text(raw.ketua_name)) facts.push({ label: "Ketua Koperasi", value: text(raw.ketua_name) });
    const units = Array.isArray(raw.unit_usaha) ? raw.unit_usaha.join(", ") : text(raw.sector);
    if (units) facts.push({ label: "Unit Usaha", value: units });
    if (text(raw.total_members) && Number(raw.total_members) > 0) facts.push({ label: "Jumlah Anggota", value: `${text(raw.total_members)} Orang` });
    const modal = number(raw.modal_awal);
    if (modal) facts.push({ label: "Modal Awal", value: formatCurrency(modal) });
    const aset = number(raw.total_assets);
    if (aset) facts.push({ label: "Total Aset", value: formatCurrency(aset) });
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
    const head = text(raw.head_name) || text(raw.mayor_name) || text(villageRaw.head_name) || text(villageRaw.mayor_name);
    if (head) facts.push({ label: "Kepala Desa", value: head });
    const pop = text(raw.population) || text(villageRaw.population);
    if (pop) facts.push({ label: "Populasi", value: `${pop} Jiwa` });
    const area = text(raw.area_size) || text(villageRaw.area_size);
    if (area) facts.push({ label: "Luas Wilayah", value: `${area} Ha` });
    const code = text(raw.code) || text(villageRaw.code);
    if (code) facts.push({ label: "Kode Desa", value: code });
    const phone = text(raw.contact_phone) || text(raw.phone) || text(villageRaw.phone);
    if (phone) facts.push({ label: "Kontak Kantor", value: phone });
    const email = text(raw.contact_email) || text(raw.email) || text(villageRaw.email);
    if (email) facts.push({ label: "Email Resmi", value: email });
    const address = text(raw.address) || text(villageRaw.address);
    if (address) facts.push({ label: "Alamat Kantor", value: address });
    if (stats.total_products !== undefined) facts.push({ label: "Total Produk", value: `${text(stats.total_products)} Produk` });
    if (stats.total_tourisms !== undefined) facts.push({ label: "Total Wisata", value: `${text(stats.total_tourisms)} Destinasi` });
    if (stats.total_potentials !== undefined) facts.push({ label: "Total Potensi", value: `${text(stats.total_potentials)} Potensi` });
    if (stats.total_bumdes !== undefined) facts.push({ label: "Total BUMDes", value: `${text(stats.total_bumdes)} Unit` });
  }

  return { ...item, body, gallery, facts };
}

function titleFor(kind: CatalogKind, raw: Dictionary) {
  if (kind === "lkdd") return text(raw.title) || `Laporan Dana Desa ${text(raw.year)}`;
  return text(raw.name) || text(raw.title) || text(raw.store_name) || text(raw.product_name) || "Sentra Desa";
}

function subtitleFor(kind: CatalogKind, raw: Dictionary, village: Dictionary) {
  if (kind === "products" && raw.price) return formatCurrency(number(raw.price));
  if (kind === "exports") {
    const dest = Array.isArray(raw.destination_countries) ? raw.destination_countries.join(", ") : text(raw.destination_country);
    return dest ? `Tujuan: ${dest}` : locationFrom(raw) || locationFrom(village) || text(village.name);
  }
  if (kind === "kdmp") {
    return text(raw.nomor_badan_hukum) || text(raw.code) || locationFrom(raw) || locationFrom(village) || text(village.name);
  }
  if (kind === "lkdd") return text(raw.fiscal_year) || text(raw.year);
  return locationFrom(raw) || locationFrom(village) || text(village.name);
}

function badgeFor(kind: CatalogKind, raw: Dictionary) {
  if (kind === "exports") {
    return raw.hs_code ? `HS ${text(raw.hs_code)}` : text(raw.export_status) ? text(raw.export_status).replace(/_/g, " ").toUpperCase() : "SIAP EKSPOR";
  }
  if (kind === "kdmp") {
    return text(raw.status) ? `STATUS: ${text(raw.status).toUpperCase()}` : "KDMP";
  }
  return text(raw.performance_category) || text(raw.category) || text(raw.type) || text(raw.sector) || (kind === "villages" ? "Profil Desa" : "");
}

function metaFor(kind: CatalogKind, raw: Dictionary, village: Dictionary) {
  const loc = locationFrom(raw) || locationFrom(village) || text(village.name);
  return [
    loc,
    kind === "products" && raw.stock ? `Stok ${text(raw.stock)}` : "",
    kind === "exports" && raw.hs_code ? `Kode HS: ${text(raw.hs_code)}` : "",
    kind === "exports" && raw.contact_person ? `PIC: ${text(raw.contact_person)}` : "",
    kind === "kdmp" && raw.code ? `Kode: ${text(raw.code)}` : "",
    text(raw.phone) || text(raw.contact_phone)
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
  const storageHost =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
      ? "http://127.0.0.1:8000/storage"
      : "https://sentradesa.id/storage";
  return `${storageHost}/${path}`;
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

function fallbackProductImage(raw: Dictionary): string {
  const cat = text(raw.category).toLowerCase();
  const name = text(raw.name || raw.title).toLowerCase();
  if (name.includes("kopi")) return "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80";
  if (name.includes("batik") || cat === "fashion") return "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80";
  if (name.includes("madu")) return "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop&q=80";
  if (name.includes("bambu") || name.includes("anyaman") || cat === "kerajinan") return "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop&q=80";
  if (name.includes("aren") || name.includes("gula") || name.includes("minyak") || name.includes("vco")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80";
  if (cat === "makanan_minuman" || name.includes("keripik") || name.includes("kacang")) return "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";
}
