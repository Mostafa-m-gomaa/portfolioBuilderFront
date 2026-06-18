import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, waitForMetaPixel } from "@/lib/metaPixel";

/**
 * Meta base code in index.html fires the first PageView (per Meta docs).
 * This hook fires PageView again on client-side route changes only (SPA).
 */
export function useMetaPixel() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    let cancelled = false;
    const path = `${location.pathname}${location.search}`;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    void (async () => {
      const ready = await waitForMetaPixel();
      if (cancelled || !ready) {
        return;
      }

      trackPageView(path);
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);
}
