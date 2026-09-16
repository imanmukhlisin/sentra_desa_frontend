import { siteConfig } from "@/shared/config/site";

export interface UserRole {
  id: number;
  name: string;
}

export interface UserMerchant {
  id: number;
  store_name: string;
  status: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles?: UserRole[] | string[];
  merchant?: UserMerchant | null;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  access_token?: string;
  user?: AuthUser;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  village?: string;
}

function resolveApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000/api";
    }
  }
  return (siteConfig.apiBaseUrl || "https://sentradesa.id/api/v1").replace(/\/v1\/?$/, "").replace(/\/$/, "") + "/api";
}

const TOKEN_KEY = "sentra_access_token";
const USER_KEY = "sentra_user";

export const authClient = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setSession(token: string, user: AuthUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Set cookie for Next.js middleware / SSR
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  },

  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const base = resolveApiBaseUrl();
    const url = `${base}/v1/public/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as AuthResponse;

      if (res.ok && data.access_token && data.user) {
        this.setSession(data.access_token, data.user);
        return { ...data, status: "success" };
      }

      return {
        status: "error",
        message: data.message || "Gagal melakukan login.",
        errors: data.errors,
      };
    } catch (err) {
      return {
        status: "error",
        message: err instanceof Error ? err.message : "Koneksi ke server gagal. Pastikan backend aktif.",
      };
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const base = resolveApiBaseUrl();
    const url = `${base}/v1/public/register`;

    try {
      // Backend validates name, email, password
      const bodyPayload = {
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = (await res.json()) as AuthResponse;

      if (res.ok && data.access_token && data.user) {
        this.setSession(data.access_token, data.user);
        return { ...data, status: "success" };
      }

      return {
        status: "error",
        message: data.message || "Pendaftaran gagal.",
        errors: data.errors,
      };
    } catch (err) {
      return {
        status: "error",
        message: err instanceof Error ? err.message : "Koneksi ke server gagal. Pastikan backend aktif.",
      };
    }
  },

  async logout(): Promise<boolean> {
    const token = this.getToken();
    const base = resolveApiBaseUrl();

    if (token) {
      try {
        await fetch(`${base}/v1/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch {
        // Ignore network errors on logout
      }
    }

    this.clearSession();
    return true;
  },

  async getProfile(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    const base = resolveApiBaseUrl();
    try {
      const res = await fetch(`${base}/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          this.clearSession();
        }
        return null;
      }

      const json = await res.json();
      return json.data as AuthUser;
    } catch {
      return null;
    }
  },
};
