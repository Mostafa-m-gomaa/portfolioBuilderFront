import type { AuthUser } from "@/types/auth.types";

export const isConfiguredSubdomain = (subdomain?: string | null) =>
  Boolean(subdomain && !subdomain.startsWith("temp-"));

/** Signup no longer requires plan selection — backend assigns the free plan automatically. */
export const needsSubscriptionOnboarding = (_user?: AuthUser | null) => false;

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

export const PENDING_SITE_READY_KEY = "pending_site_ready";
export const PENDING_SITE_CONTENT_KEY = "pending_site_content";

/** Set when a new user finishes subdomain setup and should see onboarding content once. */
export const markPendingSiteContent = () => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PENDING_SITE_CONTENT_KEY, "1");
  sessionStorage.setItem(PENDING_SITE_READY_KEY, "1");
};

/** @deprecated Use markPendingSiteContent — kept for call sites that only mark the ready step. */
export const markPendingSiteReady = () => {
  markPendingSiteContent();
};

export const clearPendingSiteReady = () => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_SITE_READY_KEY);
  sessionStorage.removeItem(PENDING_SITE_CONTENT_KEY);
};

export const clearPendingSiteContent = () => {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_SITE_CONTENT_KEY);
};

export const hasPendingSiteReady = () =>
  typeof sessionStorage !== "undefined" &&
  sessionStorage.getItem(PENDING_SITE_READY_KEY) === "1";

export const hasPendingSiteContent = () =>
  typeof sessionStorage !== "undefined" &&
  sessionStorage.getItem(PENDING_SITE_CONTENT_KEY) === "1";

export const SETUP_SITE_CONTENT_PATH = "/setup-site-content";

export const getPostSubdomainOnboardingPath = (user?: AuthUser | null): string => {
  if (!isConfiguredSubdomain(user?.subdomain)) return "/choose-subdomain";
  if (hasPendingSiteContent()) return SETUP_SITE_CONTENT_PATH;
  if (hasPendingSiteReady()) return "/site-ready";
  return "/dashboard";
};

/**
 * Default authenticated landing path (does not check portfolio / language — those pages redirect further).
 */
export const getPostAuthEntryPath = (user?: AuthUser | null): string =>
  getPostSubdomainOnboardingPath(user);
