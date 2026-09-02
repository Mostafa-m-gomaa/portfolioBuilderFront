import type { AuthUser } from "@/types/auth.types";

export const COMMENT_MAX_LENGTH = 1000;

export const needsUserComment = (user?: AuthUser | null): boolean =>
  Boolean(user) && user!.hasComment === false;

/** Feedback popup only after the dashboard tour is finished or skipped. */
export const canPromptUserComment = (user?: AuthUser | null): boolean =>
  needsUserComment(user) && user!.takeTour === true;

export const isDashboardTourActive = (): boolean =>
  typeof document !== "undefined" &&
  document.body.classList.contains("driver-active");
