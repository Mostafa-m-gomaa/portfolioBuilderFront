import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pendingEmail, verifyEmailMutation, resendVerificationMutation, isAuthenticated, user } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [code, setCode] = useState('');

  const email = useMemo(
    () => (location.state as { email?: string } | null)?.email || pendingEmail || emailInput,
    [location.state, pendingEmail, emailInput],
  );

  const onVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await verifyEmailMutation.mutateAsync({ email, code });
      navigate('/choose-subdomain');
    } catch {
      // Error toast handled in hook.
    }
  };

  const onResend = async () => {
    if (!email) return;
    await resendVerificationMutation.mutateAsync({ email });
  };

  if (isAuthenticated) {
    return <Navigate to={user?.subdomain ? '/dashboard' : '/choose-subdomain'} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md glow-border"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Verify your email</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter the verification code we sent to your email.</p>

          <form onSubmit={onVerify} className="space-y-4">
            {!pendingEmail && (
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            )}
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification code"
              className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            <button
              disabled={verifyEmailMutation.isPending}
              className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
            >
              {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={onResend}
              disabled={resendVerificationMutation.isPending || !email}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {resendVerificationMutation.isPending ? 'Sending...' : 'Resend code'}
            </button>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;

