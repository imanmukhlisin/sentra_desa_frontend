const fallback = "/images/header-sentradesa-1.webp";

export function imageUrl(value?: string | null) {
  if (!value) return fallback;
  if (value.startsWith("/images/")) return value;
  if (value.startsWith("/storage")) return value;
  if (value.startsWith("storage/")) return `/${value}`;
  if (value.startsWith("http://") || value.startsWith("https://")) return normalizeStorageUrl(value);
  return value;
}

function normalizeStorageUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.pathname.startsWith("/storage/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function galleryUrls(value: unknown): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : typeof value === "string" ? safeJsonArray(value) : [];
  return raw.map((item) => imageUrl(String(item))).filter(Boolean);
}

function safeJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return value ? [value] : [];
  }
}
