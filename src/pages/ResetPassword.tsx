import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const { resetPasswordMutation } = useAuth();
  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword });
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
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Reset password</h1>
          <p className="text-sm text-muted-foreground mb-6">Paste your reset token and set a new password.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Reset token"
              required
              className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              minLength={8}
              className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              disabled={resetPasswordMutation.isPending}
              className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
            >
              {resetPasswordMutation.isPending ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <Link to="/login" className="inline-block mt-4 text-sm text-primary hover:underline">
            Back to login
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;

