import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, LayoutDashboard, UserCog } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { applySubscriptionSummaryToAuth } from '@/lib/syncSubscriptionAuth';
import { subscriptionsService } from '@/services/subscriptions.service';
import { useAuthStore } from '@/store/auth.store';

const PaymentSuccess = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    void (async () => {
      await queryClient.resetQueries({ queryKey: ['subscription-summary'] });
      try {
        const summary = await queryClient.fetchQuery({
          queryKey: ['subscription-summary'],
          queryFn: () => subscriptionsService.getMeSummary(),
        });
        applySubscriptionSummaryToAuth(summary);
      } catch {
        /* Dashboard will refetch; avoid blocking success UI */
      }
      void queryClient.invalidateQueries({ queryKey: ['portfolio', 'me'] });
    })();
  }, [isAuthenticated, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full max-w-lg rounded-3xl p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" aria-hidden />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {t('payment.success.title')}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t('payment.success.subtitle')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  {t('payment.success.ctaDashboard')}
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <UserCog className="h-4 w-4" aria-hidden />
                  {t('payment.success.ctaProfile')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30"
                >
                  {t('payment.success.ctaPricing')}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
