export function formatCurrency(value?: number | string | null) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function compactNumber(value?: number | string | null) {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  return new Intl.NumberFormat("id-ID", { notation: "compact" }).format(Number.isFinite(amount) ? amount : 0);
}

export function stripHtml(value?: string | null) {
  return (value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(value?: string | null, length = 150) {
  const text = stripHtml(value);
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}...`;
}
