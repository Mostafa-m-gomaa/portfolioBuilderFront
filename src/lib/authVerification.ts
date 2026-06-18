import { normalizeEmail } from "@/lib/emailValidation";
import type { AuthUser } from "@/types/auth.types";

export const isUserEmailVerified = (user?: AuthUser | null) =>
  Boolean(user?.isVerified ?? user?.emailVerified);

type EmailVerificationFlowActions = {
  setPendingEmail: (email: string) => void;
  resendVerification: (email: string) => Promise<unknown>;
  logout?: () => void;
};

export const prepareEmailVerificationFlow = async (
  email: string,
  actions: EmailVerificationFlowActions,
  options?: { logoutFirst?: boolean },
) => {
  const normalized = normalizeEmail(email);
  if (options?.logoutFirst && actions.logout) {
    actions.logout();
  }
  actions.setPendingEmail(normalized);
  try {
    await actions.resendVerification(normalized);
  } catch {
    // Errors are toasted by the mutation; still continue to the verify page.
  }
  return normalized;
};
