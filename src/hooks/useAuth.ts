import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { parseApiError, setUnauthorizedHandler } from "@/api/axios";
import { isEmailNotVerifiedLoginError } from "@/lib/authErrors";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { tToast } from "@/lib/i18n";
import type {
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyResetPasswordCodePayload,
  VerifyEmailPayload,
} from "@/types/auth.types";

const useDebouncedValue = (value: string, delay = 450) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
};

export const useAuth = () => {
  const {
    login,
    logout,
    setPendingEmail,
    setAuth,
    pendingEmail,
    isAuthenticated,
    user,
  } = useAuthStore();

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (_data, variables) => {
      setPendingEmail(variables.email);
      toast.success(tToast("toast.auth.registerSuccess"));
    },
    onError: (error) => toast.error(parseApiError(error, tToast("toast.auth.registerError"))),
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
        toast.success(tToast("toast.auth.welcomeBack"));
      }
    },
    onError: (error) => {
      if (isEmailNotVerifiedLoginError(error)) return;
      toast.error(parseApiError(error, tToast("toast.auth.loginError")));
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: (payload: GoogleAuthPayload) => authService.googleAuth(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
        toast.success(tToast("toast.auth.googleSuccess"));
      }
    },
    onError: (error) => {
      if (isEmailNotVerifiedLoginError(error)) return;
      toast.error(parseApiError(error, tToast("toast.auth.googleError")));
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      if (data.token) {
        login({ token: data.token, user: data.user });
      } else if (data.user) {
        setAuth({ user: data.user });
      }
      setPendingEmail(null);
      toast.success(tToast("toast.auth.emailVerified"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.verifyError"))),
  });

  const resendVerificationMutation = useMutation({
    mutationFn: (payload: ResendVerificationPayload) =>
      authService.resendVerification(payload),
    onSuccess: () => toast.success(tToast("toast.auth.verificationSent")),
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.resendError"))),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
    onSuccess: () => toast.success(tToast("toast.auth.resetEmailSent")),
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.resetEmailError"))),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
    onSuccess: () => toast.success(tToast("toast.auth.passwordReset")),
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.passwordResetError"))),
  });

  const verifyResetPasswordCodeMutation = useMutation({
    mutationFn: (payload: VerifyResetPasswordCodePayload) =>
      authService.verifyResetPasswordCode(payload),
    onSuccess: () => toast.success(tToast("toast.auth.resetCodeVerified")),
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.resetCodeError"))),
  });

  const updateSubdomainMutation = useMutation({
    mutationFn: (subdomain: string) =>
      authService.updateSubdomain({ subdomain }),
    onSuccess: (data, subdomain) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({ user: { ...user, subdomain } });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success(tToast("toast.auth.subdomainUpdated"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.subdomainError"))),
  });

  const updateTemplateNameMutation = useMutation({
    mutationFn: (templateName: string) =>
      authService.updateTemplateName({ templateName }),
    onSuccess: (data, templateName) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({ user: { ...user, templateName } });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success(tToast("toast.auth.templateUpdated"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.templateError"))),
  });

  const updateLogoMutation = useMutation({
    mutationFn: (file: File) => authService.updateLogo(file),
    onSuccess: (data) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({ user: { ...user } });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success(tToast("toast.auth.logoUpdated"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.logoError"))),
  });

  const deleteLogoMutation = useMutation({
    mutationFn: () => authService.deleteLogo(),
    onSuccess: (data) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({ user: { ...user, logo: null } });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success(tToast("toast.auth.logoDeleted"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.logoDeleteError"))),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      authService.updateProfile(payload),
    onSuccess: (data, payload) => {
      if (data.user) {
        setAuth({ user: data.user });
      } else if (user) {
        setAuth({
          user: {
            ...user,
            ...(payload.country !== undefined ? { country: payload.country } : {}),
            ...(payload.currency !== undefined ? { currency: payload.currency } : {}),
            ...(payload.allowWhatsapp !== undefined ? { allowWhatsapp: payload.allowWhatsapp } : {}),
            ...(payload.whatsapp !== undefined
              ? { WhatsApp: payload.whatsapp ?? null, whatsapp: payload.whatsapp ?? null }
              : {}),
          },
        });
      }
      if (data.token) setAuth({ token: data.token });
      toast.success(tToast("toast.auth.profileUpdated"));
    },
    onError: (error) =>
      toast.error(parseApiError(error, tToast("toast.auth.profileError"))),
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
    verifyResetPasswordCodeMutation,
    resetPasswordMutation,
    updateSubdomainMutation,
    updateTemplateNameMutation,
    updateLogoMutation,
    deleteLogoMutation,
    updateProfileMutation,
  };
};

export const useSubdomainAvailability = (subdomainInput: string) => {
  const normalized = useMemo(
    () => subdomainInput.trim().toLowerCase(),
    [subdomainInput],
  );
  const debouncedSubdomain = useDebouncedValue(normalized, 500);

  return useQuery({
    queryKey: ["subdomain-availability", debouncedSubdomain],
    queryFn: () => authService.checkSubdomainAvailability(debouncedSubdomain),
    enabled: debouncedSubdomain.length >= 3,
    staleTime: 20_000,
  });
};
