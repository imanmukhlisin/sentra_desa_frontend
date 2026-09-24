"use client";

import { FormEvent, useState } from "react";

type Field = { name: string; label: string; type?: string };

export function SimpleFormPage({ title, description, fields }: { title: string; description: string; fields: Field[] }) {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="sentra-shell pt-[104px] md:pt-[116px] pb-16">
      <div className="sentra-container max-w-[580px]">
        <div className="ambient-card p-6 md:p-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006e23]">Sentra Desa</span>
            <h1 className="mt-1.5 text-xl sm:text-2xl font-black text-[#171d18] tracking-tight">{title}</h1>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-500">{description}</p>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-[14px] bg-emerald-50/90 border border-emerald-200/80 p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-emerald-100 text-[#006e23] mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#171d18]">Pesanan Berhasil Dicatat</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Terima kasih! Informasi pesanan Anda telah tersimpan. Pengelola atau pihak desa akan segera menghubungi Anda untuk koordinasi pengiriman.
              </p>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={submit}>
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    {field.label}
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200/85 bg-white/90 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#006e23]/60 focus:ring-3 focus:ring-[#006e23]/10 transition shadow-2xs"
                    name={field.name}
                    type={field.type ?? "text"}
                    required
                  />
                </div>
              ))}
              <div className="pt-3">
                <button
                  className="ambient-btn-primary w-full rounded-[14px] py-3 px-5 text-sm font-bold shadow-md transition active:scale-95 cursor-pointer"
                  type="submit"
                >
                  Kirim & Konfirmasi
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
