"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/presentation/components/icons";
import { getProvinces } from "@/application/use-cases/get-public-content";

export function FilterForm({ categories = [] }: { categories?: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getProvinces()
      .then((data) => {
        if (data && data.length > 0) setProvinces(data);
      })
      .catch(() => {});
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams();

    // Preserve existing village_id query if active
    const currentVillageId = params.get("village_id");
    if (currentVillageId) query.set("village_id", currentVillageId);

    ["search", "category", "province_id"].forEach((key) => {
      const value = String(data.get(key) ?? "").trim();
      if (value) query.set(key, value);
    });

    router.push(`?${query.toString()}`);
  }

  const hasCategories = categories && categories.length > 0;
  const hasActiveFilter = Boolean(params.get("search") || params.get("category") || params.get("province_id"));

  return (
    <form
      className={`w-full mb-8 rounded-[10px] ambient-card p-2.5 sm:p-3 grid gap-2.5 sm:gap-3 ${
        hasCategories
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto]"
          : "grid-cols-1 sm:grid-cols-[1.8fr_1.2fr_auto]"
      }`}
      onSubmit={submit}
    >
      {/* Input Pencarian */}
      <div className="relative flex items-center min-w-0">
        <div className="pointer-events-none absolute left-4 flex items-center justify-center text-slate-400">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          name="search"
          placeholder="Cari nama, deskripsi, atau kata kunci..."
          defaultValue={params.get("search") ?? ""}
          className="h-[52px] w-full rounded-2xl border border-slate-200/85 bg-white/85 pl-12 pr-4 text-sm sm:text-base font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#006e23]/60 focus:outline-none focus:ring-3 focus:ring-[#006e23]/10 transition shadow-2xs"
        />
      </div>

      {hasCategories ? (
        <div className="relative flex items-center min-w-0">
          <select
            name="category"
            defaultValue={params.get("category") ?? ""}
            className="h-[52px] w-full appearance-none rounded-2xl border border-slate-200/85 bg-white/85 px-4 pr-10 text-sm sm:text-base font-semibold text-slate-700 focus:bg-white focus:border-[#006e23]/60 focus:outline-none focus:ring-3 focus:ring-[#006e23]/10 transition cursor-pointer shadow-2xs"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 flex items-center justify-center text-slate-400">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      ) : null}

      <div className="relative flex items-center min-w-0">
        <select
          name="province_id"
          defaultValue={params.get("province_id") ?? ""}
          className="h-[52px] w-full appearance-none rounded-2xl border border-slate-200/85 bg-white/85 px-4 pr-10 text-sm sm:text-base font-semibold text-slate-700 focus:bg-white focus:border-[#006e23]/60 focus:outline-none focus:ring-3 focus:ring-[#006e23]/10 transition cursor-pointer shadow-2xs"
        >
          <option value="">Semua Wilayah (Provinsi)</option>
          {provinces.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 flex items-center justify-center text-slate-400">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="h-[52px] shrink-0 flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-2xl ambient-btn-primary px-7 sm:px-8 text-sm sm:text-base font-bold shadow-md transition active:scale-95 cursor-pointer"
          type="submit"
        >
          <SearchIcon className="h-5 w-5 text-white shrink-0" />
          <span>Cari</span>
        </button>
        {hasActiveFilter ? (
          <button
            type="button"
            onClick={() => router.push("?")}
            className="h-[52px] shrink-0 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/85 px-5 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition active:scale-95 cursor-pointer shadow-2xs"
            title="Reset Filter"
          >
            Reset
          </button>
        ) : null}
      </div>
    </form>
  );
}
