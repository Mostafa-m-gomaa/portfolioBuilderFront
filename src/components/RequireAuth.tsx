import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
import { getPostAuthEntryPath, needsSubscriptionOnboarding } from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import { useSubscriptionSummary } from '@/hooks/useSubscriptionSummary';
import { useAuthStore } from '@/store/auth.store';
import type { SubscriptionMeSummaryResponse } from '@/types/subscription.types';

type Props = {
  children: ReactNode;
};

const stillNeedsPlanSelection = (summary: SubscriptionMeSummaryResponse | undefined) =>
  !summary?.hasActiveSubscription &&
  summary?.subscriptionStatus === 'NOT_DETECTED';

const RequireAuth = ({ children }: Props) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const path = location.pathname;
  const { data: subSummary, isFetched, isLoading } = useSubscriptionSummary();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.email && !isUserEmailVerified(user)) {
    return <RedirectToEmailVerification email={user.email} />;
  }

  if (needsSubscriptionOnboarding(user)) {
    const waitingForSummary = !isFetched && isLoading;
    if (!waitingForSummary && stillNeedsPlanSelection(subSummary)) {
      if (path !== '/select-subscription') {
        return <Navigate to="/select-subscription" replace state={{ from: path }} />;
      }
    }
  } else if (path === '/select-subscription') {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
