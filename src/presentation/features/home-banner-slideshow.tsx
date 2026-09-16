"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HighlightItem } from "@/domain/entities/common";
import { ChevronLeftIcon, ChevronRightIcon } from "@/presentation/components/icons";
import { imageUrl } from "@/shared/utils/image";

interface HomeBannerSlideshowProps {
  highlights?: HighlightItem[];
}

function formatHighlights(rawList: HighlightItem[]): HighlightItem[] {
  if (!rawList || rawList.length === 0) return [];
  return rawList
    .map((raw) => {
      let title = String(raw.title ?? "").trim();
      let subtitle = raw.subtitle ? String(raw.subtitle) : null;
      const isMariBelanja = title.toLowerCase().includes("mari belanja");
      if (isMariBelanja) {
        title = "Mari Belanja Produk Desa Unggulan Nusantara";
        subtitle = "Dukung kemandirian pelaku UMKM dan BUMDes dengan produk berkualitas langsung dari sentra produksi desa.";
      }
      return {
        ...raw,
        title,
        subtitle,
        sort_order: isMariBelanja ? -50 : Number(raw.sort_order ?? 0)
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function HomeBannerSlideshow({ highlights = [] }: HomeBannerSlideshowProps) {
  const [items, setItems] = useState<HighlightItem[]>(() => formatHighlights(highlights));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Client-side fetch for dynamic highlights (essential for static export deployment)
  useEffect(() => {
    fetch("/api/v1/public/highlights/", { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const rawList = json?.data ?? (Array.isArray(json) ? json : []);
        if (Array.isArray(rawList) && rawList.length > 0) {
          const mapped: HighlightItem[] = rawList.map((raw: Record<string, unknown>) => ({
            id: String(raw.id ?? ""),
            title: String(raw.title ?? ""),
            subtitle: raw.subtitle ? String(raw.subtitle) : null,
            image: imageUrl(raw.image ? String(raw.image) : null),
            link_url: raw.link_url ? String(raw.link_url) : null,
            link_label: raw.link_label ? String(raw.link_label) : null,
            sort_order: Number(raw.sort_order ?? 0),
            is_active: Boolean(raw.is_active ?? true)
          }));
          setItems(formatHighlights(mapped));
        }
      })
      .catch(() => {});
  }, []);

  // Default banner if no highlights loaded
  const displayItems = items.length > 0 ? items : [
    {
      id: "default-1",
      title: "Mari Belanja Produk Desa Unggulan Nusantara",
      subtitle: "Dukung kemandirian pelaku UMKM dan BUMDes dengan produk berkualitas langsung dari sentra produksi desa.",
      image: "/images/header-sentradesa-1.webp",
      link_url: null,
      link_label: null,
      sort_order: 1,
      is_active: true
    }
  ];

  const totalSlides = displayItems.length;

  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="sentra-container pt-4 md:pt-6">
      <div
        className="group relative mx-0 overflow-hidden rounded-[20px] md:rounded-[28px] shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-72 w-full overflow-hidden bg-slate-900 md:h-[380px] lg:h-[420px]">
          {displayItems.map((h, i) => {
            const isActive = i === currentIndex;
            const bannerImage = h.image || "/images/header-sentradesa-1.webp";

            return (
              <div
                key={h.id || i}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? "z-10 opacity-100 visible pointer-events-auto" : "z-0 opacity-0 invisible pointer-events-none"
                }`}
              >
                <Image
                  src={bannerImage}
                  alt={h.title || "Banner"}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-black/80 via-black/30 to-transparent p-6 sm:p-10 md:p-14">
                  <h1 className="max-w-xl font-serif text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl lg:text-[40px] tracking-tight">
                    {h.title || "Mari Belanja Produk Desa Unggulan Nusantara"}
                  </h1>

                  <p className="mt-3 max-w-lg text-xs leading-relaxed text-white/85 sm:text-sm md:text-[15px]">
                    {h.subtitle || "Dukung kemandirian pelaku UMKM dan BUMDes dengan produk berkualitas langsung dari sentra produksi desa."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <a
                      href="#produk-desa"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e23] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#005319]"
                    >
                      <span>Lihat Produk Desa</span>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </a>

                    <Link
                      href="/village-admin/register/"
                      className="inline-flex items-center rounded-lg border border-white/20 bg-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/30"
                    >
                      Registrasi Desa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Slide sebelumnya"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Slide berikutnya"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-black/70 group-hover:opacity-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Pagination Indicators matching Image 1 */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {Array.from({ length: Math.max(totalSlides, 4) }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i < totalSlides && setCurrentIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i
                    ? "w-6 bg-[#0fff5f]"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
