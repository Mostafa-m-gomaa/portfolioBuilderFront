import type { AuthUser } from "@/types/auth.types";

export const isConfiguredSubdomain = (subdomain?: string | null) =>
  Boolean(subdomain && !subdomain.startsWith("temp-"));

/** User must pick a plan or start free trial before the rest of onboarding. */
export const needsSubscriptionOnboarding = (user?: AuthUser | null) =>
  user?.subscriptionStatus == null || user?.subscriptionStatus === "NOT_DETECTED";

/**
 * Default authenticated landing path (does not check portfolio / language — those pages redirect further).
 */
export const getPostAuthEntryPath = (user?: AuthUser | null): string => {
  if (needsSubscriptionOnboarding(user)) return "/select-subscription";
  if (isConfiguredSubdomain(user?.subdomain)) return "/dashboard";
  return "/choose-subdomain";
};
