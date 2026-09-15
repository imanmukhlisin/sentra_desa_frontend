"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { formatCurrency } from "@/shared/utils/format";
import { PhoneIcon, StoreIcon, MapPinIcon } from "@/presentation/components/icons";

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
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sentra-emerald border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 pt-[112px] pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm max-w-md mx-auto my-12">
            <h1 className="text-xl font-black text-slate-800">Produk Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Produk yang Anda cari tidak tersedia atau stok telah habis.</p>
            <Link className="sentra-button-primary mt-6 inline-flex text-xs px-5 py-2.5" href="/sentra-produk">
              Kembali ke Sentra Produk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const raw = product.raw || {};
  const images = product.gallery?.length ? product.gallery : product.image ? [product.image] : ["/images/header-sentradesa-1.webp"];
  const merchantName = String(raw.merchant_name || raw.store_name || "Merchant Desa");
  const phone = String(raw.phone || raw.merchant_phone || "6281234567890");
  const stock = Number(raw.stock ?? 25);
  const weight = Number(raw.weight ?? 250);
  const price = product.price || 0;
  const totalPrice = price * quantity;

  return (
    <div className="min-h-screen bg-slate-50 pt-[90px] pb-16">
      {/* Navigation Top Bar */}
      <div className="sticky top-[70px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-xs">
        <div className="sentra-container px-4 py-3 flex items-center justify-between">
          <Link href="/sentra-produk" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sentra-emerald transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Sentra Produk
          </Link>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-sentra-emerald uppercase">
            {product.badge || "Produk Desa"}
          </span>
        </div>
      </div>

      <div className="sentra-container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <ImageGalleryCarousel images={images} title={product.title} />
            </div>
          </div>

          {/* Right Column: Info, Merchant Card, Quantity, Purchase Actions */}
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div>
                <span className="inline-flex rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                  {product.badge || "Olahan Lokal"}
                </span>
                <h1 className="mt-2 text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-sentra-emerald">
                    {formatCurrency(price)}
                  </span>
                  <span className="text-xs text-slate-400">/ pcs</span>
                </div>
              </div>

              {/* Merchant Store Card */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sentra-emerald/10 text-sentra-emerald">
                    <StoreIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <strong className="block text-sm font-extrabold text-slate-800">{merchantName}</strong>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" /> {product.meta?.[0] || "Desa Sentra"}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(merchantName)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-emerald-600" /> Chat Merchant
                </a>
              </div>

              {/* Specs Badge */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-slate-400 block text-[11px]">Stok Tersedia</span>
                  <strong className="text-slate-800 font-extrabold">{stock} Pcs</strong>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-slate-400 block text-[11px]">Berat Pengiriman</span>
                  <strong className="text-slate-800 font-extrabold">{weight} gram</strong>
                </div>
              </div>

              {/* Quantity Counter Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">Jumlah Pembelian</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-400 font-medium">Subtotal</span>
                    <strong className="text-lg font-black text-slate-900">{formatCurrency(totalPrice)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/checkout?product_id=${product.id}&quantity=${quantity}`}
                  className="flex-1 sentra-button-primary justify-center text-xs py-3.5 font-extrabold shadow-md"
                >
                  Beli Sekarang
                </Link>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=Halo%20saya%20ingin%20pesan%20${encodeURIComponent(product.title)}%20sebanyak%20${quantity}%20pcs.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sentra-button-outline px-5 py-3.5 text-xs font-bold"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Deskripsi, Spesifikasi, Ratings */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 text-sm font-extrabold transition border-b-2 ${
                activeTab === "desc" ? "border-sentra-emerald text-sentra-emerald" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Deskripsi Produk
            </button>
            <button
              onClick={() => setActiveTab("spec")}
              className={`pb-3 text-sm font-extrabold transition border-b-2 ${
                activeTab === "spec" ? "border-sentra-emerald text-sentra-emerald" : "border-transparent text-slate-500 hover:text-slate-800"
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
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Nama Merchant</span>
                  <span className="font-bold text-slate-800">{merchantName}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Stok Produk</span>
                  <span className="font-bold text-slate-800">{stock} Pcs</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Berat Bersih</span>
                  <span className="font-bold text-slate-800">{weight} gram</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Kategori</span>
                  <span className="font-bold text-slate-800">{product.badge || "Produk Desa"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-black text-slate-900 mb-4">Produk Lainnya dari Merchant</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
