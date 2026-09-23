"use client";

import { useEffect, useState } from "react";
import { getFreshCatalog } from "@/application/use-cases/get-public-content";
import { CatalogItem } from "@/domain/entities/common";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { CatalogGridSkeleton } from "@/presentation/components/skeleton";

export function HomeProducts({
  initialProducts,
  category = "all",
  search
}: {
  initialProducts: CatalogItem[];
  category?: string;
  search?: string;
}) {
  const [products, setProducts] = useState<CatalogItem[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [refreshCompleted, setRefreshCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const queryCategory = category === "all" ? undefined : category;
    const querySearch = search?.trim() ? search.trim() : undefined;

    getFreshCatalog("products", { limit: "8", category: queryCategory, search: querySearch }).then((latestProducts) => {
      if (active) {
        if (latestProducts !== null) {
          setProducts(latestProducts);
        } else if (category === "all" && !querySearch) {
          setProducts(initialProducts);
        } else {
          setProducts([]);
        }
        setLoading(false);
        setRefreshCompleted(true);
      }
    });

    return () => {
      active = false;
    };
  }, [category, search, initialProducts]);

  if (loading && !products.length) {
    return <CatalogGridSkeleton count={8} />;
  }

  if (!products.length && refreshCompleted) {
    return (
      <div key={`empty-${category}-${search || ""}`} className="px-5 py-4 tab-fade-enter">
        <div className="empty-state">
          <p className="text-base font-bold text-slate-700">Produk tidak ditemukan</p>
          <p className="mt-1 text-xs text-slate-500">Belum ada produk untuk kategori ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${category}-${search || ""}`}
      className={`product-grid tab-fade-enter transition-all duration-300 ease-out ${
        loading ? "opacity-40 scale-[0.99] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {products.map((product) => (
        <CatalogCard key={`${product.id}-${product.slug}`} item={product} />
      ))}
    </div>
  );
}
