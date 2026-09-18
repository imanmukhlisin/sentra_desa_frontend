"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { formatCurrency } from "@/shared/utils/format";
import { ChevronLeftIcon, PhoneIcon, StoreIcon, MapPinIcon } from "@/presentation/components/icons";

export function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "spec" | "reviews">("desc");
  const [otherProducts, setOtherProducts] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getDetail("products", id)
      .then(async (item) => {
        if (!active) return;
        setProduct(item);
        setLoading(false);

        if (item) {
          const related = await getCatalog("products");
          if (active) {
            setOtherProducts(related.filter((p) => p.id !== item.id).slice(0, 4));
          }
        }
      })
      .catch(() => {
        if (active) {
          setProduct(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#006e23] border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[10px] ambient-card p-8 max-w-md mx-auto my-12">
            <h1 className="text-xl font-black text-slate-800">Produk Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Produk yang Anda cari tidak tersedia atau stok telah habis.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-2xl font-bold" href="/sentra-produk">
              Kembali ke Sentra Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = product.raw || {};
  const merchant = (raw.merchant as Record<string, unknown>) || {};
  const village = (raw.village as Record<string, unknown>) || {};
  const images = product.gallery?.length ? product.gallery : product.image ? [product.image] : ["/images/header-sentradesa-1.webp"];
  const merchantName = String(merchant.store_name || merchant.name || raw.merchant_name || raw.store_name || "Merchant Desa");
  const phone = String(merchant.phone || raw.phone || raw.merchant_phone || "6281234567890");
  const stock = Number(raw.stock ?? 25);
  const weight = Number(raw.weight ?? 250);
  const unit = String(raw.unit || "pcs");
  const price = product.price || 0;
  const discountPrice = Number(raw.discount_price ?? 0);
  const effectivePrice = discountPrice > 0 && discountPrice < price ? discountPrice : price;
  const totalPrice = effectivePrice * quantity;

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[10px] px-5 py-3.5 shadow-xs">
          <Link href="/sentra-produk" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Sentra Produk</span>
          </Link>
          <span className="rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-[11px] font-extrabold text-[#006e23] uppercase tracking-wider">
            {product.badge || "Produk Desa"}
          </span>
        </div>
      </div>

      <div className="sentra-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6">
            <div className="ambient-card overflow-hidden rounded-[10px] shadow-md border border-white/85">
              <ImageGalleryCarousel images={images} title={product.title} />
            </div>
          </div>

          {/* Right Column: Info, Merchant Card, Quantity, Purchase Actions */}
          <div className="lg:col-span-6 space-y-5">
            <div className="ambient-card rounded-[10px] p-6 sm:p-8 shadow-md border border-white/85 space-y-6">
              <div>
                <span className="inline-flex rounded-full bg-[#006e23]/10 border border-[#006e23]/20 px-3.5 py-1 text-xs font-extrabold text-[#006e23] uppercase tracking-wider">
                  {product.badge || "Olahan Lokal"}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
                  {product.title}
                </h1>
                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#006e23]">
                    {formatCurrency(effectivePrice)}
                  </span>
                  {discountPrice > 0 && discountPrice < price ? (
                    <span className="text-base line-through text-slate-400 font-bold">
                      {formatCurrency(price)}
                    </span>
                  ) : null}
                  <span className="text-xs font-bold text-slate-400">/ {unit}</span>
                </div>
              </div>

              {/* Merchant Store Card */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white/85 p-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006e23]/10 text-[#006e23]">
                    <StoreIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <strong className="block text-sm sm:text-base font-extrabold text-[#171d18]">{merchantName}</strong>
                    {village.id ? (
                      <Link
                        href={`/profil-desa/?id=${village.id}`}
                        className="text-xs text-[#006e23] hover:underline flex items-center gap-1 font-semibold mt-0.5"
                      >
                        <MapPinIcon className="h-3 w-3" /> {String(village.name || "Desa Sentra")}
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPinIcon className="h-3 w-3" /> {product.meta?.[0] || "Desa Sentra"}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(merchantName)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-[#006e23]" /> Chat
                </a>
              </div>

              {/* Specs Badge */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="rounded-2xl border border-white/90 bg-white/85 p-3.5 shadow-2xs text-center">
                  <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">Stok Tersedia</span>
                  <strong className="text-[#171d18] font-extrabold text-sm sm:text-base block mt-0.5">{stock} Pcs</strong>
                </div>
                <div className="rounded-2xl border border-white/90 bg-white/85 p-3.5 shadow-2xs text-center">
                  <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">Berat Pengiriman</span>
                  <strong className="text-[#171d18] font-extrabold text-sm sm:text-base block mt-0.5">{weight} gram</strong>
                </div>
              </div>

              {/* Quantity Counter Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-200/70">
                <label className="block text-xs font-bold text-slate-700">Jumlah Pembelian</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 font-bold transition disabled:opacity-40 cursor-pointer"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-base font-extrabold text-slate-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Subtotal</span>
                    <strong className="text-xl sm:text-2xl font-extrabold text-[#006e23]">{formatCurrency(totalPrice)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/checkout?product_id=${product.id}&quantity=${quantity}`}
                  className="flex-1 ambient-btn-primary justify-center text-center py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
                >
                  Beli Sekarang
                </Link>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20saya%20ingin%20pesan%20${encodeURIComponent(product.title)}%20sebanyak%20${quantity}%20pcs.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition shadow-2xs active:scale-95"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Deskripsi, Spesifikasi, Ratings */}
        <div className="mt-8 rounded-[10px] ambient-card p-6 md:p-8 shadow-md border border-white/85">
          <div className="flex border-b border-slate-200/70 gap-6">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 text-sm font-extrabold transition border-b-2 cursor-pointer ${
                activeTab === "desc" ? "border-[#006e23] text-[#006e23]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Deskripsi Produk
            </button>
            <button
              onClick={() => setActiveTab("spec")}
              className={`pb-3 text-sm font-extrabold transition border-b-2 cursor-pointer ${
                activeTab === "spec" ? "border-[#006e23] text-[#006e23]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Spesifikasi Lengkap
            </button>
          </div>

          <div className="pt-5">
            {activeTab === "desc" ? (
              <div className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-700">
                {product.body ? (
                  <div dangerouslySetInnerHTML={{ __html: product.body }} />
                ) : (
                  <p>{product.description || "Deskripsi produk belum diisi secara lengkap oleh merchant desa."}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Nama Merchant</span>
                  <span className="font-bold text-slate-800">{merchantName}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Stok Produk</span>
                  <span className="font-bold text-slate-800">{stock} Pcs</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Berat Bersih</span>
                  <span className="font-bold text-slate-800">{weight} gram</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-2xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Kategori</span>
                  <span className="font-bold text-slate-800">{product.badge || "Produk Desa"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-[#171d18] tracking-tight mb-5">Produk Lainnya dari Merchant</h2>
            <div className="product-grid">
              {otherProducts.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
