import type { AuthUser } from "@/types/auth.types";

export const COMMENT_MAX_LENGTH = 1000;

export const needsUserComment = (user?: AuthUser | null): boolean =>
  Boolean(user) && user!.hasComment === false;
