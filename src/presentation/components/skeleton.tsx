import React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

export function CatalogCardSkeleton() {
  return (
    <div className="ambient-card flex flex-col overflow-hidden rounded-[14px] h-full">
      {/* Media placeholder */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-200/70 animate-pulse" />

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2.5">
          <Skeleton className="h-4 sm:h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 sm:h-3.5 w-full rounded-md" />
          <Skeleton className="h-3 sm:h-3.5 w-2/3 rounded-md" />
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 border-t border-dashed border-[#e6dcce] pt-3.5">
          <Skeleton className="h-5 sm:h-6 w-24 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CatalogGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <CatalogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CatalogPageSkeleton({
  title,
  description
}: {
  title?: string;
  description?: string;
}) {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-4">
        <div className="sentra-container">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2.5 max-w-xl w-full">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 sm:h-10 w-64" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <div className="hidden sm:flex items-center gap-6 border-l border-slate-200 pl-6">
              <div className="space-y-1 text-right">
                <Skeleton className="h-6 w-16 ml-auto" />
                <Skeleton className="h-3 w-20 ml-auto" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-6 w-16 ml-auto" />
                <Skeleton className="h-3 w-20 ml-auto" />
              </div>
            </div>
          </div>

          {/* Filter Form Skeleton */}
          <div className="mb-8 rounded-[14px] ambient-card p-3 flex flex-wrap gap-3">
            <Skeleton className="h-[52px] flex-1 min-w-[200px] rounded-[14px]" />
            <Skeleton className="h-[52px] w-48 rounded-[14px]" />
            <Skeleton className="h-[52px] w-48 rounded-[14px]" />
            <Skeleton className="h-[52px] w-28 rounded-[14px]" />
          </div>
        </div>
      </section>

      <section className="pb-16 pt-0">
        <div className="sentra-container">
          <CatalogGridSkeleton count={8} />
        </div>
      </section>
    </>
  );
}

export function DetailSkeleton({
  backLabel = "Kembali",
  type = "default"
}: {
  backLabel?: string;
  type?: "default" | "article";
}) {
  if (type === "article") {
    return (
      <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
        <div className="sentra-container mb-6 max-w-4xl">
          <div className="ambient-card flex items-center justify-between rounded-[14px] px-5 py-3.5 shadow-xs">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>

        <div className="sentra-container max-w-4xl">
          <div className="ambient-card rounded-[14px] p-6 md:p-10 shadow-xs space-y-6">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-8 md:h-10 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-[260px] md:h-[400px] w-full rounded-[14px]" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 md:pt-32 pb-20">
      {/* Navigation Top Bar */}
      <div className="sentra-container mb-6">
        <div className="ambient-card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="sentra-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Media / Gallery area */}
          <div className="lg:col-span-7">
            <div className="ambient-card overflow-hidden rounded-2xl p-4 sm:p-5">
              <Skeleton className="aspect-square sm:aspect-[4/3] w-full rounded-xl" />
              <div className="mt-4 flex gap-3">
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl" />
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl" />
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Info area */}
          <div className="space-y-6 lg:col-span-5">
            <div className="ambient-card space-y-4 rounded-2xl p-6 sm:p-7">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-7 sm:h-9 w-4/5" />
              <Skeleton className="h-6 w-1/3" />
              <div className="border-t border-dashed border-[#e6dcce] pt-4 space-y-2.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="pt-6 flex gap-3">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
