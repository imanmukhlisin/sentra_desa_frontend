"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CatalogItem } from "@/domain/entities/common";
import { formatCurrency } from "@/shared/utils/format";
import { ImageOffIcon, MapPinIcon, PlusSquareIcon } from "@/presentation/components/icons";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [item.image]);

  return (
    <Link className="group flex min-h-[260px] flex-col overflow-hidden rounded-flutter bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-flutter-hover md:min-h-[310px]" href={item.href}>
      <div className="relative flex-1 overflow-hidden rounded-t-flutter bg-emerald-50">
        {item.image && !imageFailed ? (
          <Image
            src={item.image}
            alt=""
            width={640}
            height={520}
            className="h-full min-h-[150px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full min-h-[150px] items-center justify-center bg-emerald-50 text-sentra-emerald">
            <ImageOffIcon className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="p-3">
        {item.badge ? <div className="text-[10px] font-bold uppercase text-green-700">{item.badge}</div> : null}
        <h3 className="mt-1 line-clamp-1 text-sm font-black text-slate-800">{item.title}</h3>
        {item.description ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p> : null}
        <div className="mt-3 flex items-center justify-between gap-2">
          <strong className="truncate text-[15px] font-black text-sentra-emerald">
            {item.price ? formatCurrency(item.price) : item.subtitle}
          </strong>
          {item.price ? <PlusSquareIcon className="h-7 w-7 shrink-0 text-green-600" /> : null}
        </div>
        {!item.price && item.meta?.[0] ? (
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <MapPinIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.meta[0]}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
