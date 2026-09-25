import type React from "react";
import {
  Landmark,
  Sparkles,
  Newspaper,
  Store,
  Globe,
  Mountain,
  BriefcaseBusiness,
  Flag,
  WalletCards,
  FileText,
  HeartHandshake,
  Grid2X2,
  Utensils,
  Paintbrush,
  Shirt,
  Tractor,
  Fish,
  PawPrint,
  Wrench,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingBag,
  LogIn,
  Building2,
  Rocket,
  ArrowRight,
  ImageOff,
  MapPin,
  PlusSquare,
  Phone,
  User,
  Trash2,
  X,
  Plus,
  Minus,
  Check,
  Download,
  Mail,
  Award
} from "lucide-react";

export interface CartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

export function ShoppingCartIcon({
  size,
  width,
  height,
  className = "h-5 w-5",
  strokeWidth = 2.2,
  ...props
}: CartIconProps) {
  const w = size ?? width ?? 20;
  const h = size ?? height ?? 20;
  const swNum = typeof strokeWidth === "number" ? strokeWidth : Number(strokeWidth) || 2.2;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={w}
      height={h}
      className={className}
      {...props}
    >
      {/* Pegangan & Rangka Utama Keranjang (Trapezoid Basket) */}
      <path d="M3.2 7.8l3.6 1.6l4.4 10.1h11.6l2.6-10.1H6.8" strokeWidth={swNum} />
      {/* Garis Horizontal Wire Mesh */}
      <line x1="9.5" y1="12.8" x2="24.5" y2="12.8" strokeWidth={swNum * 0.8} />
      <line x1="10.3" y1="16.1" x2="23.7" y2="16.1" strokeWidth={swNum * 0.8} />
      {/* Garis Vertikal Wire Mesh (Fanning Out) */}
      <line x1="12.8" y1="9.4" x2="14.1" y2="19.5" strokeWidth={swNum * 0.8} />
      <line x1="17.0" y1="9.4" x2="17.0" y2="19.5" strokeWidth={swNum * 0.8} />
      <line x1="21.2" y1="9.4" x2="19.9" y2="19.5" strokeWidth={swNum * 0.8} />
      {/* Rangka Bawah (Chassis Bar) */}
      <path d="M11.2 19.5l-1.6 3.3h13.8" strokeWidth={swNum * 1.1} />
      {/* Roda Bolong (Hollow Wheels) */}
      <circle cx="11.8" cy="26.6" r="2.3" strokeWidth={swNum} />
      <circle cx="20.2" cy="26.6" r="2.3" strokeWidth={swNum} />
    </svg>
  );
}

// Bootstrap Icons Cart4 variant for compatibility
export function BootstrapCartIcon({ className = "h-5 w-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} {...props}>
      <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
    </svg>
  );
}

export const VillageIcon = Landmark;
export const PotentialIcon = Sparkles;
export const NewsIcon = Newspaper;
export const StoreIcon = Store;
export const GlobeIcon = Globe;
export const TourismIcon = Mountain;
export const BumdesIcon = BriefcaseBusiness;
export const KdmpIcon = Flag;
export const LkddIcon = WalletCards;
export const ArticleIcon = FileText;
export const WishlistIcon = HeartHandshake;
export const GridIcon = Grid2X2;
export const FoodIcon = Utensils;
export const CraftIcon = Paintbrush;
export const FashionIcon = Shirt;
export const FarmIcon = Tractor;
export const FishIcon = Fish;
export const LivestockIcon = PawPrint;
export const ServiceIcon = Wrench;
export const MoreIcon = MoreHorizontal;
export const ChevronDownIcon = ChevronDown;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const SearchIcon = Search;
export const ShoppingBagIcon = ShoppingBag;
export const LoginIcon = LogIn;
export const AddBusinessIcon = Building2;
export const RocketIcon = Rocket;
export const ArrowRightIcon = ArrowRight;
export const ImageOffIcon = ImageOff;
export const MapPinIcon = MapPin;
export const PlusSquareIcon = PlusSquare;
export const PhoneIcon = Phone;
export const UserIcon = User;
export const TrashIcon = Trash2;
export const XIcon = X;
export const PlusIcon = Plus;
export const MinusIcon = Minus;
export const CheckIcon = Check;
export const DownloadIcon = Download;
export const MailIcon = Mail;
export const AwardIcon = Award;

export type ServiceTheme = {
  title: string;
  color: string;
  iconPath: string;
  href: string;
};

