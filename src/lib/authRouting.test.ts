import { describe, expect, it, beforeEach } from "vitest";
import {
  clearPendingSiteReady,
  getPostAuthEntryPath,
  getPostSubdomainOnboardingPath,
  markPendingSiteContent,
  clearPendingSiteContent,
  hasPendingSiteContent,
  SETUP_SITE_CONTENT_PATH,
} from "./authRouting";

describe("authRouting", () => {
  beforeEach(() => {
    clearPendingSiteReady();
  });

  it("routes new users without a configured subdomain to choose-subdomain", () => {
    expect(getPostAuthEntryPath({ subdomain: "temp-user-1", subscriptionStatus: null })).toBe(
      "/choose-subdomain",
    );
    expect(
      getPostAuthEntryPath({ subdomain: "temp-user-1", subscriptionStatus: undefined }),
    ).toBe("/choose-subdomain");
  });

  it("keeps configured users on the dashboard path", () => {
    expect(getPostAuthEntryPath({ subdomain: "my-site", subscriptionStatus: "ACTIVE" })).toBe(
      "/dashboard",
    );
  });

  it("routes first-time configured users to site content setup once", () => {
    markPendingSiteContent();
    expect(getPostSubdomainOnboardingPath({ subdomain: "my-site" })).toBe(SETUP_SITE_CONTENT_PATH);
    expect(hasPendingSiteContent()).toBe(true);
  });

  it("routes to site-ready after content setup is completed", () => {
    markPendingSiteContent();
    clearPendingSiteContent();
    expect(getPostSubdomainOnboardingPath({ subdomain: "my-site" })).toBe("/site-ready");
    expect(getPostAuthEntryPath({ subdomain: "my-site", subscriptionStatus: "FREE_TRIAL" })).toBe(
      "/site-ready",
    );
  });
});
