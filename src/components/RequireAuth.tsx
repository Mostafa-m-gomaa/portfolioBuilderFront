import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getPostAuthEntryPath, needsSubscriptionOnboarding } from '@/lib/authRouting';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  children: ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const path = location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (needsSubscriptionOnboarding(user)) {
    if (path !== '/select-subscription') {
      return <Navigate to="/select-subscription" replace state={{ from: path }} />;
    }
  } else if (path === '/select-subscription') {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

