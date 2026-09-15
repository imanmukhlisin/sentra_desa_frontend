export const siteConfig = {
  name: "Sentra Desa",
  description: "Portal digital produk, potensi, wisata, layanan, dan informasi desa Indonesia.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sentradesa.id",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://sentradesa.id/api/v1"
};

export const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/profil-desa", label: "Profil Desa" },
  { href: "/sentra-produk", label: "Produk" },
  { href: "/desa-wisata", label: "Wisata" },
  { href: "/potensi-desa", label: "Potensi" },
  { href: "/artikel", label: "Artikel" }
];
