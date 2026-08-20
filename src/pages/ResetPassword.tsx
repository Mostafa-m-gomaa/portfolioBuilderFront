import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { primaryButton } from '@/lib/buttonStyles';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const { resetPasswordMutation } = useAuth();
  const { lang } = useLanguage();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const isAr = lang === 'ar';

  const onResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    if (newPassword !== newPasswordConfirmation) {
      toast.error(
        isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.',
      );
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword,
        newPasswordConfirmation,
      });
      setNewPassword('');
      setNewPasswordConfirmation('');
      navigate('/login', { replace: true });
    } catch {
      // Error toast handled in mutation hook.
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <ColorBendsBackground />
      <Navbar />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full max-w-md rounded-3xl p-8"
        >
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">
            {isAr ? 'إعادة تعيين كلمة المرور' : 'Reset password'}
          </h1>

          {!token ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {isAr
                  ? 'رابط إعادة التعيين غير صالح أو منتهي. اطلب رابطاً جديداً من صفحة استعادة كلمة المرور.'
                  : 'This reset link is invalid or expired. Request a new link from the forgot password page.'}
              </p>
              <Link
                to="/forgot-password"
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                {isAr ? 'طلب رابط جديد' : 'Request a new link'}
              </Link>
            </>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {isAr
                  ? 'أدخل كلمة المرور الجديدة وتأكيدها.'
                  : 'Enter and confirm your new password.'}
              </p>
              <form onSubmit={onResetPassword} className="space-y-4" noValidate>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {isAr ? 'كلمة المرور الجديدة' : 'New password'}
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isAr ? 'كلمة المرور الجديدة' : 'New password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
                  </label>
                  <PasswordInput
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    placeholder={
                      isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    resetPasswordMutation.isPending ||
                    !newPassword ||
                    !newPasswordConfirmation
                  }
                  className={primaryButton('w-full')}
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

          <Link to="/login" className="mt-4 inline-block text-sm text-primary hover:underline">
            {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
