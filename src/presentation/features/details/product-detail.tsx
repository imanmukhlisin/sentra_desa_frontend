"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem, DetailItem } from "@/domain/entities/common";
import { getCatalog, getDetail } from "@/application/use-cases/get-public-content";
import { ImageGalleryCarousel } from "@/presentation/components/image-gallery-carousel";
import { CatalogCard } from "@/presentation/components/catalog-card";
import { formatCurrency } from "@/shared/utils/format";
import { ChevronLeftIcon, PhoneIcon, MapPinIcon, ShoppingCartIcon, ServiceSquircle } from "@/presentation/components/icons";
import { DetailSkeleton } from "@/presentation/components/skeleton";
import { useCart } from "@/presentation/context/cart-context";

export function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "spec" | "reviews">("desc");
  const [otherProducts, setOtherProducts] = useState<CatalogItem[]>([]);
  const { addItem } = useCart();

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
    return <DetailSkeleton backLabel="Kembali ke Sentra Produk" />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-16">
        <div className="sentra-container px-4 text-center">
          <div className="rounded-[14px] ambient-card p-8 max-w-md mx-auto my-12">
            <h1 className="text-xl font-black text-slate-800">Produk Tidak Ditemukan</h1>
            <p className="mt-2 text-xs text-slate-500">Produk yang Anda cari tidak tersedia atau stok telah habis.</p>
            <Link className="ambient-btn-primary mt-6 inline-flex text-xs px-6 py-3 rounded-[14px] font-bold" href="/sentra-produk/">
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
  const quality = String(raw.quality || raw.kualitas || "100% Asli");
  const partner = String(raw.partner || raw.mitra || "BUMDes");

  const basePrice = Number(product.price || 0);
  const rawDiscountPrice = Number(raw.discount_price ?? raw.promo_price ?? raw.discountPrice ?? 0);
  const rawOriginalPrice = Number(raw.original_price ?? raw.originalPrice ?? 0);
  const rawDiscountPercent = Number(
    raw.discount_percent ??
    raw.discount_percentage ??
    (typeof raw.discount === "number" ? raw.discount : parseFloat(String(raw.discount || "").replace("%", "")) || 0)
  );
  const rawDiscountAmount = Number(raw.potongan_harga ?? raw.discount_amount ?? 0);

  let normalPrice = basePrice;
  let effectivePrice = basePrice;

  if (rawDiscountPrice > 0 && rawDiscountPrice < basePrice) {
    normalPrice = basePrice;
    effectivePrice = rawDiscountPrice;
  } else if (rawOriginalPrice > basePrice && basePrice > 0) {
    normalPrice = rawOriginalPrice;
    effectivePrice = basePrice;
  } else if (rawDiscountPercent > 0 && rawDiscountPercent < 100 && basePrice > 0) {
    normalPrice = basePrice;
    effectivePrice = Math.round(basePrice * (1 - rawDiscountPercent / 100));
  } else if (rawDiscountAmount > 0 && rawDiscountAmount < basePrice) {
    normalPrice = basePrice;
    effectivePrice = basePrice - rawDiscountAmount;
  }

  const hasDiscount = normalPrice > effectivePrice && effectivePrice > 0;
  const savingsAmount = hasDiscount ? normalPrice - effectivePrice : 0;
  const savingsPercent = hasDiscount ? Math.round((savingsAmount / normalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <Link href="/sentra-produk/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006e23] transition-colors">
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Kembali ke Sentra Produk</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#16a34a]/10 border border-[#16a34a]/20 px-3 py-1 text-[11px] font-extrabold text-[#16a34a] uppercase tracking-wider">
            <ServiceSquircle service="sentra-produk" size="sm" />
            <span>{product.badge || "Produk Desa"}</span>
          </span>
        </div>
      </div>

      <div className="sentra-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="ambient-card overflow-hidden rounded-[14px] shadow-md border border-white/85 flex-1 flex flex-col h-full min-h-[380px] sm:min-h-[460px] lg:min-h-full">
              <ImageGalleryCarousel
                images={images}
                title={product.title}
                className="h-full w-full min-h-[380px] sm:min-h-[460px] lg:min-h-full aspect-[16/11] lg:aspect-auto flex-1 rounded-[14px]"
              />
            </div>
          </div>

          {/* Right Column: Info, Merchant Card, Quantity, Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="ambient-card rounded-[14px] p-6 sm:p-8 shadow-md border border-white/85 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#171d18] tracking-tight leading-tight">
                  {product.title}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-baseline gap-2.5">
                  <span className="font-headline text-3xl sm:text-4xl font-extrabold text-[#006e23] tracking-tight">
                    {formatCurrency(effectivePrice)}
                  </span>
                  {hasDiscount && (
                    <div className="inline-flex items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                        {formatCurrency(normalPrice)}
                      </span>
                      <span className="rounded-[6px] bg-red-50 border border-red-200/80 px-2 py-0.5 text-xs font-bold text-red-600">
                        Hemat {savingsPercent}%
                      </span>
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-500">/ {unit}</span>
                </div>
              </div>

              {/* Merchant Store Card */}
              <div className="flex items-center justify-between gap-3 rounded-[14px] border border-slate-200/80 bg-white/90 p-3.5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <ServiceSquircle service="sentra-produk" size="md" />
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
                  className="inline-flex items-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-[#006e23]" /> Chat
                </a>
              </div>

              {/* Product Feature / Specs Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-[12px] border border-slate-200/80 bg-white/95 p-3 text-center shadow-2xs hover:border-[#006e23]/30 transition-colors">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Stok</span>
                  <strong className="text-slate-800 font-extrabold text-xs sm:text-sm block mt-0.5 truncate">{stock} {unit}</strong>
                </div>

                <div className="rounded-[12px] border border-slate-200/80 bg-white/95 p-3 text-center shadow-2xs hover:border-[#006e23]/30 transition-colors">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Berat</span>
                  <strong className="text-slate-800 font-extrabold text-xs sm:text-sm block mt-0.5 truncate">{weight >= 1000 ? `${(weight / 1000).toLocaleString("id-ID")} kg` : `${weight} gr`}</strong>
                </div>

                <div className="rounded-[12px] border border-slate-200/80 bg-white/95 p-3 text-center shadow-2xs hover:border-[#006e23]/30 transition-colors">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Kualitas</span>
                  <strong className="text-slate-800 font-extrabold text-xs sm:text-sm block mt-0.5 truncate">{quality}</strong>
                </div>

                <div className="rounded-[12px] border border-slate-200/80 bg-white/95 p-3 text-center shadow-2xs hover:border-[#006e23]/30 transition-colors">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mitra</span>
                  <strong className="text-slate-800 font-extrabold text-xs sm:text-sm block mt-0.5 truncate">{partner}</strong>
                </div>
              </div>

              {/* Quantity Counter Selector */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/70">
                <label className="block text-xs font-bold text-slate-700">Jumlah Pembelian</label>
                <div className="flex items-center rounded-[10px] border border-slate-200 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] hover:bg-slate-100 text-slate-700 font-bold transition disabled:opacity-40 cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-base font-extrabold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addItem(
                      {
                        id: product.id,
                        title: product.title,
                        price: effectivePrice,
                        image: images[0],
                        href: `/sentra-produk?id=${product.id}`
                      },
                      quantity,
                      true
                    );
                  }}
                  className="w-full ambient-btn-primary inline-flex items-center justify-center gap-2.5 rounded-[14px] py-3.5 px-6 text-sm sm:text-base font-bold shadow-md transition active:scale-95 cursor-pointer"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>+ Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Deskripsi, Spesifikasi, Ratings */}
        <div className="mt-8 rounded-[14px] ambient-card p-6 md:p-8 shadow-md border border-white/85">
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
                  <p className="leading-relaxed font-medium">
                    {product.description || "Deskripsi produk belum diisi secara lengkap oleh merchant desa."}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between p-3.5 rounded-[14px] bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Nama Merchant</span>
                  <span className="font-bold text-slate-800">{merchantName}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-[14px] bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Stok Produk</span>
                  <span className="font-bold text-slate-800">{stock} {unit}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-[14px] bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Berat Bersih</span>
                  <span className="font-bold text-slate-800">{weight >= 1000 ? `${(weight / 1000).toLocaleString("id-ID")} kg` : `${weight} gram`}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-[14px] bg-white/80 border border-slate-200/70">
                  <span className="text-slate-500 font-medium">Kategori</span>
                  <span className="font-bold text-slate-800">{product.badge || "Produk Desa"}</span>
                </div>
                {hasDiscount && (
                  <>
                    <div className="flex justify-between p-3.5 rounded-[14px] bg-white/80 border border-slate-200/70">
                      <span className="text-slate-500 font-medium">Harga Normal</span>
                      <span className="font-bold text-slate-400 line-through">{formatCurrency(normalPrice)}</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-[14px] bg-emerald-50/70 border border-emerald-200/80">
                      <span className="text-emerald-700 font-medium">Potongan Harga</span>
                      <span className="font-extrabold text-[#006e23]">Hemat {formatCurrency(savingsAmount)} ({savingsPercent}%)</span>
                    </div>
                  </>
                )}
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
