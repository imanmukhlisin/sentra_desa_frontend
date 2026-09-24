"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem } from "@/domain/entities/common";
import { formatCurrency } from "@/shared/utils/format";
import { ArrowRightIcon, ShoppingBagIcon, ShoppingCartIcon, MapPinIcon } from "@/presentation/components/icons";
import { useCart } from "@/presentation/context/cart-context";

// Mirrors dashboard villageFeatures exactly — SVG path + gradient background colour
type KindStyle = {
  iconPath: string;
  gradient: string;
  ring: string;
  badgeText: string;
  hoverTitle: string;
  btnHover: string;
};

const KIND_STYLES: Record<string, KindStyle> = {
  "profil-desa":   { iconPath: "/icons/services/profil-desa.svg",   gradient: "from-[#006e23] to-emerald-500",  ring: "border-emerald-200", badgeText: "text-[#006e23]",  hoverTitle: "group-hover:text-[#006e23]",  btnHover: "group-hover:bg-[#006e23] group-hover:text-white" },
  "potensi-desa":  { iconPath: "/icons/services/potensi-desa.svg",  gradient: "from-[#dda63a] to-orange-400",   ring: "border-amber-200",   badgeText: "text-amber-700",   hoverTitle: "group-hover:text-amber-700",   btnHover: "group-hover:bg-amber-600 group-hover:text-white" },
  "sentra-produk": { iconPath: "/icons/services/sentra-produk.svg", gradient: "from-[#16a34a] to-teal-500",     ring: "border-green-200",   badgeText: "text-green-700",   hoverTitle: "group-hover:text-green-700",   btnHover: "group-hover:bg-green-700 group-hover:text-white" },
  "desa-ekspor":   { iconPath: "/icons/services/desa-ekspor.svg",   gradient: "from-[#7c3aed] to-violet-400",   ring: "border-violet-200",  badgeText: "text-violet-700",  hoverTitle: "group-hover:text-violet-700",  btnHover: "group-hover:bg-violet-700 group-hover:text-white" },
  "desa-wisata":   { iconPath: "/icons/services/desa-wisata.svg",   gradient: "from-[#0d9488] to-cyan-400",     ring: "border-teal-200",    badgeText: "text-teal-700",    hoverTitle: "group-hover:text-teal-700",    btnHover: "group-hover:bg-teal-600 group-hover:text-white" },
  "bumdes":        { iconPath: "/icons/services/bumdes.svg",        gradient: "from-[#e5243b] to-rose-400",     ring: "border-rose-200",    badgeText: "text-rose-700",    hoverTitle: "group-hover:text-rose-700",    btnHover: "group-hover:bg-rose-600 group-hover:text-white" },
  "kdmp":          { iconPath: "/icons/services/kdmp.svg",          gradient: "from-[#ea580c] to-orange-400",   ring: "border-orange-200",  badgeText: "text-orange-700",  hoverTitle: "group-hover:text-orange-700",  btnHover: "group-hover:bg-orange-600 group-hover:text-white" },
  "lkdd":          { iconPath: "/icons/services/lkdd.svg",          gradient: "from-[#a21942] to-pink-600",     ring: "border-pink-200",    badgeText: "text-pink-800",    hoverTitle: "group-hover:text-pink-800",    btnHover: "group-hover:bg-pink-700 group-hover:text-white" },
  "artikel":       { iconPath: "/icons/services/artikel.svg",       gradient: "from-[#4c9f38] to-lime-500",     ring: "border-lime-200",    badgeText: "text-lime-700",    hoverTitle: "group-hover:text-lime-700",    btnHover: "group-hover:bg-lime-600 group-hover:text-white" },
  "wishlist":      { iconPath: "/icons/services/wishlist.svg",      gradient: "from-[#dd1367] to-pink-400",     ring: "border-pink-200",    badgeText: "text-pink-700",    hoverTitle: "group-hover:text-pink-700",    btnHover: "group-hover:bg-pink-600 group-hover:text-white" },
  // layanan-desa maps to informasi-desa icon
  "layanan-desa":  { iconPath: "/icons/services/informasi-desa.svg", gradient: "from-[#0284c7] to-sky-400",    ring: "border-sky-200",     badgeText: "text-sky-700",     hoverTitle: "group-hover:text-sky-700",     btnHover: "group-hover:bg-sky-600 group-hover:text-white" },
};

