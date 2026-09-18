"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { ArticleIcon, UserIcon, ChevronLeftIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent" />
          <p className="text-xs font-bold text-slate-600">Memuat isi artikel desa...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 border border-white/85 shadow-sm max-w-md mx-auto my-12">
            <ArticleIcon className="h-12 w-12 text-slate-400 mx-auto" />
            <h1 className="mt-4 text-xl font-extrabold text-[#171d18]">Artikel Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Artikel yang Anda cari tidak tersedia.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/artikel">
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
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6 max-w-4xl">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/artikel" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Artikel Desa</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            {article.badge || "Kabar Desa"}
          </span>
        </div>
      </div>

      <div className="sentra-container max-w-4xl">
        <article className="ambient-card rounded-[14px] p-6 md:p-10 shadow-xs space-y-6">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
              {article.badge || "Artikel Terbaru"}
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-[#171d18] leading-tight tracking-tight">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-black/5 pb-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <UserIcon className="h-4 w-4 text-[#006e23]" /> {author}
              </span>
              <span>•</span>
              <span className="font-medium">📅 {publishDate}</span>
            </div>
          </div>

          <div className="relative h-[260px] md:h-[400px] w-full overflow-hidden rounded-[14px] border border-white/80 bg-slate-100 shadow-xs">
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
            <h2 className="text-lg font-extrabold text-[#171d18] mb-4">Artikel Lainnya</h2>
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
