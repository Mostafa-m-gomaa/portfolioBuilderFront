import { apiClient } from '@/api/axios';
import type {
  AuthSuccess,
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  SubdomainAvailabilityResponse,
  UpdateSubdomainPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';

const normalizeAuthResponse = (payload: any): AuthSuccess => {
  return {
    message: payload?.message,
    token:
      payload?.token ??
      payload?.accessToken ??
      payload?.data?.token ??
      payload?.data?.accessToken,
    user: payload?.user ?? payload?.data?.user,
  };
};

const sanitizeSubdomainPart = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').slice(0, 24);

const generateTemporarySubdomain = (seed = 'user') => {
  const safeSeed = sanitizeSubdomainPart(seed) || 'user';
  const nonce = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return `temp-${safeSeed}-${nonce}`.slice(0, 48);
};

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthSuccess> {
    const ensuredSubdomain =
      payload.subdomain && payload.subdomain.trim()
        ? payload.subdomain
        : generateTemporarySubdomain(payload.name || payload.email || 'user');
    const response = await apiClient.post('/auth/register', {
      ...payload,
      subdomain: ensuredSubdomain,
    });
    return normalizeAuthResponse(response.data);
  },

  async login(payload: LoginPayload): Promise<AuthSuccess> {
    const response = await apiClient.post('/auth/login', payload);
    return normalizeAuthResponse(response.data);
  },

  async googleAuth(payload: GoogleAuthPayload): Promise<AuthSuccess> {
    const ensuredSubdomain =
      payload.subdomain && payload.subdomain.trim()
        ? payload.subdomain
        : generateTemporarySubdomain('google-user');
    const response = await apiClient.post('/auth/google', {
      ...payload,
      subdomain: ensuredSubdomain,
    });
    return normalizeAuthResponse(response.data);
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<AuthSuccess> {
    const response = await apiClient.post('/auth/verify-email', payload);
    return normalizeAuthResponse(response.data);
  },

  async resendVerification(payload: ResendVerificationPayload): Promise<{ message?: string }> {
    const response = await apiClient.post('/auth/resend-verification', payload);
    return response.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message?: string }> {
    const response = await apiClient.post('/auth/forgot-password', payload);
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message?: string }> {
    const response = await apiClient.post('/auth/reset-password', payload);
    return response.data;
  },

  async checkSubdomainAvailability(subdomain: string): Promise<SubdomainAvailabilityResponse> {
    const response = await apiClient.get('/auth/subdomain/availability', {
      params: { subdomain },
    });
    return response.data;
  },

  async updateSubdomain(payload: UpdateSubdomainPayload): Promise<AuthSuccess> {
    const response = await apiClient.patch('/auth/subdomain', payload);
    return normalizeAuthResponse(response.data);
  },
};

