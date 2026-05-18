import axios, { AxiosError } from "axios";
import type { ApiErrorPayload, ApiValidationErrorItem } from "@/types/auth.types";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://portfolioapi.booky.cloud";
export const TOKEN_STORAGE_KEY = "auth_token";

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const UPLOAD_TIMEOUT_MS = 120_000;
const UPLOAD_TOAST_THROTTLE_MS = 120;

const getUploadLabel = () => {
  const lang = typeof document !== "undefined" ? document.documentElement.lang : "en";
  return lang === "ar" ? "جاري رفع الصورة" : "Uploading";
};

type UploadToastMeta = {
  toastId: string;
  lastPercent: number;
  lastUpdateAt: number;
};

const getUploadToastMeta = (config: any): UploadToastMeta | undefined =>
  config?.__uploadToastMeta as UploadToastMeta | undefined;

const setUploadToastMeta = (config: any, meta: UploadToastMeta) => {
  config.__uploadToastMeta = meta;
};

const ensureUploadToast = (config: any) => {
  const existing = getUploadToastMeta(config);
  if (existing) return existing;

  const meta: UploadToastMeta = {
    toastId: `upload-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    lastPercent: -1,
    lastUpdateAt: 0,
  };
  setUploadToastMeta(config, meta);
  toast.loading(`${getUploadLabel()}… 0%`, { id: meta.toastId, duration: Infinity });
  return meta;
};

const updateUploadToast = (meta: UploadToastMeta, percent: number) => {
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, Math.round(percent))) : 0;
  const now = Date.now();
  if (safePercent === meta.lastPercent) return;
  if (now - meta.lastUpdateAt < UPLOAD_TOAST_THROTTLE_MS && safePercent !== 100) return;

  meta.lastPercent = safePercent;
  meta.lastUpdateAt = now;
  toast.loading(`${getUploadLabel()}… ${safePercent}%`, { id: meta.toastId, duration: Infinity });
};

const finalizeUploadToast = (config: any, isSuccess: boolean) => {
  const meta = getUploadToastMeta(config);
  if (!meta) return;

  if (isSuccess) {
    updateUploadToast(meta, 100);
  }

  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      toast.dismiss(meta.toastId);
    }, 400);
  } else {
    toast.dismiss(meta.toastId);
  }
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const isFormDataRequest =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (isFormDataRequest && (!config.timeout || config.timeout < UPLOAD_TIMEOUT_MS)) {
    config.timeout = UPLOAD_TIMEOUT_MS;
  }

  if (isFormDataRequest) {
    const meta = ensureUploadToast(config as any);
    const originalOnUploadProgress = config.onUploadProgress;
    config.onUploadProgress = (event) => {
      const total = event.total ?? 0;
      const loaded = event.loaded ?? 0;
      const percent = total > 0 ? (loaded / total) * 100 : 0;
      updateUploadToast(meta, percent);
      if (typeof originalOnUploadProgress === "function") {
        originalOnUploadProgress(event);
      }
    };
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    finalizeUploadToast(response.config as any, true);
    return response;
  },
  (error: AxiosError<ApiErrorPayload>) => {
    finalizeUploadToast((error as any)?.config, false);
    const status = error.response?.status;
    const cfg = error.config as { method?: string; url?: string } | undefined;
    /** Public catalog — 401 here must not wipe auth (avoids pricing UI flashing then losing session on reload). */
    const isPublicPackageCatalogGet = () => {
      const m = (cfg?.method || "get").toLowerCase();
      if (m !== "get") return false;
      const path = String(cfg?.url || "").split("?")[0];
      if (path === "/packages") return true;
      return /^\/packages\/[^/]+$/.test(path);
    };
    if (status === 401 && onUnauthorized && !isPublicPackageCatalogGet()) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

const collectValidationMessages = (
  errors: ApiErrorPayload["errors"],
): string | null => {
  if (!errors) return null;
  if (Array.isArray(errors)) {
    const msgs = (errors as ApiValidationErrorItem[])
      .map((e) => (e?.msg ? String(e.msg) : ""))
      .filter(Boolean);
    return msgs.length ? msgs.join(". ") : null;
  }
  const parts: string[] = [];
  for (const v of Object.values(errors)) {
    if (Array.isArray(v)) parts.push(...v.map(String));
    else if (v) parts.push(String(v));
  }
  return parts.length ? parts.join(". ") : null;
};

export const parseApiError = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const fromValidation = collectValidationMessages(
      error.response?.data?.errors,
    );
    if (fromValidation) return fromValidation;
    const apiMessage =
      error.response?.data?.message || error.response?.data?.error;
    if (apiMessage) return apiMessage;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

export const resolveApiAssetUrl = (path?: string | null) => {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return path;
};
