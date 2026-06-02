const PORTFOLIO_SITE_HOST = "getsirty.com";

export const portfolioSiteBaseUrl = (subdomain: string) =>
  `https://${subdomain.trim()}.${PORTFOLIO_SITE_HOST}`;

export const portfolioSiteEditorUrl = (subdomain: string, token: string) => {
  const url = new URL(portfolioSiteBaseUrl(subdomain));
  url.searchParams.set("token", token);
  return url.toString();
};
