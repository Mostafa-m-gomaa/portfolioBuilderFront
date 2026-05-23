import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { normalizeEmail } from '@/lib/emailValidation';

const ForgotPassword = () => {
  const { lang, t } = useLanguage();
  const { forgotPasswordMutation } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const emailRef = useRef<EmailInputHandle>(null);

  const isAr = lang === 'ar';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailRef.current?.validate()) return;
    const normalizedEmail = normalizeEmail(email);
    try {
      await forgotPasswordMutation.mutateAsync({ email: normalizedEmail });
      navigate(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
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
            {isAr ? 'استعادة كلمة المرور' : 'Forgot password'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isAr
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة تعيين كلمة المرور.'
              : 'Enter your email and we will send you a password reset code.'}
          </p>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
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
              className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
            >
              {forgotPasswordMutation.isPending
                ? isAr
                  ? 'جار الإرسال...'
                  : 'Sending...'
                : isAr
                  ? 'إرسال رمز الاستعادة'
                  : 'Send reset code'}
            </button>
          </form>

          <Link to="/login" className="inline-block mt-4 text-sm text-primary hover:underline">
            {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
