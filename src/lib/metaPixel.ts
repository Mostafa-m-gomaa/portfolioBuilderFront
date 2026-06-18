export const META_PIXEL_ID = "1036805102113837";
export const META_PIXEL_SCRIPT_URL =
  "https://connect.facebook.net/en_US/fbevents.js";

export const META_PIXEL_PURCHASE_VALUE_KEY = "meta_pixel_purchase_value";
export const META_PIXEL_PURCHASE_CURRENCY_KEY = "meta_pixel_purchase_currency";

const DEBUG =
  import.meta.env.DEV || import.meta.env.VITE_META_PIXEL_DEBUG === "true";

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type Fbq = {
  (...args: FbqArgs): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: Fbq;
};

type FbqArgs =
  | ["init", string]
  | ["track", "PageView"]
  | ["track", "Lead"]
  | ["track", "CompleteRegistration"]
  | ["track", "Purchase", { value: number; currency: string }]
  | [
      "track",
      "StartTrial",
      { value: number; currency: string; predicted_ltv: number },
    ]
  | ["track", string, Record<string, unknown>?];

function log(message: string, ...args: unknown[]) {
  if (DEBUG) {
    console.log(`[Meta Pixel] ${message}`, ...args);
  }
}

function warn(message: string, ...args: unknown[]) {
  console.warn(`[Meta Pixel] ${message}`, ...args);
}

export function isMetaPixelAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function isMetaPixelReady(): boolean {
  return isMetaPixelAvailable() && typeof window.fbq?.callMethod === "function";
}

let blockedWarningShown = false;

function warnIfPixelBlocked(): void {
  if (blockedWarningShown) return;
  blockedWarningShown = true;

  if (isMetaPixelAvailable() && !isMetaPixelReady()) {
    warn(
      "fbevents.js did not load — usually blocked by an ad blocker or privacy extension (ERR_BLOCKED_BY_CLIENT). " +
        "Disable extensions for this site to test Meta Pixel.",
    );
    return;
  }

  warn("Timed out waiting for fbevents.js");
}

export function waitForMetaPixel(
  maxAttempts = 100,
  intervalMs = 50,
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      if (isMetaPixelReady()) {
        log("fbevents.js loaded — pixel ready to send events");
        resolve(true);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        warnIfPixelBlocked();
        resolve(false);
        return;
      }

      window.setTimeout(check, intervalMs);
    };

    check();
  });
}

function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!isMetaPixelReady()) {
    warn(`Cannot track ${eventName} — fbevents.js not ready yet`);
    return;
  }

  if (params) {
    window.fbq!("track", eventName, params);
  } else {
    window.fbq!("track", eventName);
  }

  log(`${eventName} fired`, params ?? "");
}

async function trackEventWhenReady(
  eventName: string,
  params?: Record<string, unknown>,
): Promise<void> {
  const ready = await waitForMetaPixel();
  if (!ready) {
    return;
  }

  trackEvent(eventName, params);
}

export async function trackPageView(path?: string): Promise<void> {
  const ready = await waitForMetaPixel();
  if (!ready) return;

  const pagePath =
    path ?? `${window.location.pathname}${window.location.search}`;
  trackEvent("PageView");
  log("PageView path", pagePath);
}

export function storePendingPurchase(value: number, currency: string): void {
  try {
    sessionStorage.setItem(META_PIXEL_PURCHASE_VALUE_KEY, String(value));
    sessionStorage.setItem(
      META_PIXEL_PURCHASE_CURRENCY_KEY,
      currency.trim().toUpperCase(),
    );
  } catch {
    /* ignore */
  }
}

export function consumePendingPurchase(): {
  value: number;
  currency: string;
} | null {
  try {
    const valueRaw = sessionStorage.getItem(META_PIXEL_PURCHASE_VALUE_KEY);
    const currency = sessionStorage.getItem(META_PIXEL_PURCHASE_CURRENCY_KEY);
    sessionStorage.removeItem(META_PIXEL_PURCHASE_VALUE_KEY);
    sessionStorage.removeItem(META_PIXEL_PURCHASE_CURRENCY_KEY);

    if (valueRaw && currency) {
      const value = Number.parseFloat(valueRaw);
      if (Number.isFinite(value)) {
        return { value, currency: currency.toUpperCase() };
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

export function trackLead(): void {
  void trackEventWhenReady("Lead");
}

export function trackCompleteRegistration(): void {
  void trackEventWhenReady("CompleteRegistration");
}

export function trackPurchase(value: number, currency: string): void {
  void trackEventWhenReady("Purchase", {
    value,
    currency: currency.trim().toUpperCase(),
  });
}

export function trackStartTrial(currency: string): void {
  void trackEventWhenReady("StartTrial", {
    value: 0,
    currency: currency.trim().toUpperCase(),
    predicted_ltv: 0,
  });
}
