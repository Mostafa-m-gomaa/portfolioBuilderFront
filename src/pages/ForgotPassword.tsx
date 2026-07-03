import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { normalizeEmail } from '@/lib/emailValidation';
import { primaryButton } from '@/lib/buttonStyles';

const ForgotPassword = () => {
  const { lang, t } = useLanguage();
  const { forgotPasswordMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const emailRef = useRef<EmailInputHandle>(null);

  const isAr = lang === 'ar';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailRef.current?.validate()) return;
    const normalizedEmail = normalizeEmail(email);
    try {
      await forgotPasswordMutation.mutateAsync({ email: normalizedEmail });
      setEmailSent(true);
    } catch {
      // Error toast handled in mutation hook.
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full max-w-md rounded-3xl p-8"
        >
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            {isAr ? 'استعادة كلمة المرور' : 'Forgot password'}
          </h1>

          {emailSent ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {isAr
                  ? 'إذا كان البريد الإلكتروني مسجلاً لدينا، ستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور. افتح الرابط من بريدك لإكمال العملية.'
                  : 'If this email is registered, you will receive a message with a link to reset your password. Open the link from your email to continue.'}
              </p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {isAr
                  ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.'
                  : 'Enter your email and we will send you a password reset link.'}
              </p>

              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {t('auth.email')}
                  </label>
                  <EmailInput
                    ref={emailRef}
                    required
                    value={email}
                    onChange={setEmail}
                    placeholder={t('auth.placeholderEmail')}
                  />
                </div>
                <button
                  disabled={forgotPasswordMutation.isPending}
                  className={primaryButton('w-full')}
                >
                  {forgotPasswordMutation.isPending
                    ? isAr
                      ? 'جار الإرسال...'
                      : 'Sending...'
                    : isAr
                      ? 'إرسال رابط الاستعادة'
                      : 'Send reset link'}
                </button>
              </form>

              <Link to="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
                {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