export const SERVICE_THEMES: Record<string, ServiceTheme> = {
  "profil-desa":   { title: "Profil Desa",    color: "#006e23", iconPath: "/icons/services/profil-desa.svg",   href: "/profil-desa/" },
  "villages":      { title: "Profil Desa",    color: "#006e23", iconPath: "/icons/services/profil-desa.svg",   href: "/profil-desa/" },
  "potensi-desa":  { title: "Potensi Desa",   color: "#dda63a", iconPath: "/icons/services/potensi-desa.svg",  href: "/potensi-desa/" },
  "potentials":    { title: "Potensi Desa",   color: "#dda63a", iconPath: "/icons/services/potensi-desa.svg",  href: "/potensi-desa/" },
  "layanan-desa":  { title: "Informasi Desa", color: "#0284c7", iconPath: "/icons/services/informasi-desa.svg", href: "/layanan-desa/" },
  "informasi-desa":{ title: "Informasi Desa", color: "#0284c7", iconPath: "/icons/services/informasi-desa.svg", href: "/layanan-desa/" },
  "services":      { title: "Informasi Desa", color: "#0284c7", iconPath: "/icons/services/informasi-desa.svg", href: "/layanan-desa/" },
  "sentra-produk": { title: "Sentra Produk",  color: "#16a34a", iconPath: "/icons/services/sentra-produk.svg", href: "/sentra-produk/" },
  "products":      { title: "Sentra Produk",  color: "#16a34a", iconPath: "/icons/services/sentra-produk.svg", href: "/sentra-produk/" },
  "desa-ekspor":   { title: "Desa Ekspor",    color: "#7c3aed", iconPath: "/icons/services/desa-ekspor.svg",   href: "/desa-ekspor/" },
  "exports":       { title: "Desa Ekspor",    color: "#7c3aed", iconPath: "/icons/services/desa-ekspor.svg",   href: "/desa-ekspor/" },
  "desa-wisata":   { title: "Desa Wisata",    color: "#0d9488", iconPath: "/icons/services/desa-wisata.svg",   href: "/desa-wisata/" },
  "tourisms":      { title: "Desa Wisata",    color: "#0d9488", iconPath: "/icons/services/desa-wisata.svg",   href: "/desa-wisata/" },
  "bumdes":        { title: "BUMDes",         color: "#e5243b", iconPath: "/icons/services/bumdes.svg",        href: "/bumdes/" },
  "kdmp":          { title: "KDMP",           color: "#ea580c", iconPath: "/icons/services/kdmp.svg",          href: "/kdmp/" },
  "lkdd":          { title: "LKDD",           color: "#a21942", iconPath: "/icons/services/lkdd.svg",          href: "/lkdd/" },
  "artikel":       { title: "Artikel",        color: "#4c9f38", iconPath: "/icons/services/artikel.svg",       href: "/artikel/" },
  "articles":      { title: "Artikel",        color: "#4c9f38", iconPath: "/icons/services/artikel.svg",       href: "/artikel/" },
  "wishlist":      { title: "Wishlist Desa",  color: "#dd1367", iconPath: "/icons/services/wishlist.svg",      href: "/wishlist/" },
  "wishlists":     { title: "Wishlist Desa",  color: "#dd1367", iconPath: "/icons/services/wishlist.svg",      href: "/wishlist/" },
};

export function getServiceTheme(key: string): ServiceTheme {
  const normalized = String(key || "").toLowerCase().replace(/^\//, "").replace(/\/$/, "");
  return SERVICE_THEMES[normalized] || SERVICE_THEMES["profil-desa"];
}

export function ServiceSquircle({
  service,
  size = "md",
  className = ""
}: {
  service: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const theme = getServiceTheme(service);
  const sizeClasses = {
    sm: "h-5 w-5 rounded-[6px] p-0.5",
    md: "h-11 w-11 rounded-[12px] p-2",
    lg: "h-12 w-12 sm:h-14 sm:w-14 rounded-[14px] p-2.5",
    xl: "h-14 w-14 sm:h-16 sm:w-16 md:h-[68px] md:w-[68px] rounded-[14px] p-3",
  }[size];

  return (
    <div
      className={`flex items-center justify-center shrink-0 shadow-sm transition-transform ${sizeClasses} ${className}`}
      style={{ backgroundColor: theme.color }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={theme.iconPath}
        alt={theme.title}
        className="h-full w-full object-contain drop-shadow-xs"
        loading="lazy"
      />
    </div>
  );
}

