import { siteConfig } from "@/shared/config/site";

type ApiResponse<T> = {
  status?: string;
  data?: T;
  message?: string;
};

export class HttpClient {
  constructor(private readonly baseUrl = siteConfig.apiBaseUrl) {}

  async get<T>(endpoint: string, query?: Record<string, string | number | boolean | undefined>): Promise<T | null> {
    const isDev =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));

    const base = process.env.NEXT_PUBLIC_API_BASE_URL
      ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")
      : isDev
      ? "http://127.0.0.1:8000/api/v1"
      : (siteConfig.apiBaseUrl || "https://sentradesa.id/api/v1").replace(/\/$/, "");

    const cleanEndpoint = endpoint.replace(/^\//, "");

    try {
      const url = new URL(`${base}/${cleanEndpoint}`);

      Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });

      const controller = new AbortController();
      const timeoutMs = isDev ? 12000 : 8000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        signal: controller.signal,
        next: { revalidate: 120 }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = (await response.json()) as ApiResponse<T>;
        const data = (json.data ?? (json as T)) as T;
        return data ?? null;
      }
    } catch {
      // Return null on network error / abort so fallback sample data kicks in immediately
    }

    return null;
  }
}
