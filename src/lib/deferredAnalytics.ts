import { META_PIXEL_ID, META_PIXEL_SCRIPT_URL } from "@/lib/metaPixel";

const CLARITY_ID = "x2zao1xin4";

function loadScript(src: string, id?: string) {
  if (id && document.getElementById(id)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  if (id) script.id = id;
  document.head.appendChild(script);
}

function initMetaPixel() {
  if (typeof window.fbq === "function") return;

  type FbqStub = {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    loaded?: boolean;
    version?: string;
    push?: FbqStub;
  };

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  } as FbqStub;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;

  loadScript(META_PIXEL_SCRIPT_URL, "meta-pixel-script");
  window.fbq!("init", META_PIXEL_ID);
  window.fbq!("track", "PageView");
}

function initClarity() {
  if (typeof window.clarity === "function") return;

  const clarity = function (...args: unknown[]) {
    (clarity.q = clarity.q || []).push(args);
  } as typeof window.clarity & { q?: unknown[] };

  window.clarity = clarity;
  loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`, "clarity-script");
}

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/** Load third-party analytics after the main app is interactive. */
export function initDeferredAnalytics() {
  initMetaPixel();
  initClarity();
}
