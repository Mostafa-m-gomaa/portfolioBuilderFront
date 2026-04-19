export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  type?: string;
  subdomain?: string | null;
  templateName?: string | null;
  logo?: string | null;
  currency?: string | null;
  allowWhatsapp?: boolean;
  WhatsApp?: string | null;
  whatsapp?: string | null;
  isVerified?: boolean;
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

export type VerifyResetPasswordCodePayload = {
  email: string;
  code: string;
};

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};

export type SubdomainAvailabilityResponse = {
  available: boolean;
  subdomain?: string;
  message?: string;
};

export type UpdateSubdomainPayload = {
  subdomain: string;
};

export type UpdateTemplateNamePayload = {
  templateName: string;
};

export type UpdateProfilePayload = {
  currency: string;
  allowWhatsapp: boolean;
  whatsapp?: string;
};

export type ApiErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
};
