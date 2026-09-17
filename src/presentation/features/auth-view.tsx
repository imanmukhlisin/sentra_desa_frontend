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
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/85 via-black/45 to-black/85 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <Image
          src="/bg-desa.jpg"
          alt="Lanskap Desa Nusantara"
          fill
          className="object-cover"
          priority
        />

        {/* Text Overlays for Image (Always Left-Aligned Brand, No Duplicate "Selamat Datang") */}
        <div className="absolute inset-0 z-30 flex w-full">
          {/* Register Mode Text (Image on Left) */}
          <div
            className={`absolute left-0 top-0 flex h-full w-[40vw] flex-col items-start justify-center p-8 lg:p-16 transition-all duration-700 ease-in-out ${
              isLoginMode ? "opacity-0 translate-x-[-4vw] pointer-events-none" : "opacity-100 translate-x-0"
            }`}
          >
            <div className="flex w-full max-w-lg flex-col items-start text-left">
              <div className="mb-2 h-1 w-10 rounded-full bg-terra-primary-container" />
              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-terra-primary-fixed">
                Pangan & Kemandirian Desa
              </p>
              <h1 className="mb-4 font-headline text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Sentra Desa
              </h1>
              <p className="font-sans text-sm lg:text-base leading-relaxed text-white/90 max-w-md">
                Platform terpadu tata kelola potensi komoditas, transparansi ekonomi,
                dan kemandirian UMKM desa seluruh Nusantara.
              </p>
            </div>
          </div>

          {/* Login Mode Text (Image on Right) */}
          <div
            className={`absolute right-0 top-0 flex h-full w-[40vw] flex-col items-start justify-center p-8 lg:p-16 transition-all duration-700 ease-in-out ${
              isLoginMode ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[4vw] pointer-events-none"
            }`}
          >
            <div className="flex w-full max-w-lg flex-col items-start text-left">
              <div className="mb-2 h-1 w-10 rounded-full bg-terra-primary-container" />
              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-terra-primary-fixed">
                Tata Kelola & Potensi Desa
              </p>
              <h1 className="mb-4 font-headline text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Sentra Desa
              </h1>
              <p className="font-sans text-sm lg:text-base leading-relaxed text-white/90 max-w-md">
                Dashboard terpadu pengelolaan ekonomi desa, transparansi tata kelola,
                dan monitoring kemajuan komoditas lokal.
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
            className={`absolute top-0 left-0 lg:left-[12vw] w-full lg:w-[48vw] h-full flex flex-col justify-center px-6 py-6 lg:px-12 xl:px-16 overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${
              isLoginMode ? "opacity-0 translate-x-8 pointer-events-none" : "opacity-100 translate-x-0"
            }`}
          >
            <div className="mx-auto w-full max-w-[400px] text-left">
              {/* Logo Section - Left Aligned */}
              <div className="mb-5 flex items-center justify-start gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Sentra Desa Logo"
                  width={38}
                  height={38}
                  className="h-[38px] w-auto object-contain"
                  priority
                />
                <div className="leading-tight text-left">
                  <div className="text-base font-black text-terra-primary uppercase tracking-wider font-sans">
                    SENTRA DESA
                  </div>
                  <div className="text-[10px] font-semibold text-terra-on-surface-variant">
                    Berdaya dari Desa
                  </div>
                </div>
              </div>

              {/* Title & Subtitle - Left Aligned */}
              <div className="mb-5 text-left">
                <h2 className="font-headline text-2xl lg:text-[28px] font-bold tracking-tight text-terra-on-surface mb-1.5 leading-snug">
                  Daftar Akun
                </h2>
                <p className="font-sans text-xs lg:text-[13px] text-terra-on-surface-variant leading-relaxed">
                  Lengkapi data di bawah ini untuk membuat akun baru di Sentra Desa.
                </p>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && !isLoginMode && (
                <div className="mb-3 flex items-center gap-2 rounded-md bg-terra-error-container/40 px-3 py-2 text-xs text-terra-on-error-container border border-terra-error-container">
                  <AlertCircle size={15} className="shrink-0 text-terra-error" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && !isLoginMode && (
                <div className="mb-3 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                {/* Nama Lengkap */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                    <span>Nama Lengkap</span>
                    <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <User size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-3 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] text-terra-error font-medium">{fieldErrors.name[0]}</p>
                  )}
                </div>

                {/* Email Resmi */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                    <span>Email Resmi</span>
                    <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Mail size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="admin@desamaju.id"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-3 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-terra-error font-medium">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Desa & Kecamatan */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                    <span>Desa & Kecamatan</span>
                    <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <MapPin size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      required
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      placeholder="Cth: Sukamaju, Ciawi"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-3 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                    <span>Kata Sandi</span>
                    <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Lock size={16} strokeWidth={2} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 8 karakter kombinasi aman"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-9 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-terra-outline hover:text-terra-on-surface transition-colors"
                      aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-terra-error font-medium">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Persetujuan SK / Terms */}
                <div className="flex items-start gap-2.5 pt-1 text-left">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer accent-terra-primary shrink-0"
                  />
                  <label htmlFor="terms" className="text-[11px] leading-relaxed text-terra-on-surface-variant cursor-pointer select-none">
                    Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi Sentra Desa.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#005a1c] hover:shadow-cta active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Memproses Pendaftaran...
                    </>
                  ) : (
                    <>
                      Daftar Sekarang
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-left text-xs text-terra-on-surface-variant">
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-bold text-terra-primary hover:text-terra-on-primary-container hover:underline inline-flex items-center gap-0.5"
                >
                  Masuk ke Portal <ArrowRight size={13} />
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-[11px] text-terra-outline">
                © 2026 Sentra Desa • Berdaya Dari Desa.
              </div>
            </div>
          </div>


          {/* ================= LOGIN FORM ================= */}
          <div
            className={`absolute top-0 left-0 lg:left-[20vw] w-full lg:w-[48vw] h-full flex flex-col justify-center px-6 py-6 lg:px-12 xl:px-16 overflow-y-auto custom-scrollbar transition-all duration-700 delay-100 ${
              isLoginMode ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
            }`}
          >
            <div className="mx-auto w-full max-w-[400px] text-left">
              {/* Logo Section - Left Aligned */}
              <div className="mb-6 flex items-center justify-start gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Sentra Desa Logo"
                  width={38}
                  height={38}
                  className="h-[38px] w-auto object-contain"
                  priority
                />
                <div className="leading-tight text-left">
                  <div className="text-base font-black text-terra-primary uppercase tracking-wider font-sans">
                    SENTRA DESA
                  </div>
                  <div className="text-[10px] font-semibold text-terra-on-surface-variant">
                    Berdaya dari Desa
                  </div>
                </div>
              </div>

              {/* Title & Subtitle - Left Aligned ("Selamat datang kembali" ONLY here!) */}
              <div className="mb-6 text-left">
                <h2 className="font-headline text-2xl lg:text-[30px] font-bold tracking-tight text-terra-on-surface mb-1.5 leading-snug">
                  Selamat datang kembali
                </h2>
                <p className="font-sans text-xs lg:text-[13px] text-terra-on-surface-variant leading-relaxed">
                  Masuk ke akun Anda untuk melanjutkan.
                </p>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && isLoginMode && (
                <div className="mb-3 flex items-center gap-2 rounded-md bg-terra-error-container/40 px-3 py-2 text-xs text-terra-on-error-container border border-terra-error-container">
                  <AlertCircle size={15} className="shrink-0 text-terra-error" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && isLoginMode && (
                <div className="mb-3 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                {/* Email */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                    <span>Email Resmi</span>
                    <span className="text-terra-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Mail size={16} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Masukkan email Anda"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-3 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-terra-error font-medium">{fieldErrors.email[0]}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-terra-on-surface-variant flex items-center gap-1">
                      <span>Kata Sandi</span>
                      <span className="text-terra-error">*</span>
                    </label>
                    <button type="button" className="text-xs font-semibold text-terra-primary hover:text-terra-on-primary-container hover:underline">
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-terra-outline">
                      <Lock size={16} strokeWidth={2} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full rounded-md border border-terra-outline-variant/70 bg-white py-2.5 pl-9 pr-9 text-xs lg:text-sm text-terra-on-surface placeholder:text-terra-outline/70 focus:border-terra-primary focus:outline-none focus:ring-2 focus:ring-terra-primary/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-terra-outline hover:text-terra-on-surface transition-colors"
                      aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-terra-error font-medium">{fieldErrors.password[0]}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-start gap-2.5 pt-0.5 text-left">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-terra-outline-variant text-terra-primary focus:ring-terra-primary cursor-pointer accent-terra-primary shrink-0"
                  />
                  <label htmlFor="remember" className="text-xs text-terra-on-surface-variant cursor-pointer select-none">
                    Ingat saya di perangkat ini
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-terra-primary py-2.5 text-xs lg:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#005a1c] hover:shadow-cta active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Memverifikasi Akun...
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-left text-xs text-terra-on-surface-variant">
                Belum memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-bold text-terra-primary hover:text-terra-on-primary-container hover:underline inline-flex items-center gap-0.5"
                >
                  Daftar Sekarang <ArrowRight size={13} />
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center text-[11px] text-terra-outline">
                © 2026 Sentra Desa • Berdaya Dari Desa.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
