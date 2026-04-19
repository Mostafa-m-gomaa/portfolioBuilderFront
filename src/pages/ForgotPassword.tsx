import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const ForgotPassword = () => {
  const { lang, t } = useLanguage();
  const { forgotPasswordMutation } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const isAr = lang === 'ar';

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
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

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="name@example.com"
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
