import { siteConfig } from "@/shared/config/site";

type ApiResponse<T> = {
  status?: string;
  data?: T;
  message?: string;
};

export class HttpClient {
  constructor(private readonly baseUrl = siteConfig.apiBaseUrl) {}

  async get<T>(endpoint: string, query?: Record<string, string | undefined>): Promise<T | null> {
    const urlsToTry: string[] = [];

    if (typeof window !== "undefined") {
      if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        urlsToTry.push(process.env.NEXT_PUBLIC_API_BASE_URL);
      }
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        urlsToTry.push("http://localhost:8000/api/v1");
      }
    }

    urlsToTry.push(this.baseUrl);
    urlsToTry.push(siteConfig.apiBaseUrl);
    urlsToTry.push("https://sentradesa.id/api/v1");

    const uniqueUrls = Array.from(new Set(urlsToTry.filter(Boolean)));
    const cleanEndpoint = endpoint.replace(/^\//, "");

    for (const base of uniqueUrls) {
      try {
        const cleanBase = base.replace(/\/$/, "");
        const url = new URL(`${cleanBase}/${cleanEndpoint}`);

        Object.entries(query ?? {}).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value);
        });

        const response = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          next: { revalidate: 300 }
        });

        if (response.ok) {
          const json = (await response.json()) as ApiResponse<T>;
          const data = (json.data ?? (json as T)) as T;
          if (data !== null && data !== undefined) {
            if (Array.isArray(data) && data.length === 0) {
              // If empty array, continue to next fallback URL in case another endpoint has seeded data
              continue;
            }
            return data;
          }
        }
      } catch {
        // Try next fallback URL
      }
    }

    return null;
  }
}
