"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CatalogKind } from "@/domain/entities/common";

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

export function ClientDetailPage() {
  const searchParams = useSearchParams();
  const kind = (searchParams.get("kind") ?? "products") as CatalogKind;
  const id = searchParams.get("id") ?? "";

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px]">
        <div className="sentra-container px-4 text-center">
          <div className="empty-state my-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h1 className="text-xl font-black text-slate-800">Konten tidak ditemukan</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Parameter ID tidak valid atau belum ditentukan.</p>
            <Link className="sentra-button-primary mt-6 text-xs px-5 py-2.5 inline-flex" href="/">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  switch (kind) {
    case "villages":
      return <ProfileDesaDetail id={id} />;
    case "products":
      return <ProductDetail id={id} />;
    case "tourisms":
      return <TourismDetail id={id} />;
    case "bumdes":
      return <BumdesDetail id={id} />;
    case "lkdd":
      return <LkddDetail id={id} />;
    case "potentials":
      return <PotentialDetail id={id} />;
    case "exports":
      return <ExportDetail id={id} />;
    case "services":
      return <ServiceDetail id={id} />;
    case "kdmp":
      return <KdmpDetail id={id} />;
    case "articles":
      return <ArtikelDetail id={id} />;
    case "wishlists":
      return <WishlistDetail id={id} />;
    default:
      return <ProfileDesaDetail id={id} />;
  }
}
