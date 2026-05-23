import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RotateCcw, MessageCircle, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
const PaymentFailure = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full max-w-lg rounded-3xl p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-9 w-9 text-destructive" aria-hidden />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            {t('payment.failure.title')}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t('payment.failure.subtitle')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t('payment.failure.ctaRetry')}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t('payment.failure.ctaContact')}
            </Link>
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <Home className="h-4 w-4" aria-hidden />
            {t('payment.failure.ctaHome')}
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailure;
