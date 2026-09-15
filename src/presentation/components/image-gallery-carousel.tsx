"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Images, X } from "lucide-react";
import { TouchEvent, useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export function ImageGalleryCarousel({ images, title }: Props) {
  const items = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [current, setCurrent] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (items.length < 2 || fullScreen) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % items.length), 4000);
    return () => window.clearInterval(timer);
  }, [fullScreen, items.length]);

  useEffect(() => {
    setCurrent(0);
  }, [items]);

  useEffect(() => {
    if (!fullScreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullScreen(false);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const previous = () => setCurrent((value) => Math.max(0, value - 1));
  const next = () => setCurrent((value) => Math.min(items.length - 1, value + 1));
  const onTouchStart = (event: TouchEvent) => setTouchStart(event.touches[0]?.clientX ?? null);
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (distance > 45) previous();
    if (distance < -45) next();
    setTouchStart(null);
  };

  if (!items.length) {
    return (
      <div className="flex aspect-[16/11] items-center justify-center rounded-promo bg-slate-100 text-slate-400">
        <div className="text-center">
          <ImageOff className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm">Belum ada foto</p>
        </div>
      </div>
    );
  }

  const gallery = (
    <GalleryFrame
      current={current}
      images={items}
      title={title}
      fullScreen={fullScreen}
      onOpen={() => setFullScreen(true)}
      onPrevious={previous}
      onNext={next}
      onSelect={setCurrent}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );

  return (
    <>
      {gallery}
      {fullScreen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 md:p-8" role="dialog" aria-modal="true" aria-label={`Galeri ${title}`}>
          <button className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white" type="button" onClick={() => setFullScreen(false)} aria-label="Tutup galeri">
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-6xl">{gallery}</div>
        </div>
      ) : null}
    </>
  );
}

type FrameProps = {
  current: number;
  images: string[];
  title: string;
  fullScreen: boolean;
  onOpen: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
};

function GalleryFrame({ current, images, title, fullScreen, onOpen, onPrevious, onNext, onSelect, onTouchStart, onTouchEnd }: FrameProps) {
  const [failed, setFailed] = useState<number[]>([]);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${fullScreen ? "h-[82vh] rounded-xl" : "aspect-[16/11] rounded-promo"}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button className="h-full w-full cursor-zoom-in" type="button" onClick={onOpen} aria-label="Buka gambar layar penuh">
        {failed.includes(current) ? (
          <span className="flex h-full items-center justify-center text-slate-400"><ImageOff className="h-14 w-14" /></span>
        ) : (
          <Image
            key={images[current]}
            src={images[current]}
            alt={`${title} - foto ${current + 1}`}
            fill
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={fullScreen ? "object-contain" : "object-cover"}
            onError={() => setFailed((values) => [...values, current])}
          />
        )}
        {!fullScreen ? <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" /> : null}
      </button>

      {images.length > 1 ? (
        <>
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            <Images className="h-3.5 w-3.5" /> {current + 1}/{images.length}
          </div>
          {current > 0 ? <Arrow direction="left" onClick={onPrevious} /> : null}
          {current < images.length - 1 ? <Arrow direction="right" onClick={onNext} /> : null}
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Tampilkan foto ${index + 1}`}
                onClick={() => onSelect(index)}
                className={`h-1.5 rounded-full bg-white transition-all ${current === index ? "w-6" : "w-1.5 opacity-50"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Arrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Foto sebelumnya" : "Foto berikutnya"}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white transition hover:bg-black/65 ${direction === "left" ? "left-2" : "right-2"}`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
