import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseApiError, setUnauthorizedHandler } from '@/api/axios';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type {
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '@/types/auth.types';

const useDebouncedValue = (value: string, delay = 450) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export const useAuth = () => {
  const { login, logout, setPendingEmail, setAuth, pendingEmail, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (_data, variables) => {
      setPendingEmail(variables.email);
      toast.success('Registered successfully. Please verify your email.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to register')),
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
      }
      toast.success('Welcome back.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to login')),
  });

  const googleAuthMutation = useMutation({
    mutationFn: (payload: GoogleAuthPayload) => authService.googleAuth(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
      }
      toast.success('Signed in with Google.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to sign in with Google')),
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authService.verifyEmail(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
      } else if (data.user) {
        setAuth({ user: data.user });
      }
      setPendingEmail(null);
      toast.success('Email verified successfully.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to verify email')),
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (payload: ResendVerificationPayload) => authService.resendVerification(payload),
    onSuccess: () => toast.success('Verification code sent.'),
    onError: (error) => toast.error(parseApiError(error, 'Failed to resend verification code')),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
    onSuccess: () => toast.success('Password reset email sent.'),
    onError: (error) => toast.error(parseApiError(error, 'Failed to send reset email')),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
    onSuccess: () => toast.success('Password reset successfully.'),
    onError: (error) => toast.error(parseApiError(error, 'Failed to reset password')),
  });

  const updateSubdomainMutation = useMutation({
    mutationFn: (subdomain: string) => authService.updateSubdomain({ subdomain }),
    onSuccess: (data, subdomain) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({ user: { ...user, subdomain } });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success('Subdomain updated successfully.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to update subdomain')),
  });

  return {
    pendingEmail,
    isAuthenticated,
    user,
    logout,
    setPendingEmail,
    registerMutation,
    loginMutation,
    googleAuthMutation,
    verifyEmailMutation,
    resendVerificationMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    updateSubdomainMutation,
  };
};

export const useSubdomainAvailability = (subdomainInput: string) => {
  const normalized = useMemo(() => subdomainInput.trim().toLowerCase(), [subdomainInput]);
  const debouncedSubdomain = useDebouncedValue(normalized, 500);

  return useQuery({
    queryKey: ['subdomain-availability', debouncedSubdomain],
    queryFn: () => authService.checkSubdomainAvailability(debouncedSubdomain),
    enabled: debouncedSubdomain.length >= 3,
    staleTime: 20_000,
  });
};

