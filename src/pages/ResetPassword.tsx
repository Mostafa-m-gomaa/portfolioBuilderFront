import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { normalizeEmail } from '@/lib/emailValidation';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailFromQuery = useMemo(() => searchParams.get('email') ?? '', [searchParams]);
  const { verifyResetPasswordCodeMutation, resetPasswordMutation } = useAuth();
  const { lang } = useLanguage();
  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [newPassword, setNewPassword] = useState('');
  const emailRef = useRef<EmailInputHandle>(null);
  const isAr = lang === 'ar';

  const onVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailRef.current?.validate()) return;
    const normalizedEmail = normalizeEmail(email);
    try {
      await verifyResetPasswordCodeMutation.mutateAsync({ email: normalizedEmail, code });
      setStep('reset');
    } catch {
      // Error toast handled in mutation hook.
    }
  };

  const onResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step !== 'reset') return;
    try {
      await resetPasswordMutation.mutateAsync({ email: normalizeEmail(email), newPassword });
      setNewPassword('');
    } catch {
      // Error toast handled in mutation hook.
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md glow-border"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {isAr ? 'إعادة تعيين كلمة المرور' : 'Reset password'}
          </h1>
          {step === 'verify' ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {isAr
                  ? 'الخطوة 1 من 2: أدخل البريد الإلكتروني ورمز الاستعادة.'
                  : 'Step 1 of 2: Enter your email and reset code.'}
              </p>
              <form onSubmit={onVerifyCode} className="space-y-4" noValidate>
                <EmailInput
                  ref={emailRef}
                  value={email}
                  onChange={setEmail}
                  placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                  required
                />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={isAr ? 'رمز إعادة التعيين' : 'Reset code'}
                  required
                  className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={verifyResetPasswordCodeMutation.isPending || !email || !code}
                  className="w-full glass py-3 rounded-xl text-foreground font-semibold text-sm disabled:opacity-70"
                >
                  {verifyResetPasswordCodeMutation.isPending
                    ? isAr
                      ? 'جار التحقق...'
                      : 'Verifying...'
                    : isAr
                      ? 'متابعة'
                      : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {isAr
                  ? 'الخطوة 2 من 2: أدخل كلمة المرور الجديدة.'
                  : 'Step 2 of 2: Enter your new password.'}
              </p>
              <form onSubmit={onResetPassword} className="space-y-4" noValidate>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isAr ? 'كلمة المرور الجديدة' : 'New password'}
                  required
                  minLength={8}
                />
                <button
                  disabled={resetPasswordMutation.isPending}
                  className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
                >
                  {resetPasswordMutation.isPending
                    ? isAr
                      ? 'جار التحديث...'
                      : 'Updating...'
                    : isAr
                      ? 'تحديث كلمة المرور'
                      : 'Update password'}
                </button>

              </form>
            </>
          )}

          <Link to="/login" className="inline-block mt-4 text-sm text-primary hover:underline">
            {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;