const DEFAULT_STYLE: KindStyle = {
  iconPath: "/icons/services/profil-desa.svg",
  gradient: "from-[#006e23] to-emerald-500",
  ring: "border-emerald-200",
  badgeText: "text-[#006e23]",
  hoverTitle: "group-hover:text-[#006e23]",
  btnHover: "group-hover:bg-[#006e23] group-hover:text-white",
};

function detectStyle(href: string): KindStyle {
  for (const [key, style] of Object.entries(KIND_STYLES)) {
    if (href.includes(key)) return style;
  }
  return DEFAULT_STYLE;
}

function formatCardPrice(val: number): string {
  if (val >= 1_000_000_000) {
    const inB = val / 1_000_000_000;
    return `Rp ${inB.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} M`;
  }
  return formatCurrency(val);
}

export function CatalogCard({ item }: { item: CatalogItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setImageFailed(false);
  }, [item.image]);

  const hasPrice = typeof item.price === "number" && item.price > 0;
  const locationText = item.meta?.[0] || item.subtitle;
  const style = detectStyle(item.href);
  const showImage = item.image && !imageFailed;

  return (
    <Link
      className="group ambient-card-interactive flex flex-col overflow-hidden rounded-[14px] h-full transition-all duration-300"
      href={item.href}
    >
      {/* Image / Icon placeholder area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100/60 border-b border-slate-200/70">
        {showImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.title}
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
            {/* Subtle gradient tint on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          </>
        ) : (
          /* No image → gradient bg with the exact same dashboard icon */
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${style.gradient}`}>
            <div className="flex h-24 w-24 items-center justify-center rounded-[14px] bg-white/20 backdrop-blur-sm shadow-lg">
              <Image
                src={style.iconPath}
                alt={item.title}
                width={56}
                height={56}
                className="h-14 w-14 object-contain drop-shadow-md"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Real Promo / Discount tag if present */}
        {Boolean(item.raw?.discount) && (
          <div className="absolute left-0 top-0 z-10 rounded-br-lg bg-[#e5243b] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-xs">
            {String(item.raw.discount)}
          </div>
        )}
      </div>

      {/* Card body: Mengadopsi color model Mekanisme Inisiatif */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5">
        <div>
          {item.badge && (
            <div className="mb-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#64748b]">
              {item.badge.replace(/_/g, " ")}
            </div>
          )}
          <h3 className="text-base sm:text-lg font-bold text-[#334155] line-clamp-1 transition-colors group-hover:text-[#006e23] leading-snug">
            {item.title}
          </h3>
          {item.description ? (
            <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#64748b]">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="mt-3.5 sm:mt-5 flex items-center justify-between gap-1 sm:gap-2 border-t border-slate-200/80 pt-3 sm:pt-3.5">
          {hasPrice ? (
            <div className="min-w-0 flex-1 pr-1">
              <strong
                className="block text-[12px] min-[380px]:text-[13px] sm:text-[15px] font-extrabold text-[#006e23] tracking-tight leading-none tabular-nums truncate"
                title={formatCurrency(item.price!)}
              >
                {formatCardPrice(item.price!)}
              </strong>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64748b] truncate min-w-0 flex-1">
              <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{locationText || "Sentra Desa"}</span>
            </div>
          )}

          {hasPrice ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(
                  {
                    id: item.id,
                    title: item.title,
                    price: item.price ?? 0,
                    image: item.image,
                    href: item.href
                  },
                  1,
                  true
                );
              }}
              className="shrink-0 flex items-center justify-center gap-1 rounded-[8px] sm:rounded-[10px] border border-[#006e23]/35 bg-white/95 h-7 w-7 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 text-xs font-bold text-[#006e23] transition-all duration-200 hover:bg-[#006e23] hover:text-white hover:border-[#006e23] hover:shadow-2xs active:scale-95 cursor-pointer shadow-2xs"
              title="Beli produk"
              aria-label={`Beli ${item.title}`}
            >
              <ShoppingCartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">Beli</span>
            </button>
          ) : (
            <span className={`shrink-0 inline-flex items-center gap-1 rounded-[8px] sm:rounded-[10px] border ${style.ring} bg-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold ${style.badgeText} transition-all duration-200 ${style.btnHover} shadow-2xs`}>
              <span>Detail</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
