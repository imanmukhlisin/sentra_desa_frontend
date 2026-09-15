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

export function HomeBannerSlideshow({ highlights = [] }: HomeBannerSlideshowProps) {
  const [items, setItems] = useState<HighlightItem[]>(highlights);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Client-side fetch for dynamic highlights (essential for static export deployment)
  useEffect(() => {
    fetch("/api/v1/public/highlights", { headers: { Accept: "application/json" } })
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
          setItems(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const totalSlides = items.length;

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

  // Fallback to static banner if no highlights loaded
  if (totalSlides === 0) {
    return (
      <section className="sentra-container">
        <div className="relative mx-0 h-60 overflow-hidden rounded-promo bg-slate-200 md:mx-5 md:h-[400px]">
          <Image src="/images/header-sentradesa-1.webp" alt="Selamat Hari Desa Nasional" fill priority className="object-cover" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-tr from-black/80 to-transparent p-[35px]">
            <h1 className="max-w-2xl text-[28px] font-black leading-[1.1] text-white md:text-[46px]">
              Selamat Hari Desa Nasional
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sentra-container">
      <div
        className="group relative mx-0 md:mx-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-60 w-full overflow-hidden rounded-promo bg-slate-900 md:h-[400px]">
          {items.map((h, i) => {
            const isActive = i === currentIndex;
            const bannerImage = h.image || "/images/header-sentradesa-1.webp";
            const linkUrl = h.link_url;
            const isExternal = linkUrl?.startsWith("http://") || linkUrl?.startsWith("https://");

            const content = (
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? "z-10 opacity-100 pointer-events-auto" : "z-0 opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={bannerImage}
                  alt={h.title || "Banner Highlight"}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-tr from-black/80 via-black/35 to-transparent p-[25px] md:p-[35px]">
                  <h1 className="max-w-2xl text-[24px] font-black leading-[1.1] text-white md:text-[40px]">
                    {h.title}
                  </h1>

                  {h.subtitle && (
                    <p className="mt-1.5 max-w-xl text-xs text-white/80 md:text-[16px]">
                      {h.subtitle}
                    </p>
                  )}

                  {h.link_label && (
                    <div className="mt-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#1B5E20] px-4 py-2 text-xs font-bold text-white shadow-md transition-transform group-hover:scale-105">
                        {h.link_label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            if (!linkUrl) {
              return <div key={h.id || i}>{content}</div>;
            }

            if (isExternal) {
              return (
                <a
                  key={h.id || i}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={h.id || i} href={linkUrl}>
                {content}
              </Link>
            );
          })}

          {/* Navigation Arrows for Desktop */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/75 hover:scale-110 group-hover:opacity-100"
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
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/75 hover:scale-110 group-hover:opacity-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Animated Dots Indicator matching Flutter design */}
        {totalSlides > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? "w-6 bg-[#1B5E20]" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
