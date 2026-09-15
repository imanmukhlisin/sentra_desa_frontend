"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { ArticleIcon, UserIcon } from "@/presentation/components/icons";

export function ArtikelDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [otherArticles, setOtherArticles] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDetail("articles", id)
      .then(async (data) => {
        if (!active) return;
        setArticle(data);
        setLoading(false);
        if (data) {
          const list = await getCatalog("articles");
          if (active) setOtherArticles(list.filter((a) => a.id !== data.id).slice(0, 3));
        }
      })
      .catch(() => {
        if (active) {
          setArticle(null);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat isi artikel desa...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <ArticleIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-black text-slate-800">Artikel Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Artikel yang Anda cari tidak tersedia.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/artikel">
              Kembali ke Artikel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = article.raw || {};
  const author = String(raw.author || raw.penulis || "Humas Desa");
  const publishDate = String(raw.published_at || raw.created_at || "Terbaru").split("T")[0];
  const coverImage = article.image || "/images/header-sentradesa-1.webp";

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/artikel" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Artikel Desa
          </Link>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-extrabold text-blue-700 uppercase">
            {article.badge || "Kabar Desa"}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6 max-w-4xl">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800">
              {article.badge || "Artikel Terbaru"}
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <UserIcon className="h-4 w-4 text-blue-600" /> {author}
              </span>
              <span>•</span>
              <span>📅 {publishDate}</span>
            </div>
          </div>

          <div className="relative h-[260px] md:h-[400px] w-full overflow-hidden rounded-xl bg-slate-100">
            <Image src={coverImage} alt={article.title} fill className="object-cover" />
          </div>

          <div
            className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700 space-y-4 pt-2"
            dangerouslySetInnerHTML={{
              __html: article.body || article.description || "<p>Artikel berita perdesaan mengenai kegiatan pembangunan dan kabar terbaru desa.</p>"
            }}
          />
        </article>

        {otherArticles.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-black text-slate-900 mb-4">Artikel Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherArticles.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
