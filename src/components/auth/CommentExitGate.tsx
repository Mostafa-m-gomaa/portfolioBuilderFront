import { useCallback, useEffect, useRef, useState } from "react";
import UserCommentPopup from "@/components/auth/UserCommentPopup";
import {
  canPromptUserComment,
  isDashboardTourActive,
} from "@/lib/userComment";
import { useAuthStore } from "@/store/auth.store";

const EXIT_INTENT_COOLDOWN_MS = 30_000;
const MIN_DWELL_MS = 3_000;

const CommentExitGate = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const lastShownAtRef = useRef(0);
  const mountedAtRef = useRef(Date.now());
  const hasEngagedRef = useRef(false);
  const exitIntentReadyRef = useRef(false);

  const shouldPrompt = isAuthenticated && canPromptUserComment(user);

  const tryOpenPopup = useCallback(() => {
    if (!shouldPrompt || open || !exitIntentReadyRef.current) return;
    if (isDashboardTourActive()) return;
    const now = Date.now();
    if (now - lastShownAtRef.current < EXIT_INTENT_COOLDOWN_MS) return;
    lastShownAtRef.current = now;
    setOpen(true);
  }, [open, shouldPrompt]);

  useEffect(() => {
    if (!shouldPrompt) {
      setOpen(false);
      exitIntentReadyRef.current = false;
      hasEngagedRef.current = false;
      return;
    }

    mountedAtRef.current = Date.now();

    const markEngaged = () => {
      hasEngagedRef.current = true;
      if (Date.now() - mountedAtRef.current >= MIN_DWELL_MS) {
        exitIntentReadyRef.current = true;
      }
    };

    const dwellTimer = window.setTimeout(() => {
      if (hasEngagedRef.current) {
        exitIntentReadyRef.current = true;
      }
    }, MIN_DWELL_MS);

    const handleMouseOut = (event: MouseEvent) => {
      if (!hasEngagedRef.current || !exitIntentReadyRef.current) return;
      if (isDashboardTourActive()) return;
      if (event.clientY > 8) return;
      const related = event.relatedTarget as Node | null;
      if (related && document.documentElement.contains(related)) return;
      tryOpenPopup();
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!exitIntentReadyRef.current || isDashboardTourActive()) return;
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("mousemove", markEngaged, { passive: true });
    document.addEventListener("mousedown", markEngaged, { passive: true });
    document.addEventListener("keydown", markEngaged, { passive: true });
    document.addEventListener("scroll", markEngaged, { passive: true });
    document.addEventListener("touchstart", markEngaged, { passive: true });
    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearTimeout(dwellTimer);
      document.removeEventListener("mousemove", markEngaged);
      document.removeEventListener("mousedown", markEngaged);
      document.removeEventListener("keydown", markEngaged);
      document.removeEventListener("scroll", markEngaged);
      document.removeEventListener("touchstart", markEngaged);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPrompt, tryOpenPopup]);

  if (!shouldPrompt || !open) return null;

  return (
    <UserCommentPopup
      open={open}
      onStay={() => setOpen(false)}
      onSuccess={() => setOpen(false)}
    />
  );
};

export default CommentExitGate;
