import type { AuthUser } from "@/types/auth.types";
import type { Portfolio } from "@/types/portfolio.types";

export const isCustomDomainEnabled = (value: unknown): boolean =>
  value === true || value === "true" || value === 1;

export const extractAuthPatchFromMeResponse = (
  data: unknown,
): Partial<AuthUser> | null => {
  if (data == null || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const nestedUser =
    root.user && typeof root.user === "object"
      ? (root.user as Record<string, unknown>)
      : null;
  const nestedPortfolio =
    root.portfolio && typeof root.portfolio === "object"
      ? (root.portfolio as Record<string, unknown>)
      : null;

  const subdomain =
    (nestedUser?.subdomain as string | undefined) ??
    (root.subdomain as string | undefined) ??
    (nestedPortfolio?.subdomain as string | undefined);

  const domainRaw =
    nestedUser?.domain ?? root.domain ?? nestedPortfolio?.domain;

  const patch: Partial<AuthUser> = {};
  if (typeof subdomain === "string" && subdomain.trim()) {
    patch.subdomain = subdomain.trim();
  }
  if (domainRaw !== undefined) {
    patch.domain = isCustomDomainEnabled(domainRaw);
  }

  return Object.keys(patch).length ? patch : null;
};

export const mergePortfolioMeResponse = (
  data: unknown,
): { portfolio: Portfolio; authPatch: Partial<AuthUser> | null } => {
  const authPatch = extractAuthPatchFromMeResponse(data);
  const root = (data ?? {}) as Record<string, unknown>;
  const portfolio = { ...(root.portfolio ?? root) } as Portfolio;

  if (authPatch?.domain !== undefined) {
    portfolio.domain = authPatch.domain;
  }
  if (authPatch?.subdomain) {
    portfolio.subdomain = authPatch.subdomain;
  }

  return { portfolio, authPatch };
};

export const resolveCustomDomainEnabled = (
  user?: Pick<AuthUser, "domain"> | null,
  portfolio?: Pick<Portfolio, "domain"> | null,
): boolean => {
  if (user && typeof user.domain === "boolean") {
    return user.domain;
  }
  return isCustomDomainEnabled(portfolio?.domain);
};
