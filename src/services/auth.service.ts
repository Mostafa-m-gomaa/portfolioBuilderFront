import { apiClient } from "@/api/axios";
import { isCustomDomainEnabled } from "@/lib/authMeSync";
import type {
  AuthSuccess,
  AuthUser,
  ForgotPasswordPayload,
  GoogleAuthPayload,
  GoogleCheckResponse,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  SubdomainAvailabilityResponse,
  UpdateProfilePayload,
  UpdateSubdomainPayload,
  SubmitCommentResponse,
  TourStatusResponse,
  UpdateTemplateNamePayload,
  UpdateTourPayload,
  VerifyDomainResponse,
  VerifyEmailPayload,
} from "@/types/auth.types";

const normalizeUser = (raw: unknown): AuthUser | undefined => {
  if (raw == null || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  return {
    id: (r.id ?? r._id) as string | undefined,
    name: r.name as string | undefined,
    email: r.email as string | undefined,
    type: r.type as string | undefined,
    subdomain: (r.subdomain as string | null | undefined) ?? null,
    domain:
      r.domain === false || r.domain === "false"
        ? false
        : isCustomDomainEnabled(r.domain),
    templateName: (r.templateName as string | null | undefined) ?? null,
    logo: (r.logo as string | null | undefined) ?? null,
    currency: (r.currency as string | null | undefined) ?? null,
    allowWhatsapp: r.allowWhatsapp as boolean | undefined,
    WhatsApp: (r.WhatsApp as string | null | undefined) ?? null,
    whatsapp:
      (r.whatsapp as string | null | undefined) ??
      (r.WhatsApp as string | null | undefined) ??
      null,
    isVerified: Boolean(r.isVerified ?? r.emailVerified),
    emailVerified: Boolean(r.emailVerified ?? r.isVerified),
    role: (r.role as string | null | undefined) ?? null,
    authProvider: (r.authProvider as string | null | undefined) ?? null,
    subscriptionStatus:
      (r.subscriptionStatus as string | null | undefined) ?? null,
    country: (r.country as string | null | undefined) ?? null,
    hasComment:
      r.hasComment === false || r.hasComment === "false"
        ? false
        : r.hasComment === true || r.hasComment === "true"
          ? true
          : undefined,
    comment: (r.comment as string | null | undefined) ?? null,
    takeTour:
      r.takeTour === false || r.takeTour === "false"
        ? false
        : r.takeTour === true || r.takeTour === "true"
          ? true
          : undefined,
  };
};

const normalizeAuthResponse = (payload: any): AuthSuccess => {
  return {
    message: payload?.message,
    token:
      payload?.token ??
      payload?.accessToken ??
      payload?.data?.token ??
      payload?.data?.accessToken,
    user: normalizeUser(payload?.user ?? payload?.data?.user),
  };
};

const sanitizeSubdomainPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

const generateTemporarySubdomain = (seed = "user") => {
  const safeSeed = sanitizeSubdomainPart(seed) || "user";
  const nonce = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return `temp-${safeSeed}-${nonce}`.slice(0, 48);
};

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthSuccess> {
    const ensuredSubdomain =
      payload.subdomain && payload.subdomain.trim()
        ? payload.subdomain
        : generateTemporarySubdomain(payload.name || payload.email || "user");
    const response = await apiClient.post("/auth/register", {
      ...payload,
      subdomain: ensuredSubdomain,
    });
    return normalizeAuthResponse(response.data);
  },

  async login(payload: LoginPayload): Promise<AuthSuccess> {
    const response = await apiClient.post("/auth/login", payload);
    return normalizeAuthResponse(response.data);
  },

  async googleCheck(idToken: string): Promise<GoogleCheckResponse> {
    const response = await apiClient.post<GoogleCheckResponse>(
      "/auth/google/check",
      { idToken },
    );
    return response.data;
  },

  async googleAuth(payload: GoogleAuthPayload): Promise<AuthSuccess> {
    const body: Record<string, string> = { idToken: payload.idToken };
    if (payload.type) {
      body.type = payload.type;
      if (payload.subdomain?.trim()) {
        body.subdomain = payload.subdomain.trim();
      }
      if (payload.country) {
        body.country = payload.country;
      }
    }
    const response = await apiClient.post("/auth/google", body);
    return normalizeAuthResponse(response.data);
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthSuccess> {
    const response = await apiClient.post("/auth/verify-email", payload);
    return normalizeAuthResponse(response.data);
  },

  async resendVerification(
    payload: ResendVerificationPayload,
  ): Promise<{ message?: string }> {
    const response = await apiClient.post("/auth/resend-verification", payload);
    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<{ message?: string }> {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<{ message?: string }> {
    const { token, newPassword, newPasswordConfirmation } = payload;
    const response = await apiClient.post(
      "/auth/reset-password",
      { newPassword, newPasswordConfirmation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  async checkSubdomainAvailability(
    subdomain: string,
  ): Promise<SubdomainAvailabilityResponse> {
    const response = await apiClient.get("/auth/subdomain/availability", {
      params: { subdomain },
    });
    return response.data;
  },

  async updateSubdomain(payload: UpdateSubdomainPayload): Promise<AuthSuccess> {
    const response = await apiClient.patch("/auth/subdomain", payload);
    return normalizeAuthResponse(response.data);
  },

  async verifyDomain(): Promise<VerifyDomainResponse> {
    const response = await apiClient.post("/auth/verify-domain");
    return response.data;
  },

  async updateTemplateName(
    payload: UpdateTemplateNamePayload,
  ): Promise<AuthSuccess> {
    const response = await apiClient.patch("/portfolio/template-name", payload);
    return normalizeAuthResponse(response.data);
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthSuccess> {
    const response = await apiClient.patch("/auth/profile", payload);
    return normalizeAuthResponse(response.data);
  },

  async updateLogo(file: File): Promise<AuthSuccess> {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.patch("/auth/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeAuthResponse(response.data);
  },

  async deleteLogo(): Promise<AuthSuccess> {
    const response = await apiClient.delete("/auth/logo");
    return normalizeAuthResponse(response.data);
  },

  async submitComment(comment: string): Promise<SubmitCommentResponse> {
    const response = await apiClient.post<SubmitCommentResponse>(
      "/auth/comment",
      { comment: comment.trim() },
    );
    return response.data;
  },

  async getTourStatus(): Promise<TourStatusResponse> {
    const response = await apiClient.get<TourStatusResponse>("/auth/tour");
    return response.data;
  },

  async updateTour(payload: UpdateTourPayload): Promise<AuthSuccess> {
    const response = await apiClient.patch("/auth/tour", payload);
    return normalizeAuthResponse(response.data);
  },
};
