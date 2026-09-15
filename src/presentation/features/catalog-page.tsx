"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CatalogItem, CatalogKind } from "@/domain/entities/common";
import { getCatalog } from "@/application/use-cases/get-public-content";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { EmptyState } from "@/presentation/components/catalog-section";
import { FilterForm } from "@/presentation/components/filter-form";

import { ProfileDesaDetail } from "@/presentation/features/details/profile-desa-detail";
import { ProductDetail } from "@/presentation/features/details/product-detail";
import { TourismDetail } from "@/presentation/features/details/tourism-detail";
import { BumdesDetail } from "@/presentation/features/details/bumdes-detail";
import { LkddDetail } from "@/presentation/features/details/lkdd-detail";
import { PotentialDetail } from "@/presentation/features/details/potential-detail";
import { ExportDetail } from "@/presentation/features/details/export-detail";
import { ServiceDetail } from "@/presentation/features/details/service-detail";
import { KdmpDetail } from "@/presentation/features/details/kdmp-detail";
import { ArtikelDetail } from "@/presentation/features/details/artikel-detail";
import { WishlistDetail } from "@/presentation/features/details/wishlist-detail";

type Props = {
  kind: CatalogKind;
  title: string;
  description: string;
  categories?: string[];
  initialItems?: CatalogItem[];
};

export function CatalogPage(props: Props) {
  return (
    <Suspense fallback={<CatalogSkeleton title={props.title} description={props.description} />}>
      <CatalogPageContent {...props} />
    </Suspense>
  );
}

function CatalogPageContent({ kind, title, description, categories, initialItems }: Props) {
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const villageId = searchParams.get("village_id");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const [items, setItems] = useState<CatalogItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems || initialItems.length === 0);

  useEffect(() => {
    if (detailId) return;

    let isMounted = true;
    setLoading(true);

    const query = {
      village_id: villageId || undefined,
      category: category || undefined,
      search: search || undefined
    };

    getCatalog(kind, query)
      .then((res) => {
        if (isMounted) {
          setItems(res || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [kind, detailId, villageId, category, search]);

  if (detailId) {
    switch (kind) {
      case "villages":
        return <ProfileDesaDetail id={detailId} />;
      case "products":
        return <ProductDetail id={detailId} />;
      case "tourisms":
        return <TourismDetail id={detailId} />;
      case "bumdes":
        return <BumdesDetail id={detailId} />;
      case "lkdd":
        return <LkddDetail id={detailId} />;
      case "potentials":
        return <PotentialDetail id={detailId} />;
      case "exports":
        return <ExportDetail id={detailId} />;
      case "services":
        return <ServiceDetail id={detailId} />;
      case "kdmp":
        return <KdmpDetail id={detailId} />;
      case "articles":
        return <ArtikelDetail id={detailId} />;
      case "wishlists":
        return <WishlistDetail id={detailId} />;
    }
  }

  const clearHref = `/${kind === "products" ? "sentra-produk" : kind === "tourisms" ? "desa-wisata" : kind === "potentials" ? "potensi-desa" : kind === "villages" ? "profil-desa" : kind}`;

  return (
    <>
      <section className="bg-sentra-bg pt-[112px]">
        <div className="sentra-container px-5">
          <div className="rounded-flutter bg-white p-5 shadow-flutter">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[1px] text-sentra-emerald">Sentra Desa</span>
                <h1 className="mt-1 text-2xl font-black text-slate-800">{title}</h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
              </div>
              {villageId ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-sentra-emerald border border-emerald-200">
                  <span>Filter Desa (ID: {villageId})</span>
                  <Link href={clearHref} className="ml-1 underline hover:text-emerald-800">
                    Tampilkan Semua
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-sentra-bg py-5">
        <div className="sentra-container">
          <FilterForm categories={categories} />
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">Memuat data...</div>
          ) : items.length ? (
            <div className="standard-grid px-5">
              {items.map((item) => (
                <CatalogCard key={`${kind}-${item.id}-${item.slug}`} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

function CatalogSkeleton({ title, description }: { title: string; description: string }) {
  return (
    <>
      <section className="bg-sentra-bg pt-[112px]">
        <div className="sentra-container px-5">
          <div className="rounded-flutter bg-white p-5 shadow-flutter">
            <span className="text-[10px] font-black uppercase tracking-[1px] text-sentra-emerald">Sentra Desa</span>
            <h1 className="mt-1 text-2xl font-black text-slate-800">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
      </section>
      <section className="bg-sentra-bg py-5">
        <div className="sentra-container">
          <div className="py-12 text-center text-xs font-bold text-slate-500">Memuat data...</div>
        </div>
      </section>
    </>
  );
}
