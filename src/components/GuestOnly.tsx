import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  children: ReactNode;
};

const GuestOnly = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isConfiguredSubdomain = Boolean(user?.subdomain && !user.subdomain.startsWith('temp-'));

  if (isAuthenticated) {
    return <Navigate to={isConfiguredSubdomain ? '/dashboard' : '/choose-subdomain'} replace />;
  }

  return <>{children}</>;
};

export default GuestOnly;

