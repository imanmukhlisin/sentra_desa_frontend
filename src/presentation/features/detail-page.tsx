import Link from "next/link";
import { CatalogKind } from "@/domain/entities/common";
import { getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";

export async function DetailPage({ kind, id }: { kind: CatalogKind; id: string }) {
  const item = await getDetail(kind, id);

  if (!item) {
    return (
      <section className="bg-sentra-bg pt-[112px]">
        <div className="sentra-container">
          <div className="empty-state">
          <h1 className="text-xl font-black text-slate-700">Konten tidak ditemukan</h1>
          <p className="mt-1 text-sm text-slate-500">Halaman ini belum tersedia di data publik.</p>
          <Link className="sentra-button-outline mt-4" href="/">
            Kembali ke Beranda
          </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="detail-hero pt-[112px]">
        <div className="detail-image">
          <ImageGalleryCarousel images={[item.image ?? "/images/header-sentradesa-1.webp", ...(item.gallery ?? [])]} title={item.title} />
        </div>
        <div className="detail-copy">
          {item.badge ? <span className="inline-flex rounded bg-sentra-emerald px-2.5 py-1 text-[10px] font-bold uppercase text-white">{item.badge}</span> : null}
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-800 md:text-5xl">{item.title}</h1>
          {item.subtitle ? <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p> : null}
          {item.description ? <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p> : null}
          {item.facts?.length ? (
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {item.facts.map((fact) => (
                <div className="rounded-xl border border-slate-200 bg-white p-3" key={`${fact.label}-${fact.value}`}>
                  <small className="block text-xs text-slate-500">{fact.label}</small>
                  <strong className="text-sm text-slate-800">{fact.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-5 flex gap-2">
            <Link className="sentra-button-primary" href="/checkout">
              Lanjutkan
            </Link>
            <Link className="sentra-button-outline" href="/">
              Beranda
            </Link>
          </div>
        </div>
      </section>
      <article className="content">
        <h2 className="mb-3 text-xl font-black text-slate-800">Informasi Lengkap</h2>
        {item.body ? <div className="leading-7" dangerouslySetInnerHTML={{ __html: item.body }} /> : <p className="text-slate-500">Detail belum tersedia.</p>}
      </article>
    </>
  );
}
