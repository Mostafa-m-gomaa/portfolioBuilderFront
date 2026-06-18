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

export const portfolioSiteEditorUrl = (
  subdomain: string,
  token: string,
  usesCustomDomain = false,
) => {
  const url = new URL(portfolioSiteBaseUrl(subdomain, usesCustomDomain));
  url.searchParams.set("token", token);
  return url.toString();
};
