"use client";

import Image from "next/image";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-12 border-t border-emerald-900/10 bg-sentra-soft px-6 py-12">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* Logo & Tagline */}
        <div className="flex items-center justify-center gap-3">
          <Image src="/images/logo.png" alt="SentraDesa" width={42} height={42} className="h-10 w-auto object-contain" />
          <div className="text-left">
            <strong className="block font-headline text-base font-extrabold tracking-tight text-slate-900">
              Sentra<span className="text-[#006e23]">Desa</span>
            </strong>
            <span className="font-sans text-[11px] font-semibold tracking-wider text-[#006e23]/80">Platform Ekosistem Digital Desa</span>
          </div>
        </div>

        {/* Deskripsi Resmi */}
        <p className="mt-4 max-w-xl font-sans text-xs md:text-sm leading-6 text-slate-700">
          SentraDesa adalah platform ekosistem digital desa terintegrasi untuk membangun kemandirian desa
        </p>

        {/* Akun Sosial Media */}
        <div className="mt-7 flex items-center justify-center gap-3">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram SentraDesa"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook SentraDesa"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube SentraDesa"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok SentraDesa"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp SentraDesa"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-200/80 text-slate-700 shadow-2xs hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-8 font-sans text-[11px] text-slate-500">
          © {new Date().getFullYear()} SentraDesa. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* Tombol "Langsung ke Atas" (Back to Top) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Langsung ke atas"
        title="Langsung ke atas"
        className="absolute right-6 sm:right-10 bottom-10 sm:bottom-12 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-[14px] bg-white border border-emerald-600/30 text-[#006e23] shadow-md hover:bg-[#006e23] hover:text-white hover:border-[#006e23] transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer group"
      >
        <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    </footer>
  );
}
