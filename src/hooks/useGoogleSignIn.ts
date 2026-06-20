import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";
import { parseApiError } from "@/api/axios";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/types/auth.types";
import { tToast } from "@/lib/i18n";
import { toast } from "sonner";

export type GoogleSignUpState = {
  idToken: string;
  email?: string;
  name?: string;
  picture?: string;
};

type UseGoogleSignInOptions = {
  onAuthenticated?: (user?: AuthUser | null) => void | Promise<void>;
  trackRegistration?: () => void;
};

export const useGoogleSignIn = (options: UseGoogleSignInOptions = {}) => {
  const navigate = useNavigate();
  const { googleAuthMutation } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  const completeGoogleLogin = useCallback(
    async (idToken: string) => {
      const result = await googleAuthMutation.mutateAsync({ idToken });
      const authUser = result.user ?? useAuthStore.getState().user;
      if (result.token) {
        await options.onAuthenticated?.(authUser);
      }
      return result;
    },
    [googleAuthMutation, options],
  );

  const handleGoogleCredential = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        toast.error(tToast("toast.auth.googleError"));
        return;
      }

      setIsChecking(true);
      try {
        const check = await authService.googleCheck(idToken);
        if (check.needsSignup) {
          navigate("/signup/google", {
            state: {
              idToken,
              email: check.email,
              name: check.name,
              picture: check.picture,
            } satisfies GoogleSignUpState,
          });
          return;
        }

        await completeGoogleLogin(idToken);
      } catch (error) {
        toast.error(parseApiError(error, tToast("toast.auth.googleError")));
      } finally {
        setIsChecking(false);
      }
    },
    [completeGoogleLogin, navigate],
  );

  const handleGoogleError = useCallback(() => {
    toast.error(tToast("toast.auth.googleError"));
  }, []);

  return {
    handleGoogleCredential,
    handleGoogleError,
    isPending: isChecking || googleAuthMutation.isPending,
  };
};
