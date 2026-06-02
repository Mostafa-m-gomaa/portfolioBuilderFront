import { describe, expect, it } from "vitest";
import { getPostAuthEntryPath, needsSubscriptionOnboarding } from "./authRouting";

describe("authRouting", () => {
  it("routes users without a subscription status to subscription onboarding first", () => {
    expect(needsSubscriptionOnboarding({ subscriptionStatus: null })).toBe(true);
    expect(needsSubscriptionOnboarding({ subscriptionStatus: undefined })).toBe(true);
    expect(getPostAuthEntryPath({ subdomain: "temp-user-1", subscriptionStatus: null })).toBe(
      "/select-subscription",
    );
    expect(
      getPostAuthEntryPath({ subdomain: "temp-user-1", subscriptionStatus: undefined }),
    ).toBe("/select-subscription");
  });

  it("keeps configured users on the dashboard path", () => {
    expect(getPostAuthEntryPath({ subdomain: "my-site", subscriptionStatus: "ACTIVE" })).toBe(
      "/dashboard",
    );
  });
});