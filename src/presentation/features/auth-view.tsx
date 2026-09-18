"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2, Check } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/infrastructure/api/auth-client";

interface AuthViewProps {
  initialMode?: "register" | "login";
}

export function AuthView({ initialMode = "register" }: AuthViewProps) {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);

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
      const res = await authClient.register({ name: regName, email: regEmail, password: regPassword, village: regVillage });
      if (res.status === "success") {
        setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke beranda...");
        setTimeout(() => { router.push("/"); router.refresh(); }, 1200);
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
        setSuccessMessage("Login berhasil! Mengalihkan...");
        setTimeout(() => { router.push("/"); router.refresh(); }, 1000);
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
    <div className="mb-5 flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">
        <Image src="/images/logo.png" alt="SentraDesa" width={32} height={32} className="h-full w-full object-contain" priority />
      </div>
      <div className="leading-tight text-left">
        <div className="text-[15px] font-black text-[#006e23] uppercase tracking-wider font-sans">SENTRADESA</div>
        <div className="text-[10px] font-semibold text-slate-400">Berdaya dari Desa</div>
      </div>
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
              disabled={isLoading}
              className="ambient-btn-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#005319] active:scale-[0.98] text-sm sm:text-base font-bold text-white transition-all shadow-[0_8px_22px_-3px_rgba(195,140,95,0.4),0_3px_8px_rgba(0,110,35,0.25)] hover:shadow-[0_12px_28px_-3px_rgba(195,140,95,0.5),0_4px_12px_rgba(0,110,35,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
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

          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight mb-2">
            Daftar Akun
          </h1>
          <p className="text-[13px] sm:text-sm text-slate-500 leading-relaxed mb-6">
            Buat akun anda dulu. Setelah masuk anda bisa mulai mengelola website desa.
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

          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            {/* Nama Lengkap - Clean no icon like in reference */}
            <div>
              <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Budi Santoso"
                className="h-11 sm:h-12 w-full rounded-xl border border-slate-300/80 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
              />
              {fieldErrors.name && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.name[0]}</p>}
            </div>

            {/* Email Field with Envelope icon and helper text */}
            <div>
              <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">Email</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                  <Mail size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@lembaga.id"
                  className="h-11 sm:h-12 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                />
              </div>
              <p className="mt-1.5 text-[11.5px] text-slate-400 leading-normal">
                Pakai email kerja yang aktif. Ke alamat inilah kabar verifikasi dan status akun dikirim.
              </p>
              {fieldErrors.email && <p className="mt-1 text-[11.5px] text-red-500 font-medium">{fieldErrors.email[0]}</p>}
            </div>

            {/* Desa & Kecamatan */}
            <div>
              <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">Desa & Kecamatan</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                  <MapPin size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  required
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  placeholder="Cth: Sukamaju, Ciawi"
                  className="h-11 sm:h-12 w-full rounded-xl border border-slate-300/80 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006e23] focus:ring-2 focus:ring-[#006e23]/15 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Kata Sandi with Checklist */}
            <div>
              <label className="block text-[13.5px] font-semibold text-slate-800 mb-1.5">Kata Sandi</label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#006e23] transition-colors">
                  <Lock size={18} strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
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

              {/* Password Requirements Checklist matching reference */}
              <div className="mt-2.5 space-y-1 text-[11.5px] text-slate-500">
                <p className="font-medium text-slate-600 mb-1">Kata sandi harus memuat:</p>
                <div className="flex items-center gap-1.5">
                  <Check size={13} strokeWidth={2.5} className={regPassword.length >= 8 ? "text-[#006e23]" : "text-slate-300"} />
                  <span className={regPassword.length >= 8 ? "text-slate-700 font-medium" : "text-slate-500"}>Minimal 8 karakter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} strokeWidth={2.5} className={/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword) ? "text-[#006e23]" : "text-slate-300"} />
                  <span className={/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword) ? "text-slate-700 font-medium" : "text-slate-500"}>Ada huruf besar dan huruf kecil</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} strokeWidth={2.5} className={/\d/.test(regPassword) ? "text-[#006e23]" : "text-slate-300"} />
                  <span className={/\d/.test(regPassword) ? "text-slate-700 font-medium" : "text-slate-500"}>Ada angka</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} strokeWidth={2.5} className={/[!@#$%^&*(),.?":{}|<>]/.test(regPassword) ? "text-[#006e23]" : "text-slate-300"} />
                  <span className={/[!@#$%^&*(),.?":{}|<>]/.test(regPassword) ? "text-slate-700 font-medium" : "text-slate-500"}>Ada simbol, misalnya ! @ # $ %</span>
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

            {/* Submit Button - Consistent with Dashboard */}
            <button
              type="submit"
              disabled={isLoading}
              className="ambient-btn-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#006e23] hover:bg-[#005319] active:scale-[0.98] text-sm sm:text-base font-bold text-white transition-all shadow-[0_8px_22px_-3px_rgba(195,140,95,0.4),0_3px_8px_rgba(0,110,35,0.25)] hover:shadow-[0_12px_28px_-3px_rgba(195,140,95,0.5),0_4px_12px_rgba(0,110,35,0.35)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun</span>
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
