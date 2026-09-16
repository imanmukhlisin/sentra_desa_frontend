"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem } from "@/domain/entities/common";
import { formatCurrency } from "@/shared/utils/format";
import { ImageOffIcon, MapPinIcon, ShoppingBagIcon } from "@/presentation/components/icons";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [item.image]);

  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-xl border border-[#b9ccb5]/50 bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:border-[#006e23] hover:shadow-md"
      href={item.href}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e9f0e7]">
        {item.badge ? (
          <div className="absolute left-3 top-3 z-10 rounded border border-[#a04110]/40 bg-white/95 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#a04110] shadow-sm backdrop-blur-sm">
            {item.badge}
          </div>
        ) : null}

        {item.image && !imageFailed ? (
          <Image
            src={item.image}
            alt={item.title}
            width={640}
            height={480}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6b7c68]">
            <ImageOffIcon className="h-10 w-10 opacity-60" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-headline text-sm font-bold text-[#171d18] line-clamp-1 transition-colors group-hover:text-[#006e23]">
            {item.title}
          </h3>
          {item.description ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#3b4b39]/80">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-dashed border-[#b9ccb5]/40 pt-3">
          <strong className="truncate font-headline text-sm font-extrabold text-[#006e23] md:text-[15px]">
            {item.price ? formatCurrency(item.price) : item.subtitle}
          </strong>

          <span className="inline-flex items-center gap-1 rounded-lg border border-[#b9ccb5]/80 bg-[#eff6ec] px-2.5 py-1 text-[11px] font-semibold text-[#006e23] transition group-hover:bg-[#006e23] group-hover:text-white">
            <ShoppingBagIcon className="h-3.5 w-3.5" />
            <span>Detail</span>
          </span>
        </div>

        {!item.price && item.meta?.[0] ? (
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#6b7c68]">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.meta[0]}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
