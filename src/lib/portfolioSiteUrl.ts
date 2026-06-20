import type { AuthUser } from "@/types/auth.types";
import type { Portfolio } from "@/types/portfolio.types";
import { resolveCustomDomainEnabled } from "@/lib/authMeSync";

const PORTFOLIO_SITE_HOST = "getsirty.com";

const customDomainPublicHost = (subdomain: string) => {
  const hostOnly = subdomain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .split("/")[0];

  if (!hostOnly) return "";
  if (/^www\./i.test(hostOnly)) return hostOnly;
  return `www.${hostOnly}`;
};

export const portfolioSiteBaseUrl = (subdomain: string, usesCustomDomain = false) => {
  const host = subdomain.trim();
  if (!host) return `https://${PORTFOLIO_SITE_HOST}`;

  if (usesCustomDomain) {
    const publicHost = customDomainPublicHost(host);
    if (!publicHost) return `https://${PORTFOLIO_SITE_HOST}`;
    return `https://${publicHost}`;
  }

  return `https://${host}.${PORTFOLIO_SITE_HOST}`;
};

export type PortfolioSiteContext = {
  host: string;
  usesCustomDomain: boolean;
  siteUrl: string | null;
  siteEditorUrl: string | null;
};

/** Resolve public site host + custom-domain flag from the latest auth/portfolio snapshot. */
export const resolvePortfolioSiteContext = (
  user?: Pick<AuthUser, "subdomain" | "domain"> | null,
  portfolio?: Pick<Portfolio, "subdomain" | "domain"> | null,
  token?: string | null,
): PortfolioSiteContext => {
  const host = String(user?.subdomain ?? portfolio?.subdomain ?? "").trim();
  const usesCustomDomain = resolveCustomDomainEnabled(user, portfolio);

  if (!host) {
    return {
      host: "",
      usesCustomDomain,
      siteUrl: null,
      siteEditorUrl: null,
    };
  }

  return {
    host,
    usesCustomDomain,
    siteUrl: portfolioSiteBaseUrl(host, usesCustomDomain),
    siteEditorUrl: token
      ? portfolioSiteEditorUrl(host, token, usesCustomDomain)
      : null,
  };
};

export const portfolioSiteEditorUrl = (
  subdomain: string,
  token: string,
  usesCustomDomain = false,
) => {
  const url = new URL(portfolioSiteBaseUrl(subdomain, usesCustomDomain));
  url.searchParams.set("token", token);
  return url.toString();
};
