"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  ShoppingCart,
  Store,
  Landmark,
  Phone,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/infrastructure/api/auth-client";

export type AuthRole = "buyer" | "merchant" | "village_admin";

interface AuthViewProps {
  initialMode?: "register" | "login";
  initialRole?: AuthRole;
}

export function AuthView({ initialMode = "register", initialRole }: AuthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const isFromCheckout = redirectUrl.startsWith("/checkout");

  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);

  // Role selection: default to "buyer" especially if from checkout
  const [selectedRole, setSelectedRole] = useState<AuthRole>(
    isFromCheckout ? "buyer" : initialRole || "buyer"
  );

  // Step 1 vs Step 2: User picks from 3 role cards first, unless initialRole is explicitly passed
  const [hasSelectedRole, setHasSelectedRole] = useState<boolean>(
    Boolean(initialRole)
  );

  // Form Fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regStoreName, setRegStoreName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPosition, setRegPosition] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  React.useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const roleConfig = {
    buyer: {
      title: "Daftar Akun Pembeli",
      badge: "Pembeli / Warga",
      desc: "Buat akun untuk belanja produk desa, checkout pesanan, dan pantau status pengiriman.",
      btnText: "Daftar sebagai Pembeli",
      nameLabel: "Nama Lengkap Pembeli",
      namePlaceholder: "Cth: Budi Santoso",
      emailHint: "Gunakan email aktif untuk konfirmasi pemesanan dan invoice."
    },
    merchant: {
      title: "Daftar Toko UMKM Desa",
      badge: "Pelaku Usaha",
      desc: "Buka toko online desa dan pasarkan produk olahan, kerajinan, & karya lokal Anda.",
      btnText: "Buka Toko & Daftar Merchant",
      nameLabel: "Nama Pemilik Toko",
      namePlaceholder: "Cth: Siti Aminah",
      emailHint: "Email ini digunakan untuk mengelola toko dan menerima notifikasi pesanan."
    },
    village_admin: {
      title: "Daftar Admin / Aparatur Desa",
      badge: "Aparatur Desa",
      desc: "Khusus perangkat pemerintah desa untuk mengelola portal informasi, LKDD, dan verifikasi UMKM.",
      btnText: "Daftar sebagai Admin Desa",
      nameLabel: "Nama Lengkap Aparatur",
      namePlaceholder: "Cth: Ahmad Subagyo, S.P.",
      emailHint: "Disarankan memakai email kedinasan atau email resmi pemerintah desa."
    }
  };

  const switchMode = (mode: "login" | "register") => {
    setIsLoginMode(mode === "login");
    if (mode === "register" && !initialRole && !isFromCheckout) {
      setHasSelectedRole(false);
    }
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);
    setCountdown(null);
    if (typeof window !== "undefined") {
      const qs = redirectUrl && redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : "";
      window.history.replaceState(null, "", (mode === "login" ? "/login" : "/register") + qs);
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
        village: regVillage || (selectedRole === "merchant" ? regStoreName : "")
      });

      if (res.status === "success") {
        // Enrich user session with role and merchant data
        const currentUser = authClient.getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            roles: [selectedRole],
            merchant: selectedRole === "merchant" ? {
              id: Date.now(),
              store_name: regStoreName || "Toko Desa",
              status: "approved"
            } : null
          };
          authClient.setSession(authClient.getToken() || "temp_token", updatedUser);
        }

        setCountdown(3);
        if (isFromCheckout) {
          setSuccessMessage("Pendaftaran berhasil! Melanjutkan ke checkout...");
          setTimeout(() => { router.push(redirectUrl); router.refresh(); }, 3000);
        } else if (selectedRole === "merchant") {
          setSuccessMessage("Pendaftaran Merchant berhasil! Mengalihkan ke Dashboard Toko...");
          setTimeout(() => { router.push("/merchant/dashboard"); router.refresh(); }, 3000);
        } else if (selectedRole === "village_admin") {
          setSuccessMessage("Pendaftaran Admin Desa berhasil! Mengalihkan ke Beranda...");
          setTimeout(() => { router.push("/"); router.refresh(); }, 3000);
        } else {
          setSuccessMessage("Pendaftaran berhasil! Selamat datang di Sentra Desa.");
          setTimeout(() => { router.push(redirectUrl); router.refresh(); }, 3000);
        }
      } else {
        setErrorMessage(res.message || "Pendaftaran gagal.");
        if (res.errors) setFieldErrors(res.errors);
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
      const res = await authClient.login({ email: loginEmail, password: loginPassword });
      if (res.status === "success") {
        setSuccessMessage(isFromCheckout ? "Login berhasil! Melanjutkan ke checkout..." : "Login berhasil! Mengalihkan...");
        setCountdown(3);
        setTimeout(() => { router.push(redirectUrl); router.refresh(); }, 3000);
      } else {
        setErrorMessage(res.message || "Email atau kata sandi salah.");
        if (res.errors) setFieldErrors(res.errors);
      }
    } catch {
      setErrorMessage("Terjadi kesalahan sistem. Silakan periksa koneksi backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const FormBrand = () => (
    <div className="mb-5 flex items-center justify-between">
      <Link href="/" className="group flex items-center gap-2.5 cursor-pointer" title="Kembali ke Beranda">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1 group-hover:border-[#006e23]/35 transition-colors">
          <Image src="/images/logo.png" alt="SentraDesa" width={32} height={32} className="h-full w-full object-contain" priority />
        </div>
        <div className="leading-tight text-left">
          <div className="text-[15px] font-black text-[#006e23] uppercase tracking-wider font-sans group-hover:text-[#005319] transition-colors">SENTRADESA</div>
          <div className="text-[10px] font-semibold text-slate-400">Berdaya dari Desa</div>
        </div>
      </Link>
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-50 hover:text-[#006e23] transition-colors"
        title="Kembali ke Beranda"
      >
        <ChevronLeft size={14} />
        <span>Beranda</span>
      </Link>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen overflow-hidden font-sans"
      style={{
        fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
        background: `
          radial-gradient(ellipse 75% 65% at 8% 28%, rgba(220, 236, 222, 0.95) 0%, rgba(220, 236, 222, 0.45) 45%, transparent 72%),
          radial-gradient(ellipse 75% 65% at 92% 38%, rgba(254, 223, 201, 0.95) 0%, rgba(254, 223, 201, 0.45) 45%, transparent 72%),
          linear-gradient(115deg, #e1ece2 0%, #edf4ed 28%, #faf8f5 50%, #fef3e9 74%, #fce1cb 100%)
        `,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Global CSS fix for Chrome autofill and hide scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px white inset !important;
          -webkit-text-fill-color: #0f172a !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      ` }} />

      {/* ── LEFT SIDE: LOGIN FORM (Styled like reference card) ── */}
      <div
        className={`absolute top-0 left-0 h-full w-full lg:w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col px-4 py-6 sm:px-8 lg:px-12 xl:px-16 transition-all duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isLoginMode
            ? "z-10 opacity-100 translate-x-0 pointer-events-auto"
            : "max-lg:hidden z-0 opacity-0 -translate-x-20 pointer-events-none"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="relative z-10 mx-auto my-auto w-full max-w-[430px] rounded-[14px] bg-white p-7 sm:p-9 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_4px_16px_-2px_rgba(0,0,0,0.03)] border border-slate-100/90 text-left">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden mb-5 p-1 rounded-xl bg-slate-100/90 flex items-center gap-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                isLoginMode ? "bg-white text-[#006e23] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                !isLoginMode ? "bg-white text-[#006e23] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          <FormBrand />

          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight mb-2">
            Masuk ke Akun
          </h1>
          <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed mb-6">
            Masukkan email dan kata sandi Anda untuk mengakses portal SentraDesa.
          </p>

          {isFromCheckout && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-900">
              <ShoppingCart size={18} className="shrink-0 text-[#006e23]" />
              <span>Silakan masuk terlebih dahulu untuk melanjutkan proses checkout pesanan produk desa Anda.</span>
            </div>
          )}

          {errorMessage && isLoginMode && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50/90 px-3.5 py-2.5 text-xs text-red-700 border border-red-200/80">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && isLoginMode && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50/90 px-3.5 py-2.5 text-xs text-emerald-800 border border-emerald-200/80">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">Email</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                  <Mail size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nama@lembaga.id"
                  className="h-11 sm:h-12 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.email[0]}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13.5px] font-semibold text-slate-800">Kata Sandi</label>
                <button type="button" className="text-xs font-semibold text-[#006e23] hover:text-[#005319] hover:underline cursor-pointer">Lupa sandi?</button>
              </div>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                  <Lock size={18} strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-11 sm:h-12 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.password[0]}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember"
                type="checkbox"
                checked={loginRemember}
                onChange={(e) => setLoginRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#006e23] cursor-pointer shrink-0"
              />
              <label htmlFor="remember" className="text-[12.5px] text-slate-600 cursor-pointer select-none">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit Button - Consistent with Dashboard */}
            <button
              type="submit"
              disabled={isLoading || countdown !== null}
              className="ambient-btn-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#005319] active:scale-[0.98] text-sm sm:text-base font-bold text-white transition-all shadow-[0_8px_22px_-3px_rgba(195,140,95,0.4),0_3px_8px_rgba(0,110,35,0.25)] hover:shadow-[0_12px_28px_-3px_rgba(195,140,95,0.5),0_4px_12px_rgba(0,110,35,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {countdown !== null ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Mengalihkan dalam {countdown}s...</span>
                </>
              ) : isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider & Switch */}
          <div className="my-5 border-t border-slate-100" />

          <p className="text-center text-[13.5px] text-slate-500">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => switchMode("register")}
              className="font-bold text-[#006e23] hover:text-[#005319] hover:underline cursor-pointer ml-0.5"
            >
              Daftar Akun
            </button>
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: REGISTER FORM (Styled like reference card) ── */}
      <div
        className={`absolute top-0 right-0 h-full w-full lg:w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col px-4 py-6 sm:px-8 lg:px-12 xl:px-16 transition-all duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          !isLoginMode
            ? "z-10 opacity-100 translate-x-0 pointer-events-auto"
            : "max-lg:hidden z-0 opacity-0 translate-x-20 pointer-events-none"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="relative z-10 mx-auto my-auto w-full max-w-[430px] rounded-[14px] bg-white p-7 sm:p-9 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_4px_16px_-2px_rgba(0,0,0,0.03)] border border-slate-100/90 text-left">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden mb-5 p-1 rounded-xl bg-slate-100/90 flex items-center gap-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                isLoginMode ? "bg-white text-[#006e23] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                !isLoginMode ? "bg-white text-[#006e23] shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          <FormBrand />

          {!hasSelectedRole ? (
            /* ── STEP 1: PILIH PERAN TERLEBIH DAHULU ── */
            <div>
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Daftar Akun
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Pilih jenis akun yang ingin Anda daftarkan:
                </p>
              </div>

              {/* 3 Clean Role Options */}
              <div className="space-y-2.5">
                {/* 1. Pembeli */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("buyer");
                    setHasSelectedRole(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 text-left transition-all hover:border-[#006e23] hover:shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#006e23] group-hover:text-white transition-colors">
                      <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-[#006e23] transition-colors">
                          Pembeli / Warga
                        </span>
                        {isFromCheckout && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            Untuk Belanja
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Belanja produk desa & lacak pesanan
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#006e23] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>

                {/* 2. Merchant UMKM */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("merchant");
                    setHasSelectedRole(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 text-left transition-all hover:border-[#006e23] hover:shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#006e23] group-hover:text-white transition-colors">
                      <Store className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#006e23] transition-colors">
                        Merchant UMKM
                      </span>
                      <p className="text-xs text-slate-500">
                        Buka toko & pasarkan produk lokal desa
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#006e23] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>

                {/* 3. Admin Desa */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("village_admin");
                    setHasSelectedRole(true);
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 text-left transition-all hover:border-[#006e23] hover:shadow-xs active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#006e23] group-hover:text-white transition-colors">
                      <Landmark className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#006e23] transition-colors">
                        Admin Desa
                      </span>
                      <p className="text-xs text-slate-500">
                        Kelola portal desa, warta & transparansi LKDD
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#006e23] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              </div>

              {/* Divider & Switch */}
              <div className="my-5 border-t border-slate-100" />

              <p className="text-center text-[13px] text-slate-500">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-bold text-[#006e23] hover:text-[#005319] hover:underline cursor-pointer ml-0.5"
                >
                  Masuk
                </button>
              </p>
            </div>
          ) : (
            /* ── STEP 2: FORMULIR PENDAFTARAN SESUAI PERAN ── */
            <div>
              {/* Back to Step 1 Bar */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setHasSelectedRole(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Ganti jenis akun</span>
                </button>

                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {roleConfig[selectedRole].badge}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                {roleConfig[selectedRole].title}
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                {roleConfig[selectedRole].desc}
              </p>

              {errorMessage && !isLoginMode && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50/90 px-3.5 py-2.5 text-xs text-red-700 border border-red-200/80">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && !isLoginMode && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50/90 px-3.5 py-2.5 text-xs text-emerald-800 border border-emerald-200/80">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
                {/* Nama Lengkap / Pemilik / Aparatur */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
                    {roleConfig[selectedRole].nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={roleConfig[selectedRole].namePlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-300/80 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                  />
                  {fieldErrors.name && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.name[0]}</p>}
                </div>

                {/* Khusus Merchant: Nama Toko & Nomor WA */}
                {selectedRole === "merchant" && (
                  <>
                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Nama Toko / Usaha UMKM</label>
                      <div className="relative group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                          <Store size={17} strokeWidth={1.8} />
                        </div>
                        <input
                          type="text"
                          required
                          value={regStoreName}
                          onChange={(e) => setRegStoreName(e.target.value)}
                          placeholder="Cth: Keripik Singkong Barokah"
                          className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Nomor WhatsApp Toko</label>
                      <div className="relative group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                          <Phone size={17} strokeWidth={1.8} />
                        </div>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="081234567890"
                          className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Khusus Admin Desa: Jabatan di Desa */}
                {selectedRole === "village_admin" && (
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Jabatan di Pemerintahan Desa</label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                        <Briefcase size={17} strokeWidth={1.8} />
                      </div>
                      <input
                        type="text"
                        required
                        value={regPosition}
                        onChange={(e) => setRegPosition(e.target.value)}
                        placeholder="Cth: Sekretaris Desa / Kaur Pemerintahan"
                        className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                {/* Desa / Lokasi (Wajib untuk Merchant & Admin Desa, Opsional untuk Pembeli) */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
                    {selectedRole === "village_admin"
                      ? "Nama Desa yang Dikelola"
                      : selectedRole === "merchant"
                      ? "Desa & Kecamatan Lokasi Toko"
                      : "Kota / Desa Asal (Opsional)"}
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                      <MapPin size={17} strokeWidth={1.8} />
                    </div>
                    <input
                      type="text"
                      required={selectedRole !== "buyer"}
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      placeholder={
                        selectedRole === "village_admin"
                          ? "Cth: Desa Panundaan, Kec. Ciwidey"
                          : selectedRole === "merchant"
                          ? "Cth: Desa Sukamaju, Kec. Ciawi"
                          : "Cth: Bandung / Desa Panundaan"
                      }
                      className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Email</label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                      <Mail size={17} strokeWidth={1.8} />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@email.id"
                      className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">
                    {roleConfig[selectedRole].emailHint}
                  </p>
                  {fieldErrors.email && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.email[0]}</p>}
                </div>

                {/* Kata Sandi with Checklist */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">Kata Sandi</label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                      <Lock size={17} strokeWidth={1.8} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="h-11 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                    >
                      {showPassword ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
                    </button>
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                    <p className="font-medium text-slate-600 mb-0.5">Kata sandi harus memuat:</p>
                    <div className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} className={regPassword.length >= 8 ? "text-[#006e23]" : "text-slate-300"} />
                      <span className={regPassword.length >= 8 ? "text-slate-700 font-medium" : "text-slate-500"}>Minimal 8 karakter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} className={/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword) ? "text-[#006e23]" : "text-slate-300"} />
                      <span className={/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword) ? "text-slate-700 font-medium" : "text-slate-500"}>Ada huruf besar dan huruf kecil</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check size={12} strokeWidth={2.5} className={/\d/.test(regPassword) ? "text-[#006e23]" : "text-slate-300"} />
                      <span className={/\d/.test(regPassword) ? "text-slate-700 font-medium" : "text-slate-500"}>Ada angka</span>
                    </div>
                  </div>

                  {fieldErrors.password && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.password[0]}</p>}
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#006e23] cursor-pointer shrink-0"
                  />
                  <label htmlFor="terms" className="text-[12px] leading-tight text-slate-500 cursor-pointer select-none">
                    Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi SentraDesa.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || countdown !== null}
                  className="ambient-btn-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#005319] active:scale-[0.98] text-sm sm:text-base font-bold text-white transition-all shadow-[0_8px_22px_-3px_rgba(195,140,95,0.4),0_3px_8px_rgba(0,110,35,0.25)] hover:shadow-[0_12px_28px_-3px_rgba(195,140,95,0.5),0_4px_12px_rgba(0,110,35,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {countdown !== null ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Mengalihkan dalam {countdown}s...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>{roleConfig[selectedRole].btnText}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider & Switch */}
              <div className="my-5 border-t border-slate-100" />

              <p className="text-center text-[13.5px] text-slate-500">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-bold text-[#006e23] hover:text-[#005319] hover:underline cursor-pointer ml-0.5"
                >
                  Masuk
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── SLIDING IMAGE CURTAIN PANEL (Desktop only) ── */}
      {/* Glides smoothly across the screen (translateX 0% to 100%) in sync with form translation */}
      <div
        className={`absolute top-0 left-0 hidden h-full w-1/2 overflow-hidden pointer-events-none select-none transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)] lg:block z-20 shadow-2xl ${
          isLoginMode ? "border-l border-white/30 shadow-[-10px_0_35px_rgba(0,0,0,0.25)]" : "border-r border-white/30 shadow-[10px_0_35px_rgba(0,0,0,0.25)]"
        }`}
        style={{
          transform: isLoginMode ? "translateX(100%)" : "translateX(0%)",
        }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/85 via-black/45 to-black/85 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Counter-parallax inside curtain: 200% width moves -50% to 0% as curtain moves 100% to 0% */}
        <div
          className="absolute top-0 left-0 h-full w-[200%] transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            transform: isLoginMode ? "translateX(-50%)" : "translateX(0%)",
          }}
        >
          <Image src="/bg-desa.jpg" alt="Lanskap Desa Nusantara" fill className="object-cover" priority />
        </div>

        <div className="absolute inset-0 z-30 flex items-center justify-center p-8 lg:p-14 xl:p-16">
          {/* Register Mode Text (shown when curtain is on left) */}
          <div className={`w-full max-w-md flex-col items-start text-left transition-all duration-800 ease-[cubic-bezier(0.65,0,0.35,1)] delay-150 ${
            !isLoginMode ? "flex opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-8 pointer-events-none"
          }`}>
            <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#006e23] to-emerald-400" />
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-sans">Pangan & Kemandirian Desa</p>
            <h1 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-sans">
              SentraDesa
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-white max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-sans">
              Platform terpadu tata kelola potensi komoditas, transparansi ekonomi, dan kemandirian UMKM desa seluruh Nusantara.
            </p>
          </div>

          {/* Login Mode Text (shown when curtain is on right) */}
          <div className={`w-full max-w-md flex-col items-start text-left transition-all duration-800 ease-[cubic-bezier(0.65,0,0.35,1)] delay-150 ${
            isLoginMode ? "flex opacity-100 translate-x-0" : "hidden opacity-0 translate-x-8 pointer-events-none"
          }`}>
            <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#006e23] to-emerald-400" />
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-sans">Tata Kelola & Potensi Desa</p>
            <h1 className="mb-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] font-sans">
              SentraDesa
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-white max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-sans">
              Dashboard terpadu pengelolaan ekonomi desa, transparansi tata kelola, dan monitoring kemajuan komoditas lokal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
