"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { SearchIcon } from "@/presentation/components/icons";

export function FilterForm({ categories = [] }: { categories?: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams();

    // Preserve existing village_id query if active
    const currentVillageId = params.get("village_id");
    if (currentVillageId) query.set("village_id", currentVillageId);

    ["search", "category"].forEach((key) => {
      const value = String(data.get(key) ?? "").trim();
      if (value) query.set(key, value);
    });

    router.push(`?${query.toString()}`);
  }

  const hasCategories = categories && categories.length > 0;

  return (
    <form
      className={`mx-5 mb-6 grid gap-2.5 rounded-flutter bg-white p-3 shadow-flutter ${
        hasCategories ? "md:grid-cols-[1.8fr_1fr_auto]" : "md:grid-cols-[1fr_auto]"
      }`}
      onSubmit={submit}
    >
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          className="field pl-10"
          name="search"
          placeholder="Cari nama, desa, atau kata kunci..."
          defaultValue={params.get("search") ?? ""}
        />
      </div>

      {hasCategories ? (
        <select className="field" name="category" defaultValue={params.get("category") ?? ""}>
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replace(/_/g, " ").toUpperCase()}
            </option>
          ))}
        </select>
      ) : null}

      <button className="sentra-button-primary px-6 font-extrabold text-xs" type="submit">
        Cari
      </button>
    </form>
  );
}
