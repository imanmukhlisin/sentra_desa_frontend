"use client";

import React, { useState } from "react";
import { User, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-terra-surface-container-lowest font-sans overflow-hidden">
      {/* SVG Clip Path for Both S-Curves (Only applied on desktop) */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="s-curve-clip-both" clipPathUnits="objectBoundingBox">
            <path d="M 0.125,0 L 0.875,0 C 0.9375,0.35 0.8125,0.65 0.875,1 L 0.125,1 C 0.0625,0.65 0.1875,0.35 0.125,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Background Image Panel (Desktop Only) */}
      <div 
        className="absolute top-0 hidden h-full w-[110vw] bg-terra-primary transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] lg:block"
        style={{ transform: isLoginMode ? 'translateX(-10vw)' : 'translateX(0vw)' }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-black/30 to-black/80 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <Image
          src="/bg-desa.jpg"
          alt="Village Landscape"
          fill
          className="object-cover"
          priority
        />
        
        {/* Text Overlays for Image */}
        <div className="absolute inset-0 z-30 flex w-full">
          {/* Register Mode Text (Image on Left) */}
          <div 
            className={`absolute left-0 top-0 flex h-full w-[40vw] flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out ${
              isLoginMode ? 'opacity-0 translate-x-[-4vw] pointer-events-none' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="flex w-full max-w-2xl flex-col items-center text-center px-6 lg:px-12">
              <h1 className="mb-6 font-inter text-5xl font-bold tracking-tight text-white lg:text-6xl xl:text-7xl">
                Sentra Desa
              </h1>
              <p className="text-lg leading-relaxed text-white/90 lg:text-xl">
                Platform terpadu tata kelola potensi komoditas, transparansi ekonomi,
                dan kemandirian UMKM desa seluruh Nusantara.
              </p>
            </div>
          </div>
          
          {/* Login Mode Text (Image on Right) */}
          <div 
            className={`absolute right-0 top-0 flex h-full w-[40vw] flex-col items-center justify-center p-8 transition-all duration-700 ease-in-out ${
              isLoginMode ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[4vw] pointer-events-none'
            }`}
          >
            <div className="flex w-full max-w-2xl flex-col items-center text-center px-6 lg:px-12">
              <h1 className="mb-6 font-inter text-5xl font-bold tracking-tight text-white lg:text-6xl xl:text-7xl">
                Selamat Datang
              </h1>
              <p className="text-lg leading-relaxed text-white/90 lg:text-xl">
                Masuk ke portal admin untuk mengelola potensi desa Anda, meningkatkan transparansi, dan memantau kemajuan UMKM lokal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Form Container Wrapper */}
      <div 
        className={`absolute top-0 h-full w-[100vw] lg:w-[80vw] transition-all duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isLoginMode ? 'left-0 lg:left-[-20vw]' : 'left-0 lg:left-[40vw]'
        } lg:[filter:drop-shadow(0_0_40px_rgba(0,0,0,0.25))]`}
      >
        <div className="absolute inset-0 bg-terra-surface-container-lowest max-lg:[clip-path:none] lg:[clip-path:url(#s-curve-clip-both)]">
          
          {/* ================= REGISTER FORM ================= */}
          <div 
            className={`absolute top-0 left-0 lg:left-[10vw] w-full lg:w-[50vw] h-full flex flex-col justify-between p-8 lg:p-12 xl:px-24 xl:py-16 overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${
              isLoginMode ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="mx-auto w-full max-w-md mt-auto mb-auto">
              {/* Logo Section */}
              <div className="mb-8 flex justify-center items-center gap-[15px]">
                <Image 
                  src="/images/logo.png" 
                  alt="Sentra Desa Logo" 
                  width={42} 
                  height={42} 
                  className="h-[42px] w-auto object-contain" 
                  priority 
                />
                <div className="leading-tight text-left">
                  <div className="text-base font-black text-terra-primary uppercase tracking-wide">
                    SENTRA DESA
                  </div>
                  <div className="text-[10px] font-bold text-terra-on-surface-variant">
                    Berdaya dari Desa
                  </div>
                </div>
              </div>

              <div className="mb-10 text-center">
                <h1 className="font-inter text-3xl font-bold tracking-tight text-terra-on-surface mb-2">
                  Daftar Akun Admin
                </h1>
                <p className="text-terra-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
                  Lengkapi data di bawah ini untuk mengajukan hak akses resmi
                  pengelolaan desa.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                    Nama Lengkap <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <User size={18} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap sesuai KTP"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                    Email Resmi <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Mail size={18} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      placeholder="contoh: admin@desamaju.id"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                    Desa & Kecamatan <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <MapPin size={18} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="Cth: Sukamaju, Ciavi"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                    Kata Sandi <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Lock size={18} strokeWidth={2} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter kombinasi aman"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-10 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-terra-outline hover:text-terra-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer"
                    />
                  </div>
                  <label htmlFor="terms" className="text-xs leading-relaxed text-terra-on-surface-variant cursor-pointer">
                    Saya menyatakan keabsahan data di atas sesuai SK penugasan resmi
                    Kepala Desa dan menyetujui Ketentuan Layanan.
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-3 text-sm font-semibold text-white transition-all hover:bg-terra-primary/90 hover:shadow-md active:scale-[0.98]"
                >
                  Daftar Sekarang
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-terra-on-surface-variant">
                Sudah memiliki akun?{" "}
                <button
                  onClick={() => setIsLoginMode(true)}
                  className="font-bold text-terra-primary hover:underline inline-flex items-center gap-1"
                >
                  Masuk ke Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-terra-outline">
              © 2026 Sentra Desa • Berdaya Dari Desa.
            </div>
          </div>


          {/* ================= LOGIN FORM ================= */}
          <div 
            className={`absolute top-0 left-0 lg:left-[20vw] w-full lg:w-[50vw] h-full flex flex-col justify-between p-8 lg:p-12 xl:px-24 xl:py-16 overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${
              isLoginMode ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
            }`}
          >
            <div className="mx-auto w-full max-w-md mt-auto mb-auto">
              {/* Logo Section */}
              <div className="mb-8 flex justify-center items-center gap-[15px]">
                <Image 
                  src="/images/logo.png" 
                  alt="Sentra Desa Logo" 
                  width={42} 
                  height={42} 
                  className="h-[42px] w-auto object-contain" 
                  priority 
                />
                <div className="leading-tight text-left">
                  <div className="text-base font-black text-terra-primary uppercase tracking-wide">
                    SENTRA DESA
                  </div>
                  <div className="text-[10px] font-bold text-terra-on-surface-variant">
                    Berdaya dari Desa
                  </div>
                </div>
              </div>

              <div className="mb-10 text-center">
                <h1 className="font-inter text-3xl font-bold tracking-tight text-terra-on-surface mb-2">
                  Selamat Datang Kembali
                </h1>
                <p className="text-terra-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
                  Masukkan email dan kata sandi Anda untuk mengakses portal pengelolaan desa.
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                    Email Resmi <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Mail size={18} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      placeholder="admin@desamaju.id"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant">
                      Kata Sandi <span className="text-terra-error">*</span>
                    </label>
                    <button type="button" className="text-xs font-semibold text-terra-primary hover:underline">
                      Lupa Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Lock size={18} strokeWidth={2} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-10 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-terra-outline hover:text-terra-on-surface transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer"
                    />
                  </div>
                  <label htmlFor="remember" className="text-xs leading-relaxed text-terra-on-surface-variant cursor-pointer">
                    Ingat saya di perangkat ini
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-3 text-sm font-semibold text-white transition-all hover:bg-terra-primary/90 hover:shadow-md active:scale-[0.98]"
                >
                  <LogIn size={18} />
                  Masuk Sekarang
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-terra-on-surface-variant">
                Belum memiliki akun?{" "}
                <button
                  onClick={() => setIsLoginMode(false)}
                  className="font-bold text-terra-primary hover:underline inline-flex items-center gap-1"
                >
                  Daftar Sekarang <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-terra-outline">
              © 2026 Sentra Desa • Berdaya Dari Desa.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
