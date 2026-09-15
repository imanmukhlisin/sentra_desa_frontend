"use client";

import { useEffect, useState } from "react";
import { getFreshCatalog } from "@/application/use-cases/get-public-content";
import { CatalogItem } from "@/domain/entities/common";
import { CatalogCard } from "@/presentation/components/catalog-card";

export function HomeProducts({
  initialProducts,
  category = "all"
}: {
  initialProducts: CatalogItem[];
  category?: string;
}) {
  const [products, setProducts] = useState<CatalogItem[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [refreshCompleted, setRefreshCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const queryCategory = category === "all" ? undefined : category;

    getFreshCatalog("products", { limit: "6", category: queryCategory }).then((latestProducts) => {
      if (active) {
        if (latestProducts !== null) {
          setProducts(latestProducts);
        } else if (category === "all") {
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
  }, [category, initialProducts]);

  if (loading && !products.length) {
    return (
      <div className="px-5 py-4">
        <div className="empty-state animate-pulse">Memuat produk...</div>
      </div>
    );
  }

  if (!products.length && refreshCompleted) {
    return (
      <div className="px-5 py-4">
        <div className="empty-state">
          <p className="text-base font-bold text-slate-700">Produk tidak ditemukan</p>
          <p className="mt-1 text-xs text-slate-500">Belum ada produk untuk kategori ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-grid transition-opacity duration-200 ${loading ? "opacity-60" : "opacity-100"}`}>
      {products.map((product) => (
        <CatalogCard key={`${product.id}-${product.slug}`} item={product} />
      ))}
    </div>
  );
}
