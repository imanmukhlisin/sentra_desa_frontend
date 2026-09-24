"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Search, MapPin, ChevronDown, X, RotateCcw } from "lucide-react";
import { getProvinces } from "@/application/use-cases/get-public-content";

const CATEGORY_LABELS: Record<string, { label: string }> = {
  makanan_minuman: { label: "Makanan & Minuman" },
  kerajinan: { label: "Kerajinan" },
  fashion: { label: "Fashion & Batik" },
  pertanian: { label: "Pertanian" },
  perikanan: { label: "Perikanan" },
  peternakan: { label: "Peternakan" },
  jasa: { label: "Jasa Desa" },
  lainnya: { label: "Lainnya" },
  alam: { label: "Wisata Alam" },
  budaya: { label: "Wisata Budaya" },
  buatan: { label: "Wisata Edukasi" },
  kuliner: { label: "Kuliner Lokal" },
  komoditas: { label: "Komoditas" },
  perdagangan: { label: "Perdagangan" },
  wisata: { label: "Wisata" },
  keuangan: { label: "Keuangan" }
};

export function FilterForm({ categories = [] }: { categories?: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);

  const searchQuery = params.get("search") ?? "";
  const activeCategory = params.get("category") ?? "";
  const provinceId = params.get("province_id") ?? "";

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    getProvinces()
      .then((data) => {
        if (data && data.length > 0) setProvinces(data);
      })
      .catch(() => {});
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams(params.toString());

    // Preserve village_id
    const currentVillageId = params.get("village_id");
    if (currentVillageId) query.set("village_id", currentVillageId);

    if (searchInput.trim()) {
      query.set("search", searchInput.trim());
    } else {
      query.delete("search");
    }

    router.push(`?${query.toString()}`);
  }

  const handleCategorySelect = (cat: string) => {
    const query = new URLSearchParams(params.toString());
    if (cat === activeCategory || !cat) {
      query.delete("category");
    } else {
      query.set("category", cat);
    }
    router.push(`?${query.toString()}`);
  };

  const handleProvinceSelect = (provId: string) => {
    const query = new URLSearchParams(params.toString());
    if (provId) {
      query.set("province_id", provId);
    } else {
      query.delete("province_id");
    }
    router.push(`?${query.toString()}`);
  };

  const removeFilter = (key: "search" | "category" | "province_id") => {
    const query = new URLSearchParams(params.toString());
    query.delete(key);
    if (key === "search") setSearchInput("");
    router.push(`?${query.toString()}`);
  };

  const resetAllFilters = () => {
    setSearchInput("");
    const query = new URLSearchParams();
    const currentVillageId = params.get("village_id");
    if (currentVillageId) query.set("village_id", currentVillageId);
    router.push(`?${query.toString()}`);
  };

  const hasCategories = categories && categories.length > 0;
  const hasActiveFilter = Boolean(searchQuery || activeCategory || provinceId);

  return (
    <div className="w-full mb-8">
      {/* ── Unified Search Dock (Crisp Geometry - Anti-Slop) ── */}
      <form
        onSubmit={submit}
        className="group relative flex flex-col md:flex-row items-stretch md:items-center gap-1.5 p-1.5 sm:p-2 rounded-[14px] bg-white border border-slate-200 shadow-sm transition-all focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-300"
      >
        {/* 1. Search Field */}
        <div className="relative flex-1 flex items-center min-w-0">
          <div className="pointer-events-none absolute left-3 flex items-center justify-center text-slate-400 group-focus-within:text-slate-700 transition-colors">
            <Search className="h-4 w-4" strokeWidth={2} />
          </div>
          <input
            name="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari desa, produk, komoditas, atau kata kunci..."
            className="h-10 sm:h-11 w-full rounded-lg bg-transparent pl-9 pr-8 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none transition"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                if (searchQuery) removeFilter("search");
              }}
              className="absolute right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 text-xs transition cursor-pointer"
              title="Hapus pencarian"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* 2. Category Dropdown */}
        {hasCategories && (
          <>
            <div className="hidden md:block h-6 w-px bg-slate-200 shrink-0" />
            <div className="relative md:w-48 flex items-center min-w-0 bg-slate-50 md:bg-transparent rounded-lg">
              <select
                name="category"
                value={activeCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="h-10 sm:h-11 w-full appearance-none rounded-lg bg-transparent pl-3 pr-7 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 focus:bg-white focus:outline-none transition cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]?.label || cat.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 flex items-center justify-center text-slate-400">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </>
        )}

        {/* 3. Province Dropdown */}
        <div className="hidden md:block h-6 w-px bg-slate-200 shrink-0" />
        <div className="relative md:w-52 flex items-center min-w-0 bg-slate-50 md:bg-transparent rounded-lg">
          <div className="pointer-events-none absolute left-2.5 flex items-center justify-center text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <select
            name="province_id"
            value={provinceId}
            onChange={(e) => handleProvinceSelect(e.target.value)}
            className="h-10 sm:h-11 w-full appearance-none rounded-lg bg-transparent pl-8 pr-7 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 focus:bg-white focus:outline-none transition cursor-pointer"
          >
            <option value="">Semua Wilayah</option>
            {provinces.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 flex items-center justify-center text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* 4. Action Button */}
        <button
          type="submit"
          className="h-10 sm:h-11 shrink-0 inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#006e23] hover:bg-[#005319] px-5 text-sm font-semibold text-white shadow-xs active:scale-[0.99] transition-all cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-white shrink-0" strokeWidth={2.5} />
          <span>Cari</span>
        </button>
      </form>

      {/* ── Quick Category Tabs (Crisp Rectangular Chips) ── */}
      {hasCategories && (
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategorySelect("")}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-all cursor-pointer ${
              !activeCategory
                ? "bg-[#006e23] text-white border-[#006e23] shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
            }`}
          >
            <span>Semua</span>
          </button>
          {categories.map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#006e23] text-white border-[#006e23] font-semibold shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
                }`}
              >
                <span>{meta?.label || cat.replace(/_/g, " ")}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Active Filter Tags (Dismissible) ── */}
      {hasActiveFilter && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Filter Aktif:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 text-xs font-medium">
              <span>Pencarian: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => removeFilter("search")}
                className="hover:text-red-600 ml-0.5 cursor-pointer flex items-center"
                title="Hapus pencarian"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 text-xs font-medium">
              <span>Kategori: {CATEGORY_LABELS[activeCategory]?.label || activeCategory}</span>
              <button
                type="button"
                onClick={() => removeFilter("category")}
                className="hover:text-red-600 ml-0.5 cursor-pointer flex items-center"
                title="Hapus filter kategori"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {provinceId && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 text-xs font-medium">
              <span>Provinsi: {provinces.find((p) => String(p.id) === provinceId)?.name || provinceId}</span>
              <button
                type="button"
                onClick={() => removeFilter("province_id")}
                className="hover:text-red-600 ml-0.5 cursor-pointer flex items-center"
                title="Hapus filter provinsi"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-600 ml-1 cursor-pointer transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Semua</span>
          </button>
        </div>
      )}
    </div>
  );
}
