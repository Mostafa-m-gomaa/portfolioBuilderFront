import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
import { isUserEmailVerified } from '@/lib/authVerification';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  children: ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.email && !isUserEmailVerified(user)) {
    return <RedirectToEmailVerification email={user.email} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
