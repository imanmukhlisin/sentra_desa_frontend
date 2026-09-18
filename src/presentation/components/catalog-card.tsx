"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem } from "@/domain/entities/common";
import { formatCurrency } from "@/shared/utils/format";
import { ArrowRightIcon, ShoppingBagIcon, MapPinIcon } from "@/presentation/components/icons";

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

export function CatalogCard({ item }: { item: CatalogItem }) {
  const [imageFailed, setImageFailed] = useState(false);

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
      <div className="relative aspect-square w-full overflow-hidden">
        {showImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.title}
              width={640}
              height={640}
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
            {/* Subtle gradient tint on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          </>
        ) : (
          /* No image → gradient bg with the exact same dashboard icon */
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${style.gradient}`}>
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm shadow-lg">
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

        {/* Badge */}
        {item.badge && (
          <div className="absolute left-3 top-3 z-10 rounded-full border border-white/90 bg-white/95 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-md text-[#171d18]">
            {item.badge}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className={`text-base sm:text-lg font-bold text-[#171d18] line-clamp-1 transition-colors ${style.hoverTitle} leading-snug`}>
            {item.title}
          </h3>
          {item.description ? (
            <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#3b4b39]/80">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 border-t border-dashed border-[#e6dcce] pt-3.5">
          {hasPrice ? (
            <div className="min-w-0 flex-1">
              <strong className={`block truncate text-base sm:text-lg font-extrabold ${style.badgeText}`}>
                {formatCurrency(item.price!)}
              </strong>
              {item.subtitle ? (
                <span className="block truncate text-xs font-medium text-slate-500">
                  {item.subtitle}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#3b4b39] truncate min-w-0 flex-1">
              <MapPinIcon className={`h-4 w-4 shrink-0 ${style.badgeText}`} />
              <span className="truncate">{locationText || "Sentra Desa"}</span>
            </div>
          )}

          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border ${style.ring} bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold ${style.badgeText} transition-all duration-200 ${style.btnHover}`}>
            {hasPrice ? (
              <>
                <ShoppingBagIcon className="h-4 w-4" />
                <span>Beli</span>
              </>
            ) : (
              <>
                <span>Detail</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
