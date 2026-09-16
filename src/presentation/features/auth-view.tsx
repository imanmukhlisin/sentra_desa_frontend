"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, LogIn, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/infrastructure/api/auth-client";

interface AuthViewProps {
  initialMode?: "register" | "login";
}

export function AuthView({ initialMode = "register" }: AuthViewProps) {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);

  // Form State - Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  // Form State - Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);

  // Status & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const switchMode = (mode: "login" | "register") => {
    setIsLoginMode(mode === "login");
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", mode === "login" ? "/login" : "/register");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);

    if (!regAgreeTerms) {
      setErrorMessage("Silakan setujui Ketentuan Layanan untuk melanjutkan pendaftaran.");
      return;
    }

    if (regPassword.length < 8) {
      setFieldErrors({ password: ["Kata sandi minimal harus 8 karakter."] });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authClient.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        village: regVillage,
      });

      if (res.status === "success") {
        setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke beranda...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(res.message || "Pendaftaran gagal.");
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    } catch {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba sesaat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authClient.login({
        email: loginEmail,
        password: loginPassword,
      });

      if (res.status === "success") {
        setSuccessMessage("Login berhasil! Mengalihkan...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setErrorMessage(res.message || "Email atau kata sandi salah.");
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    } catch {
      setErrorMessage("Terjadi kesalahan sistem. Silakan periksa koneksi backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-terra-surface-container-lowest font-sans overflow-hidden">
      {/* SVG Clip Path for Both S-Curves (Desktop only) */}
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
        style={{ transform: isLoginMode ? "translateX(-10vw)" : "translateX(0vw)" }}
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
              isLoginMode ? "opacity-0 translate-x-[-4vw] pointer-events-none" : "opacity-100 translate-x-0"
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
              isLoginMode ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[4vw] pointer-events-none"
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
          isLoginMode ? "left-0 lg:left-[-20vw]" : "left-0 lg:left-[40vw]"
        } lg:[filter:drop-shadow(0_0_40px_rgba(0,0,0,0.25))]`}
      >
        <div className="absolute inset-0 bg-terra-surface-container-lowest max-lg:[clip-path:none] lg:[clip-path:url(#s-curve-clip-both)]">

          {/* ================= REGISTER FORM ================= */}
          <div
            className={`absolute top-0 left-0 lg:left-[10vw] w-full lg:w-[50vw] h-full flex flex-col justify-between p-8 lg:p-12 xl:px-24 xl:py-16 overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${
              isLoginMode ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-100 translate-x-0"
            }`}
          >
            <div className="mx-auto w-full max-w-md mt-auto mb-auto">
              {/* Logo Section */}
              <div className="mb-6 flex justify-center items-center gap-[15px]">
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

              <div className="mb-6 text-center">
                <h1 className="font-inter text-3xl font-bold tracking-tight text-terra-on-surface mb-2">
                  Daftar Akun Admin
                </h1>
                <p className="text-terra-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
                  Lengkapi data di bawah ini untuk mengajukan hak akses resmi pengelolaan desa.
                </p>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && !isLoginMode && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-terra-error-container/40 p-3 text-xs text-terra-on-error-container border border-terra-error-container">
                  <AlertCircle size={16} className="shrink-0 text-terra-error" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && !isLoginMode && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                {/* Nama Lengkap */}
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
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Masukkan nama lengkap sesuai KTP"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] text-terra-error">{fieldErrors.name[0]}</p>
                  )}
                </div>

                {/* Email Resmi */}
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
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contoh: admin@desamaju.id"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-terra-error">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Desa & Kecamatan */}
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
                      required
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      placeholder="Cth: Sukamaju, Ciawi"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
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
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
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
                  {fieldErrors.password && (
                    <p className="text-[11px] text-terra-error">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Persetujuan SK / Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={regAgreeTerms}
                      onChange={(e) => setRegAgreeTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer"
                    />
                  </div>
                  <label htmlFor="terms" className="text-xs leading-relaxed text-terra-on-surface-variant cursor-pointer">
                    Saya menyatakan keabsahan data di atas sesuai SK penugasan resmi Kepala Desa dan menyetujui Ketentuan Layanan.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-3 text-sm font-semibold text-white transition-all hover:bg-terra-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses Pendaftaran...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-terra-on-surface-variant">
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
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
              isLoginMode ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
            }`}
          >
            <div className="mx-auto w-full max-w-md mt-auto mb-auto">
              {/* Logo Section */}
              <div className="mb-6 flex justify-center items-center gap-[15px]">
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

              <div className="mb-6 text-center">
                <h1 className="font-inter text-3xl font-bold tracking-tight text-terra-on-surface mb-2">
                  Selamat Datang Kembali
                </h1>
                <p className="text-terra-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
                  Masukkan email dan kata sandi Anda untuk mengakses portal pengelolaan desa.
                </p>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && isLoginMode && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-terra-error-container/40 p-3 text-xs text-terra-on-error-container border border-terra-error-container">
                  <AlertCircle size={16} className="shrink-0 text-terra-error" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && isLoginMode && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                {/* Email */}
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
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@desamaju.id"
                      className="w-full rounded-md border border-terra-outline-variant bg-transparent py-2.5 pl-10 pr-4 text-sm text-terra-on-surface placeholder:text-terra-outline focus:border-terra-primary focus:outline-none focus:ring-1 focus:ring-terra-primary transition-colors"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-terra-error">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Password */}
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
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                  {fieldErrors.password && (
                    <p className="text-[11px] text-terra-error">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-start gap-3 pt-1">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={loginRemember}
                      onChange={(e) => setLoginRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer"
                    />
                  </div>
                  <label htmlFor="remember" className="text-xs leading-relaxed text-terra-on-surface-variant cursor-pointer">
                    Ingat saya di perangkat ini
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-3 text-sm font-semibold text-white transition-all hover:bg-terra-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memverifikasi Akun...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Masuk Sekarang
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-terra-on-surface-variant">
                Belum memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
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
