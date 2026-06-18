export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  type?: string;
  subdomain?: string | null;
  domain?: boolean;
  templateName?: string | null;
  logo?: string | null;
  currency?: string | null;
  allowWhatsapp?: boolean;
  WhatsApp?: string | null;
  whatsapp?: string | null;
  isVerified?: boolean;
  emailVerified?: boolean;
  role?: string | null;
  authProvider?: string | null;
  subscriptionStatus?: string | null;
  country?: string | null;
};

export type AuthSuccess = {
  message?: string;
  token?: string;
  user?: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  country: string;
  type?: "freelancer" | "agency" | string;
  subdomain?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type GoogleAuthPayload = {
  idToken: string;
  type?: "freelancer" | "agency" | string;
  country?: string;
  subdomain?: string;
};

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export type ResendVerificationPayload = {
  email: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type SubdomainAvailabilityResponse = {
  available: boolean;
  subdomain?: string;
  message?: string;
};

export type VerifyDomainResponse = {
  success: boolean;
  message?: string;
};

export type UpdateSubdomainPayload = {
  subdomain: string;
  domain?: boolean;
};

export type UpdateTemplateNamePayload = {
  templateName: string;
};

export type UpdateProfilePayload = {
  name?: string;
  country?: string;
  currency?: string;
  allowWhatsapp?: boolean;
  whatsapp?: string;
};

/** express-validator style item on 400 responses */
export type ApiValidationErrorItem = {
  type?: string;
  msg?: string;
  path?: string;
  location?: string;
  value?: unknown;
};

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string> | ApiValidationErrorItem[];
};
