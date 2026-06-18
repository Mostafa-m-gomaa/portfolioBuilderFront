import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
import { getPostAuthEntryPath } from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  children: ReactNode;
};

const GuestOnly = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    if (user?.email && !isUserEmailVerified(user)) {
      return <RedirectToEmailVerification email={user.email} />;
    }
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return <>{children}</>;
};

export default GuestOnly;

