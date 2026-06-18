import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { prepareEmailVerificationFlow } from "@/lib/authVerification";

type RedirectToEmailVerificationProps = {
  email: string;
  logoutFirst?: boolean;
};

const RedirectToEmailVerification = ({
  email,
  logoutFirst = true,
}: RedirectToEmailVerificationProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { logout, setPendingEmail, resendVerificationMutation } = useAuth();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || !email.trim()) return;
    startedRef.current = true;

    void (async () => {
      const normalized = await prepareEmailVerificationFlow(
        email,
        {
          setPendingEmail,
          resendVerification: (targetEmail) =>
            resendVerificationMutation.mutateAsync({ email: targetEmail }),
          logout,
        },
        { logoutFirst },
      );
      navigate("/verify-email", { replace: true, state: { email: normalized } });
    })();
  }, [
    email,
    logout,
    logoutFirst,
    navigate,
    resendVerificationMutation,
    setPendingEmail,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-sm text-muted-foreground">
      {t("auth.verify.redirecting")}
    </div>
  );
};

export default RedirectToEmailVerification;
