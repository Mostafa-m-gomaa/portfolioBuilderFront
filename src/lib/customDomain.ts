export const sanitizeCustomDomainInput = (value: string) => {
  let cleaned = value.toLowerCase().trim();
  cleaned = cleaned.replace(/^https?:\/\//i, "");
  cleaned = cleaned.replace(/^www\./i, "");
  cleaned = cleaned.split("/")[0] ?? "";
  cleaned = cleaned.replace(/[^a-z0-9.-]/g, "");
  return cleaned;
};

const CUSTOM_DOMAIN_PATTERN =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export const isValidCustomDomain = (domain: string) => {
  if (!domain || domain.includes("www.")) return false;
  return CUSTOM_DOMAIN_PATTERN.test(domain);
};

export const sanitizeSubdomainPart = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
