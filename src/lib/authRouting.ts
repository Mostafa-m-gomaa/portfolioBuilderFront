import type { AuthUser } from "@/types/auth.types";

export const isConfiguredSubdomain = (subdomain?: string | null) =>
  Boolean(subdomain && !subdomain.startsWith("temp-"));

/** User must pick a plan or start free trial before the rest of onboarding. */
export const needsSubscriptionOnboarding = (user?: AuthUser | null) =>
  user?.subscriptionStatus == null || user?.subscriptionStatus === "NOT_DETECTED";

export const PENDING_SUBSCRIPTION_CHOICE_KEY = "pending_subscription_choice";

/** Set after Google (or other) signup until the user picks trial or a paid plan. */
export const markPendingSubscriptionChoice = () => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PENDING_SUBSCRIPTION_CHOICE_KEY, "1");
};

export const clearPendingSubscriptionChoice = () => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_SUBSCRIPTION_CHOICE_KEY);
};

export const hasPendingSubscriptionChoice = () =>
  typeof sessionStorage !== "undefined" &&
  sessionStorage.getItem(PENDING_SUBSCRIPTION_CHOICE_KEY) === "1";

/**
 * Default authenticated landing path (does not check portfolio / language — those pages redirect further).
 */
export const getPostAuthEntryPath = (user?: AuthUser | null): string => {
  if (needsSubscriptionOnboarding(user)) return "/select-subscription";
  if (isConfiguredSubdomain(user?.subdomain)) return "/dashboard";
  return "/choose-subdomain";
};
