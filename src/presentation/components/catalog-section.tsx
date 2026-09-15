import Link from "next/link";
import { CatalogItem } from "@/domain/entities/common";
import { CatalogCard } from "@/presentation/components/catalog-card";

type Props = {
  title: string;
  description: string;
  href: string;
  items: CatalogItem[];
  columns?: "three" | "four";
};

export function CatalogSection({ title, description, href, items, columns = "three" }: Props) {
  return (
    <section className="py-10">
      <div className="sentra-container">
        <div className="mb-6 flex items-end justify-between gap-5 px-0 md:px-5">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <Link className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-sentra-emerald shadow-sm transition hover:shadow-md md:inline-flex" href={href}>
            Lihat Semua
          </Link>
        </div>
        {items.length ? (
          <div className={columns === "four" ? "product-grid" : "standard-grid"}>
            {items.map((item) => (
              <CatalogCard key={`${href}-${item.id}-${item.slug}`} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

export function EmptyState() {
  return (
    <div className="empty-state">
      <h3 className="font-bold text-slate-700">Data belum tersedia</h3>
      <p className="mt-1 text-sm">Konten akan muncul otomatis ketika API publik mengirimkan data.</p>
    </div>
  );
}
